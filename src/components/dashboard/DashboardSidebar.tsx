import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, PlusCircle, Video, CreditCard, Settings, LogOut } from "lucide-react";

const navItems = [
  { label: "Oversikt", icon: LayoutDashboard, path: "/dashboard" },
  { label: "Ny video", icon: PlusCircle, path: "/dashboard/new-video" },
  { label: "Mine videoer", icon: Video, path: "/dashboard/videos" },
  { label: "Abonnement", icon: CreditCard, path: "/dashboard/subscription" },
  { label: "Innstillinger", icon: Settings, path: "/dashboard/settings" },
];

const DashboardSidebar = () => {
  const location = useLocation();

  return (
    <aside className="hidden lg:flex flex-col w-64 min-h-screen border-r border-border bg-card">
      <div className="p-6">
        <Link to="/" className="font-display text-xl font-bold text-gradient">
          UGC Lab
        </Link>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-surface"
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
            U
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">Bruker</p>
            <p className="text-xs text-muted-foreground truncate">bruker@epost.no</p>
          </div>
        </div>
        <button className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-surface transition-colors mt-1">
          <LogOut size={18} />
          Logg ut
        </button>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
