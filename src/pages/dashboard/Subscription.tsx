import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { STRIPE_TIERS, TierKey } from "@/lib/stripe-config";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

const Subscription = () => {
  const { profile, refreshProfile } = useAuth();
  const [loading, setLoading] = useState<string | null>(null);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.get("success") === "true") {
      toast.success("Abonnementet er aktivert!");
      // Check subscription status after successful checkout
      supabase.functions.invoke("check-subscription").then(() => refreshProfile());
    }
  }, [searchParams]);

  const handleCheckout = async (tierKey: TierKey) => {
    setLoading(tierKey);
    try {
      const tier = STRIPE_TIERS[tierKey];
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { priceId: tier.price_id },
      });
      if (error) throw error;
      if (data?.url) {
        window.open(data.url, "_blank");
      }
    } catch (error: any) {
      toast.error(error.message || "Noe gikk galt");
    } finally {
      setLoading(null);
    }
  };

  const handlePortal = async () => {
    try {
      const { data, error } = await supabase.functions.invoke("customer-portal");
      if (error) throw error;
      if (data?.url) {
        window.open(data.url, "_blank");
      }
    } catch (error: any) {
      toast.error(error.message || "Kunne ikke åpne abonnementsportalen");
    }
  };

  const currentTier = profile?.subscription_tier as TierKey | null;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold">Ditt abonnement</h1>
        <p className="text-muted-foreground mt-1">Administrer planen din</p>
      </div>

      {currentTier && (
        <div className="flex gap-3">
          <Button onClick={handlePortal} variant="outline">
            Administrer abonnement
          </Button>
          <Button onClick={() => { supabase.functions.invoke("check-subscription").then(() => refreshProfile()); }} variant="outline">
            Oppdater status
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {(Object.entries(STRIPE_TIERS) as [TierKey, typeof STRIPE_TIERS[TierKey]][]).map(([key, plan]) => {
          const isCurrent = currentTier === key;
          const isPopular = key === "growth";
          const isStartup = key === "startup";

          return (
            <div
              key={key}
              className={`relative rounded-xl border p-6 flex flex-col card-shadow ${
                isPopular ? "border-primary glow-primary" : isCurrent ? "border-primary/50" : "border-border"
              } bg-card`}
            >
              {isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-primary text-xs font-semibold text-primary-foreground">
                  Mest populær
                </div>
              )}
              {isCurrent && (
                <div className="absolute -top-3 right-4 px-3 py-0.5 rounded-full bg-status-completed text-xs font-semibold text-primary-foreground">
                  Din plan
                </div>
              )}
              <h3 className="font-display text-lg font-bold mb-1">{plan.name}</h3>
              <div className="mb-4">
                <span className="font-display text-3xl font-bold">{plan.price}</span>
                <span className="text-muted-foreground text-sm ml-1">kr/mnd</span>
              </div>
              <ul className="space-y-2 mb-6 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check size={14} className="text-primary mt-0.5 shrink-0" />
                    <span className="text-muted-foreground">{f}</span>
                  </li>
                ))}
              </ul>
              <Button
                onClick={() => handleCheckout(key)}
                disabled={isCurrent || loading === key}
                className={`w-full ${
                  isCurrent
                    ? "bg-secondary text-secondary-foreground"
                    : "bg-gradient-primary text-primary-foreground hover:opacity-90"
                }`}
              >
                {isCurrent ? "Nåværende plan" : loading === key ? "Laster..." : "Velg plan"}
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Subscription;
