"use client";

import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useState } from "react";
import { DashboardSidebar } from "./sidebar";
import { Sheet, SheetContent } from "@/components/ui/sheet";

export function MobileSidebarToggle({
  profile,
}: {
  profile: Database["public"]["Tables"]["client_accounts"]["Row"];
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className="md:hidden fixed top-4 left-4 z-50"
        onClick={() => setOpen(true)}
      >
        <Menu className="h-4 w-4" />
        <span className="sr-only">Open Menu</span>
      </Button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="p-0 w-[240px]">
          <DashboardSidebar profile={profile} />
        </SheetContent>
      </Sheet>
    </>
  );
}
