create table if not exists public.feedback_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.feedback_admins enable row level security;

grant select on table public.feedback_admins to authenticated;
grant select, update on table public.feedbacks to authenticated;

drop policy if exists "Admins can read own membership" on public.feedback_admins;
create policy "Admins can read own membership"
on public.feedback_admins for select
to authenticated
using (user_id = (select auth.uid()));

drop policy if exists "Admins can read feedbacks" on public.feedbacks;
create policy "Admins can read feedbacks"
on public.feedbacks for select
to authenticated
using (
  exists (
    select 1
    from public.feedback_admins
    where feedback_admins.user_id = (select auth.uid())
  )
);

drop policy if exists "Admins can moderate feedbacks" on public.feedbacks;
create policy "Admins can moderate feedbacks"
on public.feedbacks for update
to authenticated
using (
  exists (
    select 1
    from public.feedback_admins
    where feedback_admins.user_id = (select auth.uid())
  )
)
with check (
  exists (
    select 1
    from public.feedback_admins
    where feedback_admins.user_id = (select auth.uid())
  )
);

-- Depois de criar o usuário em Authentication > Users, copie o User UID e execute:
-- insert into public.feedback_admins (user_id)
-- values ('COLE-O-USER-UID-AQUI')
-- on conflict (user_id) do nothing;
