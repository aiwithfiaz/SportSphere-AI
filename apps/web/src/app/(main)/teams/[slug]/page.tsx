export const dynamic = 'force-dynamic';

import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';
import { MapPin, Calendar, Users, Trophy, ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const team = await prisma.team.findFirst({
    where: { slug },
    select: { name: true, sport: { select: { name: true } } },
  });
  if (!team) return { title: 'Team Not Found' };
  return {
    title: `${team.name} | ${team.sport.name} Team`,
    description: `Team profile for ${team.name} in ${team.sport.name}`,
  };
}

export default async function TeamDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const team = await prisma.team.findFirst({
    where: { slug },
    include: {
      sport: true,
      players: {
        orderBy: { firstName: 'asc' },
      },
      homeMatches: {
        include: {
          homeTeam: true,
          awayTeam: true,
          sport: true,
          tournament: true,
        },
        orderBy: { scheduledAt: 'desc' },
        take: 10,
      },
      awayMatches: {
        include: {
          homeTeam: true,
          awayTeam: true,
          sport: true,
          tournament: true,
        },
        orderBy: { scheduledAt: 'desc' },
        take: 10,
      },
    },
  });

  if (!team) notFound();

  const allMatches = [...team.homeMatches, ...team.awayMatches]
    .sort((a, b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime())
    .slice(0, 10);

  const completedMatches = allMatches.filter((m) => m.status === 'COMPLETED');
  const wins = completedMatches.filter((m) => {
    if (m.homeTeamId === team.id) return m.homeScore != null && m.awayScore != null && m.homeScore > m.awayScore;
    return m.homeScore != null && m.awayScore != null && m.awayScore > m.homeScore;
  }).length;
  const losses = completedMatches.filter((m) => {
    if (m.homeTeamId === team.id) return m.homeScore != null && m.awayScore != null && m.homeScore < m.awayScore;
    return m.homeScore != null && m.awayScore != null && m.awayScore < m.homeScore;
  }).length;
  const draws = completedMatches.length - wins - losses;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Link href="/teams" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4 mr-1" /> Back to Teams
      </Link>

      {/* Header */}
      <div className="flex items-start gap-6 mb-8">
        {team.logo && (
          <div className="w-24 h-24 bg-muted rounded-xl flex items-center justify-center overflow-hidden">
            <img src={team.logo} alt={team.name} className="w-20 h-20 object-contain" />
          </div>
        )}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <Badge variant="outline">{team.sport.name}</Badge>
            {team.country && <Badge variant="secondary">{team.country}</Badge>}
          </div>
          <h1 className="text-4xl font-bold">{team.name}</h1>
          {team.shortName && <p className="text-lg text-muted-foreground">{team.shortName}</p>}
          <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
            {team.city && (
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" /> {team.city}, {team.country || ''}
              </span>
            )}
            {team.founded && (
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" /> Founded {team.founded}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Users className="h-4 w-4" /> {team.players.length} Players
            </span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-green-600">{wins}</p>
            <p className="text-sm text-muted-foreground">Wins</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-red-600">{losses}</p>
            <p className="text-sm text-muted-foreground">Losses</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-yellow-600">{draws}</p>
            <p className="text-sm text-muted-foreground">Draws</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold">{completedMatches.length}</p>
            <p className="text-sm text-muted-foreground">Total Matches</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="players">
        <TabsList>
          <TabsTrigger value="players">Players ({team.players.length})</TabsTrigger>
          <TabsTrigger value="matches">Recent Matches ({allMatches.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="players" className="mt-4">
          {team.players.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                No players registered for this team yet.
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {team.players.map((player) => (
                <Link key={player.id} href={`/players/${player.slug}`}>
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                        {player.avatar ? (
                          <img src={player.avatar} alt={player.firstName} className="w-12 h-12 rounded-full object-cover" />
                        ) : (
                          <span className="text-lg font-bold">{player.firstName[0]}{player.lastName?.[0] || ''}</span>
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{player.firstName} {player.lastName}</p>
                        <p className="text-sm text-muted-foreground">
                          {player.role || 'Player'}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="matches" className="mt-4">
          {allMatches.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                No match history available.
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {allMatches.map((match) => {
                const isHome = match.homeTeamId === team.id;
                const opponent = isHome ? match.awayTeam : match.homeTeam;
                const teamScore = isHome ? match.homeScore : match.awayScore;
                const opponentScore = isHome ? match.awayScore : match.homeScore;
                const won = teamScore != null && opponentScore != null && teamScore > opponentScore;

                return (
                  <Link key={match.id} href={`/matches/${match.id}`}>
                    <Card className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-4 flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">{match.sport.name}</Badge>
                            <Badge variant={match.status === 'COMPLETED' ? 'secondary' : match.status === 'LIVE' ? 'default' : 'outline'}>
                              {match.status}
                            </Badge>
                          </div>
                          <p className="font-medium mt-1">
                            {isHome ? 'vs' : '@'} {opponent?.name}
                          </p>
                          {match.tournament && (
                            <p className="text-xs text-muted-foreground">{match.tournament.name}</p>
                          )}
                        </div>
                        <div className="text-right">
                          {teamScore != null && opponentScore != null ? (
                            <p className={`text-lg font-bold ${won ? 'text-green-600' : 'text-red-600'}`}>
                              {teamScore} - {opponentScore}
                            </p>
                          ) : (
                            <p className="text-sm text-muted-foreground">
                              {new Date(match.scheduledAt).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
