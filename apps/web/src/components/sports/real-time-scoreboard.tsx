"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LiveIndicator } from "@/components/sports/live-indicator";

interface ScoreData {
  matchId: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  homeOvers?: number;
  awayOvers?: number;
  status: string;
  lastUpdated: string;
}

interface RealTimeScoreboardProps {
  matchId: string;
  initialData?: ScoreData;
}

export function RealTimeScoreboard({ matchId, initialData }: RealTimeScoreboardProps) {
  const [score, setScore] = useState<ScoreData | null>(initialData || null);
  const [connected, setConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<string>("");

  useEffect(() => {
    if (!initialData) return;

    setScore(initialData);
    setConnected(true);
    setLastUpdate(new Date().toLocaleTimeString());

    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:3001";
    let ws: WebSocket | null = null;
    let reconnectTimeout: NodeJS.Timeout;

    function connect() {
      try {
        ws = new WebSocket(`${wsUrl}?matchId=${matchId}`);

        ws.onopen = () => {
          setConnected(true);
          ws?.send(JSON.stringify({ type: "subscribe", matchId }));
        };

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data.type === "score_update" && data.matchId === matchId) {
              setScore((prev) => prev ? { ...prev, ...data.score } : prev);
              setLastUpdate(new Date().toLocaleTimeString());
            }
          } catch {
            // ignore parse errors
          }
        };

        ws.onclose = () => {
          setConnected(false);
          reconnectTimeout = setTimeout(connect, 5000);
        };

        ws.onerror = () => {
          ws?.close();
        };
      } catch {
        reconnectTimeout = setTimeout(connect, 5000);
      }
    }

    connect();

    return () => {
      clearTimeout(reconnectTimeout);
      ws?.close();
    };
  }, [matchId, initialData]);

  if (!score) {
    return (
      <Card className="animate-pulse">
        <CardContent className="p-6">
          <div className="h-20 bg-gray-200 dark:bg-gray-800 rounded" />
        </CardContent>
      </Card>
    );
  }

  const isLive = score.status === "LIVE" || score.status === "IN_PROGRESS";

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {isLive && <LiveIndicator />}
            <Badge variant={isLive ? "default" : "secondary"}>{score.status}</Badge>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <div className={`h-2 w-2 rounded-full ${connected ? "bg-green-500" : "bg-red-500"}`} />
            {connected ? "Connected" : "Reconnecting..."}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-center flex-1">
            <p className="text-lg font-bold">{score.homeTeam}</p>
          </div>

          <div className="text-center px-6">
            <p className="text-4xl font-bold">
              {score.homeScore} - {score.awayScore}
            </p>
            {score.homeOvers && (
              <p className="text-sm text-gray-500">
                ({score.homeOvers} ov{score.awayOvers ? ` - ${score.awayOvers} ov` : ""})
              </p>
            )}
          </div>

          <div className="text-center flex-1">
            <p className="text-lg font-bold">{score.awayTeam}</p>
          </div>
        </div>

        {lastUpdate && (
          <p className="text-xs text-gray-400 text-center mt-3">
            Last updated: {lastUpdate}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
