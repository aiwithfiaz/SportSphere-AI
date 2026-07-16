export const dynamic = 'force-dynamic';

import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Link from 'next/link';
import { ArrowLeft, Calendar, TrendingUp, Award, Target, Zap, Users, BarChart3 } from 'lucide-react';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const player = await prisma.player.findFirst({
    where: { slug },
    select: { firstName: true, lastName: true, sport: { select: { name: true } } },
  });
  if (!player) return { title: 'Player Not Found' };
  return {
    title: `${player.firstName} ${player.lastName || ''} | ${player.sport.name} Player`,
    description: `Player profile for ${player.firstName} ${player.lastName || ''} in ${player.sport.name}`,
  };
}

export default async function PlayerDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const player = await prisma.player.findFirst({
    where: { slug },
    include: {
      sport: true,
      team: true,
      matchPlayers: {
        include: {
          match: {
            include: {
              homeTeam: true,
              awayTeam: true,
              sport: true,
              tournament: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!player) notFound();

  const matchAppearances = player.matchPlayers.length;
  
  // Calculate career stats from match appearances
  const careerStats = {
    totalMatches: matchAppearances,
    completedMatches: player.matchPlayers.filter(mp => mp.match.status === 'COMPLETED').length,
    liveMatches: player.matchPlayers.filter(mp => mp.match.status === 'LIVE' || mp.match.status === 'IN_PROGRESS').length,
    captainCount: player.matchPlayers.filter(mp => mp.isCaptain).length,
    keeperCount: player.matchPlayers.filter(mp => mp.isKeeper).length,
    playingCount: player.matchPlayers.filter(mp => mp.isPlaying).length,
  };

  // Get recent 10 matches
  const recentMatches = player.matchPlayers.slice(0, 10);
  
  // Get matches by tournament
  const matchesByTournament = player.matchPlayers.reduce((acc, mp) => {
    const tournamentName = mp.match.tournament?.name || 'Other';
    acc[tournamentName] = (acc[tournamentName] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Link href="/players" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4 mr-1" /> Back to Players
      </Link>

      {/* Header */}
      <div className="flex items-start gap-6 mb-8">
        <div className="relative">
          <div className="w-32 h-32 bg-muted rounded-full flex items-center justify-center overflow-hidden">
            {player.avatar ? (
              <img src={player.avatar} alt={player.firstName} className="w-32 h-32 rounded-full object-cover" />
            ) : (
              <span className="text-4xl font-bold">{player.firstName[0]}{player.lastName?.[0] || ''}</span>
            )}
          </div>
          {player.team && (
            <div className="absolute -bottom-2 -right-2 bg-background border rounded-full px-2 py-1 text-xs font-medium">
              {player.team.shortName || player.team.name}
            </div>
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <Badge variant="outline">{player.sport.name}</Badge>
            {player.team && <Badge variant="secondary">{player.team.name}</Badge>}
            {player.role && <Badge>{player.role}</Badge>}
          </div>
          <h1 className="text-4xl font-bold">
            {player.firstName} {player.lastName}
          </h1>
          {player.role && <p className="text-lg text-muted-foreground">{player.role}</p>}
          <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground flex-wrap">
            {player.nationality && <span>{player.nationality}</span>}
            {player.dateOfBirth && (
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {new Date(player.dateOfBirth).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Career Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-blue-600">{careerStats.totalMatches}</p>
            <p className="text-sm text-muted-foreground">Total Matches</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-green-600">{careerStats.completedMatches}</p>
            <p className="text-sm text-muted-foreground">Completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-yellow-600">{careerStats.captainCount}</p>
            <p className="text-sm text-muted-foreground">Captain</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-purple-600">{careerStats.keeperCount}</p>
            <p className="text-sm text-muted-foreground">Wicketkeeper</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-orange-600">{careerStats.playingCount}</p>
            <p className="text-sm text-muted-foreground">Playing XI</p>
          </CardContent>
        </Card>
      </div>

      {/* Style Info */}
      {(player.battingStyle || player.bowlingStyle) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {player.battingStyle && (
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <Target className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Batting Style</p>
                  <p className="font-semibold text-lg">{player.battingStyle}</p>
                </div>
              </CardContent>
            </Card>
          )}
          {player.bowlingStyle && (
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <Zap className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Bowling Style</p>
                  <p className="font-semibold text-lg">{player.bowlingStyle}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="matches">Match History</TabsTrigger>
          <TabsTrigger value="stats">Career Stats</TabsTrigger>
          <TabsTrigger value="bio">Biography</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Tournament Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Matches by Tournament
                </CardTitle>
              </CardHeader>
              <CardContent>
                {Object.keys(matchesByTournament).length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">No tournament data</p>
                ) : (
                  <div className="space-y-3">
                    {Object.entries(matchesByTournament)
                      .sort(([, a], [, b]) => b - a)
                      .map(([tournament, count]) => (
                        <div key={tournament} className="flex items-center justify-between">
                          <span className="text-sm font-medium">{tournament}</span>
                          <Badge variant="secondary">{count} matches</Badge>
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Recent Form
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {recentMatches.slice(0, 10).map((mp) => {
                    const match = mp.match;
                    const isHome = match.homeTeamId === player.teamId;
                    const isCompleted = match.status === 'COMPLETED';
                    const isLive = match.status === 'LIVE' || match.status === 'IN_PROGRESS';
                    const opponent = isHome ? match.awayTeam?.name : match.homeTeam?.name;
                    
                    return (
                      <div
                        key={mp.id}
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                          isCompleted ? 'bg-green-500 text-white' : 
                          isLive ? 'bg-red-500 text-white animate-pulse' :
                          'bg-gray-200 text-gray-600'
                        }`}
                        title={`${isCompleted ? 'Completed' : isLive ? 'Live' : 'Scheduled'} vs ${opponent}`}
                      >
                        {isCompleted ? '✓' : isLive ? 'L' : 'S'}
                      </div>
                    );
                  })}
                </div>
                <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded-full bg-green-500" /> Completed
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded-full bg-red-500" /> Live
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded-full bg-gray-200" /> Draw
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="matches" className="mt-4">
          {player.matchPlayers.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                No match appearances yet.
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Match</TableHead>
                      <TableHead>Tournament</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Result</TableHead>
                      <TableHead>Role</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {player.matchPlayers.map((mp) => {
                      const match = mp.match;
                      const isHome = match.homeTeamId === player.teamId;
                      const opponent = isHome ? match.awayTeam?.name : match.homeTeam?.name;
                      return (
                        <TableRow key={mp.id}>
                          <TableCell>
                            <Link href={`/matches/${match.id}`} className="font-medium hover:underline">
                              {isHome ? 'vs' : '@'} {opponent}
                            </Link>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {match.tournament?.name || '-'}
                          </TableCell>
                          <TableCell>
                            {new Date(match.scheduledAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Badge variant={match.status === 'COMPLETED' ? 'default' : 'outline'}>
                              {match.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              {mp.isCaptain && <Badge className="bg-yellow-500">C</Badge>}
                              {mp.isKeeper && <Badge className="bg-purple-500">WK</Badge>}
                              {mp.isPlaying && <Badge variant="outline">Playing</Badge>}
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="stats" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Career Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-3xl font-bold">{careerStats.totalMatches}</p>
                  <p className="text-sm text-muted-foreground">Total Matches</p>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-3xl font-bold text-green-600">{careerStats.completedMatches}</p>
                  <p className="text-sm text-muted-foreground">Completed</p>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-3xl font-bold text-yellow-600">{careerStats.captainCount}</p>
                  <p className="text-sm text-muted-foreground">Matches as Captain</p>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-3xl font-bold text-purple-600">{careerStats.keeperCount}</p>
                  <p className="text-sm text-muted-foreground">Matches as Keeper</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bio" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>About {player.firstName}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mt-6 grid gap-6 md:grid-cols-2">
                {player.nationality && (
                  <div>
                    <p className="text-sm text-muted-foreground">Nationality</p>
                    <p className="font-medium">{player.nationality}</p>
                  </div>
                )}
                {player.battingStyle && (
                  <div>
                    <p className="text-sm text-muted-foreground">Batting Style</p>
                    <p className="font-medium">{player.battingStyle}</p>
                  </div>
                )}
                {player.bowlingStyle && (
                  <div>
                    <p className="text-sm text-muted-foreground">Bowling Style</p>
                    <p className="font-medium">{player.bowlingStyle}</p>
                  </div>
                )}
                {player.role && (
                  <div>
                    <p className="text-sm text-muted-foreground">Role</p>
                    <p className="font-medium">{player.role}</p>
                  </div>
                )}
                {player.team && (
                  <div>
                    <p className="text-sm text-muted-foreground">Current Team</p>
                    <Link href={`/teams/${player.team.slug}`} className="font-medium hover:underline">
                      {player.team.name}
                    </Link>
                  </div>
                )}
                <div>
                  <p className="text-sm text-muted-foreground">Sport</p>
                  <Link href={`/leagues?sport=${player.sport.slug}`} className="font-medium hover:underline">
                    {player.sport.name}
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
