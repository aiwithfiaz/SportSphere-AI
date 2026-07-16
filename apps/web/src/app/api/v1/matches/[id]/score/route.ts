import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

const WS_URL = process.env.WS_URL || 'http://localhost:3001';

async function broadcastScore(matchId: string, data: any) {
  try {
    await fetch(`${WS_URL}/broadcast/score`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ matchId, ...data }),
    });
  } catch {
    // WebSocket server might not be running
  }
}

export async function POST(request: NextRequest) {
  try {
    const { matchId, homeScore, awayScore, status, overs, runRate, currentInning, battingTeam, bowlingTeam } = await request.json();

    if (!matchId) {
      return NextResponse.json({ success: false, error: "matchId is required" }, { status: 400 });
    }

    const match = await prisma.match.findUnique({ where: { id: matchId } });
    if (!match) {
      return NextResponse.json({ success: false, error: "Match not found" }, { status: 404 });
    }

    const matchUpdate: any = {};
    if (homeScore != null) matchUpdate.homeScore = parseInt(homeScore);
    if (awayScore != null) matchUpdate.awayScore = parseInt(awayScore);
    if (status) matchUpdate.status = status;

    if (Object.keys(matchUpdate).length > 0) {
      await prisma.match.update({ where: { id: matchId }, data: matchUpdate });
    }

    const liveScoreData: any = {};
    if (currentInning != null) liveScoreData.currentInning = parseInt(currentInning);
    if (battingTeam) liveScoreData.battingTeam = battingTeam;
    if (bowlingTeam) liveScoreData.bowlingTeam = bowlingTeam;
    if (homeScore != null || awayScore != null) {
      liveScoreData.currentScore = { home: homeScore ?? match.homeScore, away: awayScore ?? match.awayScore };
    }

    if (Object.keys(liveScoreData).length > 0) {
      await prisma.liveScore.upsert({
        where: { matchId },
        create: { matchId, ...liveScoreData },
        update: liveScoreData,
      });
    }

    const updated = await prisma.match.findUnique({
      where: { id: matchId },
      include: { liveScore: true, homeTeam: true, awayTeam: true },
    });

    // Broadcast via WebSocket
    await broadcastScore(matchId, {
      homeScore: updated?.homeScore,
      awayScore: updated?.awayScore,
      status: updated?.status || match.status,
      currentInning,
      battingTeam,
      bowlingTeam,
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("Error updating live score:", error);
    return NextResponse.json({ success: false, error: "Failed" }, { status: 500 });
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const match = await prisma.match.findUnique({
      where: { id },
      include: {
        liveScore: true,
        homeTeam: { select: { name: true, shortName: true } },
        awayTeam: { select: { name: true, shortName: true } },
        innings: { orderBy: { inningNumber: "asc" } },
      },
    });

    if (!match) {
      return NextResponse.json({ success: false, error: "Match not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: match });
  } catch (error) {
    console.error("Error fetching score:", error);
    return NextResponse.json({ success: false, error: "Failed" }, { status: 500 });
  }
}
