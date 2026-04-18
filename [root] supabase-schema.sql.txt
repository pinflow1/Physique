-- PhysiQ Database Schema
-- Run this entire file in Supabase SQL Editor once

-- ── Extensions ───────────────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ── Users ────────────────────────────────────────────────────────────
create table public.users (
  id          uuid references auth.users(id) on delete cascade primary key,
  email       text not null,
  plan        text not null default 'basic' check (plan in ('basic', 'pro', 'elite')),
  credits     integer not null default 0 check (credits >= 0),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ── Scans ─────────────────────────────────────────────────────────────
-- NOTE: stores storage paths (not public URLs) since bucket is private
create table public.scans (
  id                  uuid primary key default uuid_generate_v4(),
  user_id             uuid references public.users(id) on delete cascade not null,
  scan_type           text not null check (scan_type in ('single', 'comparison')),
  current_image_path  text not null,
  goal_image_path     text,
  credits_used        integer not null default 1 check (credits_used > 0),
  status              text not null default 'pending'
                        check (status in ('pending', 'processing', 'complete', 'failed')),
  result              jsonb,
  created_at          timestamptz not null default now()
);

-- ── Credit Transactions ───────────────────────────────────────────────
create table public.credit_transactions (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid references public.users(id) on delete cascade not null,
  amount      integer not null,
  type        text not null check (type in ('credit', 'debit')),
  description text not null,
  scan_id     uuid references public.scans(id) on delete set null,
  created_at  timestamptz not null default now()
);

-- ── Row Level Security ────────────────────────────────────────────────
alter table public.users              enable row level security;
alter table public.scans              enable row level security;
alter table public.credit_transactions enable row level security;

-- Users: read own row, update own row, insert own row (needed for first-login fallback)
create policy "users_select_own"
  on public.users for select
  using (auth.uid() = id);

create policy "users_insert_own"
  on public.users for insert
  with check (auth.uid() = id);

create policy "users_update_own"
  on public.users for update
  using (auth.uid() = id);

-- Service role bypasses RLS (used by API routes)
create policy "users_service_all"
  on public.users for all
  using (auth.role() = 'service_role');

-- Scans: users can read their own scans
create policy "scans_select_own"
  on public.scans for select
  using (auth.uid() = user_id);

create policy "scans_service_all"
  on public.scans for all
  using (auth.role() = 'service_role');

-- Credit transactions: users can read their own
create policy "txn_select_own"
  on public.credit_transactions for select
  using (auth.uid() = user_id);

create policy "txn_service_all"
  on public.credit_transactions for all
  using (auth.role() = 'service_role');

-- ── Auto-create user row on signup ───────────────────────────────────
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, email, plan, credits)
  values (new.id, new.email, 'basic', 0)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ── Auto-update updated_at ────────────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger users_updated_at
  before update on public.users
  for each row execute procedure public.set_updated_at();

-- ── Indexes ───────────────────────────────────────────────────────────
create index idx_scans_user_id   on public.scans(user_id);
create index idx_scans_status    on public.scans(status);
create index idx_scans_created   on public.scans(created_at desc);
create index idx_txn_user_id     on public.credit_transactions(user_id);
create index idx_txn_created     on public.credit_transactions(created_at desc);

-- ── Storage bucket setup ──────────────────────────────────────────────
-- Run these manually in Supabase dashboard > Storage, OR uncomment:
-- insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
-- values (
--   'physique-images',
--   'physique-images',
--   false,
--   10485760,
--   array['image/jpeg','image/jpg','image/png','image/webp']
-- )
-- on conflict (id) do nothing;

-- Storage RLS — users can upload/read their own images, service role has full access
-- create policy "storage_user_insert"
--   on storage.objects for insert
--   with check (bucket_id = 'physique-images' and auth.uid()::text = (storage.foldername(name))[1]);

-- create policy "storage_user_select"
--   on storage.objects for select
--   using (bucket_id = 'physique-images' and auth.uid()::text = (storage.foldername(name))[1]);

-- create policy "storage_service_all"
--   on storage.objects for all
--   using (bucket_id = 'physique-images' and auth.role() = 'service_role');
