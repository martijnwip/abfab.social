-- Enums
create type public.member_role as enum ('member', 'admin');
create type public.member_status as enum ('pending', 'approved', 'rejected');

-- Members tabel
create table public.members (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users (id) on delete cascade,
  role         public.member_role   not null default 'member',
  status       public.member_status not null default 'pending',
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),

  constraint members_user_id_unique unique (user_id)
);

-- Automatisch updated_at bijwerken
create function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger members_set_updated_at
  before update on public.members
  for each row execute function public.set_updated_at();

-- RLS inschakelen
alter table public.members enable row level security;

-- Hulpfunctie: huidige gebruiker is approved
create function public.is_approved()
returns boolean language sql security definer stable as $$
  select exists (
    select 1 from public.members
    where user_id = auth.uid()
    and status = 'approved'
  );
$$;

-- Hulpfunctie: huidige gebruiker is admin
create function public.is_admin()
returns boolean language sql security definer stable as $$
  select exists (
    select 1 from public.members
    where user_id = auth.uid()
    and role = 'admin'
    and status = 'approved'
  );
$$;

-- RLS policies
-- Approved leden zien alleen hun eigen rij
create policy "members: approved users can read own row"
  on public.members for select
  using (
    user_id = auth.uid()
    and status = 'approved'
  );

-- Admins zien alle rijen
create policy "members: admins can read all"
  on public.members for select
  using (public.is_admin());

-- Admins kunnen rollen en statussen bijwerken
create policy "members: admins can update"
  on public.members for update
  using (public.is_admin())
  with check (public.is_admin());

-- Nieuwe rij aanmaken via trigger (service role bypast RLS)
create policy "members: service role can insert"
  on public.members for insert
  with check (true);

-- Trigger: maak automatisch een member aan bij nieuwe auth.user
create function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.members (user_id)
  values (new.id);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
