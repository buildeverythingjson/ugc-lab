import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PlusCircle, Video, CreditCard, Clock } from "lucide-react";

const statsCards = [
  { label: "Gjenværende videoer", value: "3 av 5", icon: Video },
  { label: "Videoer denne måneden", value: "2", icon: Clock },
  { label: "Nåværende plan", value: "Starter", icon: CreditCard },
];

const Overview = () => {
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold">
            Velkommen tilbake! 👋
          </h1>
          <p className="text-muted-foreground mt-1">Her er en oversikt over kontoen din</p>
        </div>
        <Link to="/dashboard/new-video">
          <Button className="bg-gradient-primary text-primary-foreground hover:opacity-90 glow-primary">
            <PlusCircle size={18} className="mr-2" />
            Lag ny video
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {statsCards.map((card) => (
          <div
            key={card.label}
            className="rounded-xl border border-border bg-card p-6 card-shadow"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">{card.label}</span>
              <card.icon size={18} className="text-primary" />
            </div>
            <p className="font-display text-2xl font-bold">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Recent videos */}
      <div>
        <h2 className="font-display text-lg font-semibold mb-4">Siste videoer</h2>
        <div className="rounded-xl border border-border bg-card p-8 text-center card-shadow">
          <Video size={40} className="text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground text-sm">Ingen videoer ennå</p>
          <Link to="/dashboard/new-video">
            <Button variant="link" className="text-primary mt-2">
              Lag din første video
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Overview;
