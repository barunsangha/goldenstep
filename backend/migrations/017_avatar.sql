-- ============================================
-- 017: avatars
--
-- users.avatar_url already existed (unused). It now holds an avatar
-- SEED — a short key like 'aurora' or 'ember' — not a URL and not an
-- uploaded file. Avatars are generated on the device from that seed.
--
-- Why no upload: image upload needs a Supabase Storage bucket, policies,
-- expo-image-picker, permissions, and a network round trip that can fail
-- on stage. A seed string gives every user a distinct, consistent look
-- for one text column and zero infrastructure.
--
-- get_profile must be dropped, not replaced — its return type changes.
-- Wrapped in a transaction so a failed create rolls the drop back.
-- ============================================

begin;

create or replace function set_avatar(p_user_id uuid, p_seed text)
returns table (out_avatar text)
language plpgsql
as $$
begin
  update users set avatar_url = p_seed where id = p_user_id;
  return query select u.avatar_url from users u where u.id = p_user_id;
end;
$$;

drop function if exists get_profile(uuid);

create or replace function get_profile(p_user_id uuid)
returns table (
  out_name text,
  out_avatar text,
  out_daily_step_goal int,
  out_pacts_total bigint,
  out_pacts_completed bigint,
  out_total_forfeited numeric,
  out_total_kept numeric,
  out_steps_all_time bigint
)
language sql
stable
as $$
  with mine as (
    select l.id as league_id, l.stake_amount, g.id as gw_id, g.status
    from league_members lm
    join leagues l on l.id = lm.league_id
    join gameweeks g on g.league_id = l.id
    where lm.user_id = p_user_id
  ),
  forfeits as (
    select m.gw_id, coalesce(p.amount, 0) as forfeited, m.stake_amount
    from mine m
    left join payouts p
      on p.gameweek_id = m.gw_id and p.user_id is null
    where m.status = 'closed'
  )
  select
    u.name,
    u.avatar_url,
    u.daily_step_goal,
    (select count(*) from mine),
    (select count(*) from forfeits where forfeited = 0),
    coalesce((select sum(forfeited) from forfeits), 0),
    coalesce((select sum(stake_amount - forfeited) from forfeits), 0),
    coalesce((
      select sum(r.steps) from runs r
      where r.user_id = p_user_id and r.steps is not null
    ), 0)
  from users u
  where u.id = p_user_id;
$$;

grant execute on function get_profile(uuid) to anon, authenticated;
grant execute on function set_avatar(uuid, text) to anon, authenticated;

commit;

-- Check
-- select * from get_profile('833ba400-ba22-4c6c-a50a-6f7d6dee4516');
-- select * from set_avatar('833ba400-ba22-4c6c-a50a-6f7d6dee4516', 'aurora');