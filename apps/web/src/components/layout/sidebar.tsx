"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Trophy,
  LayoutDashboard,
  Calendar,
  Brain,
  BarChart3,
  Settings,
  HelpCircle,
} from "lucide-react";

export interface SidebarProps extends React.HTMLAttributes<HTMLElement> {}

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Matches",
    href: "/matches",
    icon: Calendar,
  },
  {
    title: "Predictions",
    href: "/predictions",
    icon: Brain,
  },
  {
    title: "Leaderboard",
    href: "/leaderboard",
    icon: BarChart3,
  },
];

const secondaryNavItems: NavItem[] = [
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
  {
    title: "Help",
    href: "/help",
    icon: HelpCircle,
  },
];

const Sidebar = React.forwardRef<HTMLElement, SidebarProps>(
  ({ className, ...props }, ref) => {
    const pathname = usePathname();

    return (
      <aside
        ref={ref}
        className={cn(
          "hidden h-screen w-64 border-r bg-sidebar lg:block",
          className
        )}
        aria-label="Sidebar navigation"
        {...props}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center gap-2 px-6 py-4">
            <Trophy className="h-6 w-6 text-sportsphere-500" />
            <span className="font-bold">SportSphere</span>
          </div>
          <Separator />
          <ScrollArea className="flex-1 px-3 py-4">
            <nav className="space-y-1" aria-label="Main navigation">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    )}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.title}
                  </Link>
                );
              })}
            </nav>
            <Separator className="my-4" />
            <nav className="space-y-1" aria-label="Secondary navigation">
              {secondaryNavItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    )}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.title}
                  </Link>
                );
              })}
            </nav>
          </ScrollArea>
          <Separator />
          <div className="p-4">
            <div className="rounded-lg bg-sidebar-accent p-4">
              <h4 className="text-sm font-medium">Upgrade to Pro</h4>
              <p className="mt-1 text-xs text-muted-foreground">
                Get unlimited predictions and real-time alerts.
              </p>
              <Button size="sm" className="mt-3 w-full">
                Upgrade
              </Button>
            </div>
          </div>
        </div>
      </aside>
    );
  }
);
Sidebar.displayName = "Sidebar";

export { Sidebar };
