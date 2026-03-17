import { motion } from "framer-motion";

const stats = [
  { value: "500+", label: "videoer generert" },
  { value: "50+", label: "aktive merkevarer" },
  { value: "4.8/5", label: "kundetilfredshet" },
];

const SocialProofBar = () => {
  return (
    <section className="py-12 bg-surface border-y border-border">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-10 sm:gap-20">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-center"
            >
              <p className="font-display text-3xl sm:text-4xl font-bold text-foreground">{stat.value}</p>
              <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialProofBar;
