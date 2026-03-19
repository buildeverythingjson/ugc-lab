import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import { motion } from "framer-motion";
import nswingLogo from "@/assets/nswing-logo.png";
import tallowLogo from "@/assets/tallow-logo.png";

const platformLogos = [
  { name: "Meta", svg: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
      <path d="M12 2.04c-5.5 0-10 4.49-10 10.02 0 5 3.66 9.15 8.44 9.9v-7H7.9v-2.9h2.54V9.85c0-2.52 1.49-3.93 3.78-3.93 1.09 0 2.23.2 2.23.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.45 2.9h-2.33v7a10 10 0 008.44-9.9c0-5.53-4.5-10.02-10-10.02z"/>
    </svg>
  )},
  { name: "TikTok", svg: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.71a8.21 8.21 0 004.76 1.52V6.78a4.86 4.86 0 01-1-.09z"/>
    </svg>
  )},
  { name: "Instagram", svg: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
      <path d="M12 2.16c3.2 0 3.58.01 4.85.07 3.25.15 4.77 1.69 4.92 4.92.06 1.27.07 1.65.07 4.85 0 3.2-.01 3.58-.07 4.85-.15 3.23-1.66 4.77-4.92 4.92-1.27.06-1.65.07-4.85.07-3.2 0-3.58-.01-4.85-.07-3.26-.15-4.77-1.7-4.92-4.92-.06-1.27-.07-1.65-.07-4.85 0-3.2.01-3.58.07-4.85C2.38 3.86 3.9 2.31 7.15 2.23 8.42 2.17 8.8 2.16 12 2.16zM12 0C8.74 0 8.33.01 7.05.07 2.7.27.27 2.7.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.2 4.36 2.62 6.78 6.98 6.98C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c4.35-.2 6.78-2.62 6.98-6.98.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.2-4.35-2.62-6.78-6.98-6.98C15.67.01 15.26 0 12 0zm0 5.84A6.16 6.16 0 1018.16 12 6.16 6.16 0 0012 5.84zM12 16a4 4 0 110-8 4 4 0 010 8zm6.41-11.85a1.44 1.44 0 100 2.88 1.44 1.44 0 000-2.88z"/>
    </svg>
  )},
  { name: "Shopify", svg: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
      <path d="M15.34 3.04c-.07 0-.13.04-.15.12-.02.06-.34 1.04-.75 2.3-.22-.67-.6-1.42-1.27-1.42h-.06c-.19-.24-.42-.35-.63-.35-1.56 0-2.3 1.95-2.54 2.94l-1.36.42c-.42.13-.43.14-.49.54-.04.3-1.15 8.88-1.15 8.88L12.8 18l5.53-1.2S15.4 3.12 15.38 3.06c-.01-.02-.03-.02-.04-.02zM13 5.03c-.18.55-.47 1.37-.79 2.36l-1.61.5c.31-1.2.9-1.79 1.47-2.06.13.07.27.12.38.12.2 0 .37-.04.55-.08v.16zm-.93-1.06c-.1 0-.2.03-.3.1-.95.5-1.6 1.72-1.82 2.78l-1.27.4c.35-1.36 1.18-3.28 2.67-3.28h.06c.17.14.34.22.49.22.06 0 .12-.02.17-.04v-.18z"/>
    </svg>
  )},
];

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

          <div className="flex items-center justify-center">
            <Link to="/register">
              <Button size="lg" className="bg-gradient-primary text-primary-foreground hover:opacity-90 glow-primary px-8 h-12 text-base font-semibold">
                Lag din første video
                <ArrowRight className="ml-2" size={18} />
              </Button>
            </Link>
          </div>

          <div className="flex items-center justify-center gap-10 mt-10">
            <img src={nswingLogo} alt="NSWING" className="h-7 opacity-60 hover:opacity-90 transition-opacity invert" />
            <img src={tallowLogo} alt="Tallow" className="h-12 opacity-60 hover:opacity-90 transition-opacity" />
          </div>
        </motion.div>

        {/* Platform logos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
          className="mt-16 sm:mt-20"
        >
          <p className="text-xs uppercase tracking-widest text-muted-foreground/60 mb-5">
            Fungerer med
          </p>
          <div className="flex items-center justify-center gap-8 sm:gap-12">
            {platformLogos.map((platform) => (
              <div
                key={platform.name}
                className="text-muted-foreground/40 hover:text-muted-foreground/70 transition-colors"
                title={platform.name}
              >
                {platform.svg}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
