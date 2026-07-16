import { Metadata } from "next";
import {
  LayoutDashboard,
  Users,
  Trophy,
  Newspaper,
  Settings,
  BarChart3,
  CreditCard,
  Bell,
  Shield,
  Building2,
  Brain,
  Swords,
  Radio,
} from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Admin | SportSphere AI",
};

const adminModules = [
  {
    title: "Dashboard",
    description: "Overview of platform metrics and activity",
    icon: LayoutDashboard,
    href: "/admin",
    color: "text-blue-600",
  },
  {
    title: "User Management",
    description: "Manage users, roles, and permissions",
    icon: Users,
    href: "/admin/users",
    color: "text-green-600",
  },
  {
    title: "Sports",
    description: "Manage sports categories and configurations",
    icon: Trophy,
    href: "/admin/sports",
    color: "text-emerald-600",
  },
  {
    title: "Tournaments",
    description: "Manage leagues, cups, and tournaments",
    icon: Trophy,
    href: "/admin/tournaments",
    color: "text-teal-600",
  },
  {
    title: "Matches",
    description: "Create and manage matches and events",
    icon: Trophy,
    href: "/admin/matches",
    color: "text-yellow-600",
  },
  {
    title: "Live Scores",
    description: "Update and broadcast live match scores",
    icon: Radio,
    href: "/admin/live-scores",
    color: "text-red-600",
  },
  {
    title: "Content",
    description: "Manage articles, news, and media",
    icon: Newspaper,
    href: "/admin/content",
    color: "text-purple-600",
  },
  {
    title: "Analytics",
    description: "View detailed analytics and reports",
    icon: BarChart3,
    href: "/admin/analytics",
    color: "text-indigo-600",
  },
  {
    title: "Venues",
    description: "Manage stadiums and grounds",
    icon: Building2,
    href: "/admin/venues",
    color: "text-cyan-600",
  },
  {
    title: "Predictions",
    description: "AI predictions analytics",
    icon: Brain,
    href: "/admin/predictions",
    color: "text-violet-600",
  },
  {
    title: "Head-to-Head",
    description: "Team comparison analysis",
    icon: Swords,
    href: "/admin/h2h",
    color: "text-rose-600",
  },
  {
    title: "Subscriptions",
    description: "Manage premium plans and billing",
    icon: CreditCard,
    href: "/admin/subscriptions",
    color: "text-pink-600",
  },
  {
    title: "Notifications",
    description: "Configure notification settings",
    icon: Bell,
    href: "/admin/notifications",
    color: "text-orange-600",
  },
  {
    title: "Settings",
    description: "Platform configuration and settings",
    icon: Settings,
    href: "/admin/settings",
    color: "text-gray-600",
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Admin Panel
              </CardTitle>
            </CardHeader>
            <CardContent>
              <nav className="space-y-2">
                {adminModules.map((module) => (
                  <Link
                    key={module.href}
                    href={module.href}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <module.icon className={`h-5 w-5 ${module.color}`} />
                    <span className="text-sm font-medium">{module.title}</span>
                  </Link>
                ))}
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">{children}</div>
      </div>
    </div>
  );
}
