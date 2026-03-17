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
          <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
            Hvordan det fungerer
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Fire enkle steg fra produktbilde til ferdig video
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative p-6 rounded-xl bg-card border border-border hover:border-foreground/20 transition-colors card-shadow group"
            >
              <div className="text-xs font-semibold text-foreground mb-4">Steg {i + 1}</div>
              <div className="w-12 h-12 rounded-lg bg-primary/5 flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors">
                <step.icon size={24} className="text-foreground" />
              </div>
              <h3 className="font-display font-semibold text-lg mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
