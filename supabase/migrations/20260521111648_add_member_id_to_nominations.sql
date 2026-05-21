alter table public.nominations
  add column if not exists member_id uuid references public.members(id) on delete set null;
