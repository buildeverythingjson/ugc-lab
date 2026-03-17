import { Upload, Sliders, Sparkles, Download } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  {
    icon: Upload,
    title: "Last opp produktbilde",
    description: "Last opp et bilde av produktet ditt, så analyserer AI-en det automatisk.",
  },
  {
    icon: Sliders,
    title: "Velg stil og lengde",
    description: "Velg videolengde, språk, målgruppe og kreativ stil.",
  },
  {
    icon: Sparkles,
    title: "AI genererer videoen",
    description: "Vår AI lager en profesjonell UGC-video skreddersydd for ditt produkt.",
  },
  {
    icon: Download,
    title: "Last ned og publiser",
    description: "Få videoen levert til dashboardet ditt, klar for sosiale medier.",
  },
];

const HowItWorks = () => {
  return (
    <section id="funksjoner" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">Hvordan det fungerer</h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Fire enkle steg fra produktbilde til ferdig video
          </p>
        </div>

        {/* Horizontal stepper */}
        <div className="max-w-5xl mx-auto">
          {/* Desktop: horizontal */}
          <div className="hidden lg:flex items-start relative">
            {/* Connecting line */}
            <div className="absolute top-8 left-[calc(12.5%+24px)] right-[calc(12.5%+24px)] h-px bg-border" />

            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="flex-1 flex flex-col items-center text-center px-4 relative"
              >
                <div className="text-xs font-bold text-primary mb-3 font-display">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4 relative z-10">
                  <step.icon size={24} className="text-primary" />
                </div>
                <h3 className="font-display font-semibold text-base mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-[200px]">{step.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Mobile: vertical */}
          <div className="lg:hidden space-y-8">
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex gap-5"
              >
                <div className="flex flex-col items-center">
                  <div className="text-xs font-bold text-primary mb-2 font-display">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                    <step.icon size={20} className="text-primary" />
                  </div>
                  {i < steps.length - 1 && <div className="w-px flex-1 bg-border mt-3" />}
                </div>
                <div className="pt-6">
                  <h3 className="font-display font-semibold mb-1">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
