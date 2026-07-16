export interface VideoStream {
  id: string;
  title: string;
  thumbnail: string;
  channel: string;
  viewerCount: number;
  sport: string;
  match?: string;
  embedUrl: string;
  platform: 'youtube' | 'twitch';
  isLive: boolean;
  startedAt: string;
}

const LIVE_SPORT_CHANNELS: Record<string, { youtube?: string[]; twitch?: string[] }> = {
  cricket: {
    youtube: [
      'UC8EdDR382uS9pCT9A32wPAQ',
      'UCB3aEBABzS0LZ1VJc8dAMA',
    ],
    twitch: ['cricket', 'espncricket'],
  },
  football: {
    youtube: [
      'UC1CF02rrO3wWnDPDvzCfYBQ',
      'UCSJ4gkTM6gdfEOvP86ePzKA',
    ],
    twitch: ['premierleague', 'laliga'],
  },
  basketball: {
    youtube: ['UCi8QkzKrmn7v8RKK6fKbTmw'],
    twitch: ['nbabasketball', 'wnba'],
  },
  tennis: {
    youtube: ['UCS3Cz4Kq2bT2iXg2S5zOjEA'],
    twitch: ['tennistv'],
  },
  mma: {
    youtube: ['UCFj1z5U6rGmH2TzaV63mVpA'],
    twitch: ['ufc'],
  },
};

export async function getYouTubeLiveStreams(sport: string): Promise<VideoStream[]> {
  const channels = LIVE_SPORT_CHANNELS[sport]?.youtube || [];
  const streams: VideoStream[] = [];

  for (const channelId of channels) {
    try {
      const res = await fetch(
        `https://www.youtube.com/@handle/live`,
        { next: { revalidate: 60 } }
      );
      // YouTube doesn't expose public API without key, use embed approach
      streams.push({
        id: `yt-${channelId}`,
        title: `${sport.charAt(0).toUpperCase() + sport.slice(1)} Live Stream`,
        thumbnail: `https://img.youtube.com/vi/${channelId}/maxresdefault.jpg`,
        channel: channelId,
        viewerCount: 0,
        sport,
        embedUrl: `https://www.youtube.com/embed/live_stream?channel=${channelId}`,
        platform: 'youtube',
        isLive: true,
        startedAt: new Date().toISOString(),
      });
    } catch {
      // silently continue
    }
  }
  return streams;
}

export async function getTwitchLiveStreams(sport: string): Promise<VideoStream[]> {
  const channels = LIVE_SPORT_CHANNELS[sport]?.twitch || [];
  return channels.map((channel) => ({
    id: `twitch-${channel}`,
    title: `${channel} - Live ${sport}`,
    thumbnail: `https://static-cdn.jtvnw.net/previews-ttv/live_user_${channel}-440x248.jpg`,
    channel,
    viewerCount: 0,
    sport,
    embedUrl: `https://player.twitch.tv/?channel=${channel}&parent=sportsphere.ai`,
    platform: 'twitch' as const,
    isLive: true,
    startedAt: new Date().toISOString(),
  }));
}

export function getEmbedUrl(platform: 'youtube' | 'twitch', videoId: string): string {
  if (platform === 'youtube') {
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
  }
  return `https://player.twitch.tv/?video=${videoId}&parent=sportsphere.ai&autoplay=true`;
}

export const SPORT_VIDEO_CATEGORIES = [
  { id: 'live', name: 'Live Now', icon: '🔴' },
  { id: 'highlights', name: 'Highlights', icon: '🎬' },
  { id: 'analysis', name: 'Analysis', icon: '📊' },
  { id: 'interviews', name: 'Interviews', icon: '🎙️' },
  { id: 'classic', name: 'Classic Matches', icon: '🏆' },
];
