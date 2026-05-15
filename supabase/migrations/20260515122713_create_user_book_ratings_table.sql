-- UserBookRatings tabel
create table public.user_book_ratings (
  id           uuid primary key default gen_random_uuid(),
  work_id      uuid           not null references public.works (id) on delete cascade,
  member_id    uuid           not null references public.members (id) on delete cascade,
  cijfer       numeric(3, 1)  not null check (cijfer >= 1 and cijfer <= 10),
  commentaar   text,
  created_at   timestamptz    not null default now(),
  updated_at   timestamptz    not null default now(),

  constraint user_book_ratings_unique unique (work_id, member_id)
);

-- Automatisch updated_at bijwerken
create trigger user_book_ratings_set_updated_at
  before update on public.user_book_ratings
  for each row execute function public.set_updated_at();

-- RLS inschakelen
alter table public.user_book_ratings enable row level security;

-- Approved members zien hun eigen ratings
create policy "user_book_ratings: members can read own"
  on public.user_book_ratings for select
  using (
    public.is_approved()
    and member_id = (
      select id from public.members where user_id = auth.uid()
    )
  );

-- Admins zien alle ratings
create policy "user_book_ratings: admins can read all"
  on public.user_book_ratings for select
  using (public.is_admin());

-- Approved members mogen hun eigen rating aanmaken
create policy "user_book_ratings: members can insert own"
  on public.user_book_ratings for insert
  with check (
    public.is_approved()
    and member_id = (
      select id from public.members where user_id = auth.uid()
    )
  );

-- Approved members mogen hun eigen rating bewerken
create policy "user_book_ratings: members can update own"
  on public.user_book_ratings for update
  using (
    public.is_approved()
    and member_id = (
      select id from public.members where user_id = auth.uid()
    )
  )
  with check (
    public.is_approved()
    and member_id = (
      select id from public.members where user_id = auth.uid()
    )
  );

-- Admins mogen alle ratings bewerken
create policy "user_book_ratings: admins can update all"
  on public.user_book_ratings for update
  using (public.is_admin())
  with check (public.is_admin());
