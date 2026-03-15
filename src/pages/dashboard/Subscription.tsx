import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const plans = [
  {
    name: "Starter",
    price: "499",
    features: ["5 videoer per måned", "Opptil 15 sekunder", "AI-analyse av produktet", "Last ned i HD", "E-poststøtte"],
    current: true,
    popular: false,
  },
  {
    name: "Pro",
    price: "899",
    features: ["10 videoer per måned", "Opptil 30 sekunder", "AI-analyse av produktet", "Last ned i HD", "Prioritert støtte"],
    current: false,
    popular: true,
  },
  {
    name: "Business",
    price: "1 999",
    features: ["30 videoer per måned", "Opptil 60 sekunder", "AI-analyse av produktet", "Last ned i HD", "Dedikert støtte", "API-tilgang"],
    current: false,
    popular: false,
  },
];

const Subscription = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold">Ditt abonnement</h1>
        <p className="text-muted-foreground mt-1">Administrer planen din</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`relative rounded-xl border p-6 flex flex-col card-shadow ${
              plan.popular ? "border-primary glow-primary" : plan.current ? "border-primary/50" : "border-border"
            } bg-card`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-primary text-xs font-semibold text-primary-foreground">
                Mest populær
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
              onClick={() => toast.info("Backend er ikke koblet til ennå")}
              className={`w-full ${
                plan.current
                  ? "bg-secondary text-secondary-foreground"
                  : "bg-gradient-primary text-primary-foreground hover:opacity-90"
              }`}
              disabled={plan.current}
            >
              {plan.current ? "Nåværende plan" : "Oppgrader"}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Subscription;
