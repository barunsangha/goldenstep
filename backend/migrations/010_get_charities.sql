-- ============================================
-- 010: get_charities
-- Frontend hardcodes slugs because it has no way
-- to fetch real UUIDs. This is that way.
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