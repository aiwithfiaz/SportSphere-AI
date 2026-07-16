import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const match = await prisma.match.findUnique({
      where: { id },
      include: {
        sport: true,
        tournament: true,
        homeTeam: true,
        awayTeam: true,
        venue: true,
        liveScore: true,
        innings: { orderBy: { inningNumber: "asc" } },
        commentary: { orderBy: { createdAt: "desc" }, take: 50 },
        matchPlayers: { include: { player: true, team: true } },
      },
    });

    if (!match) {
      return NextResponse.json({ success: false, error: "Match not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: match });
  } catch (error) {
    console.error("Error fetching match:", error);
    return NextResponse.json({ success: false, error: "Failed" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { sportId, tournamentId, homeTeamId, awayTeamId, scheduledAt, format, status, homeScore, awayScore, result } = body;

    const match = await prisma.match.update({
      where: { id },
      data: {
        ...(sportId && { sportId }),
        ...(tournamentId && { tournamentId }),
        ...(homeTeamId && { homeTeamId }),
        ...(awayTeamId && { awayTeamId }),
        ...(scheduledAt && { scheduledAt: new Date(scheduledAt) }),
        ...(format && { format }),
        ...(status && { status }),
        ...(homeScore != null && { homeScore: parseInt(homeScore) }),
        ...(awayScore != null && { awayScore: parseInt(awayScore) }),
        ...(result && { result }),
      },
      include: { sport: true, homeTeam: true, awayTeam: true },
    });

    return NextResponse.json({ success: true, data: match });
  } catch (error) {
    console.error("Error updating match:", error);
    return NextResponse.json({ success: false, error: "Failed" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.match.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Match deleted" });
  } catch (error) {
    console.error("Error deleting match:", error);
    return NextResponse.json({ success: false, error: "Failed" }, { status: 500 });
  }
}
