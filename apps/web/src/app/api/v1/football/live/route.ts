import { NextRequest, NextResponse } from 'next/server';
import { getFootballLiveScores, getFootballStandings } from '@/lib/apis/football-data';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const type = request.nextUrl.searchParams.get('type') || 'live';
  const league = request.nextUrl.searchParams.get('league') || 'premier-league';
  try {
    if (type === 'standings') {
      const data = await getFootballStandings(league);
      return NextResponse.json({ success: true, data });
    }
    const data = await getFootballLiveScores();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed' }, { status: 500 });
  }
}
