import { Video } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const MyVideos = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold">Mine videoer</h1>
        <p className="text-muted-foreground mt-1">Se alle dine genererte videoer</p>
      </div>

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
    </div>
  );
};

export default MyVideos;
