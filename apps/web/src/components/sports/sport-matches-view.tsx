"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Radio, RefreshCw, Wifi, WifiOff, Search, Clock, Trophy,
  Calendar, CheckCircle2, Loader2, TrendingUp, Zap
} from "lucide-react";
import { useSocket } from "@/hooks/use-socket";
import Link from "next/link";

interface NormalizedMatch {
  id: string;
  source: "database" | "espn" | "cricbuzz" | "football";
  homeTeam: { name: string; logo?: string; score?: string | number };
  awayTeam: { name: string; logo?: string; score?: string | number };
  status: string;
  state: "pre" | "in" | "post";
  league?: string;
  time?: string;
  venue?: string;
  clock?: string;
  date?: string;
}

interface SportMatchesViewProps {
  sportSlug: string;
  sportName: string;
  sportIcon: string;
  espnSport?: string;
  showCricbuzz?: boolean;
  showFootball?: boolean;
  sportDescription?: string;
}

function isLiveMatch(m: NormalizedMatch) {
  return m.state === "in" || m.status === "LIVE" || m.status === "IN_PROGRESS";
}

function isUpcomingMatch(m: NormalizedMatch) {
  return m.state === "pre" && !isLiveMatch(m);
}

function isCompletedMatch(m: NormalizedMatch) {
  return m.state === "post" || m.status === "COMPLETED" || m.status === "FINAL";
}

