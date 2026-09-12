-- Keluarga Kaya: Add family member by phone number
-- Run after 004_saving_goals.sql

create or replace function public.add_family_member(p_phone text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user uuid := auth.uid();
  v_family uuid;
  v_profile_id uuid;
  v_full_name text;
begin
  if v_user is null then
    raise exception 'Anda harus masuk terlebih dahulu';
  end if;

  -- Get user's family (as owner)
  select fm.family_id into v_family
  from public.family_members fm
  where fm.user_id = v_user and fm.role = 'owner'
  limit 1;

  if v_family is null then
    raise exception 'Hanya pemilik keluarga yang bisa menambah anggota';
  end if;

  -- Find profile by phone number
  select p.id, p.full_name into v_profile_id, v_full_name
  from public.profiles p
  where p.phone_number = trim(p_phone);

  if v_profile_id is null then
    raise exception 'Nomor % belum terdaftar di aplikasi. Anggota harus mendaftar terlebih dahulu.', p_phone;
  end if;

  -- Check if already a member
  if exists (
    select 1 from public.family_members
    where family_id = v_family and user_id = v_profile_id
  ) then
    raise exception '% sudah menjadi anggota keluarga ini', v_full_name;
  end if;

  -- Add member
  insert into public.family_members(family_id, user_id, role)
  values (v_family, v_profile_id, 'member');
end;
$$;

revoke all on function public.add_family_member(text) from public;
grant execute on function public.add_family_member(text) to authenticated;
