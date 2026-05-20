-- Works zijn publiek zichtbaar — de leeslijst is een open etalage
drop policy "works: approved members can read" on public.works;

create policy "works: anyone can read"
  on public.works for select
  using (true);

-- Book sessions zijn ook publiek — datum en locatie mogen zichtbaar zijn
drop policy "book_sessions: approved members can read" on public.book_sessions;

create policy "book_sessions: anyone can read"
  on public.book_sessions for select
  using (true);

-- Tags zijn al publiek, geen wijziging nodig
