-- Gesprekskaart hoort bij het werk, niet de sessie.
-- Alle sessies van hetzelfde work delen dezelfde gesprekskaart.
alter table public.works
  add column gesprekskaart jsonb;
