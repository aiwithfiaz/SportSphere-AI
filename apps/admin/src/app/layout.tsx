import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SportSphere AI - Admin Dashboard",
  description: "Admin dashboard for managing SportSphere AI",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <div className="flex h-screen bg-slate-100 dark:bg-slate-900">
          {/* Sidebar */}
          <aside className="w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700">
            <div className="p-6">
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                SportSphere AI
              </h1>
              <p className="text-sm text-slate-500">Admin Dashboard</p>
            </div>
            
            <nav className="px-4 space-y-2">
              <a
                href="/admin"
                className="block px-4 py-2 rounded-md text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                Dashboard
              </a>
              <a
                href="/admin/matches"
                className="block px-4 py-2 rounded-md text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                Matches
              </a>
              <a
                href="/admin/news"
                className="block px-4 py-2 rounded-md text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                News
              </a>
              <a
                href="/admin/teams"
                className="block px-4 py-2 rounded-md text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                Teams
              </a>
              <a
                href="/admin/players"
                className="block px-4 py-2 rounded-md text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                Players
              </a>
              <a
                href="/admin/users"
                className="block px-4 py-2 rounded-md text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                Users
              </a>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 overflow-auto">
            <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Dashboard
                </h2>
                <div className="flex items-center gap-4">
                  <a
                    href="/"
                    className="text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
                  >
                    View Site
                  </a>
                </div>
              </div>
            </header>
            
            <div className="p-6">{children}</div>
          </main>
        </div>
      </body>
    </html>
  );
}
