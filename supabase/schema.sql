-- Run this in the Supabase SQL Editor (supabase.com -> your project -> SQL Editor)

create extension if not exists pgcrypto;

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create table if not exists exam_catalog (
  exam_code text primary key,
  subject text not null,
  batch_id text not null,
  label text not null,
  units text not null,
  focus text not null,
  target integer not null,
  duration_seconds integer not null,
  question_count integer not null,
  updated_at timestamptz not null default now()
);

create table if not exists exam_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  exam_code text not null references exam_catalog(exam_code) on delete cascade,
  subject text not null,
  batch_id text not null,
  score integer not null,
  max_mark integer not null,
  percentage integer not null,
  answered_count integer not null,
  time_taken_seconds integer not null,
  completed_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, exam_code)
);

create table if not exists subject_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  subject text not null,
  storage_key text not null,
  payload jsonb not null,
  updated_at timestamptz not null default now(),
  unique (user_id, storage_key)
);

create table if not exists spaced_revision_plans (
  user_id uuid primary key references auth.users,
  topics jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

drop trigger if exists exam_catalog_updated_at on exam_catalog;
create trigger exam_catalog_updated_at
  before update on exam_catalog
  for each row execute procedure set_updated_at();

drop trigger if exists exam_results_updated_at on exam_results;
create trigger exam_results_updated_at
  before update on exam_results
  for each row execute procedure set_updated_at();

drop trigger if exists subject_progress_updated_at on subject_progress;
create trigger subject_progress_updated_at
  before update on subject_progress
  for each row execute procedure set_updated_at();

drop trigger if exists spaced_revision_plans_updated_at on spaced_revision_plans;
create trigger spaced_revision_plans_updated_at
  before update on spaced_revision_plans
  for each row execute procedure set_updated_at();

alter table exam_catalog enable row level security;
alter table exam_results enable row level security;
alter table subject_progress enable row level security;
alter table spaced_revision_plans enable row level security;

drop policy if exists "authenticated_read_exam_catalog" on exam_catalog;
create policy "authenticated_read_exam_catalog" on exam_catalog
  for select
  to authenticated
  using (true);

drop policy if exists "authenticated_write_exam_catalog" on exam_catalog;
create policy "authenticated_write_exam_catalog" on exam_catalog
  for insert
  to authenticated
  with check (true);

drop policy if exists "authenticated_update_exam_catalog" on exam_catalog;
create policy "authenticated_update_exam_catalog" on exam_catalog
  for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "users_own_exam_results" on exam_results;
create policy "users_own_exam_results" on exam_results
  for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "users_own_subject_progress" on subject_progress;
create policy "users_own_subject_progress" on subject_progress
  for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "users_own_revision_plan" on spaced_revision_plans;
create policy "users_own_revision_plan" on spaced_revision_plans
  for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
