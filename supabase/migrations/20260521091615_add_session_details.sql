alter table public.book_sessions
  add column eindtijd time,
  add column notitie text,
  add column max_deelnemers integer not null default 12;
