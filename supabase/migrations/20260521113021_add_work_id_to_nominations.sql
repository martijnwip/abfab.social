alter table public.nominations
  add column if not exists work_id uuid references public.works(id) on delete set null;
