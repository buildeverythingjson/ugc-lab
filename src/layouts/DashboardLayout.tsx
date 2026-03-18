import { Outlet } from "react-router-dom";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardMobileNav from "@/components/dashboard/DashboardMobileNav";

const DashboardLayout = () => {
  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar />
      <main className="flex-1 pb-20 lg:pb-0">
        <div className="p-4 sm:p-6 md:p-8 max-w-5xl mx-auto">
          <Outlet />
        </div>
      </main>
      <DashboardMobileNav />
    </div>
  );
};

export default DashboardLayout;
