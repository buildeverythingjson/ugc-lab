import { Check, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { STRIPE_TIERS, TierKey } from "@/lib/stripe-config";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";

const Subscription = () => {
  const { profile, refreshProfile } = useAuth();
  const [loading, setLoading] = useState<string | null>(null);
  const [portalLoading, setPortalLoading] = useState(false);
  const [isAnnual, setIsAnnual] = useState(false);

  const handleCheckout = async (tierKey: TierKey, priceIdOverride?: string) => {
    setLoading(tierKey);
    try {
      const tier = STRIPE_TIERS[tierKey];
      let priceId = priceIdOverride || tier.price_id;

      if (isAnnual && !priceIdOverride && 'annual_price_id' in tier && tier.annual_price_id) {
        priceId = tier.annual_price_id;
      }

      localStorage.setItem("checkout_tier_key", priceIdOverride ? "trial" : tierKey);
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { priceId, stripeCustomerId: profile?.stripe_customer_id },
      });
      if (error) throw error;
      if (data?.url) {
        if (typeof window.fbq === "function") window.fbq("track", "InitiateCheckout");
        window.location.href = data.url;
      }
    } catch (error: any) {
      setLoading(null);
      toast.error(error.message || "Noe gikk galt");
    }
  };

  const handlePortal = async () => {
    setPortalLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("customer-portal");
      if (error) throw error;
      if (data?.url) {
        window.open(data.url, "_blank");
      }
    } catch (error: any) {
      toast.error(error.message || "Kunne ikke åpne abonnementsportalen");
    } finally {
      setPortalLoading(false);
    }
  };

  const currentTier = profile?.subscription_tier as TierKey | null;
  const hasUsedTrial = !!profile?.has_used_trial || ["trial", "startup", "growth", "business"].includes(profile?.subscription_tier ?? "");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold">Ditt abonnement</h1>
        <p className="text-muted-foreground mt-1">
          {currentTier && STRIPE_TIERS[currentTier]
            ? `Du abonnerer på ${STRIPE_TIERS[currentTier].name}-planen`
            : "Administrer planen din"}
        </p>
      </div>

      {currentTier && (
        <Button onClick={handlePortal} disabled={portalLoading} className="w-full sm:w-auto bg-foreground text-background hover:bg-foreground/90">
          {portalLoading ? "Laster..." : "Administrer abonnement"}
        </Button>
      )}

      {/* Billing toggle */}
      <div className="flex items-center justify-center gap-3">
        <span className={`text-sm font-medium ${!isAnnual ? "text-foreground" : "text-muted-foreground"}`}>
          Månedlig
        </span>
        <button
          onClick={() => setIsAnnual(!isAnnual)}
          className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
            isAnnual ? "bg-primary" : "bg-muted"
          }`}
        >
          <span
            className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform ${
              isAnnual ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
        <span className={`text-sm font-medium ${isAnnual ? "text-foreground" : "text-muted-foreground"}`}>
          Årlig
        </span>
        <span className="ml-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
          Spar 20%
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {(Object.entries(STRIPE_TIERS) as [TierKey, typeof STRIPE_TIERS[TierKey]][]).filter(([key]) => key !== "trial").map(([key, plan]) => {
          const isCurrent = currentTier === key;
          const isPopular = key === "growth";
          const showTrial = key === "startup" && !hasUsedTrial;
          const hasAnnual = 'annual_price' in plan && plan.annual_price;
          const displayPrice = isAnnual && hasAnnual ? plan.annual_price : plan.price;

          return (
            <div
              key={key}
              className={`relative rounded-xl border-2 p-6 flex flex-col card-shadow ${
                isCurrent
                  ? "border-primary bg-primary/5 ring-2 ring-primary/20 shadow-lg"
                  : isPopular ? "border-primary glow-primary" : "border-border"
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
                <span className="font-display text-3xl font-bold">{displayPrice}</span>
                <span className="text-muted-foreground text-sm ml-1">kr/mnd</span>
                {isAnnual && hasAnnual && (
                  <span className="ml-2 text-sm text-muted-foreground line-through">{plan.price} kr</span>
                )}
              </div>
              <ul className="space-y-2 mb-6 flex-1">
                {plan.features.map((f) => {
                  const isComingSoon = f.includes("(kommer snart)");
                  const displayText = f.replace(" (kommer snart)", "");
                  return (
                    <li key={f} className={`flex items-start gap-2 text-sm ${isComingSoon ? "opacity-60" : ""}`}>
                      {isComingSoon ? (
                        <Clock size={14} className="text-muted-foreground mt-0.5 shrink-0" />
                      ) : (
                        <Check size={14} className="text-primary mt-0.5 shrink-0" />
                      )}
                      <span className="text-muted-foreground">
                        {displayText}
                        {isComingSoon && (
                          <span className="ml-1.5 inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-muted text-muted-foreground">
                            Kommer snart
                          </span>
                        )}
                      </span>
                    </li>
                  );
                })}
              </ul>
              <Button
                onClick={() => showTrial 
                  ? handleCheckout(key, STRIPE_TIERS.trial.price_id) 
                  : handleCheckout(key)
                }
                disabled={isCurrent || loading !== null}
                className={`w-full ${
                  isCurrent
                    ? "bg-secondary text-secondary-foreground"
                    : "bg-gradient-primary text-primary-foreground hover:opacity-90"
                }`}
              >
                {isCurrent ? "Nåværende plan" : loading === key ? "Laster..." : showTrial ? "Prøv for 10 kr" : "Velg plan"}
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Subscription;