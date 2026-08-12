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
| `003b_runs_steps.sql` | `runs` gains `steps`, `activity_date`; distance/duration nullable |
| `004_payouts_charity.sql` | `payouts` can pay a charity; PK swapped to surrogate `id` |
| `005_create_solo_pact.sql` | `create_solo_pact()` |
| `006_get_pact_progress.sql` | `get_pact_progress()` |
| `007_users_daily_goal_and_today_progress.sql` | `users.daily_step_goal`; `get_today_progress()` |
| `008_get_leaderboards.sql` | `get_leaderboard()` made metric-aware |
| `009_riskprop.sql` | `at_risk` becomes proportional shortfall (supersedes 006) |
| `010_get_charities.sql` | `get_charities()` — real UUIDs for the picker |
| `011_close_solo_pact.sql` | `close_solo_pact()` — proportional charity forfeit |
| `012_runsexternal.sql` | dedup guard for synced activities |
| `013_demoapps.sql` | ⚠️ RLS off + anon grants — **demo only** |
| `014_get_active_pact.sql` | `get_active_pact()` — finds a user's live pact |
| `015_profile.sql` | `get_profile()`, `get_pact_history()` |

`016_demo_seed.sql` is **not** a migration — it is demo data, run by hand.

## Rules

- **Migrations are append-only.** Once a file is pushed and applied, never
  edit it — add a new numbered file that supersedes it. Editing an applied
  migration means anyone who already ran it has a database that silently
  disagrees with the file.
- **003a must run in its own execution.** Postgres cannot use a new enum
  value in the same transaction that adds it.
- **Paste functions whole**, from `create or replace` through the closing
  `$$;`. The `$$ ... $$` is one string literal.
- **No seed data in migration files.** Test inserts belong in `016_demo_seed.sql`.

## ⚠️ RLS — read this

Supabase had row level security **ON by default** on every table, with no
policies. The effect: the `anon` role (what the app uses) saw **zero rows
from every table, with no error**. Every RPC returned `[]` to the client
while returning correct data in the SQL Editor.

Migration `013` disables RLS and grants anon access.

**This corrects an earlier assumption.** Our notes said RLS was "off as a
deliberate tradeoff." It was not off — it was on and silently blocking
everything. It is off *now*, deliberately, which means anyone holding the
publishable key can read and write every table including `payouts`.
Acceptable for a hackathon with seeded users and a mocked wallet. Not
acceptable for real users or real money.

**If an RPC returns an empty array from the app, check this first.**

## The money rule

Solo pacts use **proportional forfeit**, matching `frontend/lib/pact-math.ts`:

```
forfeit = stake * (1 - clamp01(current / goal))
```

Finish the goal and nothing moves. Hit 80% of a $50 stake and $10 goes to
the charity; you keep $40.

Two settlement functions, on purpose:

| | `close_gameweek` | `close_solo_pact` |
|---|---|---|
| Used by | group leagues | solo pacts |
| Model | pot split 50/30/20 | proportional shortfall |
| Pays | top 3 users | one charity |
| Rows written | up to 3 | 0 or 1 |

**Please do not merge them.**

## RPC reference

```
create_solo_pact(p_user_id, p_name, p_metric, p_goal_amount,
                 p_stake_amount, p_charity_id,
                 p_start_date default today, p_end_date default today+6)
  -> league_id, gameweek_id, name, metric, goal_amount,
     stake_amount, charity_name, end_date

get_charities()
  -> id, slug, name
     slug matches the ids in constants/pact-config.ts

get_active_pact(p_user_id)                       -- finds the live pact
  -> gameweek_id, league_id, name, pact_type, metric, charity_name,
     goal_amount, stake_amount, start_date, end_date, days_total

get_pact_progress(p_gameweek_id, p_user_id)      -- Active pact card
  -> league_id, name, pact_type, metric, charity_name, goal_amount,
     current_amount, progress_pct, days_left, at_risk, status

get_today_progress(p_user_id)                    -- Today section
  -> steps, goal, remaining, progress_pct, at_risk

get_leaderboard(p_gameweek_id)                   -- Group pact row
  -> user_id, name, total_amount, league_rank
     NOTE: renamed from total_distance_m in 008

get_profile(p_user_id)                           -- Profile header
  -> name, daily_step_goal, pacts_total, pacts_completed,
     total_forfeited, total_kept, steps_all_time

get_pact_history(p_user_id)                      -- Profile list
  -> gameweek_id, name, metric, charity_name, goal_amount,
     final_amount, progress_pct, stake_amount, forfeited,
     end_date, status

close_solo_pact(p_gameweek_id)
  -> charity_name, goal_amount, final_amount, progress_pct, forfeit, kept

close_gameweek(p_gameweek_id)                    -- group leagues only
  -> user_id, name, place, amount
```

## Units

`distance_m` is stored in **metres**. The UI enters and displays kilometres.
Conversion happens at the API boundary via `goalToApiUnits()` in
`frontend/lib/pact-math.ts` — never convert in screens.

Steps are stored as-is.

## Duplicate protection

`runs` has a unique index on `(source, external_id)` where external_id is
not null. The app writes `external_id = pedometer:{userId}:{date}`, so
re-syncing the same day updates rather than duplicating. Without this, every
refresh would inflate the user's total — a scoring bug with money attached.

## Open questions

- **`get_today_progress.at_risk` has no agreed definition.** It currently
  spreads the stake evenly across pact days. Under the proportional model,
  "today's share of a shortfall" is not something the money rule defines.
  Product decision, not a SQL fix.
- **`head_to_head` is not in the `pact_type` enum.** `pact-config.ts` lists
  it as a mode but it is disabled in the UI. Needs a new enum value and a
  third settlement path.

## Known gaps

- `close_gameweek`'s final `return query` uses an inner `join users`.
  Charity forfeit rows have `user_id is null`, so a solo pact passed to it
  would write the row but drop it from the result. Use `close_solo_pact`.
- **No auth.** `p_user_id` is passed explicitly; the app hardcodes a demo
  UUID in `frontend/lib/session.ts`.
- **RLS off** — see above.
- **Feed tab hidden.** No social graph exists in the schema: no friends,
  no follows, no activity table. `href: null` in `app/(tabs)/_layout.tsx`.
- **`group-pact-row.tsx` still uses mock data.** `get_active_pact` returns
  one pact; a group row needs a second. Left mocked deliberately.