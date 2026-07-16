export const dynamic = 'force-dynamic';

import { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Search",
  description: "Search for matches, teams, players, and news",
};

interface SearchPageProps {
  searchParams: Promise<{ q?: string; type?: string }>;
}

async function search(query: string, type: string = "all") {
  if (!query) return { matches: [], teams: [], players: [], articles: [] };

  const results: any = {};

  if (type === "all" || type === "matches") {
    results.matches = await prisma.match.findMany({
      where: {
        OR: [
          { homeTeam: { name: { contains: query, mode: "insensitive" } } },
          { awayTeam: { name: { contains: query, mode: "insensitive" } } },
          { tournament: { name: { contains: query, mode: "insensitive" } } },
        ],
      },
      include: {
        sport: true,
        tournament: true,
        homeTeam: true,
        awayTeam: true,
      },
      take: 10,
    });
  }

  if (type === "all" || type === "teams") {
    results.teams = await prisma.team.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { shortName: { contains: query, mode: "insensitive" } },
        ],
      },
      include: {
        sport: true,
      },
      take: 10,
    });
  }

  if (type === "all" || type === "players") {
    results.players = await prisma.player.findMany({
      where: {
        OR: [
          { firstName: { contains: query, mode: "insensitive" } },
          { lastName: { contains: query, mode: "insensitive" } },
        ],
      },
      include: {
        sport: true,
        team: true,
      },
      take: 10,
    });
  }

  if (type === "all" || type === "articles") {
    results.articles = await prisma.article.findMany({
      where: {
        status: "PUBLISHED",
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { excerpt: { contains: query, mode: "insensitive" } },
        ],
      },
      include: {
        author: true,
        sport: true,
      },
      take: 10,
    });
  }

  return results;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q, type } = await searchParams;
  const results = await search(q || "", type || "all");

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Search</h1>
        <p className="text-slate-500 dark:text-slate-400">
          Search for matches, teams, players, and news
        </p>
      </div>

      {/* Search Form */}
      <form className="mb-8">
        <div className="flex gap-4">
          <Input
            name="q"
            placeholder="Search..."
            defaultValue={q}
            className="flex-1"
          />
          <select
            name="type"
            defaultValue={type || "all"}
            className="px-4 py-2 border rounded-md"
          >
            <option value="all">All</option>
            <option value="matches">Matches</option>
            <option value="teams">Teams</option>
            <option value="players">Players</option>
            <option value="articles">News</option>
          </select>
          <Button type="submit">Search</Button>
        </div>
      </form>

      {/* Search Results */}
      {q ? (
        <div className="space-y-8">
          {/* Matches */}
          {results.matches && results.matches.length > 0 && (
            <section>
              <h2 className="text-2xl font-semibold mb-4">
                Matches ({results.matches.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.matches.map((match: any) => (
                  <Link
                    key={match.id}
                    href={`/matches/${match.id}`}
                    className="block"
                  >
                    <Card className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline">{match.sport.name}</Badge>
                        </div>
                        <div className="font-medium">
                          {match.homeTeam?.name || "TBD"} vs{" "}
                          {match.awayTeam?.name || "TBD"}
                        </div>
                        <div className="text-sm text-slate-500">
                          {match.status}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Teams */}
          {results.teams && results.teams.length > 0 && (
            <section>
              <h2 className="text-2xl font-semibold mb-4">
                Teams ({results.teams.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.teams.map((team: any) => (
                  <Link
                    key={team.id}
                    href={`/teams/${team.slug}`}
                    className="block"
                  >
                    <Card className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline">{team.sport.name}</Badge>
                        </div>
                        <div className="font-medium">{team.name}</div>
                        {team.shortName && (
                          <div className="text-sm text-slate-500">
                            {team.shortName}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Players */}
          {results.players && results.players.length > 0 && (
            <section>
              <h2 className="text-2xl font-semibold mb-4">
                Players ({results.players.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.players.map((player: any) => (
                  <Link
                    key={player.id}
                    href={`/players/${player.slug}`}
                    className="block"
                  >
                    <Card className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline">{player.sport.name}</Badge>
                          {player.team && (
                            <Badge variant="secondary">
                              {player.team.name}
                            </Badge>
                          )}
                        </div>
                        <div className="font-medium">
                          {player.firstName} {player.lastName}
                        </div>
                        {player.nationality && (
                          <div className="text-sm text-slate-500">
                            {player.nationality}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Articles */}
          {results.articles && results.articles.length > 0 && (
            <section>
              <h2 className="text-2xl font-semibold mb-4">
                News ({results.articles.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.articles.map((article: any) => (
                  <Link
                    key={article.id}
                    href={`/news/${article.slug}`}
                    className="block"
                  >
                    <Card className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          {article.sport && (
                            <Badge variant="outline">
                              {article.sport.name}
                            </Badge>
                          )}
                        </div>
                        <div className="font-medium line-clamp-2">
                          {article.title}
                        </div>
                        {article.author && (
                          <div className="text-sm text-slate-500">
                            By {article.author.displayName}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* No Results */}
          {(!results.matches || results.matches.length === 0) &&
            (!results.teams || results.teams.length === 0) &&
            (!results.players || results.players.length === 0) &&
            (!results.articles || results.articles.length === 0) && (
              <div className="text-center py-12">
                <p className="text-slate-500 dark:text-slate-400">
                  No results found for "{q}"
                </p>
              </div>
            )}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-slate-500 dark:text-slate-400">
            Enter a search query to find matches, teams, players, and news
          </p>
        </div>
      )}
    </div>
  );
}


