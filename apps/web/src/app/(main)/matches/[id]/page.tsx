export const dynamic = 'force-dynamic';

import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LiveIndicator } from "@/components/sports/live-indicator";
import { LiveScoreboard } from "@/components/sports/live-scoreboard";
import { MatchCommentary } from "@/components/match-commentary";
import { Trophy, MapPin, Clock, Users } from "lucide-react";

interface MatchPageProps {
  params: Promise<{ id: string }>;
}

async function getMatch(id: string) {
  const match = await prisma.match.findUnique({
    where: { id },
    include: {
      sport: true,
      tournament: true,
      homeTeam: true,
      awayTeam: true,
      venue: true,
      liveScore: true,
      matchPlayers: {
        include: {
          player: true,
          team: true,
        },
      },
      innings: {
        orderBy: { inningNumber: "asc" },
      },
      commentary: {
        orderBy: { createdAt: "desc" },
        take: 50,
      },
    },
  });
  return match;
}

export async function generateMetadata({ params }: MatchPageProps): Promise<Metadata> {
  const { id } = await params;
  const match = await getMatch(id);
  
  if (!match) {
    return { title: "Match Not Found" };
  }

  const teams = match.homeTeam && match.awayTeam
    ? `${match.homeTeam.name} vs ${match.awayTeam.name}`
    : "Match";

  return {
    title: `${teams} - Live Score`,
    description: `Live score and updates for ${teams}`,
  };
}

export default async function MatchPage({ params }: MatchPageProps) {
  const { id } = await params;
  const match = await getMatch(id);

  if (!match) {
    notFound();
  }

  const isLive = match.status === "LIVE" || match.status === "IN_PROGRESS";
  const isCompleted = match.status === "COMPLETED";

  return (
    <div className="container mx-auto py-8">
      {/* Live Scoreboard for live matches */}
      {isLive && (
        <div className="mb-6">
          <LiveScoreboard
            matchId={match.id}
            initialData={{
              homeTeam: match.homeTeam,
              awayTeam: match.awayTeam,
              homeScore: match.homeScore,
              awayScore: match.awayScore,
              status: match.status,
            }}
          />
        </div>
      )}

      {/* Match Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="outline">{match.sport.name}</Badge>
          {match.tournament && (
            <Badge variant="secondary">{match.tournament.name}</Badge>
          )}
          {isLive && <LiveIndicator />}
        </div>
        
        <div className="flex items-center justify-between mt-4">
          <div className="text-center">
            {match.homeTeam && (
              <>
                <div className="text-2xl font-bold">{match.homeTeam.name}</div>
                <div className="text-sm text-slate-500">{match.homeTeam.shortName}</div>
              </>
            )}
          </div>
          
            <div className="text-center px-8">
            <div className="text-4xl font-bold">
              {match.homeScore ?? 0} - {match.awayScore ?? 0}
            </div>
            {match.liveScore?.currentScore && (
              <div className="text-sm text-slate-500">
                Live: {(match.liveScore.currentScore as any)?.overs ?? ""}
              </div>
            )}
          </div>
          
          <div className="text-center">
            {match.awayTeam && (
              <>
                <div className="text-2xl font-bold">{match.awayTeam.name}</div>
                <div className="text-sm text-slate-500">{match.awayTeam.shortName}</div>
              </>
            )}
          </div>
        </div>

        {match.result && (
          <div className="text-center mt-4 text-lg font-medium text-green-600">
            {match.result}
          </div>
        )}
      </div>

      {/* Match Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="commentary">
            <TabsList>
              <TabsTrigger value="commentary">Commentary</TabsTrigger>
              <TabsTrigger value="scorecard">Scorecard</TabsTrigger>
              <TabsTrigger value="stats">Stats</TabsTrigger>
            </TabsList>
            
            <TabsContent value="commentary" className="mt-4">
              <MatchCommentary matchId={match.id} />
            </TabsContent>
            
            <TabsContent value="scorecard" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Scorecard</CardTitle>
                </CardHeader>
                <CardContent>
                  {match.innings.length === 0 ? (
                    <p className="text-slate-500">Scorecard not available</p>
                  ) : (
                    <div className="space-y-6">
                      {match.innings.map((inning) => (
                        <div key={inning.id}>
                          <h3 className="font-semibold mb-2">
                            Inning {inning.inningNumber}
                          </h3>
                          <div className="text-2xl font-bold">
                            {inning.runs}/{inning.wickets} ({inning.overs} ov)
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="stats" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Match Players
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {match.matchPlayers.length === 0 ? (
                    <p className="text-slate-500">Player stats not available</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-2 font-medium">Player</th>
                            <th className="text-left py-2 font-medium">Team</th>
                            <th className="text-center py-2 font-medium">Role</th>
                            <th className="text-center py-2 font-medium">Captain</th>
                            <th className="text-center py-2 font-medium">Keeper</th>
                          </tr>
                        </thead>
                        <tbody>
                          {match.matchPlayers.map((mp) => (
                            <tr key={mp.id} className="border-b last:border-0 hover:bg-accent/50">
                              <td className="py-2">
                                <Link href={`/players/${mp.player?.slug || mp.playerId}`} className="font-medium hover:underline">
                                  {mp.player?.firstName} {mp.player?.lastName}
                                </Link>
                              </td>
                              <td className="py-2 text-muted-foreground">{mp.team?.name}</td>
                              <td className="py-2 text-center">
                                <Badge variant="outline" className="text-xs">{mp.player?.role || 'N/A'}</Badge>
                              </td>
                              <td className="py-2 text-center">{mp.isCaptain ? <Trophy className="h-4 w-4 text-yellow-500 mx-auto" /> : '-'}</td>
                              <td className="py-2 text-center">{mp.isKeeper ? '🧤' : '-'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Match Info */}
          <Card>
            <CardHeader>
              <CardTitle>Match Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm text-slate-500">Status</div>
                <div className="font-medium">{match.status}</div>
              </div>
              <div>
                <div className="text-sm text-slate-500">Format</div>
                <div className="font-medium">{match.format}</div>
              </div>
              <div>
                <div className="text-sm text-slate-500">Scheduled</div>
                <div className="font-medium">
                  {new Date(match.scheduledAt).toLocaleDateString()}
                </div>
              </div>
              {match.venue && (
                <div>
                  <div className="text-sm text-slate-500">Venue</div>
                  <div className="font-medium">{match.venue.name}</div>
                  {match.venue.city && (
                    <div className="text-sm text-slate-500">
                      {match.venue.city}
                    </div>
                  )}
                </div>
              )}
              {match.tossWinner && (
                <div>
                  <div className="text-sm text-slate-500">Toss</div>
                  <div className="font-medium">
                    {match.tossWinner} won and elected to {match.tossDecision}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link
                href="/matches"
                className="block w-full text-center px-4 py-2 bg-slate-100 rounded-md hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700"
              >
                All Matches
              </Link>
              <Link
                href={`/leagues/${match.tournament?.slug || ""}`}
                className="block w-full text-center px-4 py-2 bg-slate-100 rounded-md hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700"
              >
                Tournament
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
