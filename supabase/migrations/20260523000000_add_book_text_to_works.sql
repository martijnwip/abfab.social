ALTER TABLE works ADD COLUMN IF NOT EXISTS book_text_path TEXT;

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('book-texts', 'book-texts', false, 20971520, ARRAY['text/plain'])
ON CONFLICT (id) DO NOTHING;
