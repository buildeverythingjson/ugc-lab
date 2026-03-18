import { Check, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { toast } from "sonner";

const plans = [
  {
    name: "Basis",
    price: "499",
    tierKey: "startup",
    priceId: "price_1TBOg909raYItIuAgRaaN8zT",
    trialPriceId: "price_1TBvZn09raYItIuAon2pFcJT",
    features: [
      "5 videoer per måned",
      "30 bilder per måned (kommer snart)",
      "Opptil 15 sekunder",
      "AI-analyse av produktet",
      "Last ned i HD",
      "E-poststøtte",
    ],
    popular: false,
  },
  {
    name: "Pluss",
    price: "899",
    tierKey: "growth",
    priceId: "price_1TBOgG09raYItIuApOD5GBfp",
    features: [
      "15 videoer per måned",
      "150 bilder per måned (kommer snart)",
      "Opptil 15 sekunder",
      "AI-analyse av produktet",
      "Last ned i HD",
      "Prioritert støtte",
    ],
    popular: true,
  },
  {
    name: "Business",
    price: "1 999",
    tierKey: "business",
    priceId: "price_1TBOgL09raYItIuA0kJtfct2",
    features: [
      "30 videoer per måned",
      "300 bilder per måned (kommer snart)",
      "Opptil 30 sekunder",
      "AI-analyse av produktet",
      "Last ned i HD",
      "Dedikert støtte",
      "API-tilgang",
    ],
    popular: false,
  },
];

const PricingSection = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<string | null>(null);

  const hasUsedTrial = !!profile?.has_used_trial || ["trial", "startup", "growth", "business"].includes(profile?.subscription_tier ?? "");

  const handlePlanSelect = async (priceId: string, loadingKey: string) => {
    if (!user) {
      localStorage.setItem("pending_checkout_price_id", priceId);
      navigate("/register");
      return;
    }

    const newWindow = window.open("about:blank", "_blank");
    try {
      localStorage.setItem("checkout_tier_key", loadingKey);
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { priceId },
      });
      if (error) throw error;
      if (data?.url && newWindow) {
        if (typeof window.fbq === "function") window.fbq("track", "InitiateCheckout");
        newWindow.location.href = data.url;
      } else if (data?.url) {
        window.open(data.url, "_blank");
      }
    } catch (error: any) {
      newWindow?.close();
      toast.error(error.message || "Noe gikk galt");
    }
  };

  return (
    <section id="priser" className="py-16 sm:py-24 bg-hero-gradient">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10 sm:mb-16">
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
            Velg din plan
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg">
            Fleksible planer som vokser med deg
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, i) => {
            const showTrial = plan.trialPriceId && !hasUsedTrial;

            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`relative rounded-xl border p-8 flex flex-col ${
                  plan.popular
                    ? "border-foreground bg-card glow-primary scale-[1.02]"
                    : "border-border bg-card"
                } card-shadow`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                    Mest populær
                  </div>
                )}

                <h3 className="font-display text-xl font-bold mb-2">{plan.name}</h3>
                <div className="mb-6">
                  <span className="font-display text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground text-sm ml-1">kr/mnd</span>
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((feature) => {
                    const isComingSoon = feature.includes("(kommer snart)");
                    const displayText = feature.replace(" (kommer snart)", "");
                    return (
                      <li key={feature} className={`flex items-start gap-3 text-sm ${isComingSoon ? "opacity-60" : ""}`}>
                        {isComingSoon ? (
                          <Clock size={16} className="text-muted-foreground mt-0.5 shrink-0" />
                        ) : (
                          <Check size={16} className="text-foreground mt-0.5 shrink-0" />
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
                  className="w-full bg-gradient-primary text-primary-foreground hover:opacity-90"
                  disabled={loading !== null}
                  onClick={() =>
                    showTrial
                      ? handlePlanSelect(plan.trialPriceId!, "trial")
                      : handlePlanSelect(plan.priceId, plan.tierKey)
                  }
                >
                  {loading === "trial" && showTrial
                    ? "Laster..."
                    : loading === plan.tierKey
                    ? "Laster..."
                    : showTrial
                    ? "Prøv for 10 kr"
                    : "Velg plan"}
                </Button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
