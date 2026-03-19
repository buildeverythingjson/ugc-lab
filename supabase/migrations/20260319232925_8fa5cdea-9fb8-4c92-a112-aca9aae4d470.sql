ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_subscription_tier_check;

ALTER TABLE public.profiles
ADD CONSTRAINT profiles_subscription_tier_check
CHECK (
  subscription_tier IS NULL OR subscription_tier = ANY (
    ARRAY['trial'::text, 'startup'::text, 'growth'::text, 'business'::text, 'starter'::text, 'pro'::text]
  )
);