alter table public.nominations
  add column if not exists voorstel_actief boolean not null default false;
