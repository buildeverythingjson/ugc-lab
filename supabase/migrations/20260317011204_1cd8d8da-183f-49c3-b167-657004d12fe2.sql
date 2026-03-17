CREATE POLICY "Users can delete their own video jobs"
ON public.video_jobs
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);