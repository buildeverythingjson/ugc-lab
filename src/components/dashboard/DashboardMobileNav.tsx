import { Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, PlusCircle, Video, CreditCard, Settings, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const navItems = [
  { label: "Oversikt", icon: LayoutDashboard, path: "/dashboard" },
  { label: "Ny video", icon: PlusCircle, path: "/dashboard/new-video" },
  { label: "Videoer", icon: Video, path: "/dashboard/videos" },
  { label: "Abonnement", icon: CreditCard, path: "/dashboard/subscription" },
  { label: "Innst.", icon: Settings, path: "/dashboard/settings" },
];

const DashboardMobileNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 backdrop-blur-xl">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-1 text-xs font-medium transition-colors ${
                active ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <item.icon size={20} />
              {item.label}
            </Link>
          );
        })}
        <button
          onClick={handleLogout}
          className="flex flex-col items-center gap-1 text-xs font-medium text-muted-foreground transition-colors"
        >
          <LogOut size={20} />
          Logg ut
        </button>
      </div>
    </nav>
  );
};

export default DashboardMobileNav;
