-- ============================================
-- 009: at_risk becomes proportional shortfall
--
-- Supersedes the at_risk calculation in 006.
-- Matches frontend/lib/pact-math.ts amountAtRisk():
--   stake * (1 - clamp01(current / goal))
--
-- Previously returned the full stake regardless of progress,
-- which contradicted the product rule stated in review.tsx:
-- "you are charged the same share you missed".
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
    coalesce(
      round(
        p.stake_amount * (
          1 - least(pr.current_amount / nullif(p.goal_amount, 0), 1)
        ), 2),
      p.stake_amount
    ),
    p.status
  from pact p
  cross join progress pr
  left join charities c on c.id = p.charity_id;
$$;