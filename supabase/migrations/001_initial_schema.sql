-- ============================================
-- Keluarga Kaya — Initial Schema
-- Run this in Supabase SQL Editor
-- ============================================

-- 1. HOUSEHOLDS
create table if not exists public.households (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  created_at timestamptz default now() not null
);

-- 2. HOUSEHOLD MEMBERS
create table if not exists public.household_members (
  id uuid default gen_random_uuid() primary key,
  household_id uuid not null references public.households(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  full_name text not null default 'Anggota',
  phone_number text,
  role text not null default 'member' check (role in ('owner', 'member')),
  created_at timestamptz default now() not null,
  unique(household_id, user_id)
);

create index idx_members_user on public.household_members(user_id);
create index idx_members_household on public.household_members(household_id);
create index idx_members_phone on public.household_members(phone_number);

-- 3. TRANSACTIONS
create table if not exists public.transactions (
  id uuid default gen_random_uuid() primary key,
  household_id uuid not null references public.households(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null check (type in ('income', 'expense')),
  amount integer not null check (amount > 0),
  description text not null,
  category text,
  source text not null default 'app' check (source in ('app', 'whatsapp')),
  status text not null default 'confirmed' check (status in ('draft', 'confirmed', 'cancelled')),
  created_at timestamptz default now() not null
);

create index idx_tx_household on public.transactions(household_id, created_at desc);
create index idx_tx_user on public.transactions(user_id);
create index idx_tx_status on public.transactions(status);

-- 4. NOTIFICATIONS
create table if not exists public.notifications (
  id uuid default gen_random_uuid() primary key,
  household_id uuid not null references public.households(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null default 'transaction',
  title text not null,
  body text not null,
  read boolean not null default false,
  created_at timestamptz default now() not null
);

create index idx_notif_user on public.notifications(user_id, read, created_at desc);

-- ============================================
-- RLS — Row Level Security
-- ============================================

alter table public.households enable row level security;
alter table public.household_members enable row level security;
alter table public.transactions enable row level security;
alter table public.notifications enable row level security;

-- Helper: get household IDs for current user
create or replace function public.user_household_ids()
returns setof uuid
language sql
security definer
set search_path = ''
stable
as $$
  select hm.household_id
  from public.household_members hm
  where hm.user_id = (select auth.uid())
$$;

revoke execute on function public.user_household_ids() from public;
grant execute on function public.user_household_ids() to authenticated;

-- HOUSEHOLDS: members can read their own households
create policy "Members can read own households"
  on public.households for select to authenticated
  using (id in (select public.user_household_ids()));

-- HOUSEHOLD_MEMBERS: members can see fellow members
create policy "Members can read household members"
  on public.household_members for select to authenticated
  using (household_id in (select public.user_household_ids()));

-- HOUSEHOLD_MEMBERS: owner can insert new members (invites)
create policy "Owner can add members"
  on public.household_members for insert to authenticated
  with check (
    household_id in (select public.user_household_ids())
    and role = 'member'
  );

-- HOUSEHOLDS: authenticated users can create (onboarding)
create policy "Authenticated users can create households"
  on public.households for insert to authenticated
  with check (true);

-- TRANSACTIONS: members can read their household transactions
create policy "Members can read transactions"
  on public.transactions for select to authenticated
  using (household_id in (select public.user_household_ids()));

-- TRANSACTIONS: members can insert into their household
create policy "Members can insert transactions"
  on public.transactions for insert to authenticated
  with check (
    household_id in (select public.user_household_ids())
    and user_id = (select auth.uid())
  );

-- NOTIFICATIONS: users can read their own notifications
create policy "Users can read own notifications"
  on public.notifications for select to authenticated
  using (user_id = (select auth.uid()));

-- NOTIFICATIONS: users can update read status on own
create policy "Users can update own notifications"
  on public.notifications for update to authenticated
  using (user_id = (select auth.uid()));

-- ============================================
-- REALTIME — enable for notifications
-- ============================================
alter publication supabase_realtime add table public.notifications;

-- ============================================
-- SEED: Default categories (optional)
-- ============================================
-- Add your default categories if needed:
-- insert into public.categories (name, icon) values
--   ('Makanan', '🍔'), ('Transportasi', '🚗'), ('Rumah', '🏠'),
--   ('Tagihan', '💡'), ('Cicilan', '💳'), ('Kesehatan', '💊'),
--   ('Pendidikan', '📚'), ('Hiburan', '🎮'), ('Belanja', '🛒'),
--   ('Tabungan', '🏦'), ('Pemasukan', '💰');
