import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-hero-gradient overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 pt-24 pb-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Text content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-sm text-primary mb-8">
              <Sparkles size={14} />
              AI-drevet videogenerering
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Lag profesjonelle UGC-videoer med AI —{" "}
              <span className="text-gradient">på sekunder</span>
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground max-w-xl mb-10">
              Last opp et produktbilde, velg stil og lengde, og la AI skape engasjerende videoinnhold for sosiale medier.
            </p>

            <div className="flex flex-col sm:flex-row items-start gap-4">
              <Link to="/register">
                <Button size="lg" className="bg-gradient-primary text-primary-foreground hover:opacity-90 glow-primary px-8 h-12 text-base font-semibold">
                  Kom i gang gratis
                  <ArrowRight className="ml-2" size={18} />
                </Button>
              </Link>
              <a href="#eksempler">
                <Button size="lg" variant="outline" className="border-border hover:bg-secondary px-8 h-12 text-base">
                  Se eksempler
                </Button>
              </a>
            </div>
          </motion.div>

          {/* Right: Phone mockup with video */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="flex justify-center"
          >
            <div className="relative">
              {/* Purple glow behind phone */}
              <div className="absolute inset-0 -m-8 rounded-[3rem] bg-primary/15 blur-[60px] pointer-events-none" />

              {/* Phone frame */}
              <div className="relative w-[260px] sm:w-[280px] rounded-[2.5rem] border-[6px] border-[hsl(240,5%,18%)] bg-[hsl(240,6%,7%)] p-1.5 shadow-2xl">
                {/* Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-[hsl(240,6%,7%)] rounded-b-2xl z-10" />

                {/* Video container */}
                <div className="rounded-[2rem] overflow-hidden aspect-[9/19.5] bg-[hsl(240,5%,10%)]">
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                    src="https://EXAMPLE_VIDEO_URL.mp4"
                    poster=""
                  />
                </div>
              </div>

              {/* Caption below phone */}
              <p className="text-center text-sm text-muted-foreground mt-6">
                Generert med AI på under 5 minutter
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
