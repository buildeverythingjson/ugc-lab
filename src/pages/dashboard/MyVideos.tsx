import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Video, Clock, Loader2, CheckCircle2, XCircle, Play, Trash2, Download, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import type { Tables } from "@/integrations/supabase/types";

type VideoJob = Tables<"video_jobs">;

const STATUS_CONFIG = {
  pending: { label: "Venter", color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30", icon: Clock },
  processing: { label: "Genererer", color: "bg-blue-500/20 text-blue-400 border-blue-500/30", icon: Loader2 },
  completed: { label: "Ferdig", color: "bg-green-500/20 text-green-400 border-green-500/30", icon: CheckCircle2 },
  failed: { label: "Feilet", color: "bg-red-500/20 text-red-400 border-red-500/30", icon: XCircle },
} as const;

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString("nb-NO", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const MyVideos = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<VideoJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteJobId, setDeleteJobId] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!deleteJobId) return;
    const { error } = await supabase.from("video_jobs").delete().eq("id", deleteJobId);
    if (error) {
      toast({ title: "Kunne ikke slette", description: error.message, variant: "destructive" });
    } else {
      setJobs((prev) => prev.filter((j) => j.id !== deleteJobId));
      toast({ title: "Video slettet" });
    }
    setDeleteJobId(null);
  };

  useEffect(() => {
    if (!user) return;

    const fetchJobs = async () => {
      const { data, error } = await supabase
        .from("video_jobs")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (!error && data) setJobs(data);
      setLoading(false);
    };

    fetchJobs();

    const channel = supabase
      .channel("my-video-jobs")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "video_jobs",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setJobs((prev) => [payload.new as VideoJob, ...prev]);
          } else if (payload.eventType === "UPDATE") {
            setJobs((prev) =>
              prev.map((j) =>
                j.id === (payload.new as VideoJob).id ? (payload.new as VideoJob) : j
              )
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold">Mine videoer</h1>
        <p className="text-muted-foreground mt-1">Se alle dine genererte videoer</p>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-48 rounded-xl" />
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-12 text-center card-shadow">
          <Video size={48} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="font-display font-semibold text-lg mb-2">Ingen videoer ennå</h3>
          <p className="text-muted-foreground text-sm mb-4">
            Lag din første video for å komme i gang
          </p>
          <Link to="/dashboard/new-video">
            <Button className="bg-gradient-primary text-primary-foreground hover:opacity-90">
              Lag ny video
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-3 grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {jobs.map((job) => {
            const status = (job.status as keyof typeof STATUS_CONFIG) || "pending";
            const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;
            const StatusIcon = config.icon;

            return (
              <Link
                key={job.id}
                to={`/dashboard/videos/${job.id}`}
                className="rounded-xl border border-border bg-card card-shadow hover:border-primary/30 transition-colors block overflow-hidden group"
              >
                <div
                  className="w-full aspect-[9/16] bg-secondary/30 relative"
                  onMouseEnter={(e) => {
                    const video = e.currentTarget.querySelector("video");
                    if (video) video.play().catch(() => {});
                  }}
                  onMouseLeave={(e) => {
                    const video = e.currentTarget.querySelector("video");
                    if (video) { video.pause(); video.currentTime = 1; }
                  }}
                >
                  {job.video_url ? (
                    <video
                      src={job.video_url}
                      muted
                      loop
                      playsInline
                      preload="metadata"
                      className="w-full h-full object-cover"
                      onLoadedData={(e) => {
                        e.currentTarget.currentTime = 1;
                      }}
                    />
                  ) : job.product_image_url ? (
                    <img
                      src={job.product_image_url}
                      alt={job.brand_name}
                      className="w-full h-full object-contain"
                    />
                  ) : null}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:opacity-0 transition-opacity">
                    <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                      <Play size={18} className="text-black ml-0.5" fill="black" />
                    </div>
                  </div>
                  <div className="absolute top-1.5 right-1.5 z-10">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                          className="w-5 h-5 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center transition-colors"
                        >
                          <MoreVertical size={11} className="text-white" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
                        {job.video_url && (
                          <DropdownMenuItem asChild>
                            <a href={job.video_url} download onClick={(e) => e.stopPropagation()}>
                              <Download size={14} className="mr-2" /> Last ned
                            </a>
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={(e) => { e.stopPropagation(); setDeleteJobId(job.id); }}
                        >
                          <Trash2 size={14} className="mr-2" /> Slett
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                <div className="p-3 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-sm truncate">{job.brand_name}</h3>
                    <Badge variant="outline" className={`${config.color} border text-xs`}>
                      <StatusIcon size={12} className={`mr-1 ${status === "processing" ? "animate-spin" : ""}`} />
                      {config.label}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{job.video_length} sek</span>
                    <span>{formatDate(job.created_at)}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      <AlertDialog open={!!deleteJobId} onOpenChange={(open) => !open && setDeleteJobId(null)}>
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

export default MyVideos;
