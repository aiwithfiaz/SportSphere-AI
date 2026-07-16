import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const [totalUsers, totalTeams, totalPlayers, totalMatches, liveMatches, totalArticles, totalVenues, totalTournaments, totalSubscriptions, premiumUsers] = await Promise.all([
      prisma.user.count(),
      prisma.team.count(),
      prisma.player.count(),
      prisma.match.count(),
      prisma.match.count({ where: { status: { in: ['LIVE', 'IN_PROGRESS'] } } }),
      prisma.article.count(),
      prisma.venue.count(),
      prisma.tournament.count(),
      prisma.subscription.count({ where: { status: 'active' } }),
      prisma.subscription.count({ where: { plan: 'premium', status: 'active' } }),
    ]);

    const recentUsers = await prisma.user.findMany({
      select: { id: true, email: true, displayName: true, role: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });

    const liveMatchData = await prisma.match.findMany({
      where: { status: { in: ['LIVE', 'IN_PROGRESS'] } },
      include: { homeTeam: true, awayTeam: true, sport: true, liveScore: true },
      take: 5,
    });

    const upcomingMatches = await prisma.match.findMany({
      where: { status: 'SCHEDULED' },
      include: { homeTeam: true, awayTeam: true, sport: true },
      orderBy: { scheduledAt: 'asc' },
      take: 5,
    });

    const recentArticles = await prisma.article.findMany({
      include: { author: true, sport: true },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });

    return NextResponse.json({
      success: true,
      data: {
        stats: {
          totalUsers,
          totalTeams,
          totalPlayers,
          totalMatches,
          liveMatches,
          totalArticles,
          totalVenues,
          totalTournaments,
          totalSubscriptions,
          premiumUsers,
        },
        recentUsers,
        liveMatches: liveMatchData,
        upcomingMatches,
        recentArticles,
      },
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return NextResponse.json({ success: false, error: "Failed" }, { status: 500 });
  }
}
