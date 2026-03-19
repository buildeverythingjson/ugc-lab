import { useState, useEffect } from "react";
import logoImg from "@/assets/logo.png";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-background/80 backdrop-blur-xl border-b border-border" : ""}`}>
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/">
          <img src={logoImg} alt="Rendr" className="h-8" />
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#funksjoner" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Funksjoner
          </a>
          <a href="#priser" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Priser
          </a>
          <a href="#faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            FAQ
          </a>
          {user ? (
            <Link to="/dashboard">
              <Button variant="outline" size="sm" className="border-border hover:bg-secondary">
                Dashboard
              </Button>
            </Link>
          ) : (
            <Link to="/login">
              <Button variant="outline" size="sm" className="border-border hover:bg-secondary">
                Logg inn
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden text-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-xl border-b border-border px-4 pb-5 pt-2 space-y-1">
          <a href="#funksjoner" className="block text-sm text-muted-foreground py-3 px-2 rounded-lg hover:bg-surface active:bg-surface-hover transition-colors" onClick={() => setMobileOpen(false)}>
            Funksjoner
          </a>
          <a href="#priser" className="block text-sm text-muted-foreground py-3 px-2 rounded-lg hover:bg-surface active:bg-surface-hover transition-colors" onClick={() => setMobileOpen(false)}>
            Priser
          </a>
          <a href="#faq" className="block text-sm text-muted-foreground py-3 px-2 rounded-lg hover:bg-surface active:bg-surface-hover transition-colors" onClick={() => setMobileOpen(false)}>
            FAQ
          </a>
          <div className="pt-2">
            {user ? (
              <Link to="/dashboard" onClick={() => setMobileOpen(false)}>
                <Button variant="outline" size="sm" className="w-full border-border h-11">
                  Dashboard
                </Button>
              </Link>
            ) : (
              <Link to="/login" onClick={() => setMobileOpen(false)}>
                <Button variant="outline" size="sm" className="w-full border-border h-11">
                  Logg inn
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
