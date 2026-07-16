import { NextResponse } from 'next/server';
import { getCricbuzzMatches } from '@/lib/apis/cricbuzz';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const matches = await getCricbuzzMatches();
    return NextResponse.json({ success: true, data: matches });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch Cricbuzz matches' },
      { status: 500 }
    );
  }
}
