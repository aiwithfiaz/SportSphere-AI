export const dynamic = 'force-dynamic';

import { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const metadata: Metadata = {
  title: "Players",
  description: "Browse all sports players",
};

async function getPlayers() {
  const players = await prisma.player.findMany({
    include: {
      sport: true,
      team: true,
    },
    orderBy: { firstName: "asc" },
    take: 100,
  });
  return players;
}

export default async function PlayersPage() {
  const players = await getPlayers();

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Players</h1>
        <p className="text-slate-500 dark:text-slate-400">
          Browse all sports players
        </p>
      </div>

      {players.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-slate-500 dark:text-slate-400">
            No players found. Check back later!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {players.map((player) => (
            <Link
              key={player.id}
              href={`/players/${player.slug}`}
              className="block"
            >
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <Avatar className="w-16 h-16">
                      <AvatarImage src={player.avatar || undefined} />
                      <AvatarFallback>
                        {player.firstName[0]}
                        {player.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">
                        {player.firstName} {player.lastName}
                      </CardTitle>
                      {player.team && (
                        <p className="text-sm text-slate-500">
                          {player.team.name}
                        </p>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="outline">{player.sport.name}</Badge>
                    {player.nationality && (
                      <Badge variant="secondary">{player.nationality}</Badge>
                    )}
                    {player.role && (
                      <Badge variant="secondary">{player.role}</Badge>
                    )}
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    {player.battingStyle && (
                      <div>
                        <span className="text-slate-500">Batting:</span>{" "}
                        <span className="font-medium">
                          {player.battingStyle}
                        </span>
                      </div>
                    )}
                    {player.bowlingStyle && (
                      <div>
                        <span className="text-slate-500">Bowling:</span>{" "}
                        <span className="font-medium">
                          {player.bowlingStyle}
                        </span>
                      </div>
                    )}
                    {player.dateOfBirth && (
                      <div>
                        <span className="text-slate-500">DOB:</span>{" "}
                        <span className="font-medium">
                          {new Date(player.dateOfBirth).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

