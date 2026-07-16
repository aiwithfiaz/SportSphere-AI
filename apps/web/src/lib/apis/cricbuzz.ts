const CRICBUZZ_BASE = 'http://synd.cricbuzz.com/j2me/1.0';

export interface CricbuzzMatch {
  id: string;
  series: string;
  description: string;
  matchNumber: string;
  type: string;
  state: string;
  status: string;
  dataPath: string;
  team1: string;
  team2: string;
}

export interface CricbuzzScore {
  batsman: { name: string; runs: number; balls: number; fours: number; sixes: number; isOnStrike: boolean }[];
  bowler: { name: string; overs: string; maidens: number; runs: number; wickets: number }[];
  scoreSummary: string;
  currentOver: string;
  runRate: string;
  extras: string;
  target?: string;
}

export interface CricbuzzCommentary {
  over: string;
  bowler: string;
  batsman: string;
  commentary: string;
  event?: string;
}

export interface CricbuzzScorecard {
  innings: {
    team: string;
    score: string;
    overs: string;
    batsmen: { name: string; runs: number; balls: number; fours: number; sixes: number; dismissal: string }[];
    bowlers: { name: string; overs: string; maidens: number; runs: number; wickets: number }[];
  }[];
}

function parseXML(text: string): Record<string, string>[] {
  const items: Record<string, string>[] = [];
  const regex = /<(\w+)([^>]*)>([\s\S]*?)<\/\1>/g;
  const attrRegex = /(\w+)="([^"]*)"/g;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(text)) !== null) {
    const attrs: Record<string, string> = {};
    let attrMatch: RegExpExecArray | null;
    while ((attrMatch = attrRegex.exec(match[2])) !== null) {
      attrs[attrMatch[1]] = attrMatch[2];
    }
    attrs._content = match[3];
    items.push(attrs);
  }
  return items;
}

function extractText(xml: string, tag: string): string {
  const regex = new RegExp(`<${tag}[^>]*>([^<]*)<\\/${tag}>`, 'i');
  const match = xml.match(regex);
  return match ? match[1].trim() : '';
}

export async function getCricbuzzMatches(): Promise<CricbuzzMatch[]> {
  try {
    const res = await fetch(`${CRICBUZZ_BASE}/livematches.xml`, {
      next: { revalidate: 30 },
    });
    if (!res.ok) return [];
    const xml = await res.text();
    const items = parseXML(xml);
    return items
      .filter((item) => item.id)
      .map((item) => ({
        id: item.id || '',
        series: item.srs || '',
        description: item.mchdesc || '',
        matchNumber: item.mnum || '',
        type: item.type || '',
        state: item.mchstate || '',
        status: extractText(item._content || '', 'status'),
        dataPath: item.datapath || '',
        team1: '',
        team2: '',
      }));
  } catch {
    return [];
  }
}

export async function getCricbuzzLiveScore(matchId: string): Promise<CricbuzzScore | null> {
  try {
    const matches = await getCricbuzzMatches();
    const match = matches.find((m) => m.id === matchId);
    if (!match?.dataPath) return null;

    const res = await fetch(`${match.dataPath}commentary.xml`, { next: { revalidate: 15 } });
    if (!res.ok) return null;
    const xml = await res.text();

    const batsmen = parseXML(xml)
      .filter((item) => item.batsman || item.r)
      .map((item) => ({
        name: item.batsman || item.b || '',
        runs: parseInt(item.r || '0'),
        balls: parseInt(item.b || '0'),
        fours: parseInt(item['4'] || '0'),
        sixes: parseInt(item['6'] || '0'),
        isOnStrike: item.onscreen === '1',
      }));

    const bowlers = parseXML(xml)
      .filter((item) => item.bowler || item.o)
      .map((item) => ({
        name: item.bowler || '',
        overs: item.o || '0',
        maidens: parseInt(item.m || '0'),
        runs: parseInt(item.r || '0'),
        wickets: parseInt(item.w || '0'),
      }));

    return {
      batsman: batsmen,
      bowler: bowlers,
      scoreSummary: extractText(xml, 'score'),
      currentOver: extractText(xml, 'curover'),
      runRate: extractText(xml, 'crr'),
      extras: extractText(xml, 'extras'),
      target: extractText(xml, 'target'),
    };
  } catch {
    return null;
  }
}

export async function getCricbuzzCommentary(matchId: string): Promise<CricbuzzCommentary[]> {
  try {
    const matches = await getCricbuzzMatches();
    const match = matches.find((m) => m.id === matchId);
    if (!match?.dataPath) return [];

    const res = await fetch(`${match.dataPath}commentary.xml`, { next: { revalidate: 15 } });
    if (!res.ok) return [];
    const xml = await res.text();
    const items = parseXML(xml);

    return items
      .filter((item) => item.com || item.comm)
      .map((item) => ({
        over: item.ovr || '',
        bowler: item.bowler || '',
        batsman: item.batsman || '',
        commentary: item.com || item.comm || '',
        event: item.event || undefined,
      }));
  } catch {
    return [];
  }
}

export async function getCricbuzzScorecard(matchId: string): Promise<CricbuzzScorecard | null> {
  try {
    const matches = await getCricbuzzMatches();
    const match = matches.find((m) => m.id === matchId);
    if (!match?.dataPath) return null;

    const res = await fetch(`${match.dataPath}scorecard.xml`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    const xml = await res.text();

    const inningsBlocks = xml.split(/<innings\b/i).slice(1);
    const innings = inningsBlocks.map((block) => ({
      team: extractText(block, 't'),
      score: extractText(block, 'r'),
      overs: extractText(block, 'o'),
      batsmen: parseXML(block)
        .filter((item) => item.batsman || item.b)
        .map((item) => ({
          name: item.batsman || item.b || '',
          runs: parseInt(item.r || '0'),
          balls: parseInt(item.b || '0'),
          fours: parseInt(item['4'] || '0'),
          sixes: parseInt(item['6'] || '0'),
          dismissal: item.out || '',
        })),
      bowlers: parseXML(block)
        .filter((item) => item.bowler)
        .map((item) => ({
          name: item.bowler || '',
          overs: item.o || '0',
          maidens: parseInt(item.m || '0'),
          runs: parseInt(item.r || '0'),
          wickets: parseInt(item.w || '0'),
        })),
    }));

    return { innings };
  } catch {
    return null;
  }
}
