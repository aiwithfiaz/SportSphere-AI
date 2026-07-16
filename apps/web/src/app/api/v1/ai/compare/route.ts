import { NextRequest, NextResponse } from 'next/server';
import { comparePlayers } from '@/lib/apis/ai-tools';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = comparePlayers({
      player1Name: body.player1Name,
      player1Stats: body.player1Stats,
      player2Name: body.player2Name,
      player2Stats: body.player2Stats,
    });
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed' }, { status: 500 });
  }
}
