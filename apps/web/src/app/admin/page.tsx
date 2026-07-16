export const dynamic = 'force-dynamic';

import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import {
  Users,
  Trophy,
  TrendingUp,
  Newspaper,
  Activity,
  Calendar,
  AlertCircle,
  CheckCircle,
  Zap,
  Eye,
  UserPlus,
  Radio,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const metadata = {
  title: 'Admin Dashboard | SportSphere AI',
};

export default async function AdminDashboard() {
  const [
    totalUsers,
    totalTeams,
    totalPlayers,
    totalMatches,
    liveMatches,
    completedMatches,
    scheduledMatches,
    totalArticles,
    publishedArticles,
    totalSports,
    totalTournaments,
    totalVenues,
    totalSubscribers,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.team.count(),
    prisma.player.count(),
    prisma.match.count(),
    prisma.match.count({ where: { status: 'LIVE' } }),
    prisma.match.count({ where: { status: 'COMPLETED' } }),
    prisma.match.count({ where: { status: 'SCHEDULED' } }),
    prisma.article.count(),
    prisma.article.count({ where: { status: 'PUBLISHED' } }),
    prisma.sport.count({ where: { isActive: true } }),
    prisma.tournament.count(),
    prisma.venue.count(),
    prisma.newsletterSubscriber.count(),
  ]);

  const recentUsers = await prisma.user.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    select: { id: true, displayName: true, email: true, createdAt: true, role: true },
  });

  const liveMatchDetails = await prisma.match.findMany({
    where: { status: 'LIVE' },
    take: 5,
    include: {
      homeTeam: { select: { name: true, shortName: true } },
      awayTeam: { select: { name: true, shortName: true } },
      sport: { select: { name: true } },
      liveScore: true,
    },
  });

  const upcomingMatches = await prisma.match.findMany({
    where: { status: 'SCHEDULED' },
    take: 5,
    orderBy: { scheduledAt: 'asc' },
    include: {
      homeTeam: { select: { name: true } },
      awayTeam: { select: { name: true } },
      sport: { select: { name: true } },
    },
  });

  const recentArticles = await prisma.article.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    select: { id: true, title: true, status: true, createdAt: true, slug: true },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Platform overview and key metrics</p>
        </div>
        <Badge variant="outline" className="text-green-600">
          <CheckCircle className="h-4 w-4 mr-2" />
          All Systems Operational
        </Badge>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{totalUsers}</p>
                <p className="text-xs text-muted-foreground">Users</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Radio className="h-8 w-8 text-red-500" />
              <div>
                <p className="text-2xl font-bold">{liveMatches}</p>
                <p className="text-xs text-muted-foreground">Live Now</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Trophy className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{totalMatches}</p>
                <p className="text-xs text-muted-foreground">Matches</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Newspaper className="h-8 w-8 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">{publishedArticles}/{totalArticles}</p>
                <p className="text-xs text-muted-foreground">Articles</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-emerald-500" />
              <div>
                <p className="text-2xl font-bold">{totalTeams}</p>
                <p className="text-xs text-muted-foreground">Teams</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Activity className="h-8 w-8 text-orange-500" />
              <div>
                <p className="text-2xl font-bold">{totalPlayers}</p>
                <p className="text-xs text-muted-foreground">Players</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <UserPlus className="h-8 w-8 text-cyan-500" />
              <div>
                <p className="text-2xl font-bold">{totalSubscribers}</p>
                <p className="text-xs text-muted-foreground">Subscribers</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-xl font-bold">{totalSports}</p>
            <p className="text-xs text-muted-foreground">Sports</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-xl font-bold">{totalTournaments}</p>
            <p className="text-xs text-muted-foreground">Tournaments</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-xl font-bold">{totalVenues}</p>
            <p className="text-xs text-muted-foreground">Venues</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-xl font-bold">{scheduledMatches}</p>
            <p className="text-xs text-muted-foreground">Scheduled</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-xl font-bold">{completedMatches}</p>
            <p className="text-xs text-muted-foreground">Completed</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Live Matches */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-red-500" />
              Live Matches ({liveMatches})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {liveMatchDetails.length === 0 ? (
              <p className="text-muted-foreground text-center py-6">No live matches</p>
            ) : (
              <div className="space-y-3">
                {liveMatchDetails.map((match) => (
                  <div key={match.id} className="flex items-center justify-between p-3 rounded-lg border border-red-200 bg-red-50/50 dark:bg-red-950/20">
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">{match.sport.name}</Badge>
                        <Badge className="bg-red-500 text-xs">LIVE</Badge>
                      </div>
                      <p className="font-medium mt-1">
                        {match.homeTeam?.name} vs {match.awayTeam?.name}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">
                        {match.homeScore ?? 0} - {match.awayScore ?? 0}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Matches */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-500" />
              Upcoming Matches
            </CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingMatches.length === 0 ? (
              <p className="text-muted-foreground text-center py-6">No upcoming matches</p>
            ) : (
              <div className="space-y-3">
                {upcomingMatches.map((match) => (
                  <div key={match.id} className="flex items-center justify-between p-3 rounded-lg border">
                    <div>
                      <Badge variant="outline" className="text-xs">{match.sport.name}</Badge>
                      <p className="font-medium mt-1">
                        {match.homeTeam?.name} vs {match.awayTeam?.name}
                      </p>
                    </div>
                    <div className="text-right text-sm text-muted-foreground">
                      {new Date(match.scheduledAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Users */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-green-500" />
              Recent Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <p className="font-medium">{user.displayName || user.email}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant={user.role === 'ADMIN' ? 'default' : 'secondary'}>
                      {user.role}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Articles */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Newspaper className="h-5 w-5 text-purple-500" />
              Recent Articles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentArticles.map((article) => (
                <div key={article.id} className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <p className="font-medium">{article.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(article.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant={article.status === 'PUBLISHED' ? 'default' : 'secondary'}>
                    {article.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
