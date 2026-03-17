import { Lock, Image, Globe, Wand2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

const NewImage = () => {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="font-display text-2xl font-bold">Lag nytt bilde</h1>
            <p className="text-muted-foreground text-sm mt-0.5">Generer bilde-creatives for annonser og sosiale medier</p>
          </div>
        </div>
        <Badge variant="secondary" className="gap-1.5 text-muted-foreground">
          <Lock size={12} />
          Kommer snart
        </Badge>
      </div>

      {/* Main card - disabled/locked */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden opacity-50 pointer-events-none select-none">
        {/* Script / Description area */}
        <div className="p-6 pb-4">
          <div className="relative">
            <Textarea
              placeholder="Beskriv stilen og budskapet du ønsker for bildet..."
              rows={5}
              disabled
              className="resize-none border-0 bg-transparent p-0 text-base placeholder:text-muted-foreground/60 focus-visible:ring-0 shadow-none"
            />
            <div className="absolute top-0 right-0">
              <button
                type="button"
                disabled
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card text-sm text-muted-foreground transition-colors disabled:opacity-50"
              >
                <Wand2 size={14} /> AI Tekst
              </button>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border" />

        {/* Toolbar row */}
        <div className="px-6 py-3 flex flex-wrap items-center gap-2">
          {/* Image upload button */}
          <button
            type="button"
            disabled
            className="inline-flex items-center gap-2 px-3 py-2 rounded-full border border-border bg-card text-sm text-muted-foreground"
          >
            <Image size={16} />
            Produktbilde
          </button>

          {/* Language */}
          <div className="inline-flex items-center gap-2 px-3 py-2 rounded-full border border-border bg-card text-sm text-muted-foreground">
            <Globe size={16} />
            Norsk
          </div>

          {/* Aspect ratio selector */}
          <div className="flex items-center rounded-full border border-border bg-card overflow-hidden">
            {[
              { value: "9:16", label: "9:16" },
              { value: "4:5", label: "4:5" },
              { value: "both", label: "Begge" },
            ].map((opt) => (
              <button
                key={opt.value}
                type="button"
                disabled
                className="inline-flex items-center gap-1 px-3 py-2 text-sm text-muted-foreground/40 cursor-not-allowed"
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Submit button - pushed to right */}
          <div className="flex-1" />
          <Button
            disabled
            className="rounded-full h-9 px-5 bg-primary text-primary-foreground"
          >
            <Sparkles size={16} className="mr-1.5" /> Generer
          </Button>
        </div>
      </div>

      {/* Detail fields below - locked */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1 opacity-50 pointer-events-none select-none">
        <div className="space-y-2">
          <Label htmlFor="brand" className="text-sm text-muted-foreground font-normal">Merkenavn *</Label>
          <Input
            id="brand"
            placeholder="F.eks. Norsk Hudpleie"
            disabled
            className="bg-card border-border"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="audience" className="text-sm text-muted-foreground font-normal">Målgruppe *</Label>
          <Input
            id="audience"
            placeholder="F.eks. Kvinner 25-45"
            disabled
            className="bg-card border-border"
          />
        </div>
      </div>

      {/* Coming soon overlay message */}
      <div className="rounded-xl border border-border bg-card p-8 text-center">
        <Lock size={32} className="text-muted-foreground mx-auto mb-3" />
        <p className="font-display font-semibold text-lg">Kommer snart</p>
        <p className="text-muted-foreground text-sm mt-1">
          Bildegenerering for annonser og creatives er under utvikling.
        </p>
      </div>
    </div>
  );
};

export default NewImage;
