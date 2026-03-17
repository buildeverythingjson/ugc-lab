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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group relative rounded-2xl border border-border bg-card/50 backdrop-blur-sm p-8 hover:border-primary/30 transition-all duration-300"
            >
              {/* Subtle glow on hover */}
              <div className="absolute inset-0 rounded-2xl bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-5 group-hover:bg-primary/15 transition-colors duration-300">
                  <feature.icon size={22} className="text-primary" />
                </div>
                <h3 className="font-display text-lg font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyUGCLab;
