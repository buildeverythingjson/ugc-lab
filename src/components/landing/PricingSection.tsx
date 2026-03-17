import { Check, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const plans = [
  {
    name: "Starter",
    price: "499",
    features: [
      "5 videoer per måned",
      "Opptil 15 sekunder",
      "AI-analyse av produktet",
      "Last ned i HD",
      "E-poststøtte",
    ],
    popular: false,
  },
  {
    name: "Pro",
    price: "899",
    features: [
      "15 videoer per måned",
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
    features: [
      "30 videoer per måned",
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
  return (
    <section id="priser" className="py-24 bg-hero-gradient">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
            Velg din plan
          </h2>
          <p className="text-muted-foreground text-lg">
            Fleksible planer som vokser med deg
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`relative rounded-xl border p-8 flex flex-col ${
                plan.popular
                  ? "border-accent bg-card glow-primary scale-[1.02]"
                  : "border-border bg-card"
              } card-shadow`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-accent text-xs font-semibold text-accent-foreground">
                  Mest populær
                </div>
              )}

              <h3 className="font-display text-xl font-bold mb-2">{plan.name}</h3>
              <div className="mb-6">
                <span className="font-display text-4xl font-bold">{plan.price}</span>
                <span className="text-muted-foreground text-sm ml-1">kr/mnd</span>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm">
                    <Check size={16} className="text-accent mt-0.5 shrink-0" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link to="/register">
                <Button
                  className={`w-full ${
                    plan.popular
                      ? "bg-gradient-primary text-primary-foreground hover:opacity-90"
                      : "bg-secondary text-secondary-foreground hover:bg-surface-hover"
                  }`}
                >
                  Velg plan
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
