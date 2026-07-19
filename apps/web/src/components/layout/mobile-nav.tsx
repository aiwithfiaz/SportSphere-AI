"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Trophy, Radio, Newspaper, Users, User, Settings, Bell, Shield, LogIn, UserPlus, Globe, Wrench, Video, Search, Calculator, Swords } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export interface MobileNavProps extends React.HTMLAttributes<HTMLDivElement> {
  onNavigate?: () => void;
}

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

const mainNavItems: NavItem[] = [
  { title: "Live Scores", href: "/scores", icon: Radio, badge: "LIVE" },
  { title: "ESPN Scores", href: "/espn", icon: Globe, badge: "ESPN" },
  { title: "Cricbuzz", href: "/cricbuzz", icon: Globe, badge: "CRIC" },
  { title: "Matches", href: "/matches", icon: Trophy },
  { title: "News", href: "/news", icon: Newspaper },
  { title: "Videos", href: "/videos", icon: Video },
  { title: "Teams", href: "/teams", icon: Users },
  { title: "Players", href: "/players", icon: User },
  { title: "AI Tools", href: "/tools", icon: Wrench, badge: "AI" },
  { title: "H2H Compare", href: "/tools/h2h", icon: Swords },
  { title: "Calculator", href: "/tools/calculator", icon: Calculator },
  { title: "Predictions", href: "/predictions", icon: Settings },
  { title: "Premium", href: "/premium", icon: Trophy },
];

const secondaryNavItems: NavItem[] = [
  { title: "Dashboard", href: "/dashboard", icon: Settings },
  { title: "Notifications", href: "/notifications", icon: Bell },
  { title: "Admin Panel", href: "/admin", icon: Shield },
];

const MobileNav = React.forwardRef<HTMLDivElement, MobileNavProps>(
  ({ className, onNavigate, ...props }, ref) => {
    const pathname = usePathname();

    return (
      <div
        ref={ref}
        className={cn("flex flex-col space-y-4", className)}
        {...props}
      >
        <Link
          href="/"
          className="flex items-center space-x-2"
          onClick={onNavigate}
        >
          <Trophy className="h-6 w-6 text-blue-600" />
          <span className="font-bold text-lg">SportSphere AI</span>
        </Link>
        <Separator />

        {/* Main Navigation */}
        <nav className="flex flex-col space-y-1" aria-label="Main navigation">
          {mainNavItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
                aria-current={isActive ? "page" : undefined}
                onClick={onNavigate}
              >
                <item.icon className="h-4 w-4" />
                {item.title}
                {item.badge && (
                  <span className="ml-auto text-[10px] bg-red-500 text-white px-1.5 py-0.5 rounded-full font-bold animate-pulse">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <Separator />

        {/* Secondary Navigation */}
        <nav className="flex flex-col space-y-1" aria-label="Account navigation">
          {secondaryNavItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
                onClick={onNavigate}
              >
                <item.icon className="h-4 w-4" />
                {item.title}
              </Link>
            );
          })}
        </nav>

        <Separator />

        {/* Auth Buttons */}
        <div className="flex items-center gap-2 mt-2">
          <ThemeToggle />
          <Button variant="ghost" asChild className="justify-start gap-2 flex-1">
            <Link href="/login" onClick={onNavigate}>
              <LogIn className="h-4 w-4" />
              Log in
            </Link>
          </Button>
          <Button asChild className="gap-2 flex-1">
            <Link href="/register" onClick={onNavigate}>
              <UserPlus className="h-4 w-4" />
              Sign up
            </Link>
          </Button>
        </div>
      </div>
    );
  }
);
MobileNav.displayName = "MobileNav";

export { MobileNav };
