'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Swords, BarChart3, Trophy, Loader2 } from 'lucide-react';

interface Team {
  id: string;
  name: string;
  sportId: string;
}

interface H2HData {
  teamAId: string;
  teamBId: string;
  totalMatches: number;
  teamAWins: number;
  teamBWins: number;
  draws: number;
  recentMatches: any[];
}

export default function AdminH2HPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [teamAId, setTeamAId] = useState('');
  const [teamBId, setTeamBId] = useState('');
  const [h2hData, setH2hData] = useState<H2HData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/v1/teams?limit=100')
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setTeams(data.data);
      });
  }, []);

  const fetchH2H = async () => {
    if (!teamAId || !teamBId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/v1/h2h?teamAId=${teamAId}&teamBId=${teamBId}`);
      const data = await res.json();
      if (data.success) setH2hData(data.data);
    } catch (error) {
      console.error('Failed to fetch H2H:', error);
    } finally {
      setLoading(false);
    }
  };

  const teamA = teams.find((t) => t.id === teamAId);
  const teamB = teams.find((t) => t.id === teamBId);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Head-to-Head Analysis</h1>
        <p className="text-muted-foreground mt-1">Compare historical match records between two teams</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Swords className="h-5 w-5" />
            Select Teams
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-4">
            <div className="flex-1">
              <p className="text-sm font-medium mb-2">Team A</p>
              <Select value={teamAId} onValueChange={setTeamAId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select team" />
                </SelectTrigger>
                <SelectContent>
                  {teams.map((team) => (
                    <SelectItem key={team.id} value={team.id}>{team.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="pb-1">
              <Badge variant="outline" className="text-lg px-4 py-1">VS</Badge>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium mb-2">Team B</p>
              <Select value={teamBId} onValueChange={setTeamBId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select team" />
                </SelectTrigger>
                <SelectContent>
                  {teams.map((team) => (
                    <SelectItem key={team.id} value={team.id}>{team.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={fetchH2H} disabled={!teamAId || !teamBId || teamAId === teamBId || loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Analyze
            </Button>
          </div>
        </CardContent>
      </Card>

      {h2hData && (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-center">{teamA?.name}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-4xl font-bold text-green-600">{h2hData.teamAWins}</div>
                <p className="text-sm text-muted-foreground">Wins</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-center">Draws</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-4xl font-bold text-yellow-600">{h2hData.draws}</div>
                <p className="text-sm text-muted-foreground">Draws</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-center">{teamB?.name}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-4xl font-bold text-blue-600">{h2hData.teamBWins}</div>
                <p className="text-sm text-muted-foreground">Wins</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Matches</CardTitle>
              <CardDescription>Last {h2hData.recentMatches.length} encounters</CardDescription>
            </CardHeader>
            <CardContent>
              {h2hData.recentMatches.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No completed matches found between these teams</p>
              ) : (
                <div className="space-y-3">
                  {h2hData.recentMatches.map((match) => (
                    <div key={match.id} className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">{match.sport.name}</Badge>
                        <span className="font-medium">
                          {match.homeTeam.name} vs {match.awayTeam.name}
                        </span>
                      </div>
                      <div className="text-right">
                        {match.homeScore != null && match.awayScore != null && (
                          <Badge className="bg-green-500/10 text-green-700">
                            <Trophy className="h-3 w-3 mr-1" />
                            {match.homeScore > match.awayScore ? match.homeTeam.name :
                             match.awayScore > match.homeScore ? match.awayTeam.name : 'Draw'}
                          </Badge>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(match.scheduledAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
