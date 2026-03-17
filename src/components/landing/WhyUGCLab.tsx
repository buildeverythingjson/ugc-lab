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

        <div className="max-w-3xl mx-auto space-y-0">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative flex items-start gap-6 py-8"
            >
              {/* Vertical line connector */}
              {i < features.length - 1 && (
                <div className="absolute left-[23px] top-[68px] bottom-0 w-px bg-gradient-to-b from-accent/30 to-transparent" />
              )}

              {/* Icon */}
              <div className="relative z-10 flex-shrink-0 w-12 h-12 rounded-full bg-accent/10 border border-accent/25 flex items-center justify-center">
                <feature.icon size={20} className="text-accent" />
              </div>

              {/* Content */}
              <div className="flex-1 pt-1">
                <h3 className="font-display text-lg font-bold mb-1.5">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyUGCLab;
