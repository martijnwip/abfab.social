-- Verwijder voorstel_actief van nominations (hoort daar niet)
alter table public.nominations
  drop column if exists voorstel_actief;

-- Voorstel velden op works
alter table public.works
  add column if not exists voorstel_actief boolean not null default false,
  add column if not exists voorstel_drempel integer not null default 6;
