"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Camera,
  LayoutDashboard,
  ImageIcon,
  Users,
  ShoppingCart,
  CreditCard,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Upload,
  School,
  BoxesIcon,
  Trophy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function DashboardSidebar({
  profile,
}: {
  profile: Database["public"]["Tables"]["client_accounts"]["Row"];
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [expanded, setExpanded] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Check if we're on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      // On mobile, start with collapsed sidebar
      if (window.innerWidth < 768) {
        setExpanded(false);
      } else {
        setExpanded(true);
      }
    };

    // Initial check
    checkMobile();

    // Add event listener for window resize
    window.addEventListener("resize", checkMobile);

    // Cleanup
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const toggleSidebar = () => {
    setExpanded(!expanded);
  };

  const handleNavigation = (href: string) => {
    // If on mobile and sidebar is expanded, collapse it after navigation
    if (isMobile && expanded) {
      setExpanded(false);
    }
    router.push(href);
  };
  const navItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Schools",
      href: "/dashboard/schools",
      icon: School,
    },
    {
      title: "Classes",
      href: "/dashboard/classes",
      icon: BoxesIcon,
    },
    {
      title: "Events",
      href: "/dashboard/events",
      icon: Trophy,
    },
    {
      title: "Upload Photos",
      href: "/dashboard/upload",
      icon: Upload,
    },
    {
      title: "Class/Event Photos",
      href: "/dashboard/upload-class-photos",
      icon: Camera,
    },
    {
      title: "Galleries",
      href: "/dashboard/galleries",
      icon: ImageIcon,
    },
    {
      title: "Customers",
      href: "/dashboard/customers",
      icon: Users,
    },
    {
      title: "Orders",
      href: "/dashboard/orders",
      icon: ShoppingCart,
    },
    {
      title: "Payments",
      href: "/dashboard/payments",
      icon: CreditCard,
    },
    {
      title: "Settings",
      href: "/dashboard/settings",
      icon: Settings,
    },
    {
      title: "Help",
      href: "/dashboard/help",
      icon: HelpCircle,
    },
  ];

  return (
    <TooltipProvider delayDuration={0}>
      <div
        className={cn(
          "h-screen flex flex-col border-r bg-background transition-all duration-300",
          expanded ? "w-64" : "w-16"
        )}
      >
        <div
          className={cn(
            "flex h-16 items-center border-b px-4",
            expanded ? "justify-between" : "justify-center"
          )}
        >
          {expanded ? (
            <>
              <Link href="/dashboard" className="flex items-center gap-2">
                <Camera className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold">SchoolPrints</span>
              </Link>
              <Button variant="ghost" size="icon" onClick={toggleSidebar}>
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Collapse Sidebar</span>
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="icon" onClick={toggleSidebar}>
                <ChevronRight className="h-4 w-4" />
                <span className="sr-only">Expand Sidebar</span>
              </Button>
            </>
          )}
        </div>

        <div className="flex-1 overflow-auto py-4">
          <nav className="grid gap-1 px-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;

              return expanded ? (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.title}</span>
                </Link>
              ) : (
                <Tooltip key={item.href}>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => handleNavigation(item.href)}
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-lg transition-colors",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted"
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      <span className="sr-only">{item.title}</span>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="right">{item.title}</TooltipContent>
                </Tooltip>
              );
            })}
          </nav>
        </div>

        <div
          onClick={() => {
            router.push("/profile");
          }}
          className={cn(
            "cursor-pointer border-t p-4 bg-slate-50 hover:bg-slate-100",
            expanded ? "" : "flex justify-center"
          )}
        >
          {expanded ? (
            <div className="flex items-center gap-3 ">
              <Avatar className="h-9 w-9 bg-blue-500 text-white">
                <AvatarImage
                  src={profile.first_name?.[0] ?? "?"}
                  alt={profile.first_name?.[0] ?? "?"}
                />
                <AvatarFallback className="uppercase bg-blue-500 text-white">
                  {profile.first_name?.[0] ?? profile.email?.[0] ?? "?"}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">
                  {profile.first_name ?? profile.email ?? "Profile"}
                </p>
                <p className="text-xs text-muted-foreground">{profile.email}</p>
              </div>
            </div>
          ) : (
            <Tooltip>
              <TooltipTrigger asChild>
                <Avatar className="h-9 w-9 cursor-pointer bg-blue-500 text-white">
                  <AvatarImage
                    src="/placeholder.svg"
                    alt={`${profile.email}`}
                  />
                  <AvatarFallback className="uppercase bg-blue-500 text-white">
                    {profile.email?.[0] ?? "?"}
                  </AvatarFallback>
                </Avatar>
              </TooltipTrigger>
              <TooltipContent
                onClick={() => {
                  router.push("/profile");
                }}
                side="right"
              >
                {profile.first_name ?? profile.email ?? "Profile"}
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}
