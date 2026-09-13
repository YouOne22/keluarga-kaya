-- Keluarga Kaya Phase 3: Bills, Installments, Debts
-- Run after 007_join_family_rpc.sql

-- BILLS (Tagihan Bulanan)
create table if not exists public.bills (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families(id) on delete cascade,
  name text not null check (char_length(trim(name)) between 1 and 80),
  amount bigint not null check (amount > 0),
  due_day integer not null check (due_day between 1 and 28),
  category_id uuid references public.categories(id) on delete set null,
  notes text default '',
  is_active boolean not null default true,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.bill_payments (
  id uuid primary key default gen_random_uuid(),
  bill_id uuid not null references public.bills(id) on delete cascade,
  family_id uuid not null references public.families(id) on delete cascade,
  month text not null check (char_length(month) = 7),
  amount bigint not null check (amount > 0),
  account_id uuid references public.accounts(id) on delete set null,
  note text default '',
  paid_at timestamptz not null default now(),
  created_by uuid references auth.users(id) on delete set null
);

-- INSTALLMENTS (Cicilan/Angsuran)
create table if not exists public.installments (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families(id) on delete cascade,
  name text not null check (char_length(trim(name)) between 1 and 80),
  total_amount bigint not null check (total_amount > 0),
  monthly_amount bigint not null check (monthly_amount > 0),
  tenor_total integer not null check (tenor_total > 0),
  tenor_paid integer not null default 0 check (tenor_paid >= 0),
  start_date date not null,
  account_id uuid references public.accounts(id) on delete set null,
  category_id uuid references public.categories(id) on delete set null,
  notes text default '',
  status text not null default 'active' check (status in ('active', 'completed', 'cancelled')),
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.installment_payments (
  id uuid primary key default gen_random_uuid(),
  installment_id uuid not null references public.installments(id) on delete cascade,
  family_id uuid not null references public.families(id) on delete cascade,
  tenor_number integer not null check (tenor_number > 0),
  amount bigint not null check (amount > 0),
  account_id uuid references public.accounts(id) on delete set null,
  note text default '',
  paid_at timestamptz not null default now(),
  created_by uuid references auth.users(id) on delete set null
);

-- DEBTS (Hutang/Piutang)
create table if not exists public.debts (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families(id) on delete cascade,
  type text not null check (type in ('debt', 'receivable')),
  person_name text not null check (char_length(trim(person_name)) between 1 and 80),
  amount bigint not null check (amount > 0),
  paid_amount bigint not null default 0 check (paid_amount >= 0),
  due_date date,
  notes text default '',
  status text not null default 'unpaid' check (status in ('unpaid', 'paid')),
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.debt_payments (
  id uuid primary key default gen_random_uuid(),
  debt_id uuid not null references public.debts(id) on delete cascade,
  family_id uuid not null references public.families(id) on delete cascade,
  amount bigint not null check (amount > 0),
  account_id uuid references public.accounts(id) on delete set null,
  note text default '',
  paid_at timestamptz not null default now(),
  created_by uuid references auth.users(id) on delete set null
);

-- INDEXES
create index if not exists idx_bills_family on public.bills(family_id);
create index if not exists idx_bill_payments_bill on public.bill_payments(bill_id);
create index if not exists idx_bill_payments_month on public.bill_payments(month);
create index if not exists idx_installments_family on public.installments(family_id);
create index if not exists idx_installment_payments_installment on public.installment_payments(installment_id);
create index if not exists idx_debts_family on public.debts(family_id);
create index if not exists idx_debts_type on public.debts(type);
create index if not exists idx_debt_payments_debt on public.debt_payments(debt_id);

-- RLS
alter table public.bills enable row level security;
alter table public.bill_payments enable row level security;
alter table public.installments enable row level security;
alter table public.installment_payments enable row level security;
alter table public.debts enable row level security;
alter table public.debt_payments enable row level security;

drop policy if exists "Members manage bills" on public.bills;
create policy "Members manage bills" on public.bills
  for all to authenticated
  using (family_id in (select public.current_user_family_ids()))
  with check (family_id in (select public.current_user_family_ids()));

drop policy if exists "Members manage bill payments" on public.bill_payments;
create policy "Members manage bill payments" on public.bill_payments
  for all to authenticated
  using (family_id in (select public.current_user_family_ids()))
  with check (family_id in (select public.current_user_family_ids()));

drop policy if exists "Members manage installments" on public.installments;
create policy "Members manage installments" on public.installments
  for all to authenticated
  using (family_id in (select public.current_user_family_ids()))
  with check (family_id in (select public.current_user_family_ids()));

drop policy if exists "Members manage installment payments" on public.installment_payments;
create policy "Members manage installment payments" on public.installment_payments
  for all to authenticated
  using (family_id in (select public.current_user_family_ids()))
  with check (family_id in (select public.current_user_family_ids()));

drop policy if exists "Members manage debts" on public.debts;
create policy "Members manage debts" on public.debts
  for all to authenticated
  using (family_id in (select public.current_user_family_ids()))
  with check (family_id in (select public.current_user_family_ids()));

drop policy if exists "Members manage debt payments" on public.debt_payments;
create policy "Members manage debt payments" on public.debt_payments
  for all to authenticated
  using (family_id in (select public.current_user_family_ids()))
  with check (family_id in (select public.current_user_family_ids()));
-- TRIGGER FUNCTIONS
create or replace function public.update_installment_tenor() returns trigger as $$
begin
  if TG_OP = 'INSERT' then
    update public.installments set tenor_paid = tenor_paid + 1, updated_at = now() where id = NEW.installment_id;
  elsif TG_OP = 'DELETE' then
    update public.installments set tenor_paid = tenor_paid - 1, updated_at = now() where id = OLD.installment_id;
  end if;
  return null;
end;
$$ language plpgsql security definer;

drop trigger if exists on_installment_payment_change on public.installment_payments;
create trigger on_installment_payment_change
  after insert or delete on public.installment_payments
  for each row execute function public.update_installment_tenor();

create or replace function public.check_installment_completion() returns trigger as $$
begin
  if NEW.tenor_paid >= NEW.tenor_total then
    update public.installments set status = 'completed', updated_at = now() where id = NEW.id;
  end if;
  return null;
end;
$$ language plpgsql security definer;

drop trigger if exists on_installment_tenor_update on public.installments;
create trigger on_installment_tenor_update
  after update of tenor_paid on public.installments
  for each row execute function public.check_installment_completion();

create or replace function public.update_debt_paid_amount() returns trigger as $$
begin
  if TG_OP = 'INSERT' then
    update public.debts set paid_amount = paid_amount + NEW.amount, updated_at = now() where id = NEW.debt_id;
  elsif TG_OP = 'DELETE' then
    update public.debts set paid_amount = paid_amount - OLD.amount, updated_at = now() where id = OLD.debt_id;
  end if;
  return null;
end;
$$ language plpgsql security definer;

drop trigger if exists on_debt_payment_change on public.debt_payments;
create trigger on_debt_payment_change
  after insert or delete on public.debt_payments
  for each row execute function public.update_debt_paid_amount();

create or replace function public.check_debt_completion() returns trigger as $$
begin
  if NEW.paid_amount >= NEW.amount and NEW.status = 'unpaid' then
    update public.debts set status = 'paid', updated_at = now() where id = NEW.id;
  end if;
  return null;
end;
$$ language plpgsql security definer;

drop trigger if exists on_debt_amount_update on public.debts;
create trigger on_debt_amount_update
  after update of paid_amount on public.debts
  for each row execute function public.check_debt_completion();
