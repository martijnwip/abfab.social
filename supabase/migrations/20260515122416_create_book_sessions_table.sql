-- Enum
create type public.session_taal as enum ('NL', 'EN');

-- BookSessions tabel
create table public.book_sessions (
  id          uuid primary key default gen_random_uuid(),
  work_id     uuid        not null references public.works (id) on delete restrict,
  datum       date        not null,
  locatie     text,
  voertaal    public.session_taal not null default 'NL',
  groepscijfer numeric(3, 1) check (groepscijfer >= 0 and groepscijfer <= 10),
  notities    text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Automatisch updated_at bijwerken
create trigger book_sessions_set_updated_at
  before update on public.book_sessions
  for each row execute function public.set_updated_at();

-- RLS inschakelen
alter table public.book_sessions enable row level security;

-- Approved members mogen BookSessions lezen
create policy "book_sessions: approved members can read"
  on public.book_sessions for select
  using (public.is_approved());

-- Alleen admins mogen BookSessions aanmaken
create policy "book_sessions: admins can insert"
  on public.book_sessions for insert
  with check (public.is_admin());

-- Alleen admins mogen BookSessions bewerken
create policy "book_sessions: admins can update"
  on public.book_sessions for update
  using (public.is_admin())
  with check (public.is_admin());

-- Alleen admins mogen BookSessions verwijderen
create policy "book_sessions: admins can delete"
  on public.book_sessions for delete
  using (public.is_admin());
