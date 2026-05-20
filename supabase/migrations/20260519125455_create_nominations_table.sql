-- Enum voor locatievoorkeur
create type public.nominatie_locatie as enum ('buurt', 'online');

-- Enum voor status
create type public.nominatie_status as enum ('pending', 'actief', 'gesloten');

-- Nominations tabel
create table public.nominations (
  id                  uuid primary key default gen_random_uuid(),
  titel               text        not null,
  auteur              text,
  waarom              text,
  aantal_medelezers   integer     not null default 4 check (aantal_medelezers >= 4 and aantal_medelezers <= 12),
  voorkeur_locatie    public.nominatie_locatie not null default 'buurt',
  email               text        not null,
  status              public.nominatie_status not null default 'pending',
  created_at          timestamptz not null default now()
);

-- RLS inschakelen
alter table public.nominations enable row level security;

-- Iedereen mag een nominatie indienen (ook niet-ingelogd)
create policy "nominations: anyone can insert"
  on public.nominations for insert
  with check (true);

-- Admins zien alle nominaties
create policy "nominations: admins can read all"
  on public.nominations for select
  using (public.is_admin());

-- Admins mogen status wijzigen
create policy "nominations: admins can update"
  on public.nominations for update
  using (public.is_admin())
  with check (public.is_admin());
