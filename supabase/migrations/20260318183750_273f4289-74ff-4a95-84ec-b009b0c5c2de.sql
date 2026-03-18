
CREATE TABLE public.rate_limits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  function_name text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE INDEX idx_rate_limits_lookup ON public.rate_limits (user_id, function_name, created_at);

ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can manage rate limits"
  ON public.rate_limits
  FOR ALL
  TO public
  USING (auth.role() = 'service_role'::text)
  WITH CHECK (auth.role() = 'service_role'::text);

-- Cleanup function to remove old entries (> 5 minutes)
CREATE OR REPLACE FUNCTION public.check_rate_limit(
  p_user_id uuid,
  p_function_name text,
  p_max_requests integer,
  p_window_seconds integer DEFAULT 60
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  request_count integer;
BEGIN
  -- Clean old entries
  DELETE FROM rate_limits
  WHERE function_name = p_function_name
    AND created_at < now() - interval '5 minutes';

  -- Count recent requests
  SELECT count(*) INTO request_count
  FROM rate_limits
  WHERE user_id = p_user_id
    AND function_name = p_function_name
    AND created_at > now() - (p_window_seconds || ' seconds')::interval;

  IF request_count >= p_max_requests THEN
    RETURN false;
  END IF;

  -- Record this request
  INSERT INTO rate_limits (user_id, function_name) VALUES (p_user_id, p_function_name);
  RETURN true;
END;
$$;
