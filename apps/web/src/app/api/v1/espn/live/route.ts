import { NextResponse } from 'next/server';
import { fetchAllESPNLiveMatches, fetchESPNScoreboard, ESPN_SPORTS } from '@/lib/espn';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sport = searchParams.get('sport');
    const league = searchParams.get('league');

    if (sport && league) {
      const matches = await fetchESPNScoreboard(sport, league);
      return NextResponse.json({ success: true, data: matches, count: matches.length });
    }

    if (sport && !league) {
      const sportConfig = ESPN_SPORTS[sport];
      if (!sportConfig) {
        return NextResponse.json({ success: false, error: `Unknown sport: ${sport}` }, { status: 400 });
      }
      const allMatches = await Promise.all(
        sportConfig.leagues.map(l => fetchESPNScoreboard(sport, l.slug))
      );
      const matches = allMatches.flat();
      return NextResponse.json({ success: true, data: matches, count: matches.length });
    }

    const allMatches = await fetchAllESPNLiveMatches();
    return NextResponse.json({
      success: true,
      data: allMatches,
      count: allMatches.length,
      sports: Object.entries(ESPN_SPORTS).map(([key, s]) => ({
        key,
        name: s.name,
        leagues: s.leagues,
      })),
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch ESPN scores' },
      { status: 500 }
    );
  }
}
