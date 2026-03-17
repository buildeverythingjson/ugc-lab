import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Video, Clock, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
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
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {jobs.map((job) => {
            const status = (job.status as keyof typeof STATUS_CONFIG) || "pending";
            const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;
            const StatusIcon = config.icon;

            return (
              <Link
                key={job.id}
                to={`/dashboard/videos/${job.id}`}
                className="rounded-xl border border-border bg-card card-shadow hover:border-primary/30 transition-colors block overflow-hidden"
              >
                <div className="w-full aspect-[9/16] bg-secondary/30">
                  {job.video_url ? (
                    <video
                      src={job.video_url}
                      muted
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
    </div>
  );
};

export default MyVideos;
