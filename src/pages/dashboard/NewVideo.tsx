import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Lock, Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const NewVideo = () => {
  const { user, profile, refreshProfile } = useAuth();
  const isBusiness = profile?.subscription_tier === "business";
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [brandName, setBrandName] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [creativeDescription, setCreativeDescription] = useState("");
  const [language, setLanguage] = useState("Norsk");
  const [videoLength, setVideoLength] = useState("15");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile || !user) return;

    if ((profile?.videos_remaining ?? 0) <= 0) {
      toast.error("Du har brukt alle videoene dine denne måneden. Oppgrader planen din for flere.");
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Upload image to Supabase Storage
      const filePath = `${user.id}/${Date.now()}_${imageFile.name}`;
      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, imageFile);
      if (uploadError) throw uploadError;

      // 2. Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      // 3. Create video_jobs row
      const jobId = crypto.randomUUID();
      const { error: insertError } = await supabase.from('video_jobs').insert({
        id: jobId,
        user_id: user.id,
        status: 'pending',
        brand_name: brandName,
        target_audience: targetAudience,
        creative_description: creativeDescription || null,
        language: language,
        video_length: videoLength,
        product_image_url: publicUrl,
      });
      if (insertError) throw insertError;

      // 4. Call edge function to trigger n8n
      const { error: fnError } = await supabase.functions.invoke('submit-video-job', {
        body: {
          jobId,
          imageUrl: publicUrl,
          brandName,
          targetAudience,
          creativeDescription: creativeDescription || null,
          language,
          videoLength,
        }
      });
      if (fnError) throw fnError;

      // 5. Refresh profile and navigate
      await refreshProfile();
      toast.success("Videogenerering startet!");
      navigate(`/dashboard/videos/${jobId}`);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Noe gikk galt. Prøv igjen.");
    } finally {
      setIsSubmitting(false);
    }
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
          <Input id="brand" placeholder="F.eks. Norsk Hudpleie AS" required value={brandName} onChange={(e) => setBrandName(e.target.value)} />
        </div>

        {/* Target audience */}
        <div className="space-y-2">
          <Label htmlFor="audience">Målgruppe *</Label>
          <Input id="audience" placeholder="F.eks. Kvinner 25-45 som er interessert i hudpleie" required value={targetAudience} onChange={(e) => setTargetAudience(e.target.value)} />
        </div>

        {/* Creative description */}
        <div className="space-y-2">
          <Label htmlFor="description">Kreativ beskrivelse</Label>
          <Textarea
            id="description"
            placeholder="Beskriv stilen du ønsker, f.eks. 'Energisk og moderne, med fokus på naturlige ingredienser'"
            rows={3}
            value={creativeDescription}
            onChange={(e) => setCreativeDescription(e.target.value)}
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
              { value: "30", label: "30 sek", locked: !isBusiness, plan: "Business" },
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
          disabled={isSubmitting || !imageFile}
          className="w-full bg-gradient-primary text-primary-foreground hover:opacity-90 glow-primary h-12"
        >
          {isSubmitting ? (
            <><Loader2 size={18} className="mr-2 animate-spin" /> Genererer...</>
          ) : (
            <><Sparkles size={18} className="mr-2" /> Generer video</>
          )}
        </Button>
      </form>
    </div>
  );
};

export default NewVideo;
