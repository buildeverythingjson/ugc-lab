import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const FinalCTA = () => {
  return (
    <section className="py-16 sm:py-24 bg-hero-gradient relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto"
        >
          <h2 className="font-display text-3xl sm:text-4xl font-bold mb-6">
            Klar til å revolusjonere UGC-produksjonen din?
          </h2>
          <p className="text-lg text-muted-foreground mb-10">
            Lag din første AI-genererte video i dag. Ingen kredittkort nødvendig for å komme i gang.
          </p>

          <Link to="/register" className="block">
            <Button size="lg" className="w-full sm:w-auto bg-gradient-primary text-primary-foreground hover:opacity-90 glow-primary px-10 h-14 text-lg font-semibold">
              Kom i gang gratis
              <ArrowRight className="ml-2" size={20} />
            </Button>
          </Link>

          <p className="text-sm text-muted-foreground mt-6">
            Starter fra 499 kr/mnd etter prøveperioden
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default FinalCTA;
