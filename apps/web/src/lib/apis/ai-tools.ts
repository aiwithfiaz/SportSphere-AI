export interface MatchPrediction {
  homeWin: number;
  awayWin: number;
  draw: number;
  confidence: number;
  factors: { name: string; impact: number; detail: string }[];
  summary: string;
}

export interface WinProbabilityOver {
  over: number;
  homeWin: number;
  awayWin: number;
  draw: number;
}

export interface PlayerComparison {
  player1: { name: string; stats: Record<string, number> };
  player2: { name: string; stats: Record<string, number> };
  winner: string;
  strengths: { player: string; area: string; value: number }[];
  analysis: string;
}

export interface FantasyTeam {
  players: { name: string; team: string; role: string; points: number; credits: number; isCaptain: boolean; isViceCaptain: boolean }[];
  totalPoints: number;
  totalCredits: number;
  captain: string;
  viceCaptain: string;
  analysis: string;
}

export interface TrendAnalysis {
  period: string;
  metric: string;
  current: number;
  previous: number;
  change: number;
  changePercent: number;
  trend: 'up' | 'down' | 'stable';
  insight: string;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function calculateHomeAdvantage(homeFactor: number = 0.12): number {
  return homeFactor;
}

function calculateRecentForm(recentResults: string[]): number {
  const wins = recentResults.filter((r) => r === 'W').length;
  return wins / Math.max(recentResults.length, 1);
}

function calculateHeadToHead(homeWins: number, awayWins: number, draws: number): { home: number; away: number } {
  const total = homeWins + awayWins + draws || 1;
  return { home: homeWins / total, away: awayWins / total };
}

export function predictMatch(params: {
  homeStrength?: number;
  awayStrength?: number;
  homeForm?: string[];
  awayForm?: string[];
  homeH2HWins?: number;
  awayH2HWins?: number;
  draws?: number;
  isHome?: boolean;
  weather?: string;
  pitch?: string;
}): MatchPrediction {
  const homeStr = params.homeStrength ?? 0.6;
  const awayStr = params.awayStrength ?? 0.5;
  const homeForm = calculateRecentForm(params.homeForm || []);
  const awayForm = calculateRecentForm(params.awayForm || []);
  const h2h = calculateHeadToHead(params.homeH2HWins || 5, params.awayH2HWins || 3, params.draws || 2);

  let homeScore = homeStr * 35 + (params.isHome ? 12 : 0) + homeForm * 20 + h2h.home * 15;
  let awayScore = awayStr * 35 + awayForm * 20 + h2h.away * 15;
  const drawScore = Math.max(0, 30 - Math.abs(homeScore - awayScore));

  if (params.weather === 'rain') {
    homeScore *= 0.9;
    awayScore *= 0.9;
  }
  if (params.pitch === 'batting') {
    homeScore *= 1.05;
    awayScore *= 1.05;
  }

  const total = homeScore + awayScore + drawScore || 1;
  const homeWin = clamp(Math.round((homeScore / total) * 100), 5, 90);
  const awayWin = clamp(Math.round((awayScore / total) * 100), 5, 90);
  const draw = clamp(100 - homeWin - awayWin, 2, 25);
  const confidence = clamp(Math.round(50 + Math.abs(homeWin - awayWin) * 0.5 + homeForm * 20), 40, 95);

  const factors = [
    { name: 'Home Advantage', impact: params.isHome ? 12 : 0, detail: params.isHome ? 'Playing at home gives significant advantage' : 'Away team' },
    { name: 'Recent Form', impact: Math.round((homeForm - awayForm) * 20), detail: `Home: ${Math.round(homeForm * 100)}% win rate, Away: ${Math.round(awayForm * 100)}%` },
    { name: 'Head-to-Head', impact: Math.round((h2h.home - h2h.away) * 15), detail: `Home won ${params.homeH2HWins || 5}/${(params.homeH2HWins || 5) + (params.awayH2HWins || 3) + (params.draws || 2)} meetings` },
    { name: 'Team Strength', impact: Math.round((homeStr - awayStr) * 35), detail: `Home: ${(homeStr * 100).toFixed(0)}%, Away: ${(awayStr * 100).toFixed(0)}%` },
  ];

  const winner = homeWin > awayWin ? 'Home' : awayWin > homeWin ? 'Away' : 'Draw';
  const summary = `Based on our analysis, ${winner === 'Home' ? 'the home team' : winner === 'Away' ? 'the away team' : 'a draw'} is most likely with ${winner === 'Home' ? homeWin : winner === 'Away' ? awayWin : draw}% probability. Confidence: ${confidence}%.`;

  return { homeWin, awayWin, draw, confidence, factors, summary };
}

export function generateWinProbability(
  totalOvers: number = 50,
  targetScore: number = 250,
  currentScore: number = 120,
  currentWickets: number = 3,
  currentOver: number = 20
): WinProbabilityOver[] {
  const result: WinProbabilityOver[] = [];
  const overIncrement = Math.max(1, Math.floor((totalOvers - currentOver) / 10));

  for (let over = currentOver; over <= totalOvers; over += overIncrement) {
    const oversLeft = totalOvers - over;
    const wicketsLost = currentWickets;
    const wicketsLeft = 10 - wicketsLost;
    const requiredRunRate = (targetScore - currentScore) / Math.max(oversLeft, 1);
    const currentRunRate = currentScore / Math.max(over, 1);
    const wicketFactor = wicketsLeft / 10;
    const rrFactor = currentRunRate / Math.max(requiredRunRate, 0.1);

    const homeWin = clamp(Math.round(50 + (rrFactor - 1) * 30 + wicketFactor * 20 - (requiredRunRate > currentRunRate ? 10 : 0)), 5, 95);
    const awayWin = clamp(100 - homeWin - 3, 3, 95);
    const draw = clamp(100 - homeWin - awayWin, 2, 20);

    result.push({ over, homeWin, awayWin, draw });
  }
  return result;
}

export function comparePlayers(params: {
  player1Name: string;
  player1Stats: Record<string, number>;
  player2Name: string;
  player2Stats: Record<string, number>;
}): PlayerComparison {
  const keys = Object.keys(params.player1Stats);
  const strengths: { player: string; area: string; value: number }[] = [];
  let p1Score = 0;
  let p2Score = 0;

  for (const key of keys) {
    const v1 = params.player1Stats[key] || 0;
    const v2 = params.player2Stats[key] || 0;
    if (v1 > v2) { p1Score++; strengths.push({ player: params.player1Name, area: key, value: v1 }); }
    else if (v2 > v1) { p2Score++; strengths.push({ player: params.player2Name, area: key, value: v2 }); }
  }

  const winner = p1Score > p2Score ? params.player1Name : p2Score > p1Score ? params.player2Name : 'Tie';
  const analysis = `${winner === 'Tie' ? 'Both players are evenly matched' : `${winner} has the edge`}. ${params.player1Name} leads in ${p1Score} categories, ${params.player2Name} in ${p2Score}.`;

  return {
    player1: { name: params.player1Name, stats: params.player1Stats },
    player2: { name: params.player2Name, stats: params.player2Stats },
    winner,
    strengths: strengths.sort((a, b) => b.value - a.value),
    analysis,
  };
}

export function generateFantasyTeam(params: {
  availablePlayers: { name: string; team: string; role: string; recentPoints: number[]; credits: number }[];
  budget?: number;
  format?: string;
}): FantasyTeam {
  const budget = params.budget || 100;
  const sorted = [...params.availablePlayers].sort((a, b) => {
    const avgA = a.recentPoints.reduce((s, p) => s + p, 0) / Math.max(a.recentPoints.length, 1);
    const avgB = b.recentPoints.reduce((s, p) => s + p, 0) / Math.max(b.recentPoints.length, 1);
    return avgB - avgA;
  });

  const selected: FantasyTeam['players'] = [];
  let totalCredits = 0;
  const maxPerTeam = 7;

  const teamCounts: Record<string, number> = {};
  for (const player of sorted) {
    if (selected.length >= 11) break;
    const teamCount = teamCounts[player.team] || 0;
    if (teamCount >= maxPerTeam) continue;
    if (totalCredits + player.credits > budget) continue;

    const avgPoints = player.recentPoints.reduce((s, p) => s + p, 0) / Math.max(player.recentPoints.length, 1);
    selected.push({
      name: player.name,
      team: player.team,
      role: player.role,
      points: Math.round(avgPoints),
      credits: player.credits,
      isCaptain: false,
      isViceCaptain: false,
    });
    totalCredits += player.credits;
    teamCounts[player.team] = teamCount + 1;
  }

  if (selected.length > 0) selected[0].isCaptain = true;
  if (selected.length > 1) selected[1].isViceCaptain = true;

  const totalPoints = selected.reduce((s, p) => s + p.points * (p.isCaptain ? 2 : 1), 0);
  const captain = selected.find((p) => p.isCaptain)?.name || '';
  const viceCaptain = selected.find((p) => p.isViceCaptain)?.name || '';

  return {
    players: selected,
    totalPoints,
    totalCredits,
    captain,
    viceCaptain,
    analysis: `Team has ${selected.length} players within ${totalCredits}/${budget} credits. Captain: ${captain}, Vice-Captain: ${viceCaptain}.`,
  };
}

export function analyzeTrends(params: {
  data: { date: string; value: number }[];
  metric: string;
}): TrendAnalysis[] {
  const result: TrendAnalysis[] = [];
  const len = params.data.length;
  if (len < 2) return result;

  for (let i = 1; i < len; i++) {
    const current = params.data[i].value;
    const previous = params.data[i - 1].value;
    const change = current - previous;
    const changePercent = previous !== 0 ? (change / previous) * 100 : 0;
    const trend = change > 1 ? 'up' : change < -1 ? 'down' : 'stable';

    result.push({
      period: params.data[i].date,
      metric: params.metric,
      current,
      previous,
      change,
      changePercent: Math.round(changePercent * 10) / 10,
      trend,
      insight: `${params.metric} ${trend === 'up' ? 'increased' : trend === 'down' ? 'decreased' : 'remained stable'} by ${Math.abs(changePercent).toFixed(1)}%`,
    });
  }
  return result;
}
