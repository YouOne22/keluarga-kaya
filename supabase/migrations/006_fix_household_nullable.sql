-- Keluarga Kaya: Fix household_id nullable + WA webhook robustness
-- Run after 005_add_family_member_rpc.sql

-- Make household_id nullable on transactions (legacy column, family_id is the new one)
ALTER TABLE public.transactions ALTER COLUMN household_id DROP NOT NULL;

-- Make household_id nullable on notifications (legacy column, family_id is the new one)
ALTER TABLE public.notifications ALTER COLUMN household_id DROP NOT NULL;
