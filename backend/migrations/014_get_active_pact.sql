-- ============================================
-- 014: get_active_pact
--
-- The app has no way to find "the pact I am currently in".
-- Every progress RPC needs a gameweek_id, but nothing returns
-- one after create_solo_pact's response is gone. This closes
-- the loop: given a user, find their live gameweek.
--
-- Returns the most recently created active pact. If a user is
-- in several, Home shows the newest.
-- ============================================

create or replace function get_active_pact(p_user_id uuid)
returns table (
  out_gameweek_id uuid,
  out_league_id uuid,
  out_name text,
  out_pact_type pact_type,
  out_metric metric_type,
  out_charity_name text,
  out_goal_amount numeric,
  out_stake_amount numeric,
  out_start_date date,
  out_end_date date,
  out_days_total int
)
language sql
stable
as $$
  select
    g.id,
    l.id,
    l.name,
    l.pact_type,
    l.metric,
    c.name,
    l.goal_amount,
    l.stake_amount,
    g.start_date,
    g.end_date,
    (g.end_date - g.start_date + 1)::int
  from league_members lm
  join leagues l on l.id = lm.league_id
  join gameweeks g on g.league_id = l.id
  left join charities c on c.id = l.charity_id
  where lm.user_id = p_user_id
    and g.status = 'active'
  order by g.created_at desc
  limit 1;
$$;

grant execute on function get_active_pact(uuid) to anon, authenticated;