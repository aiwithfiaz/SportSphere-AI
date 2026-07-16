export interface NewsItem {
  id: string;
  title: string;
  description: string;
  url: string;
  imageUrl: string;
  publishedAt: string;
  source: string;
  category: string;
}

const RSS_FEEDS: Record<string, string> = {
  'espn-cricket': 'https://www.espncricinfo.com/rss/content/story/feeds/0.xml',
  'espn-football': 'https://www.espn.com/espn/rss/soccer/news',
  'espn-nba': 'https://www.espn.com/espn/rss/nba/news',
  'espn-nfl': 'https://www.espn.com/espn/rss/nfl/news',
  'espn-mlb': 'https://www.espn.com/espn/rss/mlb/news',
  'espn-nhl': 'https://www.espn.com/espn/rss/nhl/news',
  'bbc-sport': 'https://feeds.bbci.co.uk/sport/rss.xml',
  'sky-sport': 'https://www.skysports.com/rss/12040',
  'cricbuzz': 'https://www.cricbuzz.com/rss/cricket-news',
};

function parseRSSItems(xml: string, source: string): NewsItem[] {
  const items: NewsItem[] = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
  let match: RegExpExecArray | null;

  while ((match = itemRegex.exec(xml)) !== null) {
    const itemXml = match[1];
    const title = extractTag(itemXml, 'title');
    const description = extractTag(itemXml, 'description');
    const link = extractTag(itemXml, 'link');
    const pubDate = extractTag(itemXml, 'pubDate');
    const enclosure = itemXml.match(/enclosure[^>]*url="([^"]*)"/);

    if (title && link) {
      items.push({
        id: `${source}-${Buffer.from(link).toString('base64').slice(0, 20)}`,
        title: decodeHTML(title),
        description: decodeHTML(description).slice(0, 200),
        url: link,
        imageUrl: enclosure?.[1] || '',
        publishedAt: pubDate ? new Date(pubDate).toISOString() : new Date().toISOString(),
        source: source.replace(/-/g, ' ').toUpperCase(),
        category: source.includes('cricket') ? 'Cricket' :
          source.includes('football') || source.includes('soccer') ? 'Football' :
          source.includes('nba') ? 'Basketball' :
          source.includes('nfl') ? 'American Football' :
          source.includes('mlb') ? 'Baseball' :
          source.includes('nhl') ? 'Hockey' : 'Sports',
      });
    }
  }
  return items;
}

function extractTag(xml: string, tag: string): string {
  const regex = new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>|<${tag}[^>]*>([^<]*)<\\/${tag}>`, 'i');
  const match = xml.match(regex);
  return match ? (match[1] || match[2] || '').trim() : '';
}

function decodeHTML(html: string): string {
  return html
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&#39;/g, "'");
}

export async function getNewsFeed(sources?: string[]): Promise<NewsItem[]> {
  const feeds = sources || Object.keys(RSS_FEEDS);
  const results = await Promise.allSettled(
    feeds.map(async (source) => {
      const url = RSS_FEEDS[source];
      if (!url) return [];
      try {
        const res = await fetch(url, {
          next: { revalidate: 120 },
          headers: { 'User-Agent': 'SportSphere/1.0 News Aggregator' },
        });
        if (!res.ok) return [];
        const xml = await res.text();
        return parseRSSItems(xml, source);
      } catch {
        return [];
      }
    })
  );

  return results
    .filter((r) => r.status === 'fulfilled')
    .flatMap((r) => (r.status === 'fulfilled' ? r.value : []))
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

export async function getSportNews(sport: string): Promise<NewsItem[]> {
  const sportFeeds = Object.keys(RSS_FEEDS).filter((key) =>
    key.toLowerCase().includes(sport.toLowerCase())
  );
  if (sportFeeds.length === 0) return getNewsFeed();
  return getNewsFeed(sportFeeds);
}
