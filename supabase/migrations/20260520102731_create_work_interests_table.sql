create table public.work_interests (
  id         uuid primary key default gen_random_uuid(),
  work_id    uuid not null references public.works (id) on delete cascade,
  email      text not null,
  created_at timestamptz not null default now(),

  constraint work_interests_unique unique (work_id, email)
);

alter table public.work_interests enable row level security;

-- Iedereen mag interesse tonen (ook niet-ingelogd)
create policy "work_interests: anyone can insert"
  on public.work_interests for insert
  with check (true);

-- Admins zien alle interesses
create policy "work_interests: admins can read all"
  on public.work_interests for select
  using (public.is_admin());
