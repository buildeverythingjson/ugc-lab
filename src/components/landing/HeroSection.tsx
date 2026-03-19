import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import { motion } from "framer-motion";
import nswingLogo from "@/assets/nswing-logo.png";
import tallowLogo from "@/assets/tallow-logo.png";
import nuavaLogo from "@/assets/nuava-logo.avif";

const HeroSection = () => {
  return (
    <section className="relative min-h-[90vh] sm:min-h-screen flex items-center justify-center bg-hero-gradient overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 pt-20 sm:pt-24 pb-12 sm:pb-16 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-sm text-foreground mb-8">
            <Play size={14} />
            AI-drevet video- og bildegenerering
          </div>

          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight max-w-4xl mx-auto mb-6">
            UGC med AI –{" "}
            <span className="text-gradient">på sekunder.</span>
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Designet for norske merkevarer. Fra produktbilder og idéer til konverterende innhold. AI-modeller som er tilpasset det norske markedet.
          </p>

          <div className="flex flex-col items-center gap-8">
            <Link to="/register">
              <Button size="lg" className="bg-gradient-primary text-primary-foreground hover:opacity-90 glow-primary px-8 h-12 text-base font-semibold">
                Lag din første video
                <ArrowRight className="ml-2" size={18} />
              </Button>
            </Link>

            <div className="flex items-center gap-8">
              <img src={nswingLogo} alt="Nordic Swing" className="h-7 opacity-50 hover:opacity-80 transition-opacity invert" />
              <img src={tallowLogo} alt="Tallow" className="h-10 opacity-50 hover:opacity-80 transition-opacity" />
              <img src={nuavaLogo} alt="Nuava" className="h-7 opacity-50 hover:opacity-80 transition-opacity" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
