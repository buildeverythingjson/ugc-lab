import { X, Check } from "lucide-react";
import { motion } from "framer-motion";

const CostComparison = () => {
  return (
    <section className="py-16 sm:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10 sm:mb-16">
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">Spar tusenvis hver måned</h2>
          <p className="text-muted-foreground text-base sm:text-lg max-w-xl mx-auto">
            Se forskjellen mellom tradisjonell UGC og Rendr.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto"
        >
          <div className="rounded-2xl border border-border bg-card card-shadow overflow-visible relative">
            {/* Vertical divider line (desktop) */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-border hidden md:block z-0" />

            {/* VS badge (desktop) */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 hidden md:flex">
              <div className="w-12 h-12 rounded-full bg-card border border-primary/20 flex items-center justify-center shadow-lg">
                <span className="font-display font-bold text-sm text-primary">VS</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[1fr,1fr]">
              {/* Traditional UGC */}
              <div className="p-6 sm:p-8 space-y-5">
                <h3 className="font-display text-lg font-bold text-destructive">Tradisjonell UGC</h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3 text-sm">
                    <X size={16} className="text-destructive mt-0.5 shrink-0" />
                    <span className="text-muted-foreground">2 000 – 5 000 kr per video</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm">
                    <X size={16} className="text-destructive mt-0.5 shrink-0" />
                    <span className="text-muted-foreground">3-7 dagers leveringstid</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm">
                    <X size={16} className="text-destructive mt-0.5 shrink-0" />
                    <span className="text-muted-foreground">Begrenset revisjon</span>
                  </li>
                </ul>
              </div>

              {/* Mobile: horizontal line with centered VS badge */}
              <div className="relative flex md:hidden items-center justify-center h-0 mx-0">
                <div className="absolute inset-x-0 top-0 h-px bg-border" />
                <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-card border border-primary/20 flex items-center justify-center shadow-lg">
                  <span className="font-display font-bold text-xs text-primary">VS</span>
                </div>
              </div>

              {/* UGC Lab */}
              <div className="p-6 sm:p-8 space-y-5 bg-primary/[0.03]">
                <h3 className="font-display text-lg font-bold text-foreground">Rendr.</h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3 text-sm">
                    <Check size={16} className="text-foreground mt-0.5 shrink-0" />
                    <span className="text-muted-foreground">Fra 99 kr per video</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm">
                    <Check size={16} className="text-foreground mt-0.5 shrink-0" />
                    <span className="text-muted-foreground">Klar på 5 minutter</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm">
                    <Check size={16} className="text-foreground mt-0.5 shrink-0" />
                    <span className="text-muted-foreground">Ubegrenset regenerering</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <p className="text-center text-muted-foreground mt-8">
            Start i dag og spar opptil <span className="text-foreground font-semibold">95%</span> på UGC-produksjon
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default CostComparison;
