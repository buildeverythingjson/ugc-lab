import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, PlusCircle, Video, CreditCard, Settings, ImagePlus, Lock } from "lucide-react";

const navItems = [
  { label: "Oversikt", icon: LayoutDashboard, path: "/dashboard" },
  { label: "Ny video", icon: PlusCircle, path: "/dashboard/new-video" },
  { label: "Bilde", icon: ImagePlus, path: "/dashboard/new-image", comingSoon: true },
  { label: "Videoer", icon: Video, path: "/dashboard/videos" },
  { label: "Innst.", icon: Settings, path: "/dashboard/settings" },
];

const DashboardMobileNav = () => {
  const location = useLocation();

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
              <div className="relative">
                <item.icon size={20} />
                {item.comingSoon && <Lock size={8} className="absolute -top-1 -right-2 text-muted-foreground/60" />}
              </div>
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default DashboardMobileNav;