export function SportMatchesView({
  sportSlug,
  sportName,
  sportIcon,
  espnSport,
  showCricbuzz,
  showFootball,
  sportDescription,
}: SportMatchesViewProps) {
  const [dbMatches, setDbMatches] = useState<NormalizedMatch[]>([]);
  const [espnMatches, setEspnMatches] = useState<NormalizedMatch[]>([]);
  const [cricbuzzMatches, setCricbuzzMatches] = useState<NormalizedMatch[]>([]);
  const [footballMatches, setFootballMatches] = useState<NormalizedMatch[]>([]);
  const [activeTab, setActiveTab] = useState("live");
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState("");
  const [wsConnected, setWsConnected] = useState(false);
  const { socket, connect } = useSocket();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const allMatches = [...dbMatches, ...espnMatches, ...cricbuzzMatches, ...footballMatches];

  const uniqueMatches = allMatches.filter((m, i, self) => {
    const key = `${m.homeTeam.name}|${m.awayTeam.name}`;
    return self.findIndex((x) => `${x.homeTeam.name}|${x.awayTeam.name}` === key) === i;
  });

  const liveMatches = uniqueMatches.filter(isLiveMatch);
  const upcomingMatches = uniqueMatches.filter(isUpcomingMatch);
  const completedMatches = uniqueMatches.filter(isCompletedMatch);

  const tabMatches = activeTab === "live" ? liveMatches
    : activeTab === "upcoming" ? upcomingMatches
    : activeTab === "completed" ? completedMatches
    : uniqueMatches;

  const displayMatches = searchQuery
    ? tabMatches.filter(
        (m) =>
          m.homeTeam.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.awayTeam.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.league?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : tabMatches;

  const fetchDbMatches = useCallback(async () => {
    try {
      const res = await fetch(`/api/v1/matches?sport=${sportSlug}&limit=50`);
      const data = await res.json();
      if (data.success && data.data) {
        setDbMatches(
          data.data.map((m: any) => ({
            id: m.id,
            source: "database" as const,
            homeTeam: { name: m.homeTeam?.name || "TBD", logo: m.homeTeam?.logo, score: m.homeScore },
            awayTeam: { name: m.awayTeam?.name || "TBD", logo: m.awayTeam?.logo, score: m.awayScore },
            status: m.status,
            state: m.status === "LIVE" || m.status === "IN_PROGRESS" ? "in" : m.status === "COMPLETED" ? "post" : "pre",
            league: m.tournament?.name || m.sport?.name,
            time: m.scheduledAt ? new Date(m.scheduledAt).toLocaleTimeString() : undefined,
            venue: m.venue?.name,
          }))
        );
      }
    } catch {}
  }, [sportSlug]);

  const fetchEspnMatches = useCallback(async () => {
    if (!espnSport) return;
    try {
      const res = await fetch(`/api/v1/espn/live?sport=${espnSport}`);
      const data = await res.json();
      if (data.success && data.data) {
        setEspnMatches(
          data.data.map((m: any) => ({
            id: m.id,
            source: "espn" as const,
            homeTeam: { name: m.homeTeam?.name || "TBD", logo: m.homeTeam?.logo, score: m.homeTeam?.score || "0" },
            awayTeam: { name: m.awayTeam?.name || "TBD", logo: m.awayTeam?.logo, score: m.awayTeam?.score || "0" },
            status: m.status,
            state: m.state,
            league: m.leagueName,
            clock: m.clock,
            venue: m.venue,
            date: m.date,
          }))
        );
      }
    } catch {}
  }, [espnSport]);

  const fetchCricbuzzMatches = useCallback(async () => {
    if (!showCricbuzz) return;
    try {
      const res = await fetch("/api/v1/cricbuzz/matches");
      const data = await res.json();
      if (data.success && data.data) {
        setCricbuzzMatches(
          data.data
            .filter((m: any) => m.state === "live" || m.state === "upcoming")
            .map((m: any) => ({
              id: `cricbuzz-${m.id}`,
              source: "cricbuzz" as const,
              homeTeam: { name: m.team1 || "TBD" },
              awayTeam: { name: m.team2 || "TBD" },
              status: m.status || m.state,
              state: m.state === "live" ? "in" : "pre",
              league: m.series,
              time: m.description,
            }))
        );
      }
    } catch {}
  }, [showCricbuzz]);

  const fetchFootballMatches = useCallback(async () => {
    if (!showFootball) return;
    try {
      const res = await fetch("/api/v1/football/live");
      const data = await res.json();
      if (data.success && data.data) {
        setFootballMatches(
          data.data.map((m: any) => ({
            id: `football-${m.id}`,
            source: "football" as const,
            homeTeam: { name: m.homeTeam || "TBD", logo: m.homeLogo },
            awayTeam: { name: m.awayTeam || "TBD", logo: m.awayLogo },
            status: m.status,
            state: m.status === "IN_PLAY" || m.status === "PAUSED" ? "in" : m.status === "FINISHED" ? "post" : "pre",
            league: m.competition,
            clock: m.minute ? `${m.minute}'` : undefined,
          }))
        );
      }
    } catch {}
  }, [showFootball]);

  const fetchAllData = useCallback(async () => {
    await Promise.all([
      fetchDbMatches(),
      fetchEspnMatches(),
      fetchCricbuzzMatches(),
      fetchFootballMatches(),
    ]);
    setLastRefresh(new Date());
    setLoading(false);
  }, [fetchDbMatches, fetchEspnMatches, fetchCricbuzzMatches, fetchFootballMatches]);

  useEffect(() => {
    fetchAllData();
    if (autoRefresh) {
      intervalRef.current = setInterval(fetchAllData, 15000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [fetchAllData, autoRefresh]);

  useEffect(() => {
    connect();
  }, [connect]);

  useEffect(() => {
    if (!socket) return;

    const onConnect = () => setWsConnected(true);
    const onDisconnect = () => setWsConnected(false);
    const onScoreUpdate = (data: any) => {
      setDbMatches((prev) =>
        prev.map((m) =>
          m.id === data.matchId
            ? {
                ...m,
                homeTeam: { ...m.homeTeam, score: data.homeScore },
                awayTeam: { ...m.awayTeam, score: data.awayScore },
              }
            : m
        )
      );
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("score:update", onScoreUpdate);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("score:update", onScoreUpdate);
    };
  }, [socket]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <span className="text-4xl">{sportIcon}</span>
            {sportName} Live Scores
          </h1>
          <p className="text-muted-foreground mt-1">
            {sportDescription || `Real-time ${sportName.toLowerCase()} scores and match updates`}
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <Badge className={liveMatches.length > 0 ? "bg-red-500 animate-pulse" : "bg-gray-400"}>
            <Radio className="h-3 w-3 mr-1" />
            {liveMatches.length} LIVE
          </Badge>
          {wsConnected ? (
            <Badge className="bg-green-500/10 text-green-700 gap-1"><Wifi className="h-3 w-3" /> Live</Badge>
          ) : (
            <Badge variant="secondary" className="gap-1"><WifiOff className="h-3 w-3" /> Polling</Badge>
          )}
          <Button variant="outline" size="sm" onClick={() => setAutoRefresh(!autoRefresh)}>
            {autoRefresh ? "Auto: ON" : "Auto: OFF"}
          </Button>
          <Button variant="outline" size="sm" onClick={fetchAllData}>
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-3 text-center">
            <p className="text-2xl font-bold text-red-500">{liveMatches.length}</p>
            <p className="text-xs text-muted-foreground">Live Now</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <p className="text-2xl font-bold text-blue-500">{upcomingMatches.length}</p>
            <p className="text-xs text-muted-foreground">Upcoming</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <p className="text-2xl font-bold text-green-500">{completedMatches.length}</p>
            <p className="text-xs text-muted-foreground">Completed</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="live" className="gap-1">
              <Radio className="h-3 w-3" /> Live ({liveMatches.length})
            </TabsTrigger>
            <TabsTrigger value="upcoming" className="gap-1">
              <Calendar className="h-3 w-3" /> Upcoming ({upcomingMatches.length})
            </TabsTrigger>
            <TabsTrigger value="completed" className="gap-1">
              <CheckCircle2 className="h-3 w-3" /> Completed ({completedMatches.length})
            </TabsTrigger>
            <TabsTrigger value="all" className="gap-1">
              <Trophy className="h-3 w-3" /> All ({uniqueMatches.length})
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search teams..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="h-4 bg-muted rounded w-1/3 mb-3" />
                <div className="h-8 bg-muted rounded w-1/2 mb-2" />
                <div className="h-4 bg-muted rounded w-1/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : displayMatches.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Trophy className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Matches Found</h3>
            <p className="text-muted-foreground">
              {searchQuery
                ? "No matches match your search."
                : `No ${activeTab} ${sportName.toLowerCase()} matches at the moment.`}
            </p>
            <Button variant="outline" className="mt-4" onClick={fetchAllData}>
              <RefreshCw className="h-4 w-4 mr-2" /> Refresh
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayMatches.map((match) => {
            const live = isLiveMatch(match);
            const completed = isCompletedMatch(match);

            const cardContent = (
              <Card
                className={`transition-all hover:shadow-md hover:-translate-y-1 cursor-pointer h-full ${
                  live
                    ? "border-red-500/50 bg-red-50/30 dark:bg-red-950/10"
                    : ""
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="outline" className="text-xs">
                      {match.league || sportName}
                    </Badge>
                    <div className="flex items-center gap-2">
                      {match.source !== "database" && (
                        <Badge variant="secondary" className="text-[10px] uppercase">
                          {match.source === "espn"
                            ? "ESPN"
                            : match.source === "cricbuzz"
                            ? "Cricbuzz"
                            : "Football"}
                        </Badge>
                      )}
                      {live ? (
                        <Badge className="bg-red-500 animate-pulse text-xs">
                          <Radio className="h-3 w-3 mr-1" /> LIVE
                        </Badge>
                      ) : completed ? (
                        <Badge variant="secondary" className="text-xs">FT</Badge>
                      ) : (
                        <Badge variant="outline" className="text-xs">
                          <Clock className="h-3 w-3 mr-1" />
                          {match.time || "TBD"}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-2">
                        {match.homeTeam.logo && (
                          <img src={match.homeTeam.logo} alt="" className="w-6 h-6" />
                        )}
                        <span className="font-medium text-sm truncate">
                          {match.homeTeam.name}
                        </span>
                      </div>
                    </div>
                    <div className="px-4 text-center">
                      {live || completed ? (
                        <div className="text-xl font-bold">
                          {match.homeTeam.score ?? "-"} - {match.awayTeam.score ?? "-"}
                        </div>
                      ) : (
                        <div className="text-sm text-muted-foreground">vs</div>
                      )}
                      {match.clock && (
                        <div className="text-xs text-red-600 font-mono">
                          {match.clock}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 text-right">
                      <div className="flex items-center gap-2 justify-end">
                        <span className="font-medium text-sm truncate">
                          {match.awayTeam.name}
                        </span>
                        {match.awayTeam.logo && (
                          <img src={match.awayTeam.logo} alt="" className="w-6 h-6" />
                        )}
                      </div>
                    </div>
                  </div>

                  {match.venue && (
                    <p className="text-xs text-muted-foreground text-center mt-3 truncate">
                      {match.venue}
                    </p>
                  )}

                  {live && match.clock && (
                    <div className="flex items-center justify-center gap-1 mt-2">
                      <Zap className="h-3 w-3 text-red-500" />
                      <span className="text-xs text-red-600 font-medium">
                        In Progress
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            );

            return match.source === "database" ? (
              <Link key={match.id} href={`/matches/${match.id}`}>
                {cardContent}
              </Link>
            ) : (
              <div key={match.id}>{cardContent}</div>
            );
          })}
        </div>
      )}

      <div className="mt-8 text-center text-sm text-muted-foreground">
        <p>
          Data sources: Database
          {espnSport && " \u2022 ESPN"}
          {showCricbuzz && " \u2022 Cricbuzz"}
          {showFootball && " \u2022 Football-Data.org"}
        </p>
        <p className="mt-1">
          Auto-refreshes every 15 seconds \u2022 Last updated:{" "}
          {lastRefresh.toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
}
