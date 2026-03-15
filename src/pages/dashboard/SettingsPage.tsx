import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

const SettingsPage = () => {
  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold">Innstillinger</h1>
        <p className="text-muted-foreground mt-1">Administrer kontoen din</p>
      </div>

      {/* Display name */}
      <div className="rounded-xl border border-border bg-card p-6 card-shadow space-y-4">
        <h2 className="font-display font-semibold">Profil</h2>
        <div className="space-y-2">
          <Label htmlFor="displayName">Visningsnavn</Label>
          <Input id="displayName" placeholder="Ditt navn" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">E-post</Label>
          <Input id="email" type="email" placeholder="din@epost.no" />
        </div>
        <Button
          onClick={() => toast.info("Backend er ikke koblet til ennå")}
          className="bg-gradient-primary text-primary-foreground hover:opacity-90"
        >
          Lagre endringer
        </Button>
      </div>

      {/* Password */}
      <div className="rounded-xl border border-border bg-card p-6 card-shadow space-y-4">
        <h2 className="font-display font-semibold">Endre passord</h2>
        <div className="space-y-2">
          <Label htmlFor="newPassword">Nytt passord</Label>
          <Input id="newPassword" type="password" placeholder="••••••••" />
        </div>
        <Button
          onClick={() => toast.info("Backend er ikke koblet til ennå")}
          variant="outline"
        >
          Oppdater passord
        </Button>
      </div>

      <Separator />

      {/* Danger zone */}
      <div className="rounded-xl border border-destructive/30 bg-card p-6 card-shadow space-y-4">
        <h2 className="font-display font-semibold text-destructive">Faresone</h2>
        <p className="text-sm text-muted-foreground">
          Denne handlingen kan ikke angres. Alle dine data vil bli slettet permanent.
        </p>
        <Button
          variant="destructive"
          onClick={() => toast.info("Backend er ikke koblet til ennå")}
        >
          Slett konto
        </Button>
      </div>
    </div>
  );
};

export default SettingsPage;
