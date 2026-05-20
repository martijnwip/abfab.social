-- Tags tabel
create table public.tags (
  id         uuid primary key default gen_random_uuid(),
  naam       text not null unique,
  created_at timestamptz not null default now()
);

-- RLS
alter table public.tags enable row level security;

-- Iedereen mag tags lezen (nodig voor formulieren)
create policy "tags: anyone can read"
  on public.tags for select
  using (true);

-- Alleen admins mogen tags aanmaken
create policy "tags: admins can insert"
  on public.tags for insert
  with check (public.is_admin());

-- Alleen admins mogen tags verwijderen
create policy "tags: admins can delete"
  on public.tags for delete
  using (public.is_admin());

-- Seed met de huidige tags
insert into public.tags (naam) values
  ('In één ruk'),
  ('Boek & Film'),
  ('On Request'),
  ('Tech'),
  ('Philosophy'),
  ('Fictie'),
  ('Non-fictie');
