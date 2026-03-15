import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-background/80 backdrop-blur-xl border-b border-border" : ""}`}>
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="font-display text-xl font-bold text-gradient">
          UGC Lab
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#funksjoner" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Funksjoner
          </a>
          <a href="#priser" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Priser
          </a>
          <Link to="/login">
            <Button variant="outline" size="sm" className="border-border hover:bg-secondary">
              Logg inn
            </Button>
          </Link>
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden text-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-xl border-b border-border px-4 pb-4 space-y-3">
          <a href="#funksjoner" className="block text-sm text-muted-foreground" onClick={() => setMobileOpen(false)}>
            Funksjoner
          </a>
          <a href="#priser" className="block text-sm text-muted-foreground" onClick={() => setMobileOpen(false)}>
            Priser
          </a>
          <Link to="/login" onClick={() => setMobileOpen(false)}>
            <Button variant="outline" size="sm" className="w-full border-border">
              Logg inn
            </Button>
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
