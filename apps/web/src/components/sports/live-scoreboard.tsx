'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Radio, RefreshCw, Wifi, WifiOff } from 'lucide-react';
import { useSocket } from '@/hooks/use-socket';

interface LiveScoreData {
  matchId: string;
  homeScore: any;
  awayScore: any;
  status: string;
  overs?: string;
  runRate?: string;
  currentInning?: number;
  lastUpdate?: string;
  events?: any[];
}

interface LiveScoreboardProps {
  matchId: string;
  initialData?: {
    homeTeam: { name: string; shortName?: string | null } | null;
    awayTeam: { name: string; shortName?: string | null } | null;
    homeScore: number | null;
    awayScore: number | null;
    status: string;
  };
}

export function LiveScoreboard({ matchId, initialData }: LiveScoreboardProps) {
  const [liveData, setLiveData] = useState<LiveScoreData | null>(null);
  const [lastUpdate, setLastUpdate] = useState<string>('');
  const { socket, isConnected, connect } = useSocket();

  useEffect(() => {
    connect();
  }, [connect]);

  const fetchLiveScore = async () => {
    try {
      const res = await fetch(`/api/v1/matches/${matchId}/live`);
      const data = await res.json();
      if (data.success) {
        setLiveData(data.data);
        setLastUpdate(new Date().toLocaleTimeString());
      }
    } catch {}
  };

  useEffect(() => {
    fetchLiveScore();
    const interval = setInterval(fetchLiveScore, 10000);
    return () => clearInterval(interval);
  }, [matchId]);

  useEffect(() => {
    if (!isConnected || !socket || !matchId) return;

    socket.emit('join:match', matchId);

    const handleScoreUpdate = (data: any) => {
      if (data.matchId === matchId) {
        setLiveData((prev) => ({ ...prev, ...data }));
        setLastUpdate(new Date().toLocaleTimeString());
      }
    };

    const handleMatchEvent = (data: any) => {
      if (data.matchId === matchId) {
        setLiveData((prev) => ({
          matchId,
          homeScore: prev?.homeScore,
          awayScore: prev?.awayScore,
          status: prev?.status || '',
          events: [...(prev?.events || []), data],
        }));
      }
    };

    socket.on('score:update', handleScoreUpdate);
    socket.on('match:event', handleMatchEvent);

    return () => {
      socket.off('score:update', handleScoreUpdate);
      socket.off('match:event', handleMatchEvent);
      socket.emit('leave:match', matchId);
    };
  }, [isConnected, socket, matchId]);

  const isLive = initialData?.status === 'LIVE' || initialData?.status === 'IN_PROGRESS';

  return (
    <Card className={isLive ? 'border-red-200 bg-red-50/30 dark:bg-red-950/10' : ''}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Radio className={`h-5 w-5 ${isLive ? 'text-red-500 animate-pulse' : 'text-muted-foreground'}`} />
            Live Scoreboard
          </CardTitle>
          <div className="flex items-center gap-2">
            {isConnected ? (
              <Badge className="bg-green-500/10 text-green-700">
                <Wifi className="h-3 w-3 mr-1" /> Live
              </Badge>
            ) : (
              <Badge variant="secondary">
                <WifiOff className="h-3 w-3 mr-1" /> Polling
              </Badge>
            )}
            <Button size="sm" variant="ghost" onClick={fetchLiveScore}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between py-4">
          <div className="text-center flex-1">
            <p className="text-sm text-muted-foreground">Home</p>
            <p className="text-2xl font-bold">{initialData?.homeTeam?.name || 'TBD'}</p>
            {liveData?.homeScore != null && (
              <p className="text-3xl font-bold text-green-600 mt-1">
                {typeof liveData.homeScore === 'object' ? JSON.stringify(liveData.homeScore) : liveData.homeScore}
              </p>
            )}
            {initialData?.homeScore != null && liveData?.homeScore == null && (
              <p className="text-3xl font-bold mt-1">{initialData.homeScore}</p>
            )}
          </div>
          <div className="text-center px-4">
            <p className="text-4xl font-bold text-muted-foreground">VS</p>
            {liveData?.overs && <p className="text-sm text-muted-foreground mt-1">{liveData.overs}</p>}
            {liveData?.runRate && <p className="text-xs text-muted-foreground">RR: {liveData.runRate}</p>}
          </div>
          <div className="text-center flex-1">
            <p className="text-sm text-muted-foreground">Away</p>
            <p className="text-2xl font-bold">{initialData?.awayTeam?.name || 'TBD'}</p>
            {liveData?.awayScore != null && (
              <p className="text-3xl font-bold text-green-600 mt-1">
                {typeof liveData.awayScore === 'object' ? JSON.stringify(liveData.awayScore) : liveData.awayScore}
              </p>
            )}
            {initialData?.awayScore != null && liveData?.awayScore == null && (
              <p className="text-3xl font-bold mt-1">{initialData.awayScore}</p>
            )}
          </div>
        </div>
        {lastUpdate && (
          <p className="text-xs text-muted-foreground text-center">Last updated: {lastUpdate}</p>
        )}
      </CardContent>
    </Card>
  );
}
