import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Lock, Sparkles } from "lucide-react";
import { toast } from "sonner";

const NewVideo = () => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [language, setLanguage] = useState("Norsk");
  const [videoLength, setVideoLength] = useState("15");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.info("Backend er ikke koblet til ennå");
  };

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold">Lag ny video</h1>
        <p className="text-muted-foreground mt-1">Fyll ut skjemaet for å generere en UGC-video</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Image upload */}
        <div className="space-y-2">
          <Label>Produktbilde *</Label>
          <label className="flex flex-col items-center justify-center w-full h-48 rounded-xl border-2 border-dashed border-border bg-surface hover:border-primary/40 transition-colors cursor-pointer overflow-hidden">
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" className="w-full h-full object-contain" />
            ) : (
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <Upload size={32} />
                <span className="text-sm">Last opp produktbilde</span>
                <span className="text-xs">JPG, PNG eller WEBP</span>
              </div>
            )}
            <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleImageChange} />
          </label>
        </div>

        {/* Brand name */}
        <div className="space-y-2">
          <Label htmlFor="brand">Merkenavn *</Label>
          <Input id="brand" placeholder="F.eks. Norsk Hudpleie AS" required />
        </div>

        {/* Target audience */}
        <div className="space-y-2">
          <Label htmlFor="audience">Målgruppe *</Label>
          <Input id="audience" placeholder="F.eks. Kvinner 25-45 som er interessert i hudpleie" required />
        </div>

        {/* Creative description */}
        <div className="space-y-2">
          <Label htmlFor="description">Kreativ beskrivelse</Label>
          <Textarea
            id="description"
            placeholder="Beskriv stilen du ønsker, f.eks. 'Energisk og moderne, med fokus på naturlige ingredienser'"
            rows={3}
          />
        </div>

        {/* Language */}
        <div className="space-y-2">
          <Label>Språk *</Label>
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Norsk">Norsk</SelectItem>
              <SelectItem value="Engelsk">Engelsk</SelectItem>
              <SelectItem value="Svensk">Svensk</SelectItem>
              <SelectItem value="Dansk">Dansk</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Video length */}
        <div className="space-y-2">
          <Label>Videolengde *</Label>
          <div className="flex gap-3">
            {[
              { value: "15", label: "15 sek", locked: false },
              { value: "30", label: "30 sek", locked: true, plan: "Pro" },
              { value: "60", label: "60 sek", locked: true, plan: "Business" },
            ].map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => !opt.locked && setVideoLength(opt.value)}
                className={`relative flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                  videoLength === opt.value
                    ? "border-primary bg-primary/10 text-primary"
                    : opt.locked
                    ? "border-border bg-surface text-muted-foreground cursor-not-allowed opacity-50"
                    : "border-border bg-surface text-foreground hover:border-primary/30"
                }`}
                disabled={opt.locked}
                title={opt.locked ? `Oppgrader til ${opt.plan} for denne lengden` : undefined}
              >
                {opt.locked && <Lock size={14} />}
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <Button
          type="submit"
          className="w-full bg-gradient-primary text-primary-foreground hover:opacity-90 glow-primary h-12"
        >
          <Sparkles size={18} className="mr-2" />
          Generer video
        </Button>
      </form>
    </div>
  );
};

export default NewVideo;
