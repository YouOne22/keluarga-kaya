-- Keluarga Kaya Phase 2: Saving Goals
-- Run after 003_phase1_financial_schema.sql

create table if not exists public.saving_goals (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families(id) on delete cascade,
  name text not null check (char_length(trim(name)) between 1 and 80),
  category text not null default 'Lainnya' check (category in ('Pendidikan','Rumah','Kendaraan','Liburan','Pernikahan','Dana Darurat','Modal Usaha','Lainnya')),
  icon text not null default 'target',
  color text not null default '#008d51',
  target_amount bigint not null check (target_amount > 0),
  current_amount bigint not null default 0,
  deadline date,
  status text not null default 'active' check (status in ('active','completed','cancelled')),
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.saving_goal_deposits (
  id uuid primary key default gen_random_uuid(),
  goal_id uuid not null references public.saving_goals(id) on delete cascade,
  family_id uuid not null references public.families(id) on delete cascade,
  amount bigint not null check (amount > 0),
  note text default '',
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

-- Indexes
create index if not exists idx_saving_goals_family on public.saving_goals(family_id);
create index if not exists idx_saving_goal_deposits_goal on public.saving_goal_deposits(goal_id);

-- RLS
alter table public.saving_goals enable row level security;
alter table public.saving_goal_deposits enable row level security;

drop policy if exists "Members manage saving goals" on public.saving_goals;
create policy "Members manage saving goals" on public.saving_goals
  for all to authenticated
  using (family_id in (select public.current_user_family_ids()))
  with check (family_id in (select public.current_user_family_ids()));

drop policy if exists "Members manage saving goal deposits" on public.saving_goal_deposits;
create policy "Members manage saving goal deposits" on public.saving_goal_deposits
  for all to authenticated
  using (family_id in (select public.current_user_family_ids()))
  with check (family_id in (select public.current_user_family_ids()));

-- Trigger to auto-update current_amount from deposits
create or replace function public.update_saving_goal_amount() returns trigger as $$
begin
  if TG_OP = 'INSERT' then
    update public.saving_goals set current_amount = current_amount + NEW.amount, updated_at = now() where id = NEW.goal_id;
  elsif TG_OP = 'DELETE' then
    update public.saving_goals set current_amount = current_amount - OLD.amount, updated_at = now() where id = OLD.goal_id;
  end if;
  return null;
end;
$$ language plpgsql security definer;

drop trigger if exists on_deposit_change on public.saving_goal_deposits;
create trigger on_deposit_change
  after insert or delete on public.saving_goal_deposits
  for each row execute function public.update_saving_goal_amount();
