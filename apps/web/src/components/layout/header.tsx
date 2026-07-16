"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import {
  Menu, Trophy, Radio, Newspaper, Users, User, Brain,
  Shield, Star, Search, Bell, ChevronDown, Zap, Globe, BarChart3
} from "lucide-react";
import { MobileNav } from "@/components/layout/mobile-nav";

const sportsDropdown = [
  { name: "Cricket", href: "/matches?sport=cricket", icon: "🏏" },
  { name: "Football", href: "/matches?sport=football", icon: "⚽" },
  { name: "Basketball", href: "/matches?sport=basketball", icon: "🏀" },
  { name: "Baseball", href: "/matches?sport=baseball", icon: "⚾" },
  { name: "Hockey", href: "/matches?sport=hockey", icon: "🏒" },
  { name: "Tennis", href: "/matches?sport=tennis", icon: "🎾" },
];

const Header = React.forwardRef<HTMLElement, any>(
  ({ className, ...props }, ref) => {
    const [open, setOpen] = React.useState(false);
    const [sportsOpen, setSportsOpen] = React.useState(false);
    const [scrolled, setScrolled] = React.useState(false);
    const pathname = usePathname();

    React.useEffect(() => {
      const handleScroll = () => setScrolled(window.scrollY > 20);
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
      <header
        ref={ref}
        className={cn(
          "sticky top-0 z-50 w-full border-b transition-all duration-300",
          scrolled
            ? "bg-background/98 backdrop-blur-xl shadow-sm border-border/50"
            : "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
          className
        )}
        {...props}
      >
        {/* Top Bar */}
        <div className="hidden md:block border-b bg-muted/30">
          <div className="container flex h-8 items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <Radio className="h-3 w-3 text-red-500 animate-pulse" />
                Live Sports 24/7
              </span>
              <span>|</span>
              <span>AI-Powered Predictions</span>
              <span>|</span>
              <span>Real-Time Scores</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/premium" className="hover:text-foreground transition-colors">
                <Star className="h-3 w-3 inline mr-1" />
                Go Premium
              </Link>
              <Link href="/help" className="hover:text-foreground transition-colors">Help</Link>
            </div>
          </div>
        </div>

        {/* Main Header */}
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-6 md:gap-8">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="relative">
                <Trophy className="h-8 w-8 text-blue-600 group-hover:text-blue-700 transition-colors" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background animate-pulse" />
              </div>
              <div className="hidden sm:block">
                <span className="font-bold text-lg bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  SportSphere
                </span>
                <span className="text-[10px] block -mt-1 text-muted-foreground">AI-Powered Sports</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
              <Link
                href="/scores"
                className={cn(
                  "flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  pathname === "/scores" ? "bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300" : "text-muted-foreground hover:text-foreground hover:bg-accent"
                )}
              >
                <Radio className="h-3.5 w-3.5" />
                Live Scores
              </Link>

              {/* Sports Dropdown */}
              <div className="relative" onMouseLeave={() => setSportsOpen(false)}>
                <button
                  onMouseEnter={() => setSportsOpen(true)}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                    pathname === "/matches" ? "bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300" : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  )}
                >
                  <Trophy className="h-3.5 w-3.5" />
                  Sports
                  <ChevronDown className={cn("h-3 w-3 transition-transform", sportsOpen && "rotate-180")} />
                </button>
                {sportsOpen && (
                  <div className="absolute top-full left-0 w-56 bg-background border rounded-lg shadow-lg py-2 mt-1 animate-in fade-in slide-in-from-top-2">
                    {sportsDropdown.map((sport) => (
                      <Link
                        key={sport.name}
                        href={sport.href}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-accent transition-colors"
                      >
                        <span className="text-lg">{sport.icon}</span>
                        {sport.name}
                      </Link>
                    ))}
                    <div className="border-t mt-1 pt-1">
                      <Link href="/espn" className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-accent transition-colors">
                        <Globe className="h-4 w-4 text-blue-500" />
                        ESPN Live Scores
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              <Link
                href="/news"
                className={cn(
                  "flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  pathname === "/news" ? "bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300" : "text-muted-foreground hover:text-foreground hover:bg-accent"
                )}
              >
                <Newspaper className="h-3.5 w-3.5" />
                News
              </Link>

              <Link
                href="/predictions"
                className={cn(
                  "flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  pathname === "/predictions" ? "bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300" : "text-muted-foreground hover:text-foreground hover:bg-accent"
                )}
              >
                <Brain className="h-3.5 w-3.5" />
                AI Predict
              </Link>

              <Link
                href="/fantasy"
                className={cn(
                  "flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  pathname === "/fantasy" ? "bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300" : "text-muted-foreground hover:text-foreground hover:bg-accent"
                )}
              >
                <Zap className="h-3.5 w-3.5" />
                Fantasy
              </Link>

              <Link
                href="/rankings"
                className={cn(
                  "flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  pathname === "/rankings" ? "bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300" : "text-muted-foreground hover:text-foreground hover:bg-accent"
                )}
              >
                <BarChart3 className="h-3.5 w-3.5" />
                Rankings
              </Link>
            </nav>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-2">
              <Button variant="ghost" size="icon" className="h-9 w-9" asChild>
                <Link href="/notifications">
                  <Bell className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9" asChild>
                <Link href="/search">
                  <Search className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="ghost" asChild className="text-sm">
                <Link href="/login">Log in</Link>
              </Button>
              <Button asChild className="bg-blue-600 hover:bg-blue-700 text-sm">
                <Link href="/register">Get Started Free</Link>
              </Button>
            </div>

            {/* Mobile Menu */}
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" className="md:hidden h-9 w-9 p-0">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="pr-0 w-[300px]">
                <MobileNav onNavigate={() => setOpen(false)} />
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
    );
  }
);
Header.displayName = "Header";

export { Header };
