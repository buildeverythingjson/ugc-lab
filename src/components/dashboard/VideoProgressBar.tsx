import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Loader2 } from "lucide-react";

interface VideoProgressBarProps {
  createdAt: string;
  isCompleted: boolean;
}

/**
 * Simulated progress bar for video generation.
 * Estimates ~3.5 minutes total, accelerates early then slows near 90%.
 * Jumps to 100% on completion.
 */
const VideoProgressBar = ({ createdAt, isCompleted }: VideoProgressBarProps) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isCompleted) {
      setProgress(100);
      return;
    }

    const EXPECTED_MS = 3.5 * 60 * 1000; // 3.5 min
    const startTime = new Date(createdAt).getTime();

    const tick = () => {
      const elapsed = Date.now() - startTime;
      const ratio = Math.min(elapsed / EXPECTED_MS, 1);
      // Ease-out curve that caps at ~92%
      const simulated = Math.min(92, ratio * 100 * (2 - ratio));
      setProgress(Math.round(simulated));
    };

    tick();
    const interval = setInterval(tick, 2000);
    return () => clearInterval(interval);
  }, [createdAt, isCompleted]);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-blue-400 flex items-center gap-2">
          <Loader2 size={14} className="animate-spin" />
          {isCompleted ? "Ferdig!" : "Genererer video..."}
        </span>
        <span className="text-muted-foreground tabular-nums font-medium">
          {progress}%
        </span>
      </div>
      <Progress value={progress} className="h-2 bg-blue-500/10" />
    </div>
  );
};

export default VideoProgressBar;
