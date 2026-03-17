import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Clock, Loader2, CheckCircle2, XCircle, Download, RefreshCw } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type VideoJob = Tables<"video_jobs">;

const STATUS_CONFIG = {
  pending: { label: "Venter...", color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30", icon: Clock },
  processing: { label: "Genererer video...", color: "bg-blue-500/20 text-blue-400 border-blue-500/30", icon: Loader2 },
  completed: { label: "Ferdig!", color: "bg-green-500/20 text-green-400 border-green-500/30", icon: CheckCircle2 },
  failed: { label: "Feilet", color: "bg-red-500/20 text-red-400 border-red-500/30", icon: XCircle },
} as const;

const VideoDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [job, setJob] = useState<VideoJob | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchJob = async () => {
      const { data, error } = await supabase
        .from("video_jobs")
        .select("*")
        .eq("id", id)
        .single();
      if (!error && data) setJob(data);
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
  }, [id]);

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
          <ArrowLeft size={16} /> Tilbake til Mine videoer
        </Link>
        <p className="text-muted-foreground">Fant ikke videojobben.</p>
      </div>
    );
  }

  const status = (job.status as keyof typeof STATUS_CONFIG) || "pending";
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;
  const StatusIcon = config.icon;

  return (
    <div className="space-y-6 max-w-2xl">
      <Link to="/dashboard/videos" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft size={16} /> Tilbake til Mine videoer
      </Link>

      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold">{job.brand_name}</h1>
        <div className="mt-2">
          <Badge variant="outline" className={`${config.color} border`}>
            <StatusIcon size={14} className={`mr-1.5 ${status === "processing" ? "animate-spin" : ""}`} />
            {config.label}
          </Badge>
        </div>
      </div>

      {status === "processing" && (
        <Card className="border-blue-500/20 bg-blue-500/5">
          <CardContent className="pt-6">
            <p className="text-blue-400 text-sm">
              AI-en jobber med videoen din. Dette kan ta 2–5 minutter.
            </p>
          </CardContent>
        </Card>
      )}

      {status === "completed" && job.video_url && (
        <Card className="border-green-500/20 bg-green-500/5">
          <CardContent className="pt-6 space-y-4">
            <div className="w-full max-w-[360px] mx-auto">
              <AspectRatio ratio={9 / 16}>
                <video
                  src={job.video_url}
                  controls
                  playsInline
                  className="w-full h-full rounded-lg bg-black object-contain"
                />
              </AspectRatio>
            </div>
            <a href={job.video_url} download>
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                <Download size={16} className="mr-2" />
                Last ned video
              </Button>
            </a>
          </CardContent>
        </Card>
      )}

      {status === "failed" && (
        <Card className="border-red-500/20 bg-red-500/5">
          <CardContent className="pt-6 space-y-3">
            <p className="text-red-400 text-sm">{job.error_message || "En ukjent feil oppstod."}</p>
            <Link to="/dashboard/new-video">
              <Button variant="outline" className="border-red-500/30 text-red-400 hover:bg-red-500/10">
                <RefreshCw size={16} className="mr-2" />
                Prøv igjen
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Detaljer</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {job.product_image_url && (
            <div>
              <p className="text-sm text-muted-foreground mb-2">Produktbilde</p>
              <img
                src={job.product_image_url}
                alt="Produktbilde"
                className="rounded-lg max-h-48 object-contain border border-border"
              />
            </div>
          )}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Merkenavn</p>
              <p className="font-medium">{job.brand_name}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Målgruppe</p>
              <p className="font-medium">{job.target_audience}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Språk</p>
              <p className="font-medium">{job.language}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Videolengde</p>
              <p className="font-medium">{job.video_length} sek</p>
            </div>
          </div>
          {job.creative_description && (
            <div>
              <p className="text-sm text-muted-foreground">Kreativ beskrivelse</p>
              <p className="text-sm font-medium">{job.creative_description}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VideoDetail;
