

do $$ begin
  create type pact_type as enum ('solo', 'group');
exception when duplicate_object then null; end $$;

do $$ begin
  create type metric_type as enum ('steps', 'distance_m');
exception when duplicate_object then null; end $$;

do $$ begin
  create type payout_reason as enum ('winnings', 'charity_forfeit');
exception when duplicate_object then null; end $$;

create table if not exists charities (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  created_at timestamptz not null default now()
);

insert into charities (name) values
  ('Red Cross'),
  ('UNICEF'),
  ('Beyond Blue'),
  ('WWF')
on conflict (name) do nothing;


