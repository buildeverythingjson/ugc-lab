import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Lock, Sparkles, Loader2, Image, Globe, Clock, Wand2, X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const NewVideo = () => {
  const { user, profile, refreshProfile } = useAuth();
  const isBusiness = profile?.subscription_tier === "business";
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [brandName, setBrandName] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [creativeDescription, setCreativeDescription] = useState("");
  const [language, setLanguage] = useState("Norsk");
  const [videoLength, setVideoLength] = useState("15");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeneratingScript, setIsGeneratingScript] = useState(false);

  const videosRemaining = profile?.videos_remaining ?? 0;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const generateScript = async () => {
    if (!brandName.trim() || !targetAudience.trim()) {
      toast.error("Fyll inn merkenavn og målgruppe først.");
      return;
    }
    setIsGeneratingScript(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-script", {
        body: { brandName, targetAudience, language, videoLength },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      if (data?.script) {
        setCreativeDescription(data.script);
        toast.success("Manus generert!");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Kunne ikke generere manus.");
    } finally {
      setIsGeneratingScript(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile || !user) return;

    if (videosRemaining <= 0) {
      toast.error("Du har brukt alle videoene dine denne måneden. Oppgrader planen din for flere.");
      return;
    }

    setIsSubmitting(true);
    try {
      const filePath = `${user.id}/${Date.now()}_${imageFile.name}`;
      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, imageFile);
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

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

      await refreshProfile();
      if (typeof window.fbq === "function") window.fbq("track", "Lead");
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
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start sm:items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="font-display text-xl sm:text-2xl font-bold">Lag ny video</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Beskriv produktet ditt og generer en UGC-video</p>
        </div>
        <div className="flex items-center gap-2 text-sm shrink-0">
          <span className="text-muted-foreground hidden sm:inline">Kreditter</span>
          <span className="inline-flex items-center justify-center min-w-[28px] h-7 px-2 rounded-full bg-secondary font-semibold text-foreground">
            {videosRemaining}
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-0">
        {/* Main card */}
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          {/* Script / Description area */}
          <div className="p-6 pb-4">
            <div className="relative">
              <Textarea
                placeholder="Beskriv stilen og budskapet du ønsker for videoen..."
                rows={5}
                value={creativeDescription}
                onChange={(e) => setCreativeDescription(e.target.value)}
                className="resize-none border-0 bg-transparent p-0 text-base placeholder:text-muted-foreground/60 focus-visible:ring-0 shadow-none"
              />
              <div className="absolute top-0 right-0">
                <button
                  type="button"
                  disabled={isGeneratingScript}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card text-sm text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-colors disabled:opacity-50"
                  onClick={generateScript}
                >
                  {isGeneratingScript ? (
                    <><Loader2 size={14} className="animate-spin" /> Genererer...</>
                  ) : (
                    <><Wand2 size={14} /> AI Manus</>
                  )}
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
              onClick={() => fileInputRef.current?.click()}
              className={`inline-flex items-center gap-2 px-3 py-2 rounded-full border text-sm transition-colors ${
                imageFile
                  ? "border-foreground/20 bg-primary/5 text-foreground"
                  : "border-border bg-card text-muted-foreground hover:text-foreground hover:border-foreground/20"
              }`}
            >
              <Image size={16} />
              {imageFile ? imageFile.name.slice(0, 20) : "Produktbilde"}
              {imageFile && (
                <span
                  onClick={(e) => { e.stopPropagation(); removeImage(); }}
                  className="ml-1 hover:text-destructive cursor-pointer"
                >
                  <X size={14} />
                </span>
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleImageChange}
            />

            {/* Language */}
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-auto h-9 rounded-full border-border bg-card text-sm gap-2 px-3 [&>svg]:opacity-50">
                <Globe size={16} className="shrink-0 text-muted-foreground" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Norsk">Norsk</SelectItem>
                <SelectItem value="Engelsk">Engelsk</SelectItem>
                <SelectItem value="Svensk">Svensk</SelectItem>
                <SelectItem value="Dansk">Dansk</SelectItem>
              </SelectContent>
            </Select>

            {/* Video length */}
            <div className="flex items-center rounded-full border border-border bg-card overflow-hidden">
              {[
                { value: "15", label: "15s", locked: false },
                { value: "30", label: "30s", locked: !isBusiness },
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => !opt.locked && setVideoLength(opt.value)}
                  disabled={opt.locked}
                  className={`inline-flex items-center gap-1 px-3 py-2 text-sm transition-colors ${
                    videoLength === opt.value
                      ? "bg-primary text-primary-foreground"
                      : opt.locked
                      ? "text-muted-foreground/40 cursor-not-allowed"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Clock size={14} />
                  {opt.label}
                  {opt.locked && <Lock size={12} />}
                </button>
              ))}
            </div>

            {/* Submit button - pushed to right */}
            <div className="flex-1" />
            <Button
              type="submit"
              disabled={isSubmitting || !imageFile}
              className="rounded-full h-9 px-5 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isSubmitting ? (
                <><Loader2 size={16} className="mr-1.5 animate-spin" /> Genererer...</>
              ) : (
                <><Sparkles size={16} className="mr-1.5" /> Generer</>
              )}
            </Button>
          </div>
        </div>

        {/* Detail fields below */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-5">
          <div className="space-y-2">
            <Label htmlFor="brand" className="text-sm text-muted-foreground font-normal">Merkenavn *</Label>
            <Input
              id="brand"
              placeholder="F.eks. Norsk Hudpleie"
              required
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              className="bg-card border-border"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="audience" className="text-sm text-muted-foreground font-normal">Målgruppe *</Label>
            <Input
              id="audience"
              placeholder="F.eks. Kvinner 25-45"
              required
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              className="bg-card border-border"
            />
          </div>
        </div>

        {/* Image preview */}
        {imagePreview && (
          <div className="pt-4">
            <div className="relative w-32 h-32 rounded-xl border border-border overflow-hidden bg-card">
              <img src={imagePreview} alt="Forhåndsvisning" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-foreground/80 text-background flex items-center justify-center hover:bg-foreground transition-colors"
              >
                <X size={12} />
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default NewVideo;
