export const dynamic = 'force-dynamic';

import { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { MatchCard, Match } from "@/components/sports/match-card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Live Matches",
  description: "Watch live scores and match updates from around the world",
};

async function getMatches(sport?: string) {
  const where: any = {};
  if (sport) {
    where.sport = { slug: sport };
  }
  const matches = await prisma.match.findMany({
    where,
    include: {
      sport: true,
      tournament: true,
      homeTeam: true,
      awayTeam: true,
      venue: true,
    },
    orderBy: { scheduledAt: "desc" },
    take: 50,
  });
  return matches;
}

async function getLiveMatches(sport?: string) {
  const where: any = {
    status: { in: ["LIVE", "IN_PROGRESS"] },
  };
  if (sport) {
    where.sport = { slug: sport };
  }
  const matches = await prisma.match.findMany({
    where,
    include: {
      sport: true,
      tournament: true,
      homeTeam: true,
      awayTeam: true,
      venue: true,
      liveScore: true,
    },
    orderBy: { scheduledAt: "desc" },
  });
  return matches;
}

function transformMatch(dbMatch: any): Match {
  return {
    id: dbMatch.id,
    homeTeam: {
      name: dbMatch.homeTeam?.name || "TBD",
      logo: dbMatch.homeTeam?.logo || undefined,
      score: dbMatch.homeScore || undefined,
    },
    awayTeam: {
      name: dbMatch.awayTeam?.name || "TBD",
      logo: dbMatch.awayTeam?.logo || undefined,
      score: dbMatch.awayScore || undefined,
    },
    status:
      dbMatch.status === "LIVE" || dbMatch.status === "IN_PROGRESS"
        ? "live"
        : dbMatch.status === "SCHEDULED"
        ? "upcoming"
        : "finished",
    league: dbMatch.tournament?.name || dbMatch.sport?.name || "",
    time: dbMatch.scheduledAt
      ? new Date(dbMatch.scheduledAt).toLocaleTimeString()
      : undefined,
    venue: dbMatch.venue?.name || undefined,
  };
}

export default async function MatchesPage({ searchParams }: { searchParams: Promise<{ sport?: string }> }) {
  const { sport } = await searchParams;
  const [matches, liveMatches] = await Promise.all([
    getMatches(sport),
    getLiveMatches(sport),
  ]);

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Live Matches</h1>
        <p className="text-slate-500 dark:text-slate-400">
          Real-time scores and match updates
        </p>
      </div>

      {/* Live Matches Section */}
      {liveMatches.length > 0 && (
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="secondary" className="bg-red-100 text-red-800">LIVE</Badge>
            <h2 className="text-2xl font-semibold">Live Now</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {liveMatches.map((match) => (
              <MatchCard key={match.id} match={transformMatch(match)} />
            ))}
          </div>
        </section>
      )}

      {/* All Matches Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">All Matches</h2>
        {matches.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-500 dark:text-slate-400">
              No matches found. Check back later!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matches.map((match) => (
              <MatchCard key={match.id} match={transformMatch(match)} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

