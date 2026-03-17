import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const examples = [
  { src: "https://files.advideolab.com/assets/library/2026/01/1769813178339-88424ef9.mp4" },
  { src: "https://files.advideolab.com/assets/library/2026/01/1769638080415-8bae04cc.mp4" },
  { src: "https://files.advideolab.com/assets/library/2026/01/1769813210931-2e964f2f.mp4" },
];

const ExampleGallery = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-scroll carousel on mobile
  useEffect(() => {
    const startAutoScroll = () => {
      intervalRef.current = setInterval(() => {
        setActiveIndex((prev) => {
          const next = (prev + 1) % examples.length;
          const container = scrollRef.current;
          if (container) {
            const child = container.children[next] as HTMLElement;
            if (child) {
              container.scrollTo({
                left: child.offsetLeft - container.offsetLeft - (container.clientWidth - child.clientWidth) / 2,
                behavior: "smooth",
              });
            }
          }
          return next;
        });
      }, 4000);
    };

    startAutoScroll();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // Update active index on manual scroll
  const handleScroll = () => {
    const container = scrollRef.current;
    if (!container) return;
    const scrollCenter = container.scrollLeft + container.clientWidth / 2;
    let closest = 0;
    let minDist = Infinity;
    Array.from(container.children).forEach((child, i) => {
      const el = child as HTMLElement;
      const center = el.offsetLeft - container.offsetLeft + el.clientWidth / 2;
      const dist = Math.abs(scrollCenter - center);
      if (dist < minDist) {
        minDist = dist;
        closest = i;
      }
    });
    setActiveIndex(closest);
  };

  // Reset auto-scroll timer on manual interaction
  const handleTouchStart = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const handleTouchEnd = () => {
    intervalRef.current = setInterval(() => {
      setActiveIndex((prev) => {
        const next = (prev + 1) % examples.length;
        const container = scrollRef.current;
        if (container) {
          const child = container.children[next] as HTMLElement;
          if (child) {
            container.scrollTo({
              left: child.offsetLeft - container.offsetLeft - (container.clientWidth - child.clientWidth) / 2,
              behavior: "smooth",
            });
          }
        }
        return next;
      });
    }, 4000);
  };

  return (
    <section id="eksempler" className="py-16 sm:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10 sm:mb-16">
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">Se hva AI-en kan lage</h2>
          <p className="text-muted-foreground text-base sm:text-lg max-w-xl mx-auto">
            Ekte eksempler generert av UGC Lab
          </p>
        </div>

        {/* Mobile: auto-scrolling carousel */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="flex md:hidden gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4 -mx-4 px-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
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

        {/* Carousel dots */}
        <div className="flex md:hidden justify-center gap-2 mt-4">
          {examples.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setActiveIndex(i);
                const container = scrollRef.current;
                if (container) {
                  const child = container.children[i] as HTMLElement;
                  if (child) {
                    container.scrollTo({
                      left: child.offsetLeft - container.offsetLeft - (container.clientWidth - child.clientWidth) / 2,
                      behavior: "smooth",
                    });
                  }
                }
              }}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i === activeIndex
                  ? "bg-primary w-6"
                  : "bg-muted-foreground/30"
              }`}
            />
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
