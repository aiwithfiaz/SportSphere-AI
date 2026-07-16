export const dynamic = 'force-dynamic';

import { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Leagues & Tournaments",
  description: "Browse all sports leagues and tournaments",
};

async function getTournaments() {
  const tournaments = await prisma.tournament.findMany({
    include: {
      sport: true,
      matches: {
        take: 5,
        orderBy: { scheduledAt: "desc" },
      },
      standings: {
        include: {
          team: true,
        },
        orderBy: { position: "asc" },
        take: 5,
      },
    },
    orderBy: { name: "asc" },
  });
  return tournaments;
}

export default async function LeaguesPage() {
  const tournaments = await getTournaments();

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Leagues & Tournaments</h1>
        <p className="text-slate-500 dark:text-slate-400">
          Browse all sports leagues and tournaments
        </p>
      </div>

      {tournaments.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-slate-500 dark:text-slate-400">
            No tournaments found. Check back later!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tournaments.map((tournament) => (
            <Link
              key={tournament.id}
              href={`/leagues/${tournament.slug}`}
              className="block"
            >
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline">{tournament.sport.name}</Badge>
                    {tournament.isActive && (
                      <Badge className="bg-green-100 text-green-800">Active</Badge>
                    )}
                  </div>
                  <CardTitle>{tournament.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  {tournament.logo && (
                    <div className="w-16 h-16 bg-slate-100 rounded-lg mb-4 flex items-center justify-center">
                      <img
                        src={tournament.logo}
                        alt={tournament.name}
                        className="w-12 h-12 object-contain"
                      />
                    </div>
                  )}
                  
                  <div className="text-sm text-slate-500 mb-4">
                    {new Date(tournament.startDate).toLocaleDateString()} -{" "}
                    {new Date(tournament.endDate).toLocaleDateString()}
                  </div>

                  {tournament.standings.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Top Teams</h4>
                      <div className="space-y-1">
                        {tournament.standings.slice(0, 3).map((standing) => (
                          <div
                            key={standing.id}
                            className="flex justify-between text-sm"
                          >
                            <span>
                              {standing.position}. {standing.team.name}
                            </span>
                            <span className="font-medium">
                              {standing.points} pts
                            </span>
                          </div>
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

