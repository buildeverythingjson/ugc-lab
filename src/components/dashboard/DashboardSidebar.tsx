import { Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, PlusCircle, Video, CreditCard, Settings, LogOut, ImagePlus, Lock, ArrowUpCircle } from "lucide-react";
import logoImg from "@/assets/logo.png";
import { useAuth } from "@/contexts/AuthContext";

const navItems = [
  { label: "Oversikt", icon: LayoutDashboard, path: "/dashboard" },
  { label: "Ny video", icon: PlusCircle, path: "/dashboard/new-video" },
  { label: "Nytt bilde", icon: ImagePlus, path: "/dashboard/new-image", comingSoon: true },
  { label: "Mine videoer", icon: Video, path: "/dashboard/videos" },
  { label: "Abonnement", icon: CreditCard, path: "/dashboard/subscription" },
  { label: "Innstillinger", icon: Settings, path: "/dashboard/settings" },
];

const DashboardSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { profile, signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  const initials = (profile?.first_name || profile?.display_name || "U").charAt(0).toUpperCase();

  return (
    <aside className="hidden lg:flex flex-col w-64 min-h-screen border-r border-border bg-card">
      <div className="p-6">
        <Link to="/">
          <img src={logoImg} alt="Rendr" className="h-8" />
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
              {item.comingSoon && (
                <span className="ml-auto inline-flex items-center gap-1 text-[10px] text-muted-foreground/60">
                  <Lock size={10} /> Snart
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{profile?.first_name || "Bruker"}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-surface transition-colors mt-1"
        >
          <LogOut size={18} />
          Logg ut
        </button>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
