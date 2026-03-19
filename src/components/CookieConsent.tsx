import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { X } from "lucide-react";

const COOKIE_KEY = "ugclab_cookie_consent";

const CookieConsent = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_KEY);
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = (value: "all" | "necessary") => {
    localStorage.setItem(COOKIE_KEY, value);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[60] p-4 animate-in slide-in-from-bottom-4 duration-500">
      <div className="container mx-auto max-w-2xl">
        <div className="relative bg-card border border-border rounded-2xl p-5 sm:p-6 shadow-xl">
          <button
            onClick={() => accept("necessary")}
            className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Lukk"
          >
            <X size={18} />
          </button>

          <p className="text-sm text-foreground font-medium mb-1.5">Vi bruker informasjonskapsler 🍪</p>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4 pr-6">
            Vi bruker nødvendige informasjonskapsler for at nettstedet skal fungere, og analysekapsler
            for å forbedre opplevelsen din. Les mer i vår{" "}
            <Link to="/privacy" className="text-primary underline underline-offset-2 hover:text-primary/80">
              personvernerklæring
            </Link>.
          </p>

          <div className="flex items-center gap-3">
            <Button size="sm" onClick={() => accept("all")} className="h-9 px-5">
              Godta alle
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => accept("necessary")}
              className="h-9 px-5 border-border"
            >
              Kun nødvendige
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
