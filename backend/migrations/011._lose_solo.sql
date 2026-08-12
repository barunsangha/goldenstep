
011 close solo pact · SQL
-- ============================================
-- 011: close_solo_pact
--
-- Proportional forfeit, matching frontend/lib/pact-math.ts:
--   forfeit = stake * (1 - clamp01(current / goal))
--
-- Deliberately SEPARATE from close_gameweek. The two settlement
-- models share nothing: leagues split a pot 50/30/20 among the
-- top three players; a solo pact pays one charity the share the
-- user missed. Merging them makes both harder to reason about.
-- ============================================
 
create or replace function close_solo_pact(p_gameweek_id uuid)
returns table (
  out_charity_name text,
  out_goal_amount numeric,
  out_final_amount numeric,
  out_progress_pct numeric,
  out_forfeit numeric,
  out_kept numeric
)
language plpgsql
as $$
declare
  v_league_id uuid;
  v_user_id uuid;
  v_metric metric_type;
  v_goal numeric;
  v_stake numeric;
  v_charity_id uuid;
  v_current numeric;
  v_forfeit numeric;
begin
  select l.id, l.created_by, l.metric, l.goal_amount, l.stake_amount, l.charity_id
    into v_league_id, v_user_id, v_metric, v_goal, v_stake, v_charity_id
    from gameweeks g
    join leagues l on l.id = g.league_id
    where g.id = p_gameweek_id and l.pact_type = 'solo';
 
  if v_league_id is null then
    raise exception 'gameweek % is not a solo pact', p_gameweek_id;
  end if;
 
  select coalesce(sum(
    case when v_metric = 'steps' then r.steps else r.distance_m end
  ), 0)
    into v_current
    from runs r
    where r.gameweek_id = p_gameweek_id
      and r.user_id = v_user_id;
 
  v_forfeit := round(
    v_stake * (1 - least(v_current / nullif(v_goal, 0), 1)), 2
  );
 
  -- "Finish and nothing moves" -- no row when the goal is met.
  if v_forfeit > 0 then
    insert into payouts (gameweek_id, user_id, charity_id, place, amount, reason)
    values (p_gameweek_id, null, v_charity_id, null, v_forfeit, 'charity_forfeit')
    on conflict (gameweek_id) where user_id is null
    do update set amount = excluded.amount;
  end if;
 
  update gameweeks set status = 'closed' where id = p_gameweek_id;
 
  return query
    select c.name, v_goal, v_current,
           round(least(v_current / nullif(v_goal, 0) * 100, 100), 0),
           v_forfeit,
           v_stake - v_forfeit
    from charities c
    where c.id = v_charity_id;
end;
$$;
 
