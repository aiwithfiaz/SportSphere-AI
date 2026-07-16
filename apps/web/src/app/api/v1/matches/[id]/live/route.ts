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
      select: {
        id: true,
        status: true,
        homeScore: true,
        awayScore: true,
        liveScore: {
          select: {
            currentScore: true,
            currentInning: true,
            battingTeam: true,
            bowlingTeam: true,
            lastUpdated: true,
          },
        },
        innings: {
          select: {
            inningNumber: true,
            runs: true,
            wickets: true,
            overs: true,
            extras: true,
          },
          orderBy: { inningNumber: "asc" },
        },
      },
    });

    if (!match) {
      return NextResponse.json({ success: false, error: "Match not found" }, { status: 404 });
    }

    const liveData = {
      matchId: match.id,
      status: match.status,
      homeScore: match.liveScore?.currentScore || match.homeScore,
      awayScore: match.awayScore,
      currentInning: match.liveScore?.currentInning || null,
      battingTeam: match.liveScore?.battingTeam || null,
      bowlingTeam: match.liveScore?.bowlingTeam || null,
      innings: match.innings,
      lastUpdate: match.liveScore?.lastUpdated || null,
    };

    return NextResponse.json({ success: true, data: liveData });
  } catch (error) {
    console.error("Error fetching live score:", error);
    return NextResponse.json({ success: false, error: "Failed" }, { status: 500 });
  }
}
