-- SessionSignups tabel
create table public.session_signups (
  id           uuid primary key default gen_random_uuid(),
  session_id   uuid        not null references public.book_sessions (id) on delete cascade,
  member_id    uuid        not null references public.members (id) on delete cascade,
  created_at   timestamptz not null default now(),

  constraint session_signups_unique unique (session_id, member_id)
);

-- RLS inschakelen
alter table public.session_signups enable row level security;

-- Approved members zien hun eigen aanmeldingen
create policy "session_signups: members can read own"
  on public.session_signups for select
  using (
    public.is_approved()
    and member_id = (
      select id from public.members where user_id = auth.uid()
    )
  );

-- Admins zien alle aanmeldingen
create policy "session_signups: admins can read all"
  on public.session_signups for select
  using (public.is_admin());

-- Approved members mogen zichzelf aanmelden
create policy "session_signups: members can insert own"
  on public.session_signups for insert
  with check (
    public.is_approved()
    and member_id = (
      select id from public.members where user_id = auth.uid()
    )
  );

-- Approved members mogen hun eigen aanmelding verwijderen
create policy "session_signups: members can delete own"
  on public.session_signups for delete
  using (
    public.is_approved()
    and member_id = (
      select id from public.members where user_id = auth.uid()
    )
  );

-- Admins mogen alle aanmeldingen verwijderen
create policy "session_signups: admins can delete all"
  on public.session_signups for delete
  using (public.is_admin());
