import { NextRequest, NextResponse } from 'next/server';
import { getCricbuzzScorecard } from '@/lib/apis/cricbuzz';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const matchId = request.nextUrl.searchParams.get('matchId');
  if (!matchId) {
    return NextResponse.json({ success: false, error: 'matchId required' }, { status: 400 });
  }
  try {
    const scorecard = await getCricbuzzScorecard(matchId);
    return NextResponse.json({ success: true, data: scorecard });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed' }, { status: 500 });
  }
}
