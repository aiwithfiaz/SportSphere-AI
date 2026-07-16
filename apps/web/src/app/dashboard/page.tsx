export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import {
  Trophy,
  Target,
  Star,
  Calendar,
  Settings,
  TrendingUp,
  Clock,
  Newspaper,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const metadata = {
  title: 'Dashboard | SportSphere AI',
  description: 'Your personal sports dashboard with predictions and stats.',
};

export default async function DashboardPage() {
  const liveMatches = await prisma.match.findMany({
    where: { status: 'LIVE' },
    take: 5,
    include: {
      homeTeam: { select: { name: true } },
      awayTeam: { select: { name: true } },
      sport: { select: { name: true } },
      liveScore: true,
    },
    orderBy: { scheduledAt: 'desc' },
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
    where: { status: 'PUBLISHED' },
    take: 5,
    orderBy: { publishedAt: 'desc' },
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      publishedAt: true,
      categories: { select: { name: true }, take: 1 },
    },
  });

  const predictions = await prisma.prediction.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: {
      sport: { select: { name: true } },
      match: {
        select: { homeTeam: { select: { name: true } }, awayTeam: { select: { name: true } } },
      },
    },
  });

  const totalUsers = await prisma.user.count();
  const totalMatches = await prisma.match.count({ where: { status: 'COMPLETED' } });
  const totalArticles = await prisma.article.count({ where: { status: 'PUBLISHED' } });
  const totalTeams = await prisma.team.count();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here&apos;s your sports overview.</p>
        </div>
        <Link href="/dashboard/settings">
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Live Matches</p>
                <p className="text-3xl font-bold text-red-500">{liveMatches.length}</p>
              </div>
              <Zap className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Upcoming</p>
                <p className="text-3xl font-bold text-blue-500">{upcomingMatches.length}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Articles</p>
                <p className="text-3xl font-bold text-purple-500">{totalArticles}</p>
              </div>
              <Newspaper className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Teams</p>
                <p className="text-3xl font-bold text-green-500">{totalTeams}</p>
              </div>
              <Trophy className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Live Matches */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-red-500" />
              Live Now
            </CardTitle>
          </CardHeader>
          <CardContent>
            {liveMatches.length === 0 ? (
              <p className="text-muted-foreground text-center py-6">No live matches right now</p>
            ) : (
              <div className="space-y-3">
                {liveMatches.map((match) => (
                  <Link key={match.id} href={`/matches/${match.id}`}>
                    <div className="flex items-center justify-between p-3 rounded-lg border border-red-200 bg-red-50/50 dark:bg-red-950/20 hover:shadow-md transition-shadow cursor-pointer">
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
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Matches */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-500" />
              Upcoming Matches
            </CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingMatches.length === 0 ? (
              <p className="text-muted-foreground text-center py-6">No upcoming matches</p>
            ) : (
              <div className="space-y-3">
                {upcomingMatches.map((match) => (
                  <Link key={match.id} href={`/matches/${match.id}`}>
                    <div className="flex items-center justify-between p-3 rounded-lg border hover:shadow-md transition-shadow cursor-pointer">
                      <div>
                        <Badge variant="outline" className="text-xs">{match.sport.name}</Badge>
                        <p className="font-medium mt-1">
                          {match.homeTeam?.name} vs {match.awayTeam?.name}
                        </p>
                      </div>
                      <div className="text-right text-sm text-muted-foreground">
                        {new Date(match.scheduledAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Latest Predictions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-purple-500" />
              Latest Predictions
            </CardTitle>
          </CardHeader>
          <CardContent>
            {predictions.length === 0 ? (
              <p className="text-muted-foreground text-center py-6">No predictions yet</p>
            ) : (
              <div className="space-y-3">
                {predictions.map((pred) => (
                  <div key={pred.id} className="p-3 rounded-lg border">
                    <div className="flex items-center gap-2 mb-1">
                      {pred.sport && <Badge variant="outline" className="text-xs">{pred.sport.name}</Badge>}
                      {pred.confidence != null && (
                        <Badge className="text-xs">{(pred.confidence * 100).toFixed(0)}% confidence</Badge>
                      )}
                    </div>
                    <p className="font-medium text-sm">{pred.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{pred.prediction}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Latest News */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Newspaper className="h-5 w-5 text-green-500" />
              Latest News
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentArticles.length === 0 ? (
              <p className="text-muted-foreground text-center py-6">No articles published yet</p>
            ) : (
              <div className="space-y-3">
                {recentArticles.map((article) => (
                  <Link key={article.id} href={`/news/${article.slug}`}>
                    <div className="p-3 rounded-lg border hover:shadow-md transition-shadow cursor-pointer">
                      <p className="font-medium text-sm">{article.title}</p>
                      {article.excerpt && (
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{article.excerpt}</p>
                      )}
                      <div className="flex items-center gap-2 mt-2">
                        {article.categories.length > 0 && (
                          <Badge variant="secondary" className="text-xs">{article.categories[0].name}</Badge>
                        )}
                        {article.publishedAt && (
                          <span className="text-xs text-muted-foreground">
                            {new Date(article.publishedAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
