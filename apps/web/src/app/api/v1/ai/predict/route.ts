import { NextRequest, NextResponse } from 'next/server';
import { predictMatch } from '@/lib/apis/ai-tools';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const prediction = predictMatch({
      homeStrength: body.homeStrength ?? 0.6,
      awayStrength: body.awayStrength ?? 0.5,
      homeForm: body.homeForm,
      awayForm: body.awayForm,
      homeH2HWins: body.homeH2HWins,
      awayH2HWins: body.awayH2HWins,
      draws: body.draws,
      isHome: body.isHome ?? true,
      weather: body.weather,
      pitch: body.pitch,
    });
    return NextResponse.json({ success: true, data: prediction });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed' }, { status: 500 });
  }
}
