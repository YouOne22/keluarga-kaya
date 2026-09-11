-- Keluarga Kaya Phase 1: Core + Financial
-- Run after 001_initial_schema.sql and 002_create_household_rpc.sql.
-- Legacy household tables remain during transition.

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default 'Anggota', phone_number text, avatar_url text,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.families (
  id uuid primary key default gen_random_uuid(), name text not null check (char_length(trim(name)) between 1 and 100),
  created_by uuid references auth.users(id) on delete set null, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.family_members (
  id uuid primary key default gen_random_uuid(), family_id uuid not null references public.families(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade, role text not null default 'member' check (role in ('owner','member')),
  joined_at timestamptz not null default now(), unique(family_id,user_id)
);
create table if not exists public.accounts (
  id uuid primary key default gen_random_uuid(), family_id uuid not null references public.families(id) on delete cascade,
  name text not null check (char_length(trim(name)) between 1 and 80), account_type text not null default 'cash' check (account_type in ('cash','bank','ewallet','investment','other')),
  color text not null default '#008d51', opening_balance bigint not null default 0, is_archived boolean not null default false,
  created_by uuid references auth.users(id) on delete set null, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(), family_id uuid not null references public.families(id) on delete cascade,
  name text not null check (char_length(trim(name)) between 1 and 60), kind text not null check (kind in ('income','expense')),
  icon text not null default 'circle', color text not null default '#008d51', is_archived boolean not null default false,
  created_at timestamptz not null default now(), unique(family_id,name,kind)
);

alter table public.transactions add column if not exists family_id uuid references public.families(id) on delete cascade;
alter table public.transactions add column if not exists account_id uuid references public.accounts(id) on delete set null;
alter table public.transactions add column if not exists category_id uuid references public.categories(id) on delete set null;
alter table public.transactions add column if not exists transaction_date date not null default current_date;
alter table public.transactions add column if not exists updated_at timestamptz not null default now();
alter table public.transactions alter column amount type bigint;
alter table public.notifications add column if not exists family_id uuid references public.families(id) on delete cascade;

insert into public.families(id,name,created_at) select id,name,created_at from public.households on conflict(id) do nothing;
insert into public.profiles(id,full_name,phone_number) select user_id,max(full_name),max(phone_number) from public.household_members group by user_id on conflict(id) do update set full_name=excluded.full_name,phone_number=coalesce(excluded.phone_number,public.profiles.phone_number);
insert into public.family_members(family_id,user_id,role,joined_at) select household_id,user_id,role,created_at from public.household_members on conflict(family_id,user_id) do nothing;
update public.transactions set family_id=household_id where family_id is null;
update public.notifications set family_id=household_id where family_id is null;

create index if not exists idx_family_members_user_family on public.family_members(user_id,family_id);
create index if not exists idx_accounts_family_active on public.accounts(family_id) where not is_archived;
create index if not exists idx_categories_family_kind on public.categories(family_id,kind) where not is_archived;
create index if not exists idx_transactions_family_date on public.transactions(family_id,transaction_date desc) where status='confirmed';

create or replace function public.set_updated_at() returns trigger language plpgsql set search_path=public as $$ begin new.updated_at=now(); return new; end; $$;
drop trigger if exists profiles_set_updated_at on public.profiles; create trigger profiles_set_updated_at before update on public.profiles for each row execute function public.set_updated_at();
drop trigger if exists families_set_updated_at on public.families; create trigger families_set_updated_at before update on public.families for each row execute function public.set_updated_at();
drop trigger if exists accounts_set_updated_at on public.accounts; create trigger accounts_set_updated_at before update on public.accounts for each row execute function public.set_updated_at();
drop trigger if exists transactions_set_updated_at on public.transactions; create trigger transactions_set_updated_at before update on public.transactions for each row execute function public.set_updated_at();

create or replace function public.current_user_family_ids() returns setof uuid language sql stable security definer set search_path='' as $$ select fm.family_id from public.family_members fm where fm.user_id=(select auth.uid()) $$;
revoke all on function public.current_user_family_ids() from public; grant execute on function public.current_user_family_ids() to authenticated;

alter table public.profiles enable row level security; alter table public.families enable row level security; alter table public.family_members enable row level security; alter table public.accounts enable row level security; alter table public.categories enable row level security;
drop policy if exists "Profile owner manages profile" on public.profiles;
create policy "Profile owner manages profile" on public.profiles for all to authenticated using(id=(select auth.uid())) with check(id=(select auth.uid()));
drop policy if exists "Members read families" on public.families;
create policy "Members read families" on public.families for select to authenticated using(id in(select public.current_user_family_ids()));
drop policy if exists "Owners update families" on public.families;
create policy "Owners update families" on public.families for update to authenticated using(exists(select 1 from public.family_members fm where fm.family_id=id and fm.user_id=(select auth.uid()) and fm.role='owner'));
drop policy if exists "Members read family members" on public.family_members;
create policy "Members read family members" on public.family_members for select to authenticated using(family_id in(select public.current_user_family_ids()));
drop policy if exists "Members manage accounts" on public.accounts;
create policy "Members manage accounts" on public.accounts for all to authenticated using(family_id in(select public.current_user_family_ids())) with check(family_id in(select public.current_user_family_ids()));
drop policy if exists "Members manage categories" on public.categories;
create policy "Members manage categories" on public.categories for all to authenticated using(family_id in(select public.current_user_family_ids())) with check(family_id in(select public.current_user_family_ids()));

drop policy if exists "Members can read transactions" on public.transactions;
drop policy if exists "Members can insert transactions" on public.transactions;
drop policy if exists "Members manage financial transactions" on public.transactions;
create policy "Members manage financial transactions" on public.transactions for all to authenticated using(family_id in(select public.current_user_family_ids())) with check(family_id in(select public.current_user_family_ids()) and user_id=(select auth.uid()));
drop policy if exists "Users can read own notifications" on public.notifications;
drop policy if exists "Users can update own notifications" on public.notifications;
drop policy if exists "Users manage own notifications" on public.notifications;
create policy "Users manage own notifications" on public.notifications for all to authenticated using(user_id=(select auth.uid()) and family_id in(select public.current_user_family_ids())) with check(user_id=(select auth.uid()) and family_id in(select public.current_user_family_ids()));

create or replace function public.create_family(p_name text) returns uuid language plpgsql security definer set search_path=public as $$
declare v_id uuid:=gen_random_uuid(); v_user uuid:=auth.uid(); v_name text:=trim(p_name); v_full text;
begin
 if v_user is null then raise exception 'Anda harus masuk untuk membuat keluarga'; end if;
 if v_name is null or char_length(v_name) not between 1 and 100 then raise exception 'Nama keluarga wajib diisi, maksimal 100 karakter'; end if;
 select coalesce(nullif(trim(auth.jwt()->'user_metadata'->>'full_name'),''),split_part(coalesce(auth.jwt()->>'email','Anggota'),'@',1)) into v_full;
 insert into public.profiles(id,full_name) values(v_user,v_full) on conflict(id) do nothing;
 insert into public.families(id,name,created_by) values(v_id,v_name,v_user);
 insert into public.family_members(family_id,user_id,role) values(v_id,v_user,'owner');
 insert into public.accounts(family_id,name,account_type,color,created_by) values(v_id,'Kas Utama','cash','#008d51',v_user);
 insert into public.categories(family_id,name,kind,icon,color) values(v_id,'Gaji','income','wallet','#008d51'),(v_id,'Makanan','expense','utensils','#f39a2e'),(v_id,'Transportasi','expense','car','#2886e8'),(v_id,'Tagihan','expense','zap','#f7ba35'),(v_id,'Belanja','expense','shopping-cart','#e8498b');
 return v_id;
end; $$;
revoke all on function public.create_family(text) from public; grant execute on function public.create_family(text) to authenticated;

do $$ begin alter publication supabase_realtime add table public.notifications; exception when duplicate_object then null; end $$;

