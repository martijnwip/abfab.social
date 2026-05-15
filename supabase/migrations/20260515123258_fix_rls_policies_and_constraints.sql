-- Fix 1: verwijder te open INSERT policy op members
-- De trigger handle_new_user() draait als security definer en bypast RLS toch al
drop policy "members: service role can insert" on public.members;

-- Fix 2: DELETE voor eigen ratings op user_book_ratings
create policy "user_book_ratings: members can delete own"
  on public.user_book_ratings for delete
  using (
    public.is_approved()
    and member_id = (
      select id from public.members where user_id = auth.uid()
    )
  );

create policy "user_book_ratings: admins can delete all"
  on public.user_book_ratings for delete
  using (public.is_admin());

-- Fix 3: admins mogen members handmatig aanmelden voor sessies
create policy "session_signups: admins can insert"
  on public.session_signups for insert
  with check (public.is_admin());

-- Fix 4: admins mogen members verwijderen
create policy "members: admins can delete"
  on public.members for delete
  using (public.is_admin());

-- Fix 5: ondergrens groepscijfer van >= 0 naar >= 1
alter table public.book_sessions
  drop constraint if exists book_sessions_groepscijfer_check;

alter table public.book_sessions
  add constraint book_sessions_groepscijfer_check
  check (groepscijfer >= 1 and groepscijfer <= 10);
