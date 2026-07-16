const ESPN_BASE_URL = 'https://site.api.espn.com/apis/site/v2/sports';

export interface ESPNTeam {
  id: string;
  displayName: string;
  shortDisplayName: string;
  abbreviation: string;
  color: string;
  logo: string;
}

export interface ESPNCompetitor {
  id: string;
  homeAway: 'home' | 'away';
  score: string;
  team: ESPNTeam;
  records?: { name: string; summary: string }[];
  form?: string;
}

export interface ESPNStatus {
  clock: number;
  displayClock: string;
  type: {
    id: string;
    name: string;
    state: 'pre' | 'in' | 'post';
    completed: boolean;
    description: string;
    detail: string;
    shortDetail: string;
  };
}

export interface ESPNEvent {
  id: string;
  date: string;
  name: string;
  shortName: string;
  status: ESPNStatus;
  competitions: {
    id: string;
    competitors: ESPNCompetitor[];
    status: ESPNStatus;
    venue?: { fullName: string; address?: { city: string; country: string } };
    details?: any[];
    odds?: any[];
  }[];
  season?: { year: number; type: number };
}

export interface ESPNScoreboardResponse {
  leagues: { id: string; name: string; abbreviation: string; slug: string }[];
  events: ESPNEvent[];
  season?: { type: number; year: number };
  day?: { date: string };
}

export interface NormalizedMatch {
  id: string;
  externalId: string;
  source: 'espn';
  sport: string;
  league: string;
  leagueName: string;
  name: string;
  status: string;
  statusDetail: string;
  state: 'pre' | 'in' | 'post';
  clock: string;
  date: string;
  homeTeam: { id: string; name: string; abbreviation: string; color: string; logo: string; score: string };
  awayTeam: { id: string; name: string; abbreviation: string; color: string; logo: string; score: string };
  venue?: string;
  odds?: any;
}

// ESPN sport slugs mapped to friendly names
export const ESPN_SPORTS: Record<string, { name: string; slug: string; leagues: { name: string; slug: string }[] }> = {
  football: {
    name: 'Football',
    slug: 'football',
    leagues: [
      { name: 'NFL', slug: 'nfl' },
      { name: 'College Football', slug: 'college-football' },
    ],
  },
  soccer: {
    name: 'Soccer',
    slug: 'soccer',
    leagues: [
      { name: 'Premier League', slug: 'eng.1' },
      { name: 'La Liga', slug: 'esp.1' },
      { name: 'Bundesliga', slug: 'ger.1' },
      { name: 'Serie A', slug: 'ita.1' },
      { name: 'Ligue 1', slug: 'fra.1' },
      { name: 'MLS', slug: 'usa.1' },
      { name: 'Champions League', slug: 'uefa.champions' },
    ],
  },
  basketball: {
    name: 'Basketball',
    slug: 'basketball',
    leagues: [
      { name: 'NBA', slug: 'nba' },
      { name: 'WNBA', slug: 'wnba' },
      { name: 'College Basketball', slug: 'ncaab' },
    ],
  },
  baseball: {
    name: 'Baseball',
    slug: 'baseball',
    leagues: [
      { name: 'MLB', slug: 'mlb' },
    ],
  },
  hockey: {
    name: 'Hockey',
    slug: 'hockey',
    leagues: [
      { name: 'NHL', slug: 'nhl' },
    ],
  },
};

function normalizeEvent(event: ESPNEvent, sport: string, league: string, leagueName: string): NormalizedMatch {
  const comp = event.competitions?.[0];
  const status = comp?.status || event.status;
  const home = comp?.competitors?.find(c => c.homeAway === 'home');
  const away = comp?.competitors?.find(c => c.homeAway === 'away');

  let statusLabel = status.type.shortDetail || status.type.description;
  if (status.type.state === 'pre') statusLabel = 'Scheduled';
  if (status.type.state === 'in') statusLabel = 'LIVE';
  if (status.type.state === 'post') statusLabel = status.type.completed ? 'Final' : 'Final';

  return {
    id: `espn-${event.id}`,
    externalId: event.id,
    source: 'espn',
    sport,
    league,
    leagueName,
    name: event.name,
    status: statusLabel,
    statusDetail: status.type.detail || status.type.description,
    state: status.type.state,
    clock: status.displayClock || '',
    date: event.date,
    homeTeam: {
      id: home?.team?.id || '',
      name: home?.team?.displayName || '',
      abbreviation: home?.team?.abbreviation || '',
      color: home?.team?.color || '333',
      logo: home?.team?.logo || '',
      score: home?.score || '0',
    },
    awayTeam: {
      id: away?.team?.id || '',
      name: away?.team?.displayName || '',
      abbreviation: away?.team?.abbreviation || '',
      color: away?.team?.color || '333',
      logo: away?.team?.logo || '',
      score: away?.score || '0',
    },
    venue: comp?.venue?.fullName,
    odds: comp?.odds?.[0],
  };
}

export async function fetchESPNScoreboard(sport: string, league: string): Promise<NormalizedMatch[]> {
  try {
    const url = `${ESPN_BASE_URL}/${sport}/${league}/scoreboard`;
    const res = await fetch(url, { next: { revalidate: 30 } });
    if (!res.ok) throw new Error(`ESPN API error: ${res.status}`);
    
    const data: ESPNScoreboardResponse = await res.json();
    const leagueName = data.leagues?.[0]?.name || league;
    
    return (data.events || []).map(event => normalizeEvent(event, sport, league, leagueName));
  } catch (error) {
    console.error(`Failed to fetch ESPN ${sport}/${league}:`, error);
    return [];
  }
}

export async function fetchAllESPNLiveMatches(): Promise<NormalizedMatch[]> {
  const allMatches: NormalizedMatch[] = [];
  
  const fetches = Object.entries(ESPN_SPORTS).flatMap(([sportKey, sport]) =>
    sport.leagues.map(league => fetchESPNScoreboard(sportKey, league.slug))
  );
  
  const results = await Promise.allSettled(fetches);
  results.forEach(result => {
    if (result.status === 'fulfilled') {
      allMatches.push(...result.value);
    }
  });
  
  return allMatches.sort((a, b) => {
    const stateOrder = { in: 0, pre: 1, post: 2 };
    return (stateOrder[a.state] ?? 1) - (stateOrder[b.state] ?? 1);
  });
}

export async function fetchESPNMatchDetail(sport: string, league: string, eventId: string): Promise<NormalizedMatch | null> {
  try {
    const url = `${ESPN_BASE_URL}/${sport}/${league}/summary?event=${eventId}`;
    const res = await fetch(url, { next: { revalidate: 15 } });
    if (!res.ok) throw new Error(`ESPN API error: ${res.status}`);
    
    const data = await res.json();
    if (data.header) {
      const event: ESPNEvent = {
        id: eventId,
        date: data.header.competitions?.[0]?.date || '',
        name: data.header.competitions?.[0]?.name || '',
        shortName: '',
        status: data.header.competitions?.[0]?.status || { clock: 0, displayClock: '', type: { id: '0', name: '', state: 'pre', completed: false, description: '', detail: '', shortDetail: '' } },
        competitions: data.header.competitions || [],
      };
      return normalizeEvent(event, sport, league, data.header.leagues?.[0]?.name || league);
    }
    return null;
  } catch (error) {
    console.error(`Failed to fetch ESPN match detail:`, error);
    return null;
  }
}
