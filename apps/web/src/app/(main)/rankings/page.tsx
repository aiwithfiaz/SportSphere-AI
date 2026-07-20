"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Trophy, Medal, TrendingUp, TrendingDown, Star, Crown, Search,
  RefreshCw, Brain, Target, Zap, BarChart3, Users, ArrowUpRight,
  ArrowDownRight, Minus, Filter, Loader2, Activity, Clock, Globe
} from "lucide-react";

interface Ranking {
  rank: number;
  name: string;
  team: string;
  country: string;
  sport: string;
  rating: number;
  matches: number;
  points: number;
  change: number;
  form: string[];
  avatar?: string;
  age?: number;
  speciality?: string;
  recentPerformance: number[];
  aiConfidence: number;
}

interface RankingInsight {
  label: string;
  value: string;
  change: string;
  icon: any;
  color: string;
}

const SPORTS_RANKINGS: Record<string, Ranking[]> = {
  cricket: [
    { rank: 1, name: "Virat Kohli", team: "India", country: "India", sport: "Cricket", rating: 920, matches: 120, points: 12500, change: 2, form: ["W","W","L","W","W"], age: 35, speciality: "Batsman", recentPerformance: [85, 92, 78, 88, 95], aiConfidence: 94 },
    { rank: 2, name: "Joe Root", team: "England", country: "England", sport: "Cricket", rating: 910, matches: 115, points: 12200, change: -1, form: ["W","L","W","W","D"], age: 33, speciality: "Batsman", recentPerformance: [88, 75, 90, 82, 87], aiConfidence: 91 },
    { rank: 3, name: "Steve Smith", team: "Australia", country: "Australia", sport: "Cricket", rating: 905, matches: 110, points: 11800, change: 1, form: ["L","W","W","L","W"], age: 34, speciality: "Batsman", recentPerformance: [72, 88, 91, 76, 89], aiConfidence: 89 },
    { rank: 4, name: "Babar Azam", team: "Pakistan", country: "Pakistan", sport: "Cricket", rating: 895, matches: 100, points: 11500, change: 0, form: ["W","W","W","L","W"], age: 29, speciality: "Batsman", recentPerformance: [90, 85, 93, 78, 91], aiConfidence: 92 },
    { rank: 5, name: "Kane Williamson", team: "New Zealand", country: "New Zealand", sport: "Cricket", rating: 890, matches: 105, points: 11200, change: -2, form: ["D","W","L","W","W"], age: 33, speciality: "Batsman", recentPerformance: [80, 86, 74, 89, 84], aiConfidence: 88 },
    { rank: 6, name: "Rohit Sharma", team: "India", country: "India", sport: "Cricket", rating: 885, matches: 112, points: 11000, change: 3, form: ["W","W","W","W","L"], age: 37, speciality: "Batsman", recentPerformance: [92, 88, 95, 90, 78], aiConfidence: 90 },
    { rank: 7, name: "David Warner", team: "Australia", country: "Australia", sport: "Cricket", rating: 880, matches: 108, points: 10800, change: -1, form: ["L","W","L","W","W"], age: 37, speciality: "Batsman", recentPerformance: [70, 85, 72, 88, 82], aiConfidence: 85 },
    { rank: 8, name: "Ben Stokes", team: "England", country: "England", sport: "Cricket", rating: 875, matches: 95, points: 10500, change: 5, form: ["W","W","L","W","W"], age: 33, speciality: "All-rounder", recentPerformance: [88, 92, 76, 90, 94], aiConfidence: 93 },
    { rank: 9, name: "Pat Cummins", team: "Australia", country: "Australia", sport: "Cricket", rating: 870, matches: 80, points: 10200, change: 0, form: ["W","L","W","W","L"], age: 31, speciality: "Bowler", recentPerformance: [85, 78, 90, 87, 82], aiConfidence: 87 },
    { rank: 10, name: "Jasprit Bumrah", team: "India", country: "India", sport: "Cricket", rating: 865, matches: 75, points: 10000, change: 2, form: ["W","W","W","L","W"], age: 30, speciality: "Bowler", recentPerformance: [92, 88, 95, 80, 91], aiConfidence: 95 },
  ],
  football: [
    { rank: 1, name: "Lionel Messi", team: "Inter Miami", country: "Argentina", sport: "Football", rating: 935, matches: 850, points: 15200, change: 0, form: ["W","W","W","D","W"], age: 37, speciality: "Forward", recentPerformance: [95, 92, 88, 90, 94], aiConfidence: 96 },
    { rank: 2, name: "Erling Haaland", team: "Man City", country: "Norway", sport: "Football", rating: 920, matches: 320, points: 14800, change: 1, form: ["W","W","L","W","W"], age: 24, speciality: "Striker", recentPerformance: [92, 95, 78, 91, 93], aiConfidence: 94 },
    { rank: 3, name: "Kylian Mbappe", team: "Real Madrid", country: "France", sport: "Football", rating: 915, matches: 350, points: 14500, change: -1, form: ["W","D","W","W","L"], age: 26, speciality: "Forward", recentPerformance: [90, 85, 92, 88, 78], aiConfidence: 92 },
    { rank: 4, name: "Jude Bellingham", team: "Real Madrid", country: "England", sport: "Football", rating: 900, matches: 280, points: 13800, change: 3, form: ["W","W","W","W","D"], age: 21, speciality: "Midfielder", recentPerformance: [88, 92, 95, 90, 87], aiConfidence: 95 },
    { rank: 5, name: "Vinicius Jr", team: "Real Madrid", country: "Brazil", sport: "Football", rating: 895, matches: 300, points: 13500, change: 0, form: ["W","L","W","W","W"], age: 24, speciality: "Winger", recentPerformance: [85, 78, 90, 92, 88], aiConfidence: 90 },
  ],
  basketball: [
    { rank: 1, name: "Nikola Jokic", team: "Denver Nuggets", country: "Serbia", sport: "Basketball", rating: 940, matches: 650, points: 16000, change: 0, form: ["W","W","W","L","W"], age: 29, speciality: "Center", recentPerformance: [95, 92, 88, 78, 94], aiConfidence: 97 },
    { rank: 2, name: "Luka Doncic", team: "Dallas Mavericks", country: "Slovenia", sport: "Basketball", rating: 925, matches: 450, points: 15200, change: 1, form: ["W","W","L","W","W"], age: 25, speciality: "Guard", recentPerformance: [92, 88, 75, 91, 93], aiConfidence: 94 },
    { rank: 3, name: "Giannis Antetokounmpo", team: "Milwaukee Bucks", country: "Greece", sport: "Basketball", rating: 920, matches: 600, points: 15000, change: -1, form: ["W","L","W","W","L"], age: 29, speciality: "Forward", recentPerformance: [88, 78, 92, 90, 85], aiConfidence: 91 },
    { rank: 4, name: "Shai Gilgeous-Alexander", team: "OKC Thunder", country: "Canada", sport: "Basketball", rating: 910, matches: 380, points: 14500, change: 2, form: ["W","W","W","W","D"], age: 26, speciality: "Guard", recentPerformance: [90, 92, 88, 95, 91], aiConfidence: 96 },
    { rank: 5, name: "Jayson Tatum", team: "Boston Celtics", country: "USA", sport: "Basketball", rating: 905, matches: 500, points: 14200, change: 0, form: ["W","W","L","W","W"], age: 26, speciality: "Forward", recentPerformance: [88, 90, 76, 92, 89], aiConfidence: 90 },
  ],
  tennis: [
    { rank: 1, name: "Carlos Alcaraz", team: "Spain", country: "Spain", sport: "Tennis", rating: 950, matches: 250, points: 11800, change: 0, form: ["W","W","W","W","W"], age: 21, speciality: "Singles", recentPerformance: [95, 98, 92, 96, 94], aiConfidence: 98 },
    { rank: 2, name: "Novak Djokovic", team: "Serbia", country: "Serbia", sport: "Tennis", rating: 930, matches: 1100, points: 11500, change: -1, form: ["W","L","W","W","L"], age: 37, speciality: "Singles", recentPerformance: [88, 78, 92, 90, 82], aiConfidence: 89 },
    { rank: 3, name: "Jannik Sinner", team: "Italy", country: "Italy", sport: "Tennis", rating: 915, matches: 280, points: 11200, change: 2, form: ["W","W","W","L","W"], age: 22, speciality: "Singles", recentPerformance: [92, 90, 94, 80, 93], aiConfidence: 95 },
    { rank: 4, name: "Alexander Zverev", team: "Germany", country: "Germany", sport: "Tennis", rating: 900, matches: 400, points: 10800, change: 0, form: ["W","W","L","W","W"], age: 27, speciality: "Singles", recentPerformance: [88, 85, 78, 92, 90], aiConfidence: 88 },
    { rank: 5, name: "Daniil Medvedev", team: "Russia", country: "Russia", sport: "Tennis", rating: 890, matches: 450, points: 10500, change: -2, form: ["L","W","W","L","W"], age: 28, speciality: "Singles", recentPerformance: [75, 88, 90, 78, 86], aiConfidence: 86 },
  ],
};

