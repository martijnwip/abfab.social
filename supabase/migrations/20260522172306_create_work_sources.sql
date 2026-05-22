create table public.work_sources (
  id         uuid primary key default gen_random_uuid(),
  work_id    uuid not null references public.works(id) on delete cascade,
  type       text not null default 'overig',
  titel      text,
  inhoud     text not null,
  bron       text,
  created_at timestamptz not null default now()
);

alter table public.work_sources enable row level security;

create policy "work_sources: admins can do all"
  on public.work_sources for all
  using (public.is_admin())
  with check (public.is_admin());
