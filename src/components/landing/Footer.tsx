import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-background py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="font-display font-bold text-lg text-gradient">UGC Lab</div>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Personvern</a>
            <a href="#" className="hover:text-foreground transition-colors">Vilkår</a>
            <a href="#" className="hover:text-foreground transition-colors">Kontakt</a>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2026 UGC Lab. Alle rettigheter reservert.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
