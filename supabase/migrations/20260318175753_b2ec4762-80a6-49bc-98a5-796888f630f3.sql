
CREATE OR REPLACE FUNCTION public.decrement_video_credit(p_user_id uuid)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  remaining integer;
BEGIN
  UPDATE profiles
  SET videos_remaining = videos_remaining - 1,
      videos_used_this_month = videos_used_this_month + 1
  WHERE id = p_user_id AND videos_remaining > 0
  RETURNING videos_remaining INTO remaining;

  IF NOT FOUND THEN
    RETURN -1;
  END IF;

  RETURN remaining;
END;
$$;

CREATE OR REPLACE FUNCTION public.refund_video_credit(p_user_id uuid)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  remaining integer;
BEGIN
  UPDATE profiles
  SET videos_remaining = videos_remaining + 1,
      videos_used_this_month = GREATEST(videos_used_this_month - 1, 0)
  WHERE id = p_user_id
  RETURNING videos_remaining INTO remaining;

  RETURN COALESCE(remaining, -1);
END;
$$;
