-- ============================================
-- 008: metric-aware get_leaderboard
-- ============================================
begin;
drop function if exists get_leaderboard(uuid);
create or replace function get_leaderboard(p_gameweek_id uuid)
returns table (
  user_id uuid,
  name text,
  total_amount numeric,
  league_rank bigint
)
language sql
stable
as $$
  with pact as (
    select l.metric
    from gameweeks g
    join leagues l on l.id = g.league_id
    where g.id = p_gameweek_id
  ),
  totals as (
    select
      u.id as user_id,
      u.name,
      coalesce(sum(
        case when p.metric = 'steps' then r.steps else r.distance_m end
      ), 0) as total_amount
    from runs r
    cross join pact p
    join users u on u.id = r.user_id
    where r.gameweek_id = p_gameweek_id
    group by u.id, u.name
  )
  select
    t.user_id,
    t.name,
    t.total_amount,
    rank() over (order by t.total_amount desc) as league_rank
  from totals t
  order by t.total_amount desc;
$$;
commit;
