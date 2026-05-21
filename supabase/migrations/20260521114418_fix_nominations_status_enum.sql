-- Voeg nieuwe waarden toe aan de bestaande status enum
alter type public.nominatie_status add value if not exists 'approved';
alter type public.nominatie_status add value if not exists 'rejected';
