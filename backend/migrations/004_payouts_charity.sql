-- ============================================
-- Step 4: payouts support charity forfeits
-- ============================================

-- PK must go before user_id can be nullable
alter table payouts drop constraint if exists payouts_pkey;

alter table payouts
  add column if not exists id uuid primary key default gen_random_uuid();

alter table payouts alter column user_id drop not null;
alter table payouts alter column place drop not null;

alter table payouts
  add column if not exists charity_id uuid references charities(id) on delete restrict;

alter table payouts
  add column if not exists reason payout_reason not null default 'winnings';

-- keeps close_gameweek's ON CONFLICT working, untouched
create unique index if not exists uq_payouts_gameweek_user
  on payouts(gameweek_id, user_id);

-- at most one charity forfeit per gameweek
create unique index if not exists uq_payouts_gameweek_charity
  on payouts(gameweek_id) where user_id is null;

do $$ begin
  alter table payouts add constraint payouts_one_recipient
    check (
      (user_id is not null and charity_id is null)
      or (user_id is null and charity_id is not null)
    );
exception when duplicate_object then null; end $$;

select column_name, is_nullable
from information_schema.columns
where table_name = 'payouts'
order by ordinal_position;

