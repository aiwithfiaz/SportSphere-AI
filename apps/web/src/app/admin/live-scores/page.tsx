'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Radio, RefreshCw, Wifi, WifiOff, Send, Zap } from 'lucide-react';

interface Match {
  id: string;
  status: string;
  homeScore: number | null;
  awayScore: number | null;
  scheduledAt: string;
  format: string;
  homeTeam: { name: string; shortName?: string | null };
  awayTeam: { name: string; shortName?: string | null };
  sport: { name: string; slug: string };
  liveScore?: {
    currentInning: number | null;
    battingTeam: string | null;
    bowlingTeam: string | null;
    currentScore: any;
  } | null;
}

export default function AdminLiveScorePage() {
  const [liveMatches, setLiveMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [homeScore, setHomeScore] = useState('');
  const [awayScore, setAwayScore] = useState('');
  const [matchStatus, setMatchStatus] = useState('');
  const [currentInning, setCurrentInning] = useState('');
  const [battingTeam, setBattingTeam] = useState('');
  const [bowlingTeam, setBowlingTeam] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchLiveMatches();
    const interval = setInterval(fetchLiveMatches, 15000);
    return () => clearInterval(interval);
  }, []);

  const fetchLiveMatches = async () => {
    try {
      const res = await fetch('/api/v1/matches?status=LIVE&limit=20');
      const data = await res.json();
      if (data.success) {
        setLiveMatches(data.data);
      }
      // Also fetch IN_PROGRESS
      const res2 = await fetch('/api/v1/matches?status=IN_PROGRESS&limit=20');
      const data2 = await res2.json();
      if (data2.success) {
        setLiveMatches((prev) => {
          const existingIds = new Set(prev.map((m) => m.id));
          const newMatches = data2.data.filter((m: Match) => !existingIds.has(m.id));
          return [...prev, ...newMatches];
        });
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  };

  const fetchMatchScore = async (matchId: string) => {
    try {
      const res = await fetch(`/api/v1/matches/${matchId}/score`);
      const data = await res.json();
      if (data.success && data.data) {
        const m = data.data;
        setSelectedMatch(m);
        setHomeScore(m.homeScore?.toString() || '');
        setAwayScore(m.awayScore?.toString() || '');
        setMatchStatus(m.status);
        setCurrentInning(m.liveScore?.currentInning?.toString() || '');
        setBattingTeam(m.liveScore?.battingTeam || '');
        setBowlingTeam(m.liveScore?.bowlingTeam || '');
      }
    } catch {
      setError('Failed to fetch match details');
    }
  };

  const handleScoreUpdate = async () => {
    if (!selectedMatch) return;
    setSending(true);
    setError('');
    setSent(false);

    try {
      const body: any = { matchId: selectedMatch.id };
      if (homeScore) body.homeScore = parseInt(homeScore);
      if (awayScore) body.awayScore = parseInt(awayScore);
      if (matchStatus) body.status = matchStatus;
      if (currentInning) body.currentInning = parseInt(currentInning);
      if (battingTeam) body.battingTeam = battingTeam;
      if (bowlingTeam) body.bowlingTeam = bowlingTeam;

      const res = await fetch('/api/v1/matches/${selectedMatch.id}/score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (data.success) {
        setSent(true);
        setSelectedMatch(data.data);
        fetchLiveMatches();
        setTimeout(() => setSent(false), 3000);
      } else {
        setError(data.error || 'Failed to update score');
      }
    } catch {
      setError('Network error');
    } finally {
      setSending(false);
    }
  };

  const handleQuickStatus = async (matchId: string, status: string) => {
    try {
      await fetch(`/api/v1/matches/${matchId}/score`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ matchId, status }),
      });
      fetchLiveMatches();
      if (selectedMatch?.id === matchId) {
        fetchMatchScore(matchId);
      }
    } catch {}
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Live Score Management</h2>
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-muted rounded w-1/3 mb-2" />
                <div className="h-8 bg-muted rounded w-1/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Radio className="h-6 w-6 text-red-500 animate-pulse" />
            Live Score Management
          </h2>
          <p className="text-gray-600 dark:text-gray-400">Update scores for live matches in real-time.</p>
        </div>
        <Button variant="outline" onClick={fetchLiveMatches}>
          <RefreshCw className="h-4 w-4 mr-2" />Refresh
        </Button>
      </div>

      {liveMatches.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Radio className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No live matches currently</p>
            <p className="text-sm text-gray-400 mt-1">Start a match from the Matches admin to see it here</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Match List */}
          <div className="lg:col-span-1 space-y-3">
            <h3 className="font-semibold text-sm text-gray-600 uppercase tracking-wider">Live Matches ({liveMatches.length})</h3>
            {liveMatches.map((match) => (
              <Card
                key={match.id}
                className={`cursor-pointer transition-all hover:shadow-md ${selectedMatch?.id === match.id ? 'border-blue-500 shadow-lg' : ''}`}
                onClick={() => fetchMatchScore(match.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline" className="text-xs">{match.sport.name}</Badge>
                    <Badge className={match.status === 'LIVE' ? 'bg-red-500' : 'bg-yellow-500'}>
                      {match.status}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium truncate">{match.homeTeam.name}</span>
                      <span className="text-lg font-bold">{match.homeScore ?? '-'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium truncate">{match.awayTeam.name}</span>
                      <span className="text-lg font-bold">{match.awayScore ?? '-'}</span>
                    </div>
                  </div>
                  <div className="flex gap-1 mt-3">
                    <Button size="sm" variant="outline" className="flex-1 text-xs h-7"
                      onClick={(e) => { e.stopPropagation(); handleQuickStatus(match.id, 'COMPLETED'); }}>
                      End Match
                    </Button>
                    {match.status === 'COMPLETED' && (
                      <Button size="sm" variant="outline" className="flex-1 text-xs h-7"
                        onClick={(e) => { e.stopPropagation(); handleQuickStatus(match.id, 'LIVE'); }}>
                        Restart
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Score Editor */}
          <div className="lg:col-span-2">
            {selectedMatch ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-yellow-500" />
                    Update Score
                  </CardTitle>
                  <CardDescription>
                    {selectedMatch.homeTeam.name} vs {selectedMatch.awayTeam.name} ({selectedMatch.sport.name})
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Current Score Display */}
                  <div className="flex items-center justify-center gap-8 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Home</p>
                      <p className="text-xl font-bold">{selectedMatch.homeTeam.name}</p>
                      <p className="text-3xl font-bold text-green-600">{selectedMatch.homeScore ?? '-'}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-400">VS</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Away</p>
                      <p className="text-xl font-bold">{selectedMatch.awayTeam.name}</p>
                      <p className="text-3xl font-bold text-green-600">{selectedMatch.awayScore ?? '-'}</p>
                    </div>
                  </div>

                  {/* Score Inputs */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="homeScore">{selectedMatch.homeTeam.name} Score</Label>
                      <Input
                        id="homeScore"
                        type="number"
                        value={homeScore}
                        onChange={(e) => setHomeScore(e.target.value)}
                        placeholder="0"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="awayScore">{selectedMatch.awayTeam.name} Score</Label>
                      <Input
                        id="awayScore"
                        type="number"
                        value={awayScore}
                        onChange={(e) => setAwayScore(e.target.value)}
                        placeholder="0"
                      />
                    </div>
                  </div>

                  {/* Status */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Match Status</Label>
                      <Select value={matchStatus} onValueChange={setMatchStatus}>
                        <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                          <SelectItem value="LIVE">Live</SelectItem>
                          <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                          <SelectItem value="COMPLETED">Completed</SelectItem>
                          <SelectItem value="CANCELLED">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Current Inning</Label>
                      <Select value={currentInning} onValueChange={setCurrentInning}>
                        <SelectTrigger><SelectValue placeholder="Select inning" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1st Inning</SelectItem>
                          <SelectItem value="2">2nd Inning</SelectItem>
                          <SelectItem value="3">3rd Inning</SelectItem>
                          <SelectItem value="4">4th Inning</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Batting/Bowling */}
                  {(selectedMatch.sport.slug === 'cricket') && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Batting Team</Label>
                        <Select value={battingTeam} onValueChange={setBattingTeam}>
                          <SelectTrigger><SelectValue placeholder="Select team" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value={selectedMatch.homeTeam.name}>{selectedMatch.homeTeam.name}</SelectItem>
                            <SelectItem value={selectedMatch.awayTeam.name}>{selectedMatch.awayTeam.name}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Bowling Team</Label>
                        <Select value={bowlingTeam} onValueChange={setBowlingTeam}>
                          <SelectTrigger><SelectValue placeholder="Select team" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value={selectedMatch.homeTeam.name}>{selectedMatch.homeTeam.name}</SelectItem>
                            <SelectItem value={selectedMatch.awayTeam.name}>{selectedMatch.awayTeam.name}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}

                  {/* Error/Success Messages */}
                  {error && (
                    <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded text-sm text-red-700">
                      {error}
                    </div>
                  )}
                  {sent && (
                    <div className="p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded text-sm text-green-700 flex items-center gap-2">
                      <Wifi className="h-4 w-4" />Score updated and broadcast via WebSocket!
                    </div>
                  )}

                  {/* Submit */}
                  <Button onClick={handleScoreUpdate} disabled={sending} className="w-full" size="lg">
                    <Send className="h-4 w-4 mr-2" />
                    {sending ? 'Updating...' : 'Update & Broadcast Score'}
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <Radio className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Select a match to update its score</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
