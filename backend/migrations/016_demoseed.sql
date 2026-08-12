-- ============================================
-- 016: demo seed data  ⚠️  NOT A SCHEMA MIGRATION
--
-- Run this by hand before a demo. It backfills finished pacts so the
-- Profile screen shows a real history instead of a single row.
--
-- Safe to re-run: every insert is guarded.
-- Delete the created rows with the cleanup block at the bottom.
-- ============================================

do $$
declare
  v_user uuid := '833ba400-ba22-4c6c-a50a-6f7d6dee4516';  -- Khai
  v_redcross uuid;
  v_unicef uuid;
  v_wwf uuid;
  v_league uuid;
  v_gw uuid;
begin
  select id into v_redcross from charities where name = 'Red Cross';
  select id into v_unicef   from charities where name = 'UNICEF';
  select id into v_wwf      from charities where name = 'WWF';

  ---------------------------------------------------------------
  -- Pact 1: FINISHED — goal met, nothing forfeited
  ---------------------------------------------------------------
  if not exists (select 1 from leagues where name = '40,000 steps this week') then
    insert into leagues (name, invite_code, stake_amount, created_by,
                         max_members, pact_type, metric, goal_amount, charity_id)
    values ('40,000 steps this week', 'DEMO01', 40, v_user,
            1, 'solo', 'steps', 40000, v_unicef)
    returning id into v_league;

    insert into league_members (league_id, user_id) values (v_league, v_user);

    insert into gameweeks (league_id, start_date, end_date, status)
    values (v_league, current_date - 21, current_date - 15, 'closed')
    returning id into v_gw;

    -- 42,000 steps: goal beaten
    insert into runs (user_id, gameweek_id, steps, source, activity_date, external_id)
    values (v_user, v_gw, 42000, 'health', current_date - 16, 'demo:pact1');
    -- no payout row: "finish and nothing moves"
  end if;

  ---------------------------------------------------------------
  -- Pact 2: MISSED — 60% done, 40% of stake to charity
  ---------------------------------------------------------------
  if not exists (select 1 from leagues where name = '60,000 steps this week') then
    insert into leagues (name, invite_code, stake_amount, created_by,
                         max_members, pact_type, metric, goal_amount, charity_id)
    values ('60,000 steps this week', 'DEMO02', 25, v_user,
            1, 'solo', 'steps', 60000, v_wwf)
    returning id into v_league;

    insert into league_members (league_id, user_id) values (v_league, v_user);

    insert into gameweeks (league_id, start_date, end_date, status)
    values (v_league, current_date - 14, current_date - 8, 'closed')
    returning id into v_gw;

    insert into runs (user_id, gameweek_id, steps, source, activity_date, external_id)
    values (v_user, v_gw, 36000, 'health', current_date - 9, 'demo:pact2');

    -- 36,000 / 60,000 = 60% done -> forfeit 40% of $25 = $10.00
    insert into payouts (gameweek_id, user_id, charity_id, place, amount, reason)
    values (v_gw, null, v_wwf, null, 10.00, 'charity_forfeit');
  end if;

  ---------------------------------------------------------------
  -- Pact 3: MISSED badly — 25% done, 75% to charity
  ---------------------------------------------------------------
  if not exists (select 1 from leagues where name = '80,000 steps this week') then
    insert into leagues (name, invite_code, stake_amount, created_by,
                         max_members, pact_type, metric, goal_amount, charity_id)
    values ('80,000 steps this week', 'DEMO03', 20, v_user,
            1, 'solo', 'steps', 80000, v_redcross)
    returning id into v_league;

    insert into league_members (league_id, user_id) values (v_league, v_user);

    insert into gameweeks (league_id, start_date, end_date, status)
    values (v_league, current_date - 35, current_date - 29, 'closed')
    returning id into v_gw;

    insert into runs (user_id, gameweek_id, steps, source, activity_date, external_id)
    values (v_user, v_gw, 20000, 'health', current_date - 30, 'demo:pact3');

    -- 20,000 / 80,000 = 25% -> forfeit 75% of $20 = $15.00
    insert into payouts (gameweek_id, user_id, charity_id, place, amount, reason)
    values (v_gw, null, v_redcross, null, 15.00, 'charity_forfeit');
  end if;
end $$;

-- Check it
select * from get_profile('833ba400-ba22-4c6c-a50a-6f7d6dee4516');
select out_name, out_progress_pct, out_forfeited, out_status
from get_pact_history('833ba400-ba22-4c6c-a50a-6f7d6dee4516');

-- ============================================
-- CLEANUP (run to remove the demo pacts)
--
-- delete from leagues where invite_code in ('DEMO01','DEMO02','DEMO03');
-- -- cascades to league_members, gameweeks, payouts; runs are restricted
-- -- so delete those first if it complains:
-- -- delete from runs where external_id like 'demo:%';
-- ============================================