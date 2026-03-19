import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  {
    q: "Hvor lang tid tar det å generere en video?",
    a: "De fleste videoer er ferdige på 2-5 minutter, avhengig av lengden du velger.",
  },
  {
    q: "Hvilken kvalitet har videoene?",
    a: "Alle videoer genereres i HD-kvalitet, klare for bruk på TikTok, Instagram Reels og andre plattformer.",
  },
  {
    q: "Kan jeg kansellere abonnementet mitt?",
    a: "Ja, du kan kansellere når som helst fra kontoen din. Du beholder tilgangen ut perioden du har betalt for.",
  },
  {
    q: "Hva skjer hvis jeg ikke er fornøyd med videoen?",
    a: "Du kan regenerere videoen med justerte innstillinger. Ved feil refunderes kreditten automatisk.",
  },
  {
    q: "Hvilke språk støttes?",
    a: "Vi støtter norsk, engelsk, svensk og dansk — med flere språk på vei.",
  },
  {
    q: "Trenger jeg teknisk erfaring?",
    a: "Nei! Last opp et bilde, fyll inn litt info, og AI-en gjør resten.",
  },
];

const FAQSection = () => {
  return (
    <section id="faq" className="py-16 sm:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10 sm:mb-16">
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">Ofte stilte spørsmål</h2>
          <p className="text-muted-foreground text-base sm:text-lg max-w-xl mx-auto">
            Har du spørsmål? Her er svarene.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto"
        >
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                className="rounded-xl border border-border bg-card px-6 card-shadow"
              >
                <AccordionTrigger className="text-left font-display font-semibold text-sm sm:text-base hover:no-underline">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm leading-relaxed">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;
