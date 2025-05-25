import type React from "react";
import { DashboardSidebar } from "./_components/sidebar";
import { MobileSidebarToggle } from "./_components/mobile-sidebar-toggle";
import { getCurrentProfile } from "@/utils/queries/users";
import { ScrollArea } from "@/components/ui/scroll-area";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // only the users whose role is photographer_admin on the client_accounts table can access the dashboard

  const profile = await getCurrentProfile();

  if (!profile || profile.app_role !== "photographer_admin") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/30">
        <h1 className="text-2xl font-bold">
          You are not allowed to access this page
        </h1>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-muted/30">
      {/* Hide sidebar on small screens */}
      <div className="hidden md:block">
        <DashboardSidebar profile={profile} />
      </div>

      {/* Mobile sidebar toggle */}
      <MobileSidebarToggle profile={profile} />

      <main className="flex-1 overflow-auto">
        <div className="container h-[100dvh] py-8 px-4 md:px-8">{children}</div>
      </main>
    </div>
  );
}
