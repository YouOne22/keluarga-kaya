-- ============================================
-- Keluarga Kaya — Atomic household onboarding
-- Run after 001_initial_schema.sql
-- ============================================

-- Creates household and its owner in one DB transaction.
-- SECURITY DEFINER is required because a new user has no household membership yet.
create or replace function public.create_household(p_name text)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_household_id uuid;
  v_user_id uuid := auth.uid();
  v_full_name text;
begin
  if v_user_id is null then
    raise exception 'Anda harus masuk untuk membuat rumah tangga';
  end if;

  if nullif(trim(p_name), '') is null then
    raise exception 'Nama rumah tangga wajib diisi';
  end if;

  if char_length(trim(p_name)) > 100 then
    raise exception 'Nama rumah tangga maksimal 100 karakter';
  end if;

  select coalesce(
    nullif(trim(auth.jwt() -> 'user_metadata' ->> 'full_name'), ''),
    nullif(split_part(auth.jwt() ->> 'email', '@', 1), ''),
    'Anggota'
  ) into v_full_name;

  insert into public.households (name)
  values (trim(p_name))
  returning id into v_household_id;

  insert into public.household_members (
    household_id,
    user_id,
    full_name,
    role
  )
  values (
    v_household_id,
    v_user_id,
    v_full_name,
    'owner'
  );

  return v_household_id;
end;
$$;

revoke all on function public.create_household(text) from public;
grant execute on function public.create_household(text) to authenticated;

-- Review possible household records created before this migration.
-- Do NOT delete until you confirm they are unwanted.
-- select h.id, h.name, h.created_at
-- from public.households h
-- left join public.household_members hm on hm.household_id = h.id
-- where hm.id is null
-- order by h.created_at desc;