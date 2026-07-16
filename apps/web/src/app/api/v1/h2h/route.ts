import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const teamAId = searchParams.get('teamAId');
    const teamBId = searchParams.get('teamBId');
    const sportId = searchParams.get('sportId');

    if (!teamAId || !teamBId) {
      return NextResponse.json(
        { success: false, error: 'teamAId and teamBId are required' },
        { status: 400 }
      );
    }

    const whereClause: any = {
      OR: [
        { homeTeamId: teamAId, awayTeamId: teamBId },
        { homeTeamId: teamBId, awayTeamId: teamAId },
      ],
      status: 'COMPLETED',
    };
    if (sportId) whereClause.sportId = sportId;

    const matches = await prisma.match.findMany({
      where: whereClause,
      include: {
        homeTeam: true,
        awayTeam: true,
        sport: true,
        tournament: true,
      },
      orderBy: { scheduledAt: 'desc' },
      take: 20,
    });

    let teamAWins = 0;
    let teamBWins = 0;
    let draws = 0;

    matches.forEach((match) => {
      if (match.homeScore != null && match.awayScore != null) {
        if (match.homeScore > match.awayScore && match.homeTeamId === teamAId) teamAWins++;
        else if (match.homeScore > match.awayScore && match.homeTeamId === teamBId) teamBWins++;
        else if (match.awayScore > match.homeScore && match.awayTeamId === teamAId) teamAWins++;
        else if (match.awayScore > match.homeScore && match.awayTeamId === teamBId) teamBWins++;
        else draws++;
      } else {
        draws++;
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        teamAId,
        teamBId,
        totalMatches: matches.length,
        teamAWins,
        teamBWins,
        draws,
        recentMatches: matches.slice(0, 5),
      },
    });
  } catch (error) {
    console.error('H2H API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch head-to-head data' },
      { status: 500 }
    );
  }
}
