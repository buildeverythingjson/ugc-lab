import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";

const SettingsPage = () => {
  const { profile, user, refreshProfile } = useAuth();
  const [firstName, setFirstName] = useState(profile?.first_name || "");
  const [lastName, setLastName] = useState(profile?.last_name || "");
  const [website, setWebsite] = useState(profile?.website || "");
  const [newPassword, setNewPassword] = useState("");

  const handleUpdateProfile = async () => {
    if (!user) return;
    const { error } = await supabase
      .from("profiles")
      .update({ display_name: displayName })
      .eq("id", user.id);
    if (error) {
      toast.error("Kunne ikke oppdatere profilen");
    } else {
      toast.success("Profil oppdatert!");
      refreshProfile();
    }
  };

  const handleUpdatePassword = async () => {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Passord oppdatert!");
      setNewPassword("");
    }
  };

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold">Innstillinger</h1>
        <p className="text-muted-foreground mt-1">Administrer kontoen din</p>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 card-shadow space-y-4">
        <h2 className="font-display font-semibold">Profil</h2>
        <div className="space-y-2">
          <Label htmlFor="displayName">Visningsnavn</Label>
          <Input id="displayName" value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Ditt navn" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">E-post</Label>
          <Input id="email" type="email" value={user?.email || ""} disabled />
        </div>
        <Button onClick={handleUpdateProfile} className="bg-gradient-primary text-primary-foreground hover:opacity-90">
          Lagre endringer
        </Button>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 card-shadow space-y-4">
        <h2 className="font-display font-semibold">Endre passord</h2>
        <div className="space-y-2">
          <Label htmlFor="newPassword">Nytt passord</Label>
          <Input id="newPassword" type="password" placeholder="••••••••" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
        </div>
        <Button onClick={handleUpdatePassword} variant="outline">
          Oppdater passord
        </Button>
      </div>

      <Separator />

      <div className="rounded-xl border border-destructive/30 bg-card p-6 card-shadow space-y-4">
        <h2 className="font-display font-semibold text-destructive">Faresone</h2>
        <p className="text-sm text-muted-foreground">
          Denne handlingen kan ikke angres. Alle dine data vil bli slettet permanent.
        </p>
        <Button variant="destructive" onClick={() => toast.info("Kontakt support for å slette kontoen din")}>
          Slett konto
        </Button>
      </div>
    </div>
  );
};

export default SettingsPage;
