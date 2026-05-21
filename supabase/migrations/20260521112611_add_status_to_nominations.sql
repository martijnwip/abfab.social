alter table public.nominations
  add column if not exists status text not null default 'pending'
    check (status in ('pending', 'approved', 'rejected'));
