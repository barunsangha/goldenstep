============================================
-- 013: demo access (RLS off + anon grants)
--
-- WHY THIS EXISTS
-- Supabase enabled row level security by default on every table in
-- this schema. With RLS on and no policies defined, the `anon` role
-- (the role the app uses) sees ZERO ROWS from every table -- with no
-- error. Every RPC returned an empty array from the client while
-- returning correct data in the SQL Editor.
--
-- ⚠️  DEMO ONLY -- DO NOT SHIP
-- This configuration means anyone holding the publishable key can
-- read and write every table, including `payouts`. That is an
-- acceptable tradeoff for a hackathon with seeded users and a fully
-- mocked wallet. It is not acceptable for real users or real money.
--
-- To undo: re-enable RLS on each table and add per-table policies
-- scoped to auth.uid(), then narrow these grants.
-- ============================================
 
alter table users           disable row level security;
alter table leagues         disable row level security;
alter table league_members  disable row level security;
alter table gameweeks       disable row level security;
alter table runs            disable row level security;
alter table payouts         disable row level security;
alter table charities       disable row level security;
 
-- Tables and functions created by migrations 001-012 came after
-- Supabase set its default grants, so anon does not inherit access.
grant usage on schema public to anon, authenticated;
 
grant select, insert, update, delete
  on all tables in schema public
  to anon, authenticated;
 
grant usage, select
  on all sequences in schema public
  to anon, authenticated;
 
grant execute
  on all functions in schema public
  to anon, authenticated;
 
-- Anything created from here on gets the same treatment.
alter default privileges in schema public
  grant select, insert, update, delete on tables to anon, authenticated;
 
alter default privileges in schema public
  grant execute on functions to anon, authenticated;
 
-- PostgREST caches the schema; force it to pick up new functions.
notify pgrst, 'reload schema';
 
-- ============================================
-- Verify as the role the app actually uses:
--
--   set role anon;
--   select count(*) from charities;   -- expect 4
--   select count(*) from leagues;     -- expect 5
--   reset role;
-- ============================================