const INSIGHTS: RankingInsight[] = [
  { label: "Total Players", value: "2,450+", change: "+120", icon: Users, color: "text-blue-600" },
  { label: "AI Accuracy", value: "94.2%", change: "+1.8%", icon: Brain, color: "text-purple-600" },
  { label: "Sports Tracked", value: "8", change: "+2", icon: Globe, color: "text-green-600" },
  { label: "Updates Daily", value: "Real-time", change: "Live", icon: Zap, color: "text-yellow-600" },
];

export default function RankingsPage() {
  const [sport, setSport] = useState("cricket");
  const [rankings, setRankings] = useState<Ranking[]>(SPORTS_RANKINGS.cricket);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [sortBy, setSortBy] = useState<"rank" | "rating" | "change">("rank");

  const filteredRankings = rankings
    .filter(
      (r) =>
        searchQuery === "" ||
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.team.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.country.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "change") return b.change - a.change;
      return a.rank - b.rank;
    });

  useEffect(() => {
    setRankings(SPORTS_RANKINGS[sport] || SPORTS_RANKINGS.cricket);
  }, [sport]);

  const getChangeIcon = (change: number) => {
    if (change > 0) return <ArrowUpRight className="h-3 w-3 text-green-500" />;
    if (change < 0) return <ArrowDownRight className="h-3 w-3 text-red-500" />;
    return <Minus className="h-3 w-3 text-muted-foreground" />;
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return "text-green-600";
    if (change < 0) return "text-red-600";
    return "text-muted-foreground";
  };

  const getFormBadge = (result: string) => {
    if (result === "W") return <span className="w-5 h-5 rounded-full bg-green-500 text-white text-[10px] flex items-center justify-center font-bold">W</span>;
    if (result === "L") return <span className="w-5 h-5 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center font-bold">L</span>;
    return <span className="w-5 h-5 rounded-full bg-yellow-400 text-white text-[10px] flex items-center justify-center font-bold">D</span>;
  };

  const top3 = [rankings[1], rankings[0], rankings[2]];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white py-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold flex items-center gap-3">
                <Trophy className="h-10 w-10 text-yellow-500" />
                Global Rankings
              </h1>
              <p className="text-gray-300 text-lg mt-1">
                AI-powered player rankings with real-time analytics
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="bg-green-500/20 text-green-300 gap-1">
                <Activity className="h-3 w-3" /> Live Updates
              </Badge>
              <Button variant="outline" size="sm" className="text-white border-white/30">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Insights */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {INSIGHTS.map((insight) => (
            <Card key={insight.label}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">{insight.label}</p>
                    <p className="text-xl font-bold">{insight.value}</p>
                    <p className="text-xs text-green-600">{insight.change}</p>
                  </div>
                  <insight.icon className={`h-8 w-8 ${insight.color} opacity-50`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Sport Selector & Filters */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <Tabs value={sport} onValueChange={setSport}>
            <TabsList>
              <TabsTrigger value="cricket">🏏 Cricket</TabsTrigger>
              <TabsTrigger value="football">⚽ Football</TabsTrigger>
              <TabsTrigger value="basketball">🏀 Basketball</TabsTrigger>
              <TabsTrigger value="tennis">🎾 Tennis</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search players..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 w-48"
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="border rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-900"
            >
              <option value="rank">By Rank</option>
              <option value="rating">By Rating</option>
              <option value="change">By Trend</option>
            </select>
          </div>
        </div>

        {/* Top 3 Podium */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {top3.map((player, i) => (
            <Card
              key={player.rank}
              className={`text-center transition-all hover:shadow-lg ${
                i === 1 ? "ring-2 ring-yellow-400 scale-105 dark:bg-gray-900" : "dark:bg-gray-900"
              }`}
            >
              <CardContent className="p-6">
                <div className={`w-20 h-20 rounded-full mx-auto mb-3 flex items-center justify-center text-2xl font-bold ${
                  i === 1 ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" :
                  i === 0 ? "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300" :
                  "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                }`}>
                  {i === 1 ? <Crown className="h-10 w-10" /> : player.rank}
                </div>
                <h3 className="font-bold text-lg">{player.name}</h3>
                <p className="text-sm text-muted-foreground">{player.team}</p>
                <p className="text-xs text-muted-foreground">{player.country} • {player.speciality}</p>
                <div className="mt-3">
                  <p className="text-2xl font-bold text-blue-600">{player.rating}</p>
                  <p className="text-xs text-muted-foreground">Rating</p>
                </div>
                <div className="flex items-center justify-center gap-1 mt-2">
                  <span className={`text-xs font-medium ${getChangeColor(player.change)}`}>
                    {player.change > 0 ? `+${player.change}` : player.change}
                  </span>
                  {getChangeIcon(player.change)}
                </div>
                <div className="flex items-center justify-center gap-1 mt-2">
                  {player.form.map((f, fi) => (
                    <span key={fi}>{getFormBadge(f)}</span>
                  ))}
                </div>
                <div className="mt-3 flex items-center justify-center gap-1">
                  <Brain className="h-3 w-3 text-purple-500" />
                  <span className="text-xs text-muted-foreground">AI: {player.aiConfidence}%</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Full Rankings */}
        <Card className="dark:bg-gray-900">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Complete Rankings</span>
              <Badge variant="secondary">{filteredRankings.length} players</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y dark:divide-gray-800">
              {filteredRankings.map((player) => (
                <div
                  key={player.rank}
                  className="flex items-center justify-between p-4 hover:bg-accent transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                      player.rank <= 3
                        ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                        : "bg-muted text-muted-foreground"
                    }`}>
                      {player.rank}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold">{player.name}</p>
                        <Badge variant="outline" className="text-[10px]">{player.speciality}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {player.team} • {player.country} • {player.matches} matches
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        {player.form.map((f, fi) => (
                          <span key={fi}>{getFormBadge(f)}</span>
                        ))}
                        <span className="text-xs text-muted-foreground ml-2">Recent form</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    {/* Performance Bar */}
                    <div className="hidden md:block w-32">
                      <div className="flex items-center gap-1 mb-1">
                        <BarChart3 className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">Performance</span>
                      </div>
                      <div className="flex gap-0.5 h-4">
                        {player.recentPerformance.map((p, i) => (
                          <div
                            key={i}
                            className="flex-1 rounded-sm"
                            style={{
                              height: `${p}%`,
                              backgroundColor: p >= 90 ? "#22c55e" : p >= 80 ? "#3b82f6" : p >= 70 ? "#eab308" : "#ef4444",
                              alignSelf: "flex-end",
                            }}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="font-bold text-lg">{player.rating}</p>
                      <p className="text-xs text-muted-foreground">Rating</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{player.points.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">Points</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className={`text-sm font-medium ${getChangeColor(player.change)}`}>
                        {player.change > 0 ? `+${player.change}` : player.change}
                      </span>
                      {getChangeIcon(player.change)}
                    </div>
                    <div className="hidden sm:flex items-center gap-1">
                      <Brain className="h-3 w-3 text-purple-500" />
                      <span className="text-xs text-muted-foreground">{player.aiConfidence}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* AI Insights Footer */}
        <Card className="mt-6 dark:bg-gray-900">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Brain className="h-5 w-5 text-purple-500" />
              <h3 className="font-bold">AI Ranking Insights</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                <p className="font-medium text-purple-700 dark:text-purple-400">Top Mover Alert</p>
                <p className="text-muted-foreground mt-1">
                  {rankings.find((r) => r.change >= 3)?.name || "N/A"} gained {rankings.find((r) => r.change >= 3)?.change || 0} positions this period
                </p>
              </div>
              <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                <p className="font-medium text-blue-700 dark:text-blue-400">Rating Prediction</p>
                <p className="text-muted-foreground mt-1">
                  {rankings[0]?.name} projected to reach {rankings[0]?.rating + 15} rating by next month
                </p>
              </div>
              <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                <p className="font-medium text-green-700 dark:text-green-400">Form Analysis</p>
                <p className="text-muted-foreground mt-1">
                  {rankings.find((r) => r.form.every((f) => f === "W"))?.name || rankings[0]?.name} on longest winning streak
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
