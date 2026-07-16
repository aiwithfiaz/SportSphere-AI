export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const q = searchParams.get("q");
    const type = searchParams.get("type") || "all";
    const limit = parseInt(searchParams.get("limit") || "20");

    if (!q || q.trim().length === 0) {
      return NextResponse.json({ results: [], total: 0 });
    }

    const searchTerm = q.trim();
    const results: any[] = [];

    if (type === "all" || type === "matches") {
      const matches = await prisma.match.findMany({
        where: {
          OR: [
            { homeTeam: { name: { contains: searchTerm, mode: "insensitive" } } },
            { awayTeam: { name: { contains: searchTerm, mode: "insensitive" } } },
            { tournament: { name: { contains: searchTerm, mode: "insensitive" } } },
          ],
        },
        include: {
          sport: true,
          tournament: true,
          homeTeam: true,
          awayTeam: true,
        },
        take: type === "matches" ? limit : 5,
      });
      results.push(
        ...matches.map((m) => ({ type: "match", id: m.id, title: `${m.homeTeam?.name || "TBD"} vs ${m.awayTeam?.name || "TBD"}`, subtitle: m.tournament?.name || m.sport?.name, data: m }))
      );
    }

    if (type === "all" || type === "teams") {
      const teams = await prisma.team.findMany({
        where: {
          OR: [
            { name: { contains: searchTerm, mode: "insensitive" } },
            { shortName: { contains: searchTerm, mode: "insensitive" } },
          ],
        },
        include: { sport: true },
        take: type === "teams" ? limit : 5,
      });
      results.push(
        ...teams.map((t) => ({ type: "team", id: t.id, title: t.name, subtitle: t.sport?.name, data: t }))
      );
    }

    if (type === "all" || type === "players") {
      const players = await prisma.player.findMany({
        where: {
          OR: [
            { firstName: { contains: searchTerm, mode: "insensitive" } },
            { lastName: { contains: searchTerm, mode: "insensitive" } },
          ],
        },
        include: { sport: true, team: true },
        take: type === "players" ? limit : 5,
      });
      results.push(
        ...players.map((p) => ({ type: "player", id: p.id, title: `${p.firstName} ${p.lastName}`, subtitle: p.team?.name || p.sport?.name, data: p }))
      );
    }

    if (type === "all" || type === "articles") {
      const articles = await prisma.article.findMany({
        where: {
          status: "PUBLISHED",
          OR: [
            { title: { contains: searchTerm, mode: "insensitive" } },
            { excerpt: { contains: searchTerm, mode: "insensitive" } },
          ],
        },
        include: { author: true, sport: true },
        take: type === "articles" ? limit : 5,
      });
      results.push(
        ...articles.map((a) => ({ type: "article", id: a.id, title: a.title, subtitle: a.sport?.name || a.author?.displayName, data: a }))
      );
    }

    return NextResponse.json({ results, total: results.length });
  } catch (error) {
    console.error("Error searching:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
