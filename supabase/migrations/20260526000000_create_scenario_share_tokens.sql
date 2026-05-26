create table scenario_share_tokens (
  id uuid primary key default gen_random_uuid(),
  token text unique not null default encode(gen_random_bytes(16), 'hex'),
  work_id uuid not null references works(id) on delete cascade,
  expires_at timestamptz not null default now() + interval '7 days',
  created_at timestamptz not null default now()
);

-- Iedereen mag een geldig token opzoeken (voor de publieke pagina)
alter table scenario_share_tokens enable row level security;

create policy "Publiek lezen van geldige tokens"
  on scenario_share_tokens for select
  using (expires_at > now());

create policy "Alleen service role mag schrijven"
  on scenario_share_tokens for all
  using (false)
  with check (false);
