import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

async function getDashboardStats() {
  const [
    totalMatches,
    liveMatches,
    totalTeams,
    totalPlayers,
    totalArticles,
    totalUsers,
  ] = await Promise.all([
    prisma.match.count(),
    prisma.match.count({
      where: { status: { in: ["LIVE", "IN_PROGRESS"] } },
    }),
    prisma.team.count(),
    prisma.player.count(),
    prisma.article.count(),
    prisma.user.count(),
  ]);

  return {
    totalMatches,
    liveMatches,
    totalTeams,
    totalPlayers,
    totalArticles,
    totalUsers,
  };
}

async function getRecentMatches() {
  const matches = await prisma.match.findMany({
    include: {
      sport: true,
      homeTeam: true,
      awayTeam: true,
    },
    orderBy: { createdAt: "desc" },
    take: 5,
  });
  return matches;
}

async function getRecentArticles() {
  const articles = await prisma.article.findMany({
    include: {
      author: true,
      sport: true,
    },
    orderBy: { createdAt: "desc" },
    take: 5,
  });
  return articles;
}

export default async function AdminDashboard() {
  const [stats, recentMatches, recentArticles] = await Promise.all([
    getDashboardStats(),
    getRecentMatches(),
    getRecentArticles(),
  ]);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-slate-500">
              Total Matches
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalMatches}</div>
            <p className="text-sm text-green-600 mt-1">
              {stats.liveMatches} live now
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-slate-500">
              Total Teams
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalTeams}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-slate-500">
              Total Players
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalPlayers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-slate-500">
              Total Articles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalArticles}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-slate-500">
              Total Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalUsers}</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Matches */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Matches</CardTitle>
          </CardHeader>
          <CardContent>
            {recentMatches.length === 0 ? (
              <p className="text-slate-500">No matches yet</p>
            ) : (
              <div className="space-y-4">
                {recentMatches.map((match) => (
                  <div
                    key={match.id}
                    className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg"
                  >
                    <div>
                      <div className="font-medium">
                        {match.homeTeam?.name || "TBD"} vs{" "}
                        {match.awayTeam?.name || "TBD"}
                      </div>
                      <div className="text-sm text-slate-500">
                        {match.sport.name} • {match.status}
                      </div>
                    </div>
                    <div className="text-sm text-slate-500">
                      {new Date(match.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Articles */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Articles</CardTitle>
          </CardHeader>
          <CardContent>
            {recentArticles.length === 0 ? (
              <p className="text-slate-500">No articles yet</p>
            ) : (
              <div className="space-y-4">
                {recentArticles.map((article) => (
                  <div
                    key={article.id}
                    className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg"
                  >
                    <div>
                      <div className="font-medium line-clamp-1">
                        {article.title}
                      </div>
                      <div className="text-sm text-slate-500">
                        {article.sport?.name || "General"} • {article.status}
                      </div>
                    </div>
                    <div className="text-sm text-slate-500">
                      {new Date(article.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
