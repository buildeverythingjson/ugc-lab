
CREATE TABLE public.trial_activations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  ip_address text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.trial_activations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can manage trial activations"
  ON public.trial_activations
  FOR ALL
  TO public
  USING (auth.role() = 'service_role'::text)
  WITH CHECK (auth.role() = 'service_role'::text);

CREATE INDEX idx_trial_activations_ip ON public.trial_activations(ip_address);
CREATE INDEX idx_trial_activations_user ON public.trial_activations(user_id);
