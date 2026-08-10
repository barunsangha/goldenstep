-- ============================================================
-- RunLeague — Full Backend SQL (Schema + Seed + Functions)
-- Safe to re-run: uses IF NOT EXISTS / OR REPLACE / exception guards
-- Run this top-to-bottom in the Supabase SQL Editor
-- ============================================================

-- ------------------------------------------------------------
-- 1. EXTENSIONS
-- ------------------------------------------------------------
create extension if not exists "pgcrypto";

-- ------------------------------------------------------------
-- 2. ENUMS
-- ------------------------------------------------------------
do $$ begin
  create type gameweek_status as enum ('active', 'closed');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type run_source as enum ('strava', 'manual');
exception when duplicate_object then null;
end $$;

-- ------------------------------------------------------------
-- 3. TABLES
-- ------------------------------------------------------------
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  strava_id text unique,
  avatar_url text,
  created_at timestamptz not null default now()
);

create table if not exists leagues (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  invite_code text not null unique,
  stake_amount numeric(10,2) not null default 0,
  created_by uuid not null references users(id) on delete restrict,
  max_members int not null default 10,
  created_at timestamptz not null default now()
);

create table if not exists league_members (
  league_id uuid not null references leagues(id) on delete cascade,
  user_id uuid not null references users(id) on delete cascade,
  joined_at timestamptz not null default now(),
  primary key (league_id, user_id)
);

create table if not exists gameweeks (
  id uuid primary key default gen_random_uuid(),
  league_id uuid not null references leagues(id) on delete cascade,
  start_date date not null,
  end_date date not null,
  status gameweek_status not null default 'active',
  created_at timestamptz not null default now(),
  constraint valid_date_range check (end_date >= start_date)
);

create table if not exists runs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete restrict,
  gameweek_id uuid not null references gameweeks(id) on delete restrict,
  distance_m numeric(10,2) not null check (distance_m >= 0),
  duration_s int not null check (duration_s > 0),
  pace_s_per_km numeric(10,2) generated always as (
    case when distance_m > 0
      then (duration_s::numeric / (distance_m / 1000.0))
      else null
    end
  ) stored,
  source run_source not null default 'strava',
  flagged boolean not null default false,
  synced_at timestamptz not null default now()
);

create table if not exists payouts (
  gameweek_id uuid not null references gameweeks(id) on delete cascade,
  user_id uuid not null references users(id) on delete restrict,
  place int not null check (place in (1, 2, 3)),
  amount numeric(10,2) not null default 0,
  primary key (gameweek_id, user_id)
);

-- ------------------------------------------------------------
-- 4. INDEXES
-- ------------------------------------------------------------
create index if not exists idx_runs_gameweek on runs(gameweek_id);
create index if not exists idx_runs_user on runs(user_id);
create index if not exists idx_gameweeks_league on gameweeks(league_id);
create index if not exists idx_league_members_user on league_members(user_id);

-- ------------------------------------------------------------
-- 5. SEED DATA (test data — safe to skip/remove for production)
-- ------------------------------------------------------------
insert into users (name, strava_id) values
  ('Khai', 'strava_001'),
  ('Barun', 'strava_002')
on conflict (strava_id) do nothing;

insert into leagues (name, invite_code, stake_amount, created_by)
select 'Dorm Legends', 'ABC123', 5.00, id from users where name = 'Khai'
on conflict (invite_code) do nothing;

insert into league_members (league_id, user_id)
select l.id, u.id from leagues l, users u
where l.invite_code = 'ABC123'
on conflict (league_id, user_id) do nothing;

insert into gameweeks (league_id, start_date, end_date)
select id, current_date, current_date + 6
from leagues where invite_code = 'ABC123'
on conflict do nothing;

-- Note: these two inserts are not conflict-guarded (runs has no natural
-- unique key), so re-running this whole file will duplicate these two
-- seed runs. Fine for dev/testing; strip this section before demo day
-- or wrap in a "delete existing seed runs first" guard.
insert into runs (user_id, gameweek_id, distance_m, duration_s)
select u.id, g.id, 5000, 1500
from users u, gameweeks g
where u.name = 'Khai';

insert into runs (user_id, gameweek_id, distance_m, duration_s)
select u.id, g.id, 3200, 1100
from users u, gameweeks g
where u.name = 'Barun';

-- ------------------------------------------------------------
-- 6. FUNCTION: get_leaderboard
-- Returns ranked total distance per user for a given gameweek.
-- Callable from frontend via supabase.rpc('get_leaderboard', { p_gameweek_id })
-- ------------------------------------------------------------
create or replace function get_leaderboard(p_gameweek_id uuid)
returns table (
  user_id uuid,
  name text,
  total_distance_m numeric,
  league_rank bigint
)
language sql
stable
as $$
  select
    u.id as user_id,
    u.name,
    sum(r.distance_m) as total_distance_m,
    rank() over (order by sum(r.distance_m) desc) as league_rank
  from runs r
  join users u on u.id = r.user_id
  where r.gameweek_id = p_gameweek_id
  group by u.id, u.name
  order by total_distance_m desc;
