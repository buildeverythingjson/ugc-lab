import { FileText, Globe, UserCircle, Zap } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: FileText,
    title: "AI-genererte manus",
    description: "Vår AI analyserer produktet ditt og skriver et skreddersydd manus tilpasset målgruppen din.",
  },
  {
    icon: Globe,
    title: "Flere språk",
    description: "Generer videoer på norsk, engelsk, svensk og dansk — med naturlig uttale.",
  },
  {
    icon: UserCircle,
    title: "Ingen skuespillere nødvendig",
    description: "Realistiske AI-avatarer leverer manuset ditt med profesjonelt utseende.",
  },
  {
    icon: Zap,
    title: "Klar på minutter, ikke dager",
    description: "Fra produktbilde til ferdig video på under 5 minutter. Ingen ventetid på freelancere.",
  },
];

const WhyUGCLab = () => {
  return (
    <section className="py-24 bg-hero-gradient">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">Hvorfor UGC Lab?</h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Alt du trenger for å lage profesjonelt videoinnhold
          </p>
        </div>

        <div className="max-w-5xl mx-auto space-y-16">
          {features.map((feature, i) => {
            const isReversed = i % 2 === 1;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className={`flex flex-col md:flex-row items-center gap-8 md:gap-16 ${
                  isReversed ? "md:flex-row-reverse" : ""
                }`}
              >
                {/* Text side */}
                <div className="flex-1 space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <feature.icon size={24} className="text-primary" />
                  </div>
                  <h3 className="font-display text-xl font-bold">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>

                {/* Visual placeholder */}
                <div className="flex-1 w-full">
                  <div className="rounded-2xl border border-border bg-card aspect-[4/3] flex items-center justify-center card-shadow">
                    <feature.icon size={48} className="text-primary/20" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyUGCLab;
