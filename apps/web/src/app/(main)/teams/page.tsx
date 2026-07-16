export const dynamic = 'force-dynamic';

import { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Teams",
  description: "Browse all sports teams",
};

async function getTeams() {
  const teams = await prisma.team.findMany({
    include: {
      sport: true,
      players: {
        take: 5,
        orderBy: { firstName: "asc" },
      },
      _count: {
        select: {
          players: true,
          homeMatches: true,
          awayMatches: true,
        },
      },
    },
    orderBy: { name: "asc" },
  });
  return teams;
}

export default async function TeamsPage() {
  const teams = await getTeams();

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Teams</h1>
        <p className="text-slate-500 dark:text-slate-400">
          Browse all sports teams
        </p>
      </div>

      {teams.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-slate-500 dark:text-slate-400">
            No teams found. Check back later!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map((team) => (
            <Link
              key={team.id}
              href={`/teams/${team.slug}`}
              className="block"
            >
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline">{team.sport.name}</Badge>
                    {team.country && (
                      <Badge variant="secondary">{team.country}</Badge>
                    )}
                  </div>
                  <CardTitle>{team.name}</CardTitle>
                  {team.shortName && (
                    <p className="text-sm text-slate-500">{team.shortName}</p>
                  )}
                </CardHeader>
                <CardContent>
                  {team.logo && (
                    <div className="w-16 h-16 bg-slate-100 rounded-lg mb-4 flex items-center justify-center">
                      <img
                        src={team.logo}
                        alt={team.name}
                        className="w-12 h-12 object-contain"
                      />
                    </div>
                  )}
                  
                  <div className="space-y-2 text-sm">
                    {team.city && (
                      <div>
                        <span className="text-slate-500">City:</span>{" "}
                        <span className="font-medium">{team.city}</span>
                      </div>
                    )}
                    {team.founded && (
                      <div>
                        <span className="text-slate-500">Founded:</span>{" "}
                        <span className="font-medium">{team.founded}</span>
                      </div>
                    )}
                    <div>
                      <span className="text-slate-500">Players:</span>{" "}
                      <span className="font-medium">
                        {team._count.players}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500">Matches:</span>{" "}
                      <span className="font-medium">
                        {team._count.homeMatches + team._count.awayMatches}
                      </span>
                    </div>
                  </div>

                  {team.players.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-medium mb-2">Key Players</h4>
                      <div className="flex flex-wrap gap-2">
                        {team.players.slice(0, 3).map((player) => (
                          <Badge key={player.id} variant="outline">
                            {player.firstName} {player.lastName}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

