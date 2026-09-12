-- Keluarga Kaya: Join family by owner phone number
-- Run after 006_fix_household_nullable.sql

create or replace function public.join_family_by_phone(p_phone text)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user uuid := auth.uid();
  v_owner_id uuid;
  v_family uuid;
  v_owner_name text;
begin
  if v_user is null then
    raise exception 'Anda harus masuk terlebih dahulu';
  end if;

  -- 1. Find profile by phone number
  select p.id, p.full_name into v_owner_id, v_owner_name
  from public.profiles p
  where p.phone_number = trim(p_phone);

  if v_owner_id is null then
    raise exception 'Nomor WhatsApp % tidak ditemukan di aplikasi.', p_phone;
  end if;

  if v_owner_id = v_user then
    raise exception 'Anda tidak bisa bergabung dengan keluarga sendiri.';
  end if;

  -- 2. Find family where this user is owner (or member)
  select fm.family_id into v_family
  from public.family_members fm
  where fm.user_id = v_owner_id
  limit 1;

  if v_family is null then
    raise exception 'Pengguna dengan nomor % belum tergabung dalam keluarga manapun.', p_phone;
  end if;

  -- 3. Check if current user is already in ANY family
  if exists (
    select 1 from public.family_members
    where user_id = v_user
  ) then
    raise exception 'Anda sudah tergabung dalam keluarga. Keluar dulu atau gunakan akun yang berbeda.';
  end if;

  -- 4. Insert current user as member
  insert into public.family_members(family_id, user_id, role)
  values (v_family, v_user, 'member');

  return v_family;
end;
$$;

revoke all on function public.join_family_by_phone(text) from public;
grant execute on function public.join_family_by_phone(text) to authenticated;
