import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Mail, Send, CheckCircle } from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !message.trim()) {
      toast.error("Vennligst fyll ut alle feltene");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Vennligst skriv inn en gyldig e-postadresse");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.functions.invoke("send-contact-email", {
        body: { name: name.trim(), email: email.trim(), message: message.trim() },
      });

      if (error) throw error;

      setSubmitted(true);
      toast.success("Meldingen din er sendt!");
    } catch (err) {
      console.error("Error submitting contact form:", err);
      toast.error("Noe gikk galt. Prøv igjen senere.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4 max-w-xl">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft size={16} />
            Tilbake til forsiden
          </Link>

          <div className="mb-10">
            <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight mb-3">
              Kontakt oss
            </h1>
            <p className="text-muted-foreground leading-relaxed">
              Har du spørsmål, trenger hjelp, eller ønsker å gi tilbakemelding?
              Fyll ut skjemaet nedenfor, så svarer vi deg så fort vi kan.
            </p>
          </div>

          {submitted ? (
            <div className="rounded-xl border border-border bg-card p-10 text-center space-y-4">
              <CheckCircle className="mx-auto text-primary" size={48} />
              <h2 className="font-display text-xl font-semibold">Takk for din henvendelse!</h2>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-sm mx-auto">
                Vi har mottatt meldingen din og vil svare deg på e-post innen 24 timer.
              </p>
              <Link to="/">
                <Button variant="outline" className="mt-4">
                  Tilbake til forsiden
                </Button>
              </Link>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="rounded-xl border border-border bg-card p-6 md:p-8 space-y-5"
            >
              <div className="space-y-2">
                <Label htmlFor="name">Navn</Label>
                <Input
                  id="name"
                  placeholder="Ditt fulle navn"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={100}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">E-post</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="din@epost.no"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  maxLength={255}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Melding</Label>
                <Textarea
                  id="message"
                  placeholder="Beskriv hva du trenger hjelp med..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  maxLength={2000}
                  rows={5}
                  required
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <Button type="submit" disabled={loading} className="gap-2">
                  <Send size={16} />
                  {loading ? "Sender..." : "Send melding"}
                </Button>
                <a
                  href="mailto:hjelp@ugclab.no"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
                >
                  <Mail size={14} />
                  hjelp@ugclab.no
                </a>
              </div>
            </form>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
