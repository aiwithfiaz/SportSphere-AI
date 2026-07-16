import { NextRequest, NextResponse } from 'next/server';
import { getNewsFeed, getSportNews } from '@/lib/apis/news-aggregator';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const sport = request.nextUrl.searchParams.get('sport');
  const sourcesParam = request.nextUrl.searchParams.get('sources');
  try {
    const sources = sourcesParam ? sourcesParam.split(',') : undefined;
    const news = sport ? await getSportNews(sport) : await getNewsFeed(sources);
    return NextResponse.json({ success: true, data: news });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed' }, { status: 500 });
  }
}
