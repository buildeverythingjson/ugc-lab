import { useState, useEffect } from "react";
import logoImg from "@/assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRecovery, setIsRecovery] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    if (hashParams.get("type") === "recovery") {
      setIsRecovery(true);
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setIsRecovery(true);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passordene stemmer ikke overens");
      return;
    }
    if (password.length < 6) {
      toast.error("Passordet må være minst 6 tegn");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast.success("Passordet er oppdatert!");
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Kunne ikke oppdatere passordet");
    } finally {
      setLoading(false);
    }
  };

  if (!isRecovery) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-hero-gradient px-4">
        <div className="w-full max-w-md relative z-10">
          <div className="text-center mb-8">
            <Link to="/">
              <img src={logoImg} alt="Rendr" className="h-5 mx-auto" />
            </Link>
          </div>
          <div className="rounded-xl border border-border bg-card p-8 card-shadow text-center">
            <h1 className="font-display text-2xl font-bold mb-4">Ugyldig lenke</h1>
            <p className="text-sm text-muted-foreground mb-6">
              Denne tilbakestillingslenken er ugyldig eller utløpt.
            </p>
            <Link to="/forgot-password">
              <Button variant="outline" className="w-full">Be om ny lenke</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-hero-gradient px-4">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-primary/8 blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <Link to="/">
            <img src={logoImg} alt="Rendr" className="h-6 mx-auto" />
          </Link>
        </div>

        <div className="rounded-xl border border-border bg-card p-8 card-shadow">
          <h1 className="font-display text-2xl font-bold text-center mb-2">Nytt passord</h1>
          <p className="text-sm text-muted-foreground text-center mb-6">
            Velg et nytt passord for kontoen din.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Nytt passord</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Bekreft passord</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" disabled={loading} className="w-full bg-gradient-primary text-primary-foreground hover:opacity-90">
              {loading ? "Oppdaterer..." : "Oppdater passord"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;