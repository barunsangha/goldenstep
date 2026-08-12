-- ============================================
-- 015: profile data
--
-- Two functions for the Profile screen:
--   get_profile        — headline numbers for a user
--   get_pact_history   — their past pacts and how each ended
--
-- Both read from existing tables; no schema changes.
-- ============================================

create or replace function get_profile(p_user_id uuid)
returns table (
  out_name text,
  out_daily_step_goal int,
  out_pacts_total bigint,
  out_pacts_completed bigint,
  out_total_forfeited numeric,
  out_total_kept numeric,
  out_steps_all_time bigint
)
language sql
stable
as $$
  with mine as (
    select l.id as league_id, l.stake_amount, g.id as gw_id, g.status
    from league_members lm
    join leagues l on l.id = lm.league_id
    join gameweeks g on g.league_id = l.id
    where lm.user_id = p_user_id
  ),
  forfeits as (
    select m.gw_id, coalesce(p.amount, 0) as forfeited, m.stake_amount
    from mine m
    left join payouts p
      on p.gameweek_id = m.gw_id and p.user_id is null
    where m.status = 'closed'
  )
  select
    u.name,
    u.daily_step_goal,
    (select count(*) from mine),
    -- "completed" = closed with nothing forfeited
    (select count(*) from forfeits where forfeited = 0),
    coalesce((select sum(forfeited) from forfeits), 0),
    coalesce((select sum(stake_amount - forfeited) from forfeits), 0),
    coalesce((
      select sum(r.steps) from runs r
      where r.user_id = p_user_id and r.steps is not null
    ), 0)
  from users u
  where u.id = p_user_id;
$$;

create or replace function get_pact_history(p_user_id uuid)
returns table (
  out_gameweek_id uuid,
  out_name text,
  out_metric metric_type,
  out_charity_name text,
  out_goal_amount numeric,
  out_final_amount numeric,
  out_progress_pct numeric,
  out_stake_amount numeric,
  out_forfeited numeric,
  out_end_date date,
  out_status gameweek_status
)
language sql
stable
as $$
  select
    g.id,
    l.name,
    l.metric,
    c.name,
    l.goal_amount,
    coalesce(totals.amount, 0),
    case
      when l.goal_amount is null or l.goal_amount = 0 then null
      else round(least(coalesce(totals.amount, 0) / l.goal_amount * 100, 100), 0)
    end,
    l.stake_amount,
    coalesce(pay.amount, 0),
    g.end_date,
    g.status
  from league_members lm
  join leagues l on l.id = lm.league_id
  join gameweeks g on g.league_id = l.id
  left join charities c on c.id = l.charity_id
  left join lateral (
    select sum(
      case when l.metric = 'steps' then r.steps else r.distance_m end
    ) as amount
    from runs r
    where r.gameweek_id = g.id and r.user_id = p_user_id
  ) totals on true
  left join payouts pay
    on pay.gameweek_id = g.id and pay.user_id is null
  where lm.user_id = p_user_id
  order by g.end_date desc;
$$;

grant execute on function get_profile(uuid) to anon, authenticated;
grant execute on function get_pact_history(uuid) to anon, authenticated;

