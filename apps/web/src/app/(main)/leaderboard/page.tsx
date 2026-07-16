export const dynamic = 'force-dynamic';

import { Metadata } from "next";
import { Trophy, Medal, TrendingUp, Crown, Star, Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const metadata: Metadata = {
  title: "Leaderboard",
  description: "Global prediction leaderboard and rankings",
};

const topPredictors = [
  { rank: 1, name: "Alex Kumar", points: 12450, accuracy: 89, predictions: 234, streak: 15, country: "🇮🇳" },
  { rank: 2, name: "Sarah Chen", points: 11200, accuracy: 86, predictions: 198, streak: 12, country: "🇨🇳" },
  { rank: 3, name: "Mike Johnson", points: 10800, accuracy: 84, predictions: 256, streak: 10, country: "🇺🇸" },
  { rank: 4, name: "Emma Wilson", points: 9950, accuracy: 82, predictions: 187, streak: 8, country: "🇬🇧" },
  { rank: 5, name: "Raj Patel", points: 9400, accuracy: 81, predictions: 223, streak: 7, country: "🇮🇳" },
  { rank: 6, name: "Carlos Silva", points: 8750, accuracy: 79, predictions: 165, streak: 6, country: "🇧🇷" },
  { rank: 7, name: "Yuki Tanaka", points: 8200, accuracy: 78, predictions: 142, streak: 5, country: "🇯🇵" },
  { rank: 8, name: "Hans Mueller", points: 7800, accuracy: 77, predictions: 178, streak: 4, country: "🇩🇪" },
  { rank: 9, name: "Priya Singh", points: 7500, accuracy: 76, predictions: 156, streak: 3, country: "🇮🇳" },
  { rank: 10, name: "David Park", points: 7200, accuracy: 75, predictions: 134, streak: 3, country: "🇰🇷" },
];

const leaderboardStats = {
  totalUsers: 10234,
  avgAccuracy: "74%",
  totalPredictions: "1.2M",
  topStreak: 28,
};

function getRankIcon(rank: number) {
  if (rank === 1) return <Crown className="h-5 w-5 text-yellow-500" />;
  if (rank === 2) return <Medal className="h-5 w-5 text-gray-400" />;
  if (rank === 3) return <Medal className="h-5 w-5 text-amber-600" />;
  return <span className="text-sm font-bold text-gray-500 w-5 text-center">#{rank}</span>;
}

export default function LeaderboardPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Trophy className="h-8 w-8 text-yellow-500" />
          <h1 className="text-4xl font-bold">Leaderboard</h1>
        </div>
        <p className="text-slate-500 dark:text-slate-400">
          Global prediction rankings — compete with the best predictors worldwide
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">{leaderboardStats.totalUsers.toLocaleString()}</p>
            <p className="text-sm text-gray-500">Active Predictors</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-green-600">{leaderboardStats.avgAccuracy}</p>
            <p className="text-sm text-gray-500">Avg. Accuracy</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">{leaderboardStats.totalPredictions}</p>
            <p className="text-sm text-gray-500">Total Predictions</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-purple-600">{leaderboardStats.topStreak}</p>
            <p className="text-sm text-gray-500">Top Streak</p>
          </CardContent>
        </Card>
      </div>

      {/* Top 3 Podium */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[topPredictors[1], topPredictors[0], topPredictors[2]].map((user, idx) => {
          const medals = ["🥈", "🥇", "🥉"];
          const sizes = ["text-lg", "text-2xl", "text-lg"];
          return (
            <Card key={user.rank} className={idx === 1 ? "border-primary shadow-lg" : ""}>
              <CardContent className="p-6 text-center">
                <div className={`text-4xl mb-2 ${idx === 1 ? "text-5xl" : ""}`}>{medals[idx]}</div>
                <Avatar className={`mx-auto mb-3 ${idx === 1 ? "h-20 w-20" : "h-16 w-16"}`}>
                  <AvatarFallback className="text-lg">{user.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                </Avatar>
                <p className="font-bold text-lg">{user.name}</p>
                <p className="text-sm text-gray-500">{user.country}</p>
                <p className="text-2xl font-bold text-primary mt-2">{user.points.toLocaleString()}</p>
                <p className="text-sm text-gray-500">points</p>
                <div className="flex items-center justify-center gap-4 mt-3">
                  <div>
                    <p className="text-sm font-bold">{user.accuracy}%</p>
                    <p className="text-xs text-gray-500">Accuracy</p>
                  </div>
                  <div>
                    <p className="text-sm font-bold">{user.predictions}</p>
                    <p className="text-xs text-gray-500">Predictions</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Full Leaderboard */}
      <Card>
        <CardHeader>
          <CardTitle>Global Rankings</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">Rank</TableHead>
                <TableHead>Predictor</TableHead>
                <TableHead>Points</TableHead>
                <TableHead>Accuracy</TableHead>
                <TableHead>Predictions</TableHead>
                <TableHead>Streak</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topPredictors.map((user) => (
                <TableRow key={user.rank} className={user.rank <= 3 ? "bg-primary/5" : ""}>
                  <TableCell>
                    <div className="flex items-center">{getRankIcon(user.rank)}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{user.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.country}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell><span className="font-bold">{user.points.toLocaleString()}</span></TableCell>
                  <TableCell>
                    <Badge variant={user.accuracy >= 85 ? "default" : user.accuracy >= 80 ? "secondary" : "outline"}>
                      {user.accuracy}%
                    </Badge>
                  </TableCell>
                  <TableCell>{user.predictions}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Target className="h-3 w-3 text-orange-500" />
                      <span className="font-medium">{user.streak}</span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
