-- ============================================
-- Step 6: get_pact_progress (metric-aware)
-- ============================================

create or replace function get_pact_progress(
  p_gameweek_id uuid,
  p_user_id uuid
)
returns table (
  out_league_id uuid,
  out_name text,
  out_pact_type pact_type,
  out_metric metric_type,
  out_charity_name text,
  out_goal_amount numeric,
  out_current_amount numeric,
  out_progress_pct numeric,
  out_days_left int,
  out_at_risk numeric,
  out_status gameweek_status
)
language sql
stable
as $$
  with pact as (
    select l.id, l.name, l.pact_type, l.metric, l.goal_amount,
           l.stake_amount, l.charity_id,
           g.id as gw_id, g.end_date, g.status
    from gameweeks g
    join leagues l on l.id = g.league_id
    where g.id = p_gameweek_id
  ),
  progress as (
    select coalesce(sum(
      case when p.metric = 'steps' then r.steps else r.distance_m end
    ), 0) as current_amount
    from pact p
    left join runs r
      on r.gameweek_id = p.gw_id
     and r.user_id = p_user_id
  )
  select
    p.id,
    p.name,
    p.pact_type,
    p.metric,
    c.name,
    p.goal_amount,
    pr.current_amount,
    case
      when p.goal_amount is null or p.goal_amount = 0 then null
      else round(least(pr.current_amount / p.goal_amount * 100, 100), 0)
    end,
    greatest(p.end_date - current_date, 0)::int,
    p.stake_amount,
    p.status
  from pact p
  cross join progress pr
  left join charities c on c.id = p.charity_id;
$$;
select * from get_pact_progress(
  'f4dd831a-a9eb-4e2c-976b-a3d9f97de1af',
  '833ba400-ba22-4c6c-a50a-6f7d6dee4516'
);
insert into runs (user_id, gameweek_id, steps, source, activity_date)
values (
  '833ba400-ba22-4c6c-a50a-6f7d6dee4516',
  'f4dd831a-a9eb-4e2c-976b-a3d9f97de1af',
  37000,
  'health',
  current_date
);