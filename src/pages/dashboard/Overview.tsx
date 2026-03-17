import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PlusCircle, Video, CreditCard, Clock, Sparkles } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

const Overview = () => {
  const { profile } = useAuth();
  const checkoutTriggered = useRef(false);

  useEffect(() => {
    const pendingPriceId = localStorage.getItem("pending_checkout_price_id");
    if (pendingPriceId && !checkoutTriggered.current) {
      checkoutTriggered.current = true;
      localStorage.removeItem("pending_checkout_price_id");
      supabase.functions.invoke("create-checkout", {
        body: { priceId: pendingPriceId },
      }).then(({ data, error }) => {
        if (error) {
          toast.error("Kunne ikke starte betaling");
          return;
        }
        if (data?.url) window.open(data.url, "_blank");
      });
    }
  }, []);

  const tier = profile?.subscription_tier || "Ingen";
  const remaining = profile?.videos_remaining ?? 0;
  const used = profile?.videos_used_this_month ?? 0;
  const tierMax = profile?.subscription_tier === "business" ? 30 : profile?.subscription_tier === "growth" ? 15 : profile?.subscription_tier === "startup" ? 5 : profile?.subscription_tier === "trial" ? 1 : 0;

  const statsCards = [
    { label: "Gjenværende videoer", value: `${remaining} av ${tierMax}`, icon: Video },
    { label: "Videoer denne måneden", value: `${used}`, icon: Clock },
    { label: "Nåværende plan", value: tier.charAt(0).toUpperCase() + tier.slice(1), icon: CreditCard },
  ];
  const isTrialUser = profile?.has_used_trial && (!profile?.subscription_tier || profile?.subscription_tier === "trial");

  return (
    <div className="space-y-8">
      {isTrialUser && (
        <div className="rounded-xl border border-primary/30 bg-primary/5 p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex items-center gap-3 flex-1">
            <div className="rounded-full bg-primary/10 p-2.5">
              <Sparkles size={20} className="text-primary" />
            </div>
            <div>
              <p className="font-display font-semibold text-sm">Prøveperioden din er brukt opp</p>
              <p className="text-muted-foreground text-sm mt-0.5">
                Oppgrader til en plan for å fortsette å lage videoer.
              </p>
            </div>
          </div>
          <Link to="/dashboard/subscription">
            <Button size="sm" className="bg-gradient-primary text-primary-foreground hover:opacity-90">
              Se planer
            </Button>
          </Link>
        </div>
      )}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold">
            Velkommen tilbake, {profile?.first_name || "bruker"}! 👋
          </h1>
          <p className="text-muted-foreground mt-1">Her er en oversikt over kontoen din</p>
        </div>
        <Link to="/dashboard/new-video">
          <Button className="bg-gradient-primary text-primary-foreground hover:opacity-90 glow-primary">
            <PlusCircle size={18} className="mr-2" />
            Lag ny video
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {statsCards.map((card) => (
          <div key={card.label} className="rounded-xl border border-border bg-card p-6 card-shadow">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">{card.label}</span>
              <card.icon size={18} className="text-primary" />
            </div>
            <p className="font-display text-2xl font-bold">{card.value}</p>
          </div>
        ))}
      </div>

      <div>
        <h2 className="font-display text-lg font-semibold mb-4">Siste videoer</h2>
        <div className="rounded-xl border border-border bg-card p-8 text-center card-shadow">
          <Video size={40} className="text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground text-sm">Ingen videoer ennå</p>
          <Link to="/dashboard/new-video">
            <Button variant="link" className="text-primary mt-2">Lag din første video</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Overview;
