import { NextRequest, NextResponse } from 'next/server';
import { generateWinProbability } from '@/lib/apis/ai-tools';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const probability = generateWinProbability(
      body.totalOvers ?? 50,
      body.targetScore ?? 250,
      body.currentScore ?? 120,
      body.currentWickets ?? 3,
      body.currentOver ?? 20
    );
    return NextResponse.json({ success: true, data: probability });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed' }, { status: 500 });
  }
}
