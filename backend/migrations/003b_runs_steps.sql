
-- ============================================
-- Step 3: runs accepts steps as well as distance
-- ============================================

alter table runs
  add column if not exists steps int check (steps is null or steps >= 0);

alter table runs
  add column if not exists activity_date date not null default current_date;

alter table runs alter column distance_m drop not null;
alter table runs alter column duration_s drop not null;

do $$ begin
  alter table runs add constraint runs_has_metric
    check (distance_m is not null or steps is not null);
exception when duplicate_object then null; end $$;

create index if not exists idx_runs_user_date on runs(user_id, activity_date);

select column_name, is_nullable, data_type
from information_schema.columns
where table_name = 'runs'
order by ordinal_position;