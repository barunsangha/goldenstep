-- ============================================
-- 012: prevent duplicate activity imports
--
-- Without this, a retried sync, a re-auth, or a refresh can
-- re-import the same activity and silently inflate a user's
-- totals. In an app where money is attached to standings,
-- that is a scoring bug, not a cosmetic one.
--
-- The partial index means manual entries and seed data
-- (no external_id) are unaffected.
-- ============================================

alter table runs
  add column if not exists external_id text;

create unique index if not exists uq_runs_external
  on runs(source, external_id) where external_id is not null;