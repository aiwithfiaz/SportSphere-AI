import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const sport = searchParams.get("sport");
    const status = searchParams.get("status");
    const limit = parseInt(searchParams.get("limit") || "50");

    const where: any = {};
    if (sport) where.sport = { slug: sport };
    if (status) where.status = status;

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
      orderBy: { scheduledAt: "asc" },
      take: limit,
    });

    return NextResponse.json({ success: true, data: matches });
  } catch (error) {
    console.error("Error fetching matches:", error);
    return NextResponse.json({ success: false, error: "Failed" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sportId, tournamentId, homeTeamId, awayTeamId, scheduledAt, format, status } = body;

    if (!sportId || !homeTeamId || !awayTeamId || !scheduledAt) {
      return NextResponse.json({ success: false, error: "sportId, homeTeamId, awayTeamId, and scheduledAt are required" }, { status: 400 });
    }

    const match = await prisma.match.create({
      data: {
        sportId,
        tournamentId: tournamentId || null,
        homeTeamId,
        awayTeamId,
        scheduledAt: new Date(scheduledAt),
        format: format || "OTHER",
        status: status || "SCHEDULED",
      },
      include: {
        sport: true,
        tournament: true,
        homeTeam: true,
        awayTeam: true,
      },
    });

    return NextResponse.json({ success: true, data: match }, { status: 201 });
  } catch (error) {
    console.error("Error creating match:", error);
    return NextResponse.json({ success: false, error: "Failed" }, { status: 500 });
  }
}
