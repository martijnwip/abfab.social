alter table public.works
  add column tags text[] not null default '{}';
