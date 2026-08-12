alter table users
  add column if not exists daily_step_goal int not null default 10000
  check (daily_step_goal > 0);

create or replace function get_today_progress(p_user_id uuid)
returns table (
  out_steps int,
  out_goal int,
  out_remaining int,
  out_progress_pct numeric,
  out_at_risk numeric
)
language sql
stable
as $$
  with today as (
    select coalesce(sum(r.steps), 0)::int as steps
    from runs r
    where r.user_id = p_user_id
      and r.activity_date = current_date
      and r.steps is not null
  ),
  goal as (
    select daily_step_goal as goal from users where id = p_user_id
  ),
  risk as (
    select coalesce(sum(
      l.stake_amount / nullif(g.end_date - g.start_date + 1, 0)
    ), 0) as at_risk
    from league_members lm
    join leagues l on l.id = lm.league_id
    join gameweeks g on g.league_id = l.id
    where lm.user_id = p_user_id
      and g.status = 'active'
      and current_date between g.start_date and g.end_date
  )
  select
    t.steps,
    g.goal,
    greatest(g.goal - t.steps, 0),
    round(least(t.steps::numeric / g.goal * 100, 100), 0),
    round(r.at_risk, 2)
  from today t cross join goal g cross join risk r;
$$;

select * from get_today_progress('833ba400-ba22-4c6c-a50a-6f7d6dee4516');

select id, steps, activity_date, source
from runs
where user_id = '833ba400-ba22-4c6c-a50a-6f7d6dee4516'
  and steps is not null;

  alter table runs
  add column if not exists external_id text;

create unique index if not exists uq_runs_external
  on runs(source, external_id) where external_id is not null;

  

