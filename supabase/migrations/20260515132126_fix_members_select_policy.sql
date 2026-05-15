-- Elke ingelogde gebruiker mag zijn eigen rij lezen, ongeacht status.
-- Dit is nodig zodat pending/rejected members hun eigen status kunnen opvragen.
drop policy "members: approved users can read own row" on public.members;

create policy "members: users can read own row"
  on public.members for select
  using (user_id = auth.uid());
