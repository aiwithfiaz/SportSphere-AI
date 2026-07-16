export const dynamic = 'force-dynamic';

import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { User, Mail, Calendar, Shield, Trophy, Target, Settings } from 'lucide-react';

export const metadata = {
  title: 'Profile | SportSphere AI',
};

export default async function ProfilePage() {
  const userCount = await prisma.user.count();
  const teamCount = await prisma.team.count();
  const playerCount = await prisma.player.count();
  const matchCount = await prisma.match.count();
  const articleCount = await prisma.article.count({ where: { status: 'PUBLISHED' } });
  const sportCount = await prisma.sport.count({ where: { isActive: true } });

  const recentMatches = await prisma.match.findMany({
    take: 5,
    orderBy: { scheduledAt: 'desc' },
    include: {
      homeTeam: { select: { name: true } },
      awayTeam: { select: { name: true } },
      sport: { select: { name: true } },
    },
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Profile</h1>
          <p className="text-muted-foreground">Your account and platform overview</p>
        </div>
        <Link href="/dashboard/settings">
          <Button variant="outline"><Settings className="h-4 w-4 mr-2" /> Settings</Button>
        </Link>
      </div>

      {/* Account Card */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" /> Account Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">admin@sportsphere.ai</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
              <Shield className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Role</p>
                <p className="font-medium">Administrator</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Member Since</p>
                <p className="font-medium">January 2026</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
              <Trophy className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge className="bg-green-500/10 text-green-700">Active</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Platform Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-blue-600">{sportCount}</p>
            <p className="text-sm text-muted-foreground">Sports</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-green-600">{teamCount}</p>
            <p className="text-sm text-muted-foreground">Teams</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-purple-600">{playerCount}</p>
            <p className="text-sm text-muted-foreground">Players</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-orange-600">{matchCount}</p>
            <p className="text-sm text-muted-foreground">Matches</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-red-600">{articleCount}</p>
            <p className="text-sm text-muted-foreground">Articles</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-cyan-600">{userCount}</p>
            <p className="text-sm text-muted-foreground">Users</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Matches */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Matches</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentMatches.map(match => (
              <Link key={match.id} href={`/matches/${match.id}`}>
                <div className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent transition-colors cursor-pointer">
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">{match.sport.name}</Badge>
                      <Badge variant={match.status === 'COMPLETED' ? 'secondary' : 'outline'}>{match.status}</Badge>
                    </div>
                    <p className="font-medium mt-1">{match.homeTeam?.name} vs {match.awayTeam?.name}</p>
                  </div>
                  <div className="text-right">
                    {match.homeScore != null && match.awayScore != null ? (
                      <p className="font-bold">{match.homeScore} - {match.awayScore}</p>
                    ) : (
                      <p className="text-sm text-muted-foreground">{new Date(match.scheduledAt).toLocaleDateString()}</p>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
