-- Publieke bucket voor boekomslagen
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'covers',
  'covers',
  true,
  5242880, -- 5MB
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do nothing;

-- Alleen admins mogen uploaden
create policy "covers: admins can upload"
  on storage.objects for insert
  with check (
    bucket_id = 'covers'
    and public.is_admin()
  );

-- Iedereen mag covers lezen (publieke bucket)
create policy "covers: public can read"
  on storage.objects for select
  using (bucket_id = 'covers');

-- Admins mogen covers verwijderen
create policy "covers: admins can delete"
  on storage.objects for delete
  using (
    bucket_id = 'covers'
    and public.is_admin()
  );
