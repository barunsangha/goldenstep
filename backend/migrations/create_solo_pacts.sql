-- ============================================
-- Step 5: create_solo_pact
-- ============================================

create or replace function create_solo_pact(
  p_user_id uuid,
  p_name text,
  p_metric metric_type,
  p_goal_amount numeric,
  p_stake_amount numeric,
  p_charity_id uuid,
  p_start_date date default current_date,
  p_end_date date default (current_date + 6)
)
returns table (
  out_league_id uuid,
  out_gameweek_id uuid,
  out_name text,
  out_metric metric_type,
  out_goal_amount numeric,
  out_stake_amount numeric,
  out_charity_name text,
  out_end_date date
)
language plpgsql
as $$
declare
  v_code text;
  v_league_id uuid;
  v_gameweek_id uuid;
begin
  if not exists (select 1 from charities where id = p_charity_id) then
    raise exception 'charity % does not exist', p_charity_id;
  end if;

  loop
    v_code := upper(substring(md5(random()::text) from 1 for 6));
    exit when not exists (select 1 from leagues where invite_code = v_code);
  end loop;

  insert into leagues (
    name, invite_code, stake_amount, created_by,
    max_members, pact_type, metric, goal_amount, charity_id
  )
  values (
    p_name, v_code, p_stake_amount, p_user_id,
    1, 'solo', p_metric, p_goal_amount, p_charity_id
  )
  returning id into v_league_id;

  insert into league_members (league_id, user_id)
  values (v_league_id, p_user_id);

  insert into gameweeks (league_id, start_date, end_date)
  values (v_league_id, p_start_date, p_end_date)
  returning id into v_gameweek_id;

  return query
    select l.id, v_gameweek_id, l.name, l.metric, l.goal_amount,
           l.stake_amount, c.name, g.end_date
    from leagues l
    join charities c on c.id = l.charity_id
    join gameweeks g on g.id = v_gameweek_id
    where l.id = v_league_id;
end;
$$;

select id, name from users;
select id, name from charities where name = 'Red Cross';

select * from create_solo_pact(
  '833ba400-ba22-4c6c-a50a-6f7d6dee4516',
  '50,000 steps this week',
  'steps',
  50000,
  13.00,
  '6339bc0e-48d7-42ba-a87c-6357fd0524b7'
);