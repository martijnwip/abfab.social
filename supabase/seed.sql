-- ============================================================
-- Seed: admin + dummy members
-- Uitvoeren via Supabase Dashboard → SQL Editor
-- Idempotent: veilig om meerdere keren te draaien
-- ============================================================

-- Dummy user UUIDs
do $$ begin
  -- 1. Jouzelf als admin
  insert into public.members (user_id, role, status)
  values ('ca8e8903-23c7-4e2f-b26e-50af92358914', 'admin', 'approved')
  on conflict (user_id) do update
    set role = 'admin', status = 'approved';

  -- 2. Dummy auth users aanmaken
  insert into auth.users (
    id, instance_id, aud, role, email,
    encrypted_password, email_confirmed_at,
    created_at, updated_at,
    confirmation_token, recovery_token,
    email_change_token_new, email_change
  ) values
    (
      'aaaaaaaa-0000-0000-0000-000000000001',
      '00000000-0000-0000-0000-000000000000',
      'authenticated', 'authenticated',
      'anna.de.vries@example.nl', '',
      now(), now(), now(), '', '', '', ''
    ),
    (
      'aaaaaaaa-0000-0000-0000-000000000002',
      '00000000-0000-0000-0000-000000000000',
      'authenticated', 'authenticated',
      'thomas.bakker@example.nl', '',
      now(), now(), now(), '', '', '', ''
    ),
    (
      'aaaaaaaa-0000-0000-0000-000000000003',
      '00000000-0000-0000-0000-000000000000',
      'authenticated', 'authenticated',
      'lisa.janssen@example.nl', '',
      now(), now(), now(), '', '', '', ''
    ),
    (
      'aaaaaaaa-0000-0000-0000-000000000004',
      '00000000-0000-0000-0000-000000000000',
      'authenticated', 'authenticated',
      'mark.smit@example.nl', '',
      now(), now(), now(), '', '', '', ''
    ),
    (
      'aaaaaaaa-0000-0000-0000-000000000005',
      '00000000-0000-0000-0000-000000000000',
      'authenticated', 'authenticated',
      'sara.hendriks@example.nl', '',
      now(), now(), now(), '', '', '', ''
    )
  on conflict (id) do nothing;

  -- 3. Member rijen voor dummy users
  -- (trigger heeft dit al gedaan als ze via signup kwamen,
  --  maar bij directe insert in auth.users niet)
  insert into public.members (user_id, role, status)
  values
    ('aaaaaaaa-0000-0000-0000-000000000001', 'member', 'approved'),
    ('aaaaaaaa-0000-0000-0000-000000000002', 'member', 'pending'),
    ('aaaaaaaa-0000-0000-0000-000000000003', 'member', 'pending'),
    ('aaaaaaaa-0000-0000-0000-000000000004', 'member', 'rejected'),
    ('aaaaaaaa-0000-0000-0000-000000000005', 'member', 'approved')
  on conflict (user_id) do nothing;

end $$;
