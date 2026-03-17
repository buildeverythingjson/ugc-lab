import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Lock, Sparkles, Loader2, Image, Globe, Clock, Wand2, X, ArrowUp, Paperclip } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const NewVideo = () => {
  const { user, profile, refreshProfile } = useAuth();
  const isBusiness = profile?.subscription_tier === "business";
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
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

  const autoResize = () => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = Math.min(el.scrollHeight, 200) + "px";
    }
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
        setTimeout(autoResize, 0);
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
      toast.success("Videogenerering startet!");
      navigate(`/dashboard/videos/${jobId}`);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Noe gikk galt. Prøv igjen.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const canSubmit = imageFile && brandName.trim() && targetAudience.trim();

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)]">
      {/* Centered content */}
      <div className="w-full max-w-2xl space-y-8">
        {/* Title area */}
        <div className="text-center space-y-2">
          <h1 className="font-display text-2xl sm:text-3xl font-bold">Hva skal videoen handle om?</h1>
          <p className="text-muted-foreground text-sm">
            Skriv et manus eller la AI generere et for deg
          </p>
        </div>

        {/* Detail fields - above the composer */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="brand" className="text-xs text-muted-foreground font-normal">Merkenavn</Label>
            <Input
              id="brand"
              placeholder="F.eks. Norsk Hudpleie"
              required
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              className="bg-card border-border h-10"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="audience" className="text-xs text-muted-foreground font-normal">Målgruppe</Label>
            <Input
              id="audience"
              placeholder="F.eks. Kvinner 25-45"
              required
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              className="bg-card border-border h-10"
            />
          </div>
        </div>

        {/* Composer card */}
        <form onSubmit={handleSubmit}>
          <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
            {/* Image preview inside composer */}
            {imagePreview && (
              <div className="px-4 pt-4">
                <div className="relative inline-flex rounded-xl border border-border overflow-hidden bg-secondary">
                  <img src={imagePreview} alt="Forhåndsvisning" className="h-20 w-20 object-cover" />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-1 right-1 w-5 h-5 rounded-full bg-foreground/70 text-background flex items-center justify-center hover:bg-foreground transition-colors"
                  >
                    <X size={10} />
                  </button>
                </div>
              </div>
            )}

            {/* Textarea */}
            <div className="px-4 pt-4 pb-2">
              <textarea
                ref={textareaRef}
                placeholder="Skriv manuset ditt her, eller klikk AI Manus for å generere..."
                value={creativeDescription}
                onChange={(e) => {
                  setCreativeDescription(e.target.value);
                  autoResize();
                }}
                rows={3}
                className="w-full resize-none bg-transparent text-foreground text-[15px] leading-relaxed placeholder:text-muted-foreground/50 focus:outline-none"
                style={{ minHeight: "80px", maxHeight: "200px" }}
              />
            </div>

            {/* Bottom toolbar */}
            <div className="px-3 pb-3 flex items-center gap-1.5">
              {/* Attach image */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className={`p-2 rounded-xl transition-colors ${
                  imageFile
                    ? "text-foreground bg-secondary"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
                title="Last opp produktbilde"
              >
                <Paperclip size={18} />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleImageChange}
              />

              {/* AI Script button */}
              <button
                type="button"
                disabled={isGeneratingScript}
                onClick={generateScript}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors disabled:opacity-50"
              >
                {isGeneratingScript ? (
                  <><Loader2 size={16} className="animate-spin" /> Genererer...</>
                ) : (
                  <><Wand2 size={16} /> AI Manus</>
                )}
              </button>

              {/* Language selector */}
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="w-auto h-9 rounded-xl border-0 bg-transparent text-sm gap-1.5 px-3 text-muted-foreground hover:text-foreground hover:bg-secondary [&>svg]:opacity-50">
                  <Globe size={16} className="shrink-0" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Norsk">Norsk</SelectItem>
                  <SelectItem value="Engelsk">Engelsk</SelectItem>
                  <SelectItem value="Svensk">Svensk</SelectItem>
                  <SelectItem value="Dansk">Dansk</SelectItem>
                </SelectContent>
              </Select>

              {/* Video length toggle */}
              <div className="flex items-center rounded-xl overflow-hidden">
                {[
                  { value: "15", label: "15s", locked: false },
                  { value: "30", label: "30s", locked: !isBusiness },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => !opt.locked && setVideoLength(opt.value)}
                    disabled={opt.locked}
                    className={`inline-flex items-center gap-1 px-2.5 py-2 text-sm transition-colors rounded-lg ${
                      videoLength === opt.value
                        ? "text-foreground bg-secondary"
                        : opt.locked
                        ? "text-muted-foreground/30 cursor-not-allowed"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                    }`}
                  >
                    <Clock size={14} />
                    {opt.label}
                    {opt.locked && <Lock size={11} />}
                  </button>
                ))}
              </div>

              {/* Spacer + Submit */}
              <div className="flex-1" />

              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  {videosRemaining} kreditter
                </span>
                <button
                  type="submit"
                  disabled={isSubmitting || !canSubmit}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                    canSubmit && !isSubmitting
                      ? "bg-foreground text-background hover:bg-foreground/90"
                      : "bg-secondary text-muted-foreground/40 cursor-not-allowed"
                  }`}
                >
                  {isSubmitting ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <ArrowUp size={18} />
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewVideo;
