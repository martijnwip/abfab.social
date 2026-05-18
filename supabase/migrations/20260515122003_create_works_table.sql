-- Works tabel
create table public.works (
  id                      uuid primary key default gen_random_uuid(),
  originele_titel         text        not null,
  auteur                  text        not null,
  jaar_eerste_publicatie  integer,
  taal_origineel          text,
  cover_image_url         text,
  open_library_work_id    text,           -- soft reference, geen FK
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now()
);

-- Automatisch updated_at bijwerken
create trigger works_set_updated_at
  before update on public.works
  for each row execute function public.set_updated_at();

-- RLS inschakelen
alter table public.works enable row level security;

-- Approved members mogen Works lezen
create policy "works: approved members can read"
  on public.works for select
  using (public.is_approved());

-- Alleen admins mogen Works aanmaken
create policy "works: admins can insert"
  on public.works for insert
  with check (public.is_admin());

-- Alleen admins mogen Works bewerken
create policy "works: admins can update"
  on public.works for update
  using (public.is_admin())
  with check (public.is_admin());

-- Alleen admins mogen Works verwijderen
create policy "works: admins can delete"
  on public.works for delete
  using (public.is_admin());
