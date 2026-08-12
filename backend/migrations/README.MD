# Backend migrations

Applied in numeric order. Each file was run in the Supabase SQL Editor
and verified before being committed.

`../database.sql` is the original full build (pre-pact model).
These migrations extend it to support the PACT product model:
steps, solo pacts, and charity forfeits.

| File | What it does |
|---|---|
| `001_charities_and_enums.sql` | `charities` table; `pact_type`, `metric_type`, `payout_reason` enums |
| `002_extend_leagues.sql` | `leagues` gains `pact_type`, `metric`, `charity_id`, `goal_amount` |
| `003a_run_source_health.sql` | adds `'health'` to `run_source` — **run alone** |
| `003b_runs_steps.sql` | `runs` gains `steps`, `activity_date`; distance/duration now nullable |
| `004_payouts_charity.sql` | `payouts` can pay a charity; PK swapped to surrogate `id` |
| `005_create_solo_pact.sql` | `create_solo_pact()` RPC |
| `006_get_pact_progress.sql` | `get_pact_progress()` RPC — Active pact card |
| `007_users_daily_goal_and_today_progress.sql` | `users.daily_step_goal`; `get_today_progress()` RPC — Today section |

## Gotchas

- **003a must run in its own execution.** Postgres cannot use a new enum
  value in the same transaction that adds it.
- **Paste functions whole**, from `create or replace` through the closing `$$;`.
  The `$$ ... $$` is one string literal.
- **No seed data in these files.** Test inserts belong in a separate
  `seed.sql`, or replaying migrations duplicates demo data.

## RPC quick reference (for frontend)

```
create_solo_pact(p_user_id, p_name, p_metric, p_goal_amount,
                 p_stake_amount, p_charity_id,
                 p_start_date default today, p_end_date default today+6)

get_pact_progress(p_gameweek_id, p_user_id)
  -> name, pact_type, metric, charity_name, goal_amount,
     current_amount, progress_pct, days_left, at_risk, status

get_today_progress(p_user_id)
  -> steps, goal, remaining, progress_pct, at_risk
```

## Known gaps

- `get_leaderboard` still hardcodes `sum(distance_m)` — not metric-aware.
  A steps-based group pact will rank incorrectly (nulls sort first on `desc`).
- `close_gameweek` writes no charity forfeit rows yet, and its final
  `join users` is an inner join — forfeit rows (`user_id is null`) would be
  silently dropped from the return. Needs a left join.
- `runs` has no dedup guard. Before Strava sync goes live, add
  `external_id` + a unique index on `(source, external_id)`.