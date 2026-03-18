import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-background py-10 sm:py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 sm:gap-10 mb-10 sm:mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="font-display text-xl font-bold text-gradient">
              UGC Lab
            </Link>
            <p className="text-sm text-muted-foreground mt-3 max-w-xs leading-relaxed">
              AI-drevet UGC-videoproduksjon for moderne merkevarer
            </p>
          </div>

          {/* Produkt */}
          <div>
            <h4 className="font-display font-semibold text-sm mb-4">Produkt</h4>
            <ul className="space-y-2.5">
              <li>
                <a href="#funksjoner" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Funksjoner
                </a>
              </li>
              <li>
                <a href="#priser" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Priser
                </a>
              </li>
              <li>
                <a href="#faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Juridisk */}
          <div>
            <h4 className="font-display font-semibold text-sm mb-4">Juridisk</h4>
            <ul className="space-y-2.5">
              <li>
                <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Personvern
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Vilkår
                </Link>
              </li>
              <li>
                <Link to="/kontakt" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Kontakt oss
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8">
          <p className="text-sm text-muted-foreground text-center">
            © {new Date().getFullYear()} UGC Lab. Alle rettigheter reservert.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
