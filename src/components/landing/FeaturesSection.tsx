import { Upload, Sliders, Sparkles, Download } from "lucide-react";

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

const FeaturesSection = () => {
  return (
    <section id="funksjoner" className="py-16 sm:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10 sm:mb-16">
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
            Hvordan det fungerer
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg max-w-xl mx-auto">
            Fire enkle steg fra produktbilde til ferdig video
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 max-w-5xl mx-auto">
          {steps.map((step, i) => (
            <div
              key={step.title}
              className="relative p-4 sm:p-6 rounded-xl bg-card border border-border hover:border-primary/30 transition-colors card-shadow group"
            >
              <div className="text-xs font-semibold text-primary mb-4">Steg {i + 1}</div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-primary/20 transition-colors">
                <step.icon size={20} className="text-primary sm:hidden" />
                <step.icon size={24} className="text-primary hidden sm:block" />
              </div>
              <h3 className="font-display font-semibold text-base sm:text-lg mb-1 sm:mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
