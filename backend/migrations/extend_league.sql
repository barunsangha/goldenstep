-- ============================================
-- Step 2: extend leagues for solo pacts, metrics, charities
-- ============================================

alter table leagues
  add column if not exists pact_type pact_type not null default 'group';

alter table leagues
  add column if not exists metric metric_type not null default 'distance_m';

alter table leagues
  add column if not exists charity_id uuid references charities(id) on delete restrict;

alter table leagues
  add column if not exists goal_amount numeric(12,2)
  check (goal_amount is null or goal_amount > 0);

do $$ begin
  alter table leagues
    add constraint solo_requires_charity
    check (pact_type <> 'solo' or charity_id is not null);
exception when duplicate_object then null; end $$;

create index if not exists idx_leagues_pact_type on leagues(pact_type);
create index if not exists idx_leagues_charity on leagues(charity_id);


