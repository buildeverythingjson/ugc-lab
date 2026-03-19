import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { ArrowLeft, ChevronLeft, ChevronRight, Clock, Loader2, XCircle, Download, RefreshCw, Trash2, MoreVertical } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import type { Tables } from "@/integrations/supabase/types";
import { useAuth } from "@/contexts/AuthContext";

type VideoJob = Tables<"video_jobs">;

const STATUS_CONFIG = {
  pending: { label: "Venter...", color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30", icon: Clock },
  processing: { label: "Genererer video...", color: "bg-blue-500/20 text-blue-400 border-blue-500/30", icon: Loader2 },
  failed: { label: "Feilet", color: "bg-red-500/20 text-red-400 border-red-500/30", icon: XCircle },
} as const;

const VideoDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [job, setJob] = useState<VideoJob | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [siblingIds, setSiblingIds] = useState<string[]>([]);

  const handleDelete = async () => {
    if (!id) return;
    const { error } = await supabase.from("video_jobs").delete().eq("id", id);
    if (error) {
      toast({ title: "Kunne ikke slette", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Video slettet" });
      navigate("/dashboard/videos");
    }
    setShowDeleteDialog(false);
  };

  useEffect(() => {
    if (!id || !user) return;

    const fetchJob = async () => {
      const [jobRes, idsRes] = await Promise.all([
        supabase.from("video_jobs").select("*").eq("id", id).single(),
        supabase.from("video_jobs").select("id").eq("user_id", user.id).order("created_at", { ascending: false }),
      ]);
      if (!jobRes.error && jobRes.data) setJob(jobRes.data);
      if (!idsRes.error && idsRes.data) setSiblingIds(idsRes.data.map((r) => r.id));
      setLoading(false);
    };

    fetchJob();

    const channel = supabase
      .channel(`video-job-${id}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "video_jobs",
          filter: `id=eq.${id}`,
        },
        (payload) => {
          setJob(payload.new as VideoJob);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id, user]);

  const currentIndex = siblingIds.indexOf(id ?? "");
  const prevId = currentIndex > 0 ? siblingIds[currentIndex - 1] : null;
  const nextId = currentIndex < siblingIds.length - 1 ? siblingIds[currentIndex + 1] : null;

  if (loading) {
    return (
      <div className="space-y-6 max-w-2xl">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="space-y-6 max-w-2xl">
        <Link to="/dashboard/videos" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft size={16} /> Tilbake
        </Link>
        <p className="text-muted-foreground">Fant ikke videojobben.</p>
      </div>
    );
  }

  const status = (job.status as keyof typeof STATUS_CONFIG) || "pending";
  const isCompleted = job.status === "completed";
  const config = !isCompleted ? STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG.pending : null;

  return (
    <div className="space-y-5 max-w-4xl">
      <div className="flex items-center justify-between">
        <Link to="/dashboard/videos" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft size={16} /> Tilbake
        </Link>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            disabled={!prevId}
            onClick={() => prevId && navigate(`/dashboard/videos/${prevId}`)}
          >
            <ChevronLeft size={16} />
          </Button>
          <span className="text-xs text-muted-foreground tabular-nums">
            {currentIndex >= 0 ? currentIndex + 1 : "–"} / {siblingIds.length}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            disabled={!nextId}
            onClick={() => nextId && navigate(`/dashboard/videos/${nextId}`)}
          >
            <ChevronRight size={16} />
          </Button>
        </div>
      </div>

      {status === "processing" && (
        <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 px-4 py-3">
          <p className="text-blue-400 text-sm">
            <Loader2 size={14} className="inline mr-2 animate-spin" />
            AI-en jobber med videoen din. Dette kan ta 2–5 minutter.
          </p>
        </div>
      )}

      {status === "failed" && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 space-y-2">
          <p className="text-red-400 text-sm">{job.error_message || "En ukjent feil oppstod."}</p>
          <Link to="/dashboard/new-video">
            <Button variant="outline" size="sm" className="border-red-500/30 text-red-400 hover:bg-red-500/10">
              <RefreshCw size={14} className="mr-1.5" />
              Prøv igjen
            </Button>
          </Link>
        </div>
      )}

      {/* Side-by-side layout on desktop */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Video column */}
        {isCompleted && job.video_url && (
          <div className="shrink-0">
            <div className="w-full max-w-[240px] md:w-[240px] relative group">
              <AspectRatio ratio={9 / 16}>
                <video
                  src={job.video_url}
                  controls
                  playsInline
                  className="w-full h-full rounded-lg bg-black object-contain"
                />
              </AspectRatio>
              {/* 3-dot menu overlay */}
              <div className="absolute top-2 right-2 z-10">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="w-7 h-7 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center transition-colors">
                      <MoreVertical size={14} className="text-white" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <a href={job.video_url} download>
                        <Download size={14} className="mr-2" /> Last ned
                      </a>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onClick={() => setShowDeleteDialog(true)}
                    >
                      <Trash2 size={14} className="mr-2" /> Slett
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        )}

        {/* Details column */}
        <div className="flex-1 min-w-0 space-y-4">
          <div>
            <h1 className="font-display text-xl font-bold">{job.brand_name}</h1>
            {config && (
              <Badge variant="outline" className={`${config.color} border mt-1.5`}>
                <config.icon size={12} className={`mr-1 ${status === "processing" ? "animate-spin" : ""}`} />
                {config.label}
              </Badge>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-muted-foreground text-xs">Målgruppe</p>
              <p className="font-medium">{job.target_audience}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Språk</p>
              <p className="font-medium">{job.language}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Videolengde</p>
              <p className="font-medium">{job.video_length} sek</p>
            </div>
          </div>

          {job.creative_description && (
            <div>
              <p className="text-muted-foreground text-xs mb-1">Kreativ beskrivelse</p>
              <p className="text-sm leading-relaxed">{job.creative_description}</p>
            </div>
          )}

          {job.product_image_url && (
            <div>
              <p className="text-muted-foreground text-xs mb-1.5">Produktbilde</p>
              <img
                src={job.product_image_url}
                alt="Produktbilde"
                className="rounded-lg max-h-32 object-contain border border-border"
              />
            </div>
          )}
        </div>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Slett video?</AlertDialogTitle>
            <AlertDialogDescription>
              Er du sikker på at du vil slette denne videoen? Denne handlingen kan ikke angres.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Avbryt</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive hover:bg-destructive/90" onClick={handleDelete}>
              Slett
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default VideoDetail;
