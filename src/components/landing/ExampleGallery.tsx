import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const examples = [
  { src: "https://assets.mixkit.co/videos/51185/51185-720.mp4", brand: "Glow Skincare", length: "15s" },
  { src: "https://assets.mixkit.co/videos/50415/50415-720.mp4", brand: "Pure Beauty", length: "15s" },
  { src: "https://assets.mixkit.co/videos/52031/52031-720.mp4", brand: "Luxe Cosmetics", length: "30s" },
];

const ExampleGallery = () => {
  return (
    <section id="eksempler" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">Se hva AI-en kan lage</h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Ekte eksempler generert av UGC Lab
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {examples.map((ex, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group"
            >
              <div className="rounded-xl overflow-hidden border border-border bg-card aspect-[9/16]">
                <video
                  muted
                  playsInline
                  controls
                  className="w-full h-full object-cover"
                  src={ex.src}
                />
              </div>
              <div className="mt-3 flex items-center gap-2">
                <p className="text-sm font-medium text-foreground">{ex.brand}</p>
                <span className="text-xs text-muted-foreground">·</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">{ex.length}</span>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
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
