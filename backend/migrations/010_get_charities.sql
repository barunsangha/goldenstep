-- ============================================
-- 010: get_charities
--
-- The frontend hardcoded charity slugs in
-- constants/pact-config.ts because it had no way to fetch
-- real UUIDs, while create_solo_pact requires p_charity_id uuid.
--
-- out_slug is generated to match those hardcoded ids exactly
-- (red-cross, unicef, beyond-blue, wwf) so the picker can map
-- slug -> uuid without changing its display metadata.
-- ============================================

create or replace function get_charities()
returns table (
  out_id uuid,
  out_slug text,
  out_name text
)
language sql
stable
as $$
  select
    c.id,
    lower(replace(c.name, ' ', '-')),
    c.name
  from charities c
  order by c.name;
$$;