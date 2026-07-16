import { NextRequest, NextResponse } from 'next/server';
import { getYouTubeLiveStreams, getTwitchLiveStreams } from '@/lib/apis/video-integration';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const sport = request.nextUrl.searchParams.get('sport') || 'cricket';
  const platform = request.nextUrl.searchParams.get('platform');
  try {
    let streams;
    if (platform === 'youtube') streams = await getYouTubeLiveStreams(sport);
    else if (platform === 'twitch') streams = getTwitchLiveStreams(sport);
    else {
      const [yt, tw] = await Promise.all([
        getYouTubeLiveStreams(sport),
        Promise.resolve(getTwitchLiveStreams(sport)),
      ]);
      streams = [...yt, ...tw];
    }
    return NextResponse.json({ success: true, data: streams });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed' }, { status: 500 });
  }
}
