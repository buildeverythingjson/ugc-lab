import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useRef } from "react";

const examples = [
  { src: "https://files.advideolab.com/assets/library/2026/01/1769813178339-88424ef9.mp4" },
  { src: "https://files.advideolab.com/assets/library/2026/01/1769638080415-8bae04cc.mp4" },
  { src: "https://files.advideolab.com/assets/library/2026/01/1769813210931-2e964f2f.mp4" },
];

const ExampleGallery = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <section id="eksempler" className="py-16 sm:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10 sm:mb-16">
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">Se hva AI-en kan lage</h2>
          <p className="text-muted-foreground text-base sm:text-lg max-w-xl mx-auto">
            Ekte eksempler generert av UGC Lab
          </p>
        </div>

        {/* Mobile: horizontal scroll carousel */}
        <div
          ref={scrollRef}
          className="flex md:hidden gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4 -mx-4 px-4"
        >
          {examples.map((ex, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="flex-shrink-0 w-[70vw] max-w-[280px] snap-center"
            >
              <div className="rounded-xl overflow-hidden border border-border bg-card aspect-[9/16]">
                <video
                  muted
                  autoPlay
                  loop
                  playsInline
                  className="w-full h-full object-cover"
                  src={ex.src}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Desktop: grid layout */}
        <div className="hidden md:grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {examples.map((ex, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <div className="rounded-xl overflow-hidden border border-border bg-card aspect-[9/16]">
                <video
                  muted
                  autoPlay
                  loop
                  playsInline
                  className="w-full h-full object-cover"
                  src={ex.src}
                />
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-10 sm:mt-12">
          <Link to="/register">
            <Button size="lg" className="bg-gradient-primary text-primary-foreground hover:opacity-90 glow-primary px-8 h-12 text-base font-semibold">
              Lag din første video
              <ArrowRight className="ml-2" size={18} />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ExampleGallery;
