'use client';

import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Radio, RefreshCw, Wifi, WifiOff, ExternalLink, Clock, Trophy, Zap } from 'lucide-react';

interface ESPNTeam {
  id: string;
  name: string;
  abbreviation: string;
  color: string;
  logo: string;
  score: string;
}

interface ESPNMatch {
  id: string;
  externalId: string;
  source: string;
  sport: string;
  league: string;
  leagueName: string;
  name: string;
  status: string;
  statusDetail: string;
  state: 'pre' | 'in' | 'post';
  clock: string;
  date: string;
  homeTeam: ESPNTeam;
  awayTeam: ESPNTeam;
  venue?: string;
}

const SPORT_TABS = [
  { value: 'all', label: 'All Sports', icon: Trophy },
  { value: 'football', label: 'Football', icon: Zap },
  { value: 'soccer', label: 'Soccer', icon: Zap },
  { value: 'basketball', label: 'Basketball', icon: Zap },
  { value: 'baseball', label: 'Baseball', icon: Zap },
  { value: 'hockey', label: 'Hockey', icon: Zap },
];

export default function ESPNScoresPage() {
  const [matches, setMatches] = useState<ESPNMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [autoRefresh, setAutoRefresh] = useState(true);

  const fetchScores = useCallback(async () => {
    try {
      const params = activeTab !== 'all' ? `?sport=${activeTab}` : '';
      const res = await fetch(`/api/v1/espn/live${params}`);
      const data = await res.json();
      if (data.success) {
        setMatches(data.data);
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false);
      setLastRefresh(new Date());
    }
  }, [activeTab]);

  useEffect(() => {
    setLoading(true);
    fetchScores();
  }, [fetchScores]);

  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(fetchScores, 30000);
    return () => clearInterval(interval);
  }, [autoRefresh, fetchScores]);

  const liveMatches = matches.filter(m => m.state === 'in');
  const scheduledMatches = matches.filter(m => m.state === 'pre');
  const completedMatches = matches.filter(m => m.state === 'post');

  const groupedByLeague = matches.reduce((acc, match) => {
    const key = `${match.sport}-${match.league}`;
    if (!acc[key]) acc[key] = { sport: match.sport, league: match.leagueName, matches: [] };
    acc[key].matches.push(match);
    return acc;
  }, {} as Record<string, { sport: string; league: string; matches: ESPNMatch[] }>);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Trophy className="h-8 w-8 text-blue-600" />
            Live Sports Scores
          </h1>
          <p className="text-muted-foreground mt-1">
            Real-time scores powered by ESPN • {matches.length} matches across {Object.keys(groupedByLeague).length} leagues
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge className={liveMatches.length > 0 ? 'bg-red-500 animate-pulse' : 'bg-gray-400'}>
            <Radio className="h-3 w-3 mr-1" />
            {liveMatches.length} LIVE
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
          >
            {autoRefresh ? 'Auto: ON' : 'Auto: OFF'}
          </Button>
          <Button variant="outline" size="sm" onClick={fetchScores}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Sport Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList>
          {SPORT_TABS.map(tab => (
            <TabsTrigger key={tab.value} value={tab.value} className="gap-1">
              <tab.icon className="h-3 w-3" />
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Stats Bar */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-3 text-center">
            <p className="text-2xl font-bold text-red-500">{liveMatches.length}</p>
            <p className="text-xs text-muted-foreground">Live Now</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <p className="text-2xl font-bold text-blue-500">{scheduledMatches.length}</p>
            <p className="text-xs text-muted-foreground">Scheduled</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <p className="text-2xl font-bold text-green-500">{completedMatches.length}</p>
            <p className="text-xs text-muted-foreground">Completed</p>
          </CardContent>
        </Card>
      </div>

      {/* Matches by League */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-muted rounded w-1/3 mb-4" />
                <div className="space-y-3">
                  {[1, 2].map(j => (
                    <div key={j} className="h-16 bg-muted rounded" />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : Object.keys(groupedByLeague).length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Trophy className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Matches Available</h3>
            <p className="text-muted-foreground">No matches found for the selected filter.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedByLeague).map(([key, group]) => (
            <Card key={key}>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <span className="capitalize">{group.sport}</span>
                  <span className="text-muted-foreground">•</span>
                  <span>{group.league}</span>
                  <Badge variant="secondary" className="ml-2">{group.matches.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {group.matches.map(match => (
                  <div
                    key={match.id}
                    className={`flex items-center justify-between p-4 rounded-lg border transition-all hover:shadow-md ${
                      match.state === 'in' ? 'bg-red-50 dark:bg-red-950/10 border-red-200' : 
                      match.state === 'post' ? 'bg-gray-50 dark:bg-gray-800/30' : 'bg-white dark:bg-gray-900/30'
                    }`}
                  >
                    {/* Status */}
                    <div className="w-24 flex-shrink-0">
                      {match.state === 'in' ? (
                        <Badge className="bg-red-500 animate-pulse">
                          <Radio className="h-3 w-3 mr-1" /> LIVE
                        </Badge>
                      ) : match.state === 'post' ? (
                        <Badge variant="secondary">Final</Badge>
                      ) : (
                        <Badge variant="outline">
                          <Clock className="h-3 w-3 mr-1" />
                          {new Date(match.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </Badge>
                      )}
                    </div>

                    {/* Home Team */}
                    <div className="flex items-center gap-3 flex-1 justify-end">
                      <span className="text-sm font-medium text-right">{match.homeTeam.name}</span>
                      {match.homeTeam.logo && (
                        <img src={match.homeTeam.logo} alt="" className="w-8 h-8" />
                      )}
                      <span className="text-2xl font-bold w-12 text-center">{match.homeTeam.score}</span>
                    </div>

                    {/* VS / Score */}
                    <div className="px-4 text-center">
                      {match.state === 'in' ? (
                        <div className="text-sm font-mono text-red-600">
                          {match.clock || 'LIVE'}
                        </div>
                      ) : match.state === 'post' ? (
                        <span className="text-sm text-muted-foreground">Final</span>
                      ) : (
                        <span className="text-sm text-muted-foreground">vs</span>
                      )}
                    </div>

                    {/* Away Team */}
                    <div className="flex items-center gap-3 flex-1">
                      <span className="text-2xl font-bold w-12 text-center">{match.awayTeam.score}</span>
                      {match.awayTeam.logo && (
                        <img src={match.awayTeam.logo} alt="" className="w-8 h-8" />
                      )}
                      <span className="text-sm font-medium">{match.awayTeam.name}</span>
                    </div>

                    {/* Venue & Details */}
                    <div className="w-48 flex-shrink-0 text-right">
                      {match.venue && (
                        <p className="text-xs text-muted-foreground truncate">{match.venue}</p>
                      )}
                      <p className="text-xs text-muted-foreground">{match.statusDetail}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="mt-8 text-center text-sm text-muted-foreground">
        <p>Data provided by ESPN • Auto-refreshes every 30 seconds</p>
        <p className="mt-1">Last updated: {lastRefresh.toLocaleTimeString()}</p>
      </div>
    </div>
  );
}
