# Backend migrations

Applied in numeric order. Every file here was run in the Supabase SQL Editor
and verified against live data before being committed.

`../database.sql` is the original full build (the pre-pact league model).
These migrations extend it to the PACT product model: steps, solo pacts,
and proportional charity forfeits.

## Files

| File | What it does |
|---|---|
| `001_charities_and_enums.sql` | `charities` table; `pact_type`, `metric_type`, `payout_reason` enums |
| `002_extend_leagues.sql` | `leagues` gains `pact_type`, `metric`, `charity_id`, `goal_amount` |
| `003a_run_source_health.sql` | adds `'health'` to `run_source` — **run alone** |
| `003b_runs_steps.sql` | `runs` gains `steps`, `activity_date`; distance/duration now nullable |
| `004_payouts_charity.sql` | `payouts` can pay a charity; PK swapped to surrogate `id` |
| `005_create_solo_pact.sql` | `create_solo_pact()` |
| `006_get_pact_progress.sql` | `get_pact_progress()` — Active pact card |
| `007_users_daily_goal_and_today_progress.sql` | `users.daily_step_goal`; `get_today_progress()` — Today section |
| `008_get_leaderboards.sql` | `get_leaderboard()` made metric-aware |
| `009_at_risk_proportional.sql` | `at_risk` becomes proportional shortfall |
| `010_get_charities.sql` | `get_charities()` — real UUIDs for the picker |
| `011_close_solo_pact.sql` | `close_solo_pact()` — proportional charity forfeit |
| `012_runs_external_id.sql` | dedup guard for synced activities |

## Rules

- **Migrations are append-only.** Once a file is pushed and applied, never edit
  it — add a new numbered file that supersedes it. Editing an applied migration
  means anyone who already ran it has a database that silently disagrees with
  the file. That is how schema drift starts.
- **003a must run in its own execution.** Postgres cannot use a new enum value
  in the same transaction that adds it.
- **Paste functions whole**, from `create or replace` through the closing `$$;`.
  The `$$ ... $$` is one string literal.
- **No seed data in these files.** Test inserts belong in a separate `seed.sql`,
  or replaying migrations duplicates demo data.

## The money rule

Solo pacts use **proportional forfeit**, matching `frontend/lib/pact-math.ts`:

```
forfeit = stake * (1 - clamp01(current / goal))
```

Finish the goal and nothing moves. Hit 80% of a $50 stake and $10 goes to the
charity; you keep $40. This is deliberately NOT the league model — group
leagues still split a pot 50/30/20 among the top three via `close_gameweek`.

Two settlement functions, on purpose:

| | `close_gameweek` | `close_solo_pact` |
|---|---|---|
| Used by | group leagues | solo pacts |
| Model | pot split 50/30/20 | proportional shortfall |
| Pays | top 3 users | one charity |
| Rows written | up to 3 | 0 or 1 |

## RPC reference

```
create_solo_pact(p_user_id, p_name, p_metric, p_goal_amount,
                 p_stake_amount, p_charity_id,
                 p_start_date default today, p_end_date default today+6)
  -> league_id, gameweek_id, name, metric, goal_amount,
     stake_amount, charity_name, end_date

get_charities()
  -> id, slug, name
     slug matches the ids hardcoded in constants/pact-config.ts

get_pact_progress(p_gameweek_id, p_user_id)      -- Active pact card
  -> league_id, name, pact_type, metric, charity_name, goal_amount,
     current_amount, progress_pct, days_left, at_risk, status

get_today_progress(p_user_id)                    -- Today section
  -> steps, goal, remaining, progress_pct, at_risk

get_leaderboard(p_gameweek_id)                   -- Group pact row
  -> user_id, name, total_amount, league_rank
     NOTE: renamed from total_distance_m in 008

close_solo_pact(p_gameweek_id)
  -> charity_name, goal_amount, final_amount, progress_pct, forfeit, kept

close_gameweek(p_gameweek_id)                    -- group leagues only
  -> user_id, name, place, amount
```

## Units

`distance_m` is stored in **metres**. The UI enters and displays kilometres.
Conversion happens at the API boundary via `goalToApiUnits()` in
`frontend/lib/pact-math.ts` — do not convert in screens.

Steps are stored as-is.

## Open questions

- **`get_today_progress.at_risk` has no agreed definition.** It currently
  returns the stake spread evenly across pact days. Under the proportional
  model, "today's share of a shortfall" is not something the money rule
  defines. Needs a product decision, not a SQL fix.
- **`head_to_head` is not in the `pact_type` enum.** `constants/pact-config.ts`
  lists it as a mode but it is disabled in the UI. Adding it means a new enum
  value and a third settlement path.

## Known gaps

- `close_gameweek`'s final `return query` uses an inner `join users`. Charity
  forfeit rows have `user_id is null`, so if a solo pact were ever passed to it
  the row would be written but silently dropped from the result. Use
  `close_solo_pact` for solo pacts; fix the join if the two are ever merged.
- RLS is intentionally OFF on all tables for demo speed. This is a deliberate
  tradeoff, not an oversight. Do not ship past the hackathon without it.
- No auth wiring. `p_user_id` is passed explicitly rather than read from
  `auth.uid()`.