create extension if not exists pgcrypto;

create table if not exists public.feedbacks (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 50),
  rating smallint not null check (rating between 1 and 5),
  product text not null check (char_length(product) between 1 and 100),
  message text not null check (char_length(message) between 20 and 400),
  consent boolean not null default false,
  approved boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.feedbacks enable row level security;

create policy "Public can read approved feedbacks"
on public.feedbacks for select
to anon
using (approved = true);

create policy "Public can submit feedbacks for moderation"
on public.feedbacks for insert
to anon
with check (approved = false and consent = true);

create index if not exists feedbacks_approved_created_at_idx
on public.feedbacks (approved, created_at desc);

-- A aprovação inicial pode ser feita no Table Editor do Supabase.
-- Marque approved como true somente depois de revisar o depoimento.
