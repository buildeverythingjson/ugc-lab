import { FileText, Globe, UserCircle, Zap } from "lucide-react";
import logoImg from "@/assets/logo.png";

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
    <section className="py-16 sm:py-24 bg-hero-gradient">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10 sm:mb-16">
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 flex items-center justify-center gap-3">Hvorfor <img src={logoImg} alt="Rendr" className="h-5 sm:h-6 md:h-7 inline-block" /></h2>
          <p className="text-muted-foreground text-base sm:text-lg max-w-xl mx-auto">
            Alt du trenger for å lage profesjonelt videoinnhold
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-0">
          {features.map((feature, i) => (
            <div
              key={feature.title}
              className="relative flex items-start gap-4 sm:gap-6 py-6 sm:py-8"
            >
              {/* Vertical line connector */}
              {i < features.length - 1 && (
                <div className="absolute left-[23px] top-[68px] bottom-0 w-px bg-gradient-to-b from-border to-transparent" />
              )}

              {/* Icon */}
              <div className="relative z-10 flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/5 border border-border flex items-center justify-center">
                <feature.icon size={20} className="text-foreground" />
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
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyUGCLab;