$$;

-- ------------------------------------------------------------
-- 7. FUNCTION: close_gameweek
-- Computes the pot (stake x member count), pays out 1st/2nd/3rd
-- (50%/30%/20% split), and marks the gameweek closed.
-- Output columns are prefixed out_* to avoid PL/pgSQL ambiguity
-- with the RETURNS TABLE column names.
-- Callable via supabase.rpc('close_gameweek', { p_gameweek_id })
-- ------------------------------------------------------------
drop function if exists close_gameweek(uuid);

create or replace function close_gameweek(p_gameweek_id uuid)
returns table (
  out_user_id uuid,
  out_name text,
  out_place int,
  out_amount numeric
)
language plpgsql
as $$
declare
  v_league_id uuid;
  v_stake numeric;
  v_member_count int;
  v_pot numeric;
begin
  select g.league_id, l.stake_amount
    into v_league_id, v_stake
    from gameweeks g
    join leagues l on l.id = g.league_id
    where g.id = p_gameweek_id;

  select count(*) into v_member_count
    from league_members
    where league_id = v_league_id;

  v_pot := v_stake * v_member_count;

  insert into payouts (gameweek_id, user_id, place, amount)
  select
    p_gameweek_id,
    lb.user_id,
    lb.league_rank::int,
    case lb.league_rank
      when 1 then v_pot * 0.50
      when 2 then v_pot * 0.30
      when 3 then v_pot * 0.20
    end
  from get_leaderboard(p_gameweek_id) lb
  where lb.league_rank <= 3
  on conflict (gameweek_id, user_id) do update
    set place = excluded.place, amount = excluded.amount;

  update gameweeks set status = 'closed' where id = p_gameweek_id;

  return query
    select po.user_id, u.name, po.place, po.amount
    from payouts po
    join users u on u.id = po.user_id
    where po.gameweek_id = p_gameweek_id
    order by po.place;
end;
$$;

-- ------------------------------------------------------------
-- 8. FUNCTION: flag_suspicious_runs
-- Anti-cheat pace check: flags runs faster than 2:30/km (150 s/km,
-- elite marathon pace — implausible for casual runners) or slower
-- than 15:00/km (900 s/km, likely a GPS/data error).
-- Callable via supabase.rpc('flag_suspicious_runs')
-- ------------------------------------------------------------
create or replace function flag_suspicious_runs()
returns table (
  out_run_id uuid,
  out_user_id uuid,
  out_name text,
  out_pace_s_per_km numeric,
  out_flagged boolean
)
language plpgsql
as $$
begin
  update runs
  set flagged = true
  where (pace_s_per_km < 150 or pace_s_per_km > 900)
  and flagged = false;

  return query
    select r.id, r.user_id, u.name, r.pace_s_per_km, r.flagged
    from runs r
    join users u on u.id = r.user_id
    where r.flagged = true;
end;
$$;
create or replace function create_league(
  p_name text,
  p_stake_amount numeric,
  p_created_by uuid,
  p_max_members int default 10
)
returns table (
  out_league_id uuid,
  out_name text,
  out_invite_code text,
  out_stake_amount numeric
)
language plpgsql
as $$
declare
  v_code text;
  v_league_id uuid;
begin
  -- generate a unique 6-character invite code, retry if it collides
  loop
    v_code := upper(substring(md5(random()::text) from 1 for 6));
    exit when not exists (select 1 from leagues where invite_code = v_code);
  end loop;

  insert into leagues (name, invite_code, stake_amount, created_by, max_members)
  values (p_name, v_code, p_stake_amount, p_created_by, p_max_members)
  returning id into v_league_id;

  -- creator automatically joins their own league
  insert into league_members (league_id, user_id)
  values (v_league_id, p_created_by);

  return query
    select l.id, l.name, l.invite_code, l.stake_amount
    from leagues l where l.id = v_league_id;
end;
$$;

create or replace function join_league(
  p_invite_code text,
  p_user_id uuid
)
returns table (
  out_league_id uuid,
  out_league_name text,
  out_member_count bigint
)
language plpgsql
as $$
declare
  v_league_id uuid;
  v_max int;
  v_count int;
begin
  -- find the league
  select id, max_members into v_league_id, v_max
  from leagues where invite_code = upper(p_invite_code);

  if v_league_id is null then
    raise exception 'League not found for invite code %', p_invite_code;
  end if;

  -- already a member?
  if exists (
    select 1 from league_members
    where league_id = v_league_id and user_id = p_user_id
  ) then
    raise exception 'User is already a member of this league';
  end if;

  -- league full?
  select count(*) into v_count
  from league_members where league_id = v_league_id;

  if v_count >= v_max then
    raise exception 'League is full (% / % members)', v_count, v_max;
  end if;

  insert into league_members (league_id, user_id)
  values (v_league_id, p_user_id);

  return query
    select l.id, l.name, (select count(*) from league_members m where m.league_id = l.id)
    from leagues l where l.id = v_league_id;
end;
$$;
