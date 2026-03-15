import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // TODO: Supabase auth
    toast.info("Backend er ikke koblet til ennå");
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-hero-gradient px-4">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-primary/8 blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <Link to="/" className="font-display text-2xl font-bold text-gradient">
            UGC Lab
          </Link>
        </div>

        <div className="rounded-xl border border-border bg-card p-8 card-shadow">
          <h1 className="font-display text-2xl font-bold text-center mb-6">Logg inn</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-post</Label>
              <Input
                id="email"
                type="email"
                placeholder="din@epost.no"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Passord</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-primary text-primary-foreground hover:opacity-90"
            >
              {loading ? "Logger inn..." : "Logg inn"}
            </Button>
          </form>

          <p className="text-sm text-muted-foreground text-center mt-6">
            Har du ikke en konto?{" "}
            <Link to="/register" className="text-primary hover:underline">
              Registrer deg
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
