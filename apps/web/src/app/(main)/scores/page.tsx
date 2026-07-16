'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Radio, RefreshCw, Wifi, WifiOff, Zap, Users, Filter, Search, ExternalLink } from 'lucide-react';
import { io, Socket } from 'socket.io-client';
import Link from 'next/link';

interface ScoreUpdate {
  matchId: string;
  homeScore: any;
  awayScore: any;
  status: string;
  currentInning?: number;
  battingTeam?: string;
  bowlingTeam?: string;
  timestamp: string;
}

interface LiveMatch {
  id: string;
  status: string;
  homeScore: number | null;
  awayScore: number | null;
  format: string;
  scheduledAt: string;
  homeTeam: { name: string; shortName?: string | null };
  awayTeam: { name: string; shortName?: string | null };
  sport: { name: string; slug: string };
  liveScore?: any;
  viewers?: number;
}

export default function RealTimeScoresPage() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [reconnecting, setReconnecting] = useState(false);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const [liveMatches, setLiveMatches] = useState<LiveMatch[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<string | null>(null);
  const [scoreUpdates, setScoreUpdates] = useState<ScoreUpdate[]>([]);
  const [viewers, setViewers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [sportFilter, setSportFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const updatesEndRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);

  // Get unique sports from matches
  const availableSports = Array.from(new Set(liveMatches.map(m => m.sport.name)));

  // Filter matches by sport and search
  const filteredMatches = liveMatches.filter(match => {
    const matchesSport = sportFilter === 'all' || match.sport.name === sportFilter;
    const matchesSearch = searchQuery === '' || 
      match.homeTeam.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      match.awayTeam.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSport && matchesSearch;
  });

  // Connect to WebSocket with auto-reconnect
  const connectSocket = useCallback(() => {
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:3001';
    const newSocket = io(wsUrl, {
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 15,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 10000,
    });

    newSocket.on('connect', () => {
      setConnected(true);
      setReconnecting(false);
      setReconnectAttempts(0);
      console.log('Connected to WebSocket');
    });

    newSocket.on('disconnect', (reason) => {
      setConnected(false);
      console.log('Disconnected from WebSocket:', reason);
      if (reason === 'io server disconnect') {
        // Server disconnected us, try to reconnect
        setReconnecting(true);
        newSocket.connect();
      }
    });

    newSocket.on('reconnect_attempt', (attempt) => {
      setReconnectAttempts(attempt);
      setReconnecting(true);
      console.log(`Reconnection attempt ${attempt}`);
    });

    newSocket.on('reconnect', () => {
      setConnected(true);
      setReconnecting(false);
      setReconnectAttempts(0);
      console.log('Reconnected to WebSocket');
    });

    newSocket.on('reconnect_failed', () => {
      setReconnecting(false);
      console.log('Failed to reconnect to WebSocket');
    });

    newSocket.on('score:update', (data: ScoreUpdate) => {
      setScoreUpdates((prev) => [data, ...prev].slice(0, 100));
      setLiveMatches((prev) =>
        prev.map((m) =>
          m.id === data.matchId
            ? { ...m, homeScore: data.homeScore, awayScore: data.awayScore, status: data.status }
            : m
        )
      );
    });

    newSocket.on('match:event', (data: any) => {
      setScoreUpdates((prev) => [
        { matchId: data.matchId, homeScore: null, awayScore: null, status: 'EVENT', timestamp: new Date().toISOString(), ...data },
        ...prev,
      ].slice(0, 100));
    });

    newSocket.on('viewer:update', (data: { matchId: string; viewers: number }) => {
      setLiveMatches((prev) =>
        prev.map((m) =>
          m.id === data.matchId ? { ...m, viewers: data.viewers } : m
        )
      );
    });

    socketRef.current = newSocket;
    setSocket(newSocket);

    return newSocket;
  }, []);

  // Initialize socket connection
  useEffect(() => {
    const socket = connectSocket();
    return () => {
      socket.disconnect();
    };
  }, [connectSocket]);

  // Fetch live matches
  useEffect(() => {
    fetchLiveMatches();
    const interval = setInterval(fetchLiveMatches, 10000);
    return () => clearInterval(interval);
  }, []);

  // Join match room when selected
  useEffect(() => {
    if (!socket || !connected || !selectedMatch) return;
    socket.emit('join:match', selectedMatch);
    return () => {
      socket.emit('leave:match', selectedMatch);
    };
  }, [socket, connected, selectedMatch]);

  // Auto-scroll updates
  useEffect(() => {
    updatesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [scoreUpdates]);

  const fetchLiveMatches = async () => {
    try {
      const [res1, res2] = await Promise.all([
        fetch('/api/v1/matches?status=LIVE&limit=50'),
        fetch('/api/v1/matches?status=IN_PROGRESS&limit=50'),
      ]);
      const [data1, data2] = await Promise.all([res1.json(), res2.json()]);
      const all = [...(data1.success ? data1.data : []), ...(data2.success ? data2.data : [])];
      const unique = all.filter((m: LiveMatch, i: number, self: LiveMatch[]) =>
        self.findIndex((x) => x.id === m.id) === i
      );
      setLiveMatches(unique);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  };

  const selectMatch = (matchId: string) => {
    if (selectedMatch) {
      socket?.emit('leave:match', selectedMatch);
    }
    setSelectedMatch(matchId);
    setScoreUpdates([]);
  };

  const forceReconnect = () => {
    if (socketRef.current) {
      socketRef.current.disconnect();
    }
    connectSocket();
  };

  const selectedMatchData = liveMatches.find((m) => m.id === selectedMatch);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Radio className={`h-8 w-8 ${connected ? 'text-red-500 animate-pulse' : 'text-gray-400'}`} />
            Live Scores
          </h1>
          <p className="text-muted-foreground mt-1">Real-time scores powered by WebSocket</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/espn">
            <Button variant="outline" size="sm" className="gap-2">
              <ExternalLink className="h-4 w-4" />
              ESPN Live Scores
            </Button>
          </Link>
          {connected ? (
            <Badge className="bg-green-500/10 text-green-700 gap-1">
              <Wifi className="h-3 w-3" /> Connected
            </Badge>
          ) : reconnecting ? (
            <Badge className="bg-yellow-500/10 text-yellow-700 gap-1 animate-pulse">
              <Wifi className="h-3 w-3" /> Reconnecting ({reconnectAttempts}/15)
            </Badge>
          ) : (
            <Badge variant="secondary" className="gap-1">
              <WifiOff className="h-3 w-3" /> Disconnected
            </Badge>
          )}
          <Button variant="outline" size="sm" onClick={forceReconnect} disabled={connected}>
            <RefreshCw className={`h-4 w-4 ${reconnecting ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={sportFilter} onValueChange={setSportFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by sport" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sports</SelectItem>
              {availableSports.map(sport => (
                <SelectItem key={sport} value={sport}>{sport}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search teams..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="text-sm text-muted-foreground flex items-center gap-1">
          <Users className="h-4 w-4" />
          {filteredMatches.length} matches
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Match List */}
        <div className="lg:col-span-1 space-y-3 max-h-[600px] overflow-y-auto">
          <h3 className="font-semibold text-sm text-gray-600 uppercase tracking-wider sticky top-0 bg-background py-2">
            Live Matches ({filteredMatches.length})
          </h3>
          {loading ? (
            [1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-4">
                  <div className="h-4 bg-muted rounded w-1/2 mb-2" />
                  <div className="h-6 bg-muted rounded w-1/3" />
                </CardContent>
              </Card>
            ))
          ) : filteredMatches.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <Radio className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">
                  {liveMatches.length === 0 ? 'No live matches' : 'No matches match your filter'}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredMatches.map((match) => (
              <Card
                key={match.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedMatch === match.id ? 'border-blue-500 shadow-lg ring-2 ring-blue-200' : ''
                }`}
                onClick={() => selectMatch(match.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline" className="text-xs">{match.sport.name}</Badge>
                    <div className="flex items-center gap-2">
                      {match.viewers && match.viewers > 0 && (
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Users className="h-3 w-3" /> {match.viewers}
                        </span>
                      )}
                      <Badge className={match.status === 'LIVE' ? 'bg-red-500 animate-pulse' : 'bg-yellow-500'}>
                        {match.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium truncate">{match.homeTeam.name}</span>
                      <span className="text-xl font-bold">{match.homeScore ?? '-'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium truncate">{match.awayTeam.name}</span>
                      <span className="text-xl font-bold">{match.awayScore ?? '-'}</span>
                    </div>
                  </div>
                  {match.liveScore && (
                    <div className="mt-2 text-xs text-muted-foreground">
                      {match.liveScore.battingTeam && `Batting: ${match.liveScore.battingTeam}`}
                      {match.liveScore.currentInning && ` | Inning ${match.liveScore.currentInning}`}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {selectedMatchData ? (
            <>
              {/* Score Card */}
              <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/20 dark:to-background">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="h-5 w-5 text-yellow-500" />
                      {selectedMatchData.sport.name}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge className={selectedMatchData.status === 'LIVE' ? 'bg-red-500' : 'bg-yellow-500'}>
                        {selectedMatchData.status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between py-6">
                    <div className="text-center flex-1">
                      <p className="text-sm text-muted-foreground">Home</p>
                      <p className="text-2xl font-bold mt-1">{selectedMatchData.homeTeam.name}</p>
                      <p className="text-5xl font-bold text-green-600 mt-2">
                        {selectedMatchData.homeScore ?? '-'}
                      </p>
                    </div>
                    <div className="text-center px-8">
                      <p className="text-3xl font-bold text-gray-300">VS</p>
                    </div>
                    <div className="text-center flex-1">
                      <p className="text-sm text-muted-foreground">Away</p>
                      <p className="text-2xl font-bold mt-1">{selectedMatchData.awayTeam.name}</p>
                      <p className="text-5xl font-bold text-green-600 mt-2">
                        {selectedMatchData.awayScore ?? '-'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Live Updates Feed */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Radio className="h-4 w-4 text-red-500 animate-pulse" />
                    Live Updates Feed
                    <Badge variant="secondary" className="ml-auto">{scoreUpdates.length}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {scoreUpdates.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Radio className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>Waiting for live updates...</p>
                      <p className="text-xs mt-1">Updates will appear here in real-time</p>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-[400px] overflow-y-auto">
                      {scoreUpdates.map((update, i) => (
                        <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                          <div className="mt-1">
                            <Zap className="h-4 w-4 text-yellow-500" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              {update.homeScore != null && (
                                <Badge variant="outline">Home: {update.homeScore}</Badge>
                              )}
                              {update.awayScore != null && (
                                <Badge variant="outline">Away: {update.awayScore}</Badge>
                              )}
                              {update.status === 'EVENT' && (
                                <Badge className="bg-purple-500">{(update as any).event}</Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              {new Date(update.timestamp).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      ))}
                      <div ref={updatesEndRef} />
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Radio className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Select a Match</h3>
                <p className="text-muted-foreground">
                  Choose a live match from the list to see real-time score updates
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
