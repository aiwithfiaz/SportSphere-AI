const FOOTBALL_API_BASE = 'https://api.football-data.org/v4';

export interface FootballMatch {
  id: number;
  competition: string;
  competitionCode: string;
  homeTeam: string;
  awayTeam: string;
  homeLogo: string;
  awayLogo: string;
  score: string;
  status: string;
  minute: number;
  utcDate: string;
}

export interface FootballStanding {
  position: number;
  team: string;
  teamLogo: string;
  played: number;
  won: number;
  draw: number;
  lost: number;
  points: number;
  goalDifference: number;
  form: string[];
}

export interface FootballPlayer {
  name: string;
  nationality: string;
  position: string;
  dateOfBirth: string;
  marketValue: number;
  team: string;
  goals: number;
  assists: number;
}

const LEAGUE_MAP: Record<string, string> = {
  'premier-league': 'PL',
  'la-liga': 'PD',
  'bundesliga': 'BL1',
  'serie-a': 'SA',
  'ligue-1': 'FL1',
  'eredivisie': 'DED',
  'primeira-liga': 'PPL',
  'champions-league': 'CL',
  'europa-league': 'EL',
  'world-cup': 'WC',
};

export async function getFootballLiveScores(): Promise<FootballMatch[]> {
  try {
    const res = await fetch(`${FOOTBALL_API_BASE}/matches?status=LIVE,IN_PLAY,PAUSED`, {
      headers: { 'X-Auth-Token': process.env.FOOTBALL_API_KEY || '' },
      next: { revalidate: 30 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.matches || []).map((m: Record<string, unknown>) => ({
      id: m.id as number,
      competition: (m.competition as Record<string, string>)?.name || '',
      competitionCode: (m.competition as Record<string, string>)?.code || '',
      homeTeam: (m.homeTeam as Record<string, string>)?.shortName || '',
      awayTeam: (m.awayTeam as Record<string, string>)?.shortName || '',
      homeLogo: (m.homeTeam as Record<string, string>)?.crest || '',
      awayLogo: (m.awayTeam as Record<string, string>)?.crest || '',
      score: `${(m.score as Record<string, Record<string, number>>)?.fullTime?.home ?? 0} - ${(m.score as Record<string, Record<string, number>>)?.fullTime?.away ?? 0}`,
      status: m.status as string,
      minute: m.minute as number,
      utcDate: m.utcDate as string,
    }));
  } catch {
    return [];
  }
}

export async function getFootballStandings(league: string): Promise<FootballStanding[]> {
  try {
    const code = LEAGUE_MAP[league] || league.toUpperCase();
    const res = await fetch(`${FOOTBALL_API_BASE}/competitions/${code}/standings`, {
      headers: { 'X-Auth-Token': process.env.FOOTBALL_API_KEY || '' },
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    const table = (data.standings as Array<{ type: string; table: Array<Record<string, unknown>> }>)
      ?.find((s) => s.type === 'TOTAL');
    return (table?.table || []).map((row: Record<string, unknown>) => ({
      position: row.position as number,
      team: (row.team as Record<string, string>)?.shortName || '',
      teamLogo: (row.team as Record<string, string>)?.crest || '',
      played: row.playedGames as number,
      won: row.won as number,
      draw: row.draw as number,
      lost: row.lost as number,
      points: row.points as number,
      goalDifference: row.goalDifference as number,
      form: ((row.form as string) || '').split(',').map((f: string) => f.trim()),
    }));
  } catch {
    return [];
  }
}
