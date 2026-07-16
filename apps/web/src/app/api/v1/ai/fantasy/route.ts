import { NextRequest, NextResponse } from 'next/server';
import { generateFantasyTeam } from '@/lib/apis/ai-tools';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = generateFantasyTeam({
      availablePlayers: body.players,
      budget: body.budget ?? 100,
      format: body.format,
    });
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed' }, { status: 500 });
  }
}
