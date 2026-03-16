
INSERT INTO storage.buckets (id, name, public)
VALUES ('generated-videos', 'generated-videos', true);

CREATE POLICY "Public read access for generated videos"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'generated-videos');

CREATE POLICY "Service role can upload generated videos"
ON storage.objects FOR INSERT
TO service_role
WITH CHECK (bucket_id = 'generated-videos');
