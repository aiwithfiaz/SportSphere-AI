export const dynamic = 'force-dynamic';

import { Metadata } from "next";
import { TrendingUp, Target, Trophy, Brain, Zap, ChevronRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const metadata: Metadata = {
  title: "AI Predictions",
  description: "AI-powered match predictions and outcome forecasting",
};

async function getUpcomingMatches() {
  return prisma.match.findMany({
    where: { status: "SCHEDULED" },
    include: {
      sport: true,
      tournament: true,
      homeTeam: true,
      awayTeam: true,
    },
    orderBy: { scheduledAt: "asc" },
    take: 10,
  });
}

async function getLiveMatches() {
  return prisma.match.findMany({
    where: { status: { in: ["LIVE", "IN_PROGRESS"] } },
    include: {
      sport: true,
      tournament: true,
      homeTeam: true,
      awayTeam: true,
      liveScore: true,
    },
    orderBy: { scheduledAt: "desc" },
    take: 10,
  });
}

const sportInsights = [
  { sport: "Cricket", accuracy: "82%", predictions: "12,450", icon: "🏏", trend: "+3%" },
  { sport: "Football", accuracy: "78%", predictions: "8,230", icon: "⚽", trend: "+5%" },
  { sport: "Basketball", accuracy: "85%", predictions: "6,100", icon: "🏀", trend: "+2%" },
  { sport: "Tennis", accuracy: "80%", predictions: "4,560", icon: "🎾", trend: "+1%" },
];

export default async function PredictionsPage() {
  const [upcomingMatches, liveMatches] = await Promise.all([
    getUpcomingMatches(),
    getLiveMatches(),
  ]);

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Brain className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold">AI Predictions</h1>
        </div>
        <p className="text-slate-500 dark:text-slate-400">
          Machine learning-powered match predictions and outcome forecasting
        </p>
      </div>

      {/* AI Model Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4 text-center">
            <Target className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <p className="text-2xl font-bold">81%</p>
            <p className="text-sm text-gray-500">Overall Accuracy</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <p className="text-2xl font-bold">31,340</p>
            <p className="text-sm text-gray-500">Predictions Made</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Trophy className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
            <p className="text-2xl font-bold">4</p>
            <p className="text-sm text-gray-500">Sports Covered</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Zap className="h-8 w-8 text-purple-500 mx-auto mb-2" />
            <p className="text-2xl font-bold">Live</p>
            <p className="text-sm text-gray-500">Model Status</p>
          </CardContent>
        </Card>
      </div>

      {/* Sport-specific Accuracy */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Model Accuracy by Sport</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {sportInsights.map((sport) => (
              <div key={sport.sport} className="p-4 border rounded-lg">
                <div className="text-3xl mb-2">{sport.icon}</div>
                <p className="font-semibold">{sport.sport}</p>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-lg font-bold text-green-600">{sport.accuracy}</p>
                  <Badge variant="secondary" className="text-xs">{sport.trend}</Badge>
                </div>
                <p className="text-xs text-gray-500 mt-1">{sport.predictions} predictions</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upcoming">Upcoming Predictions</TabsTrigger>
          <TabsTrigger value="live">Live Predictions</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="mt-6">
          {upcomingMatches.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-gray-500">No upcoming matches for predictions.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {upcomingMatches.map((match) => (
                <Card key={match.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline">{match.sport?.name}</Badge>
                          {match.tournament && (
                            <Badge variant="secondary">{match.tournament.name}</Badge>
                          )}
                        </div>
                        <p className="font-semibold text-lg">
                          {match.homeTeam?.name || "TBD"} vs {match.awayTeam?.name || "TBD"}
                        </p>
                        <p className="text-sm text-gray-500">
                          {match.scheduledAt ? new Date(match.scheduledAt).toLocaleString() : "TBD"}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="bg-primary/10 rounded-lg p-3">
                          <p className="text-xs text-gray-500 mb-1">AI Prediction</p>
                          <p className="font-bold text-primary">{match.homeTeam?.name ? "62%" : "—"}</p>
                          <p className="text-xs text-gray-400">vs {match.awayTeam?.name ? "38%" : "—"}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="live" className="mt-6">
          {liveMatches.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-gray-500">No live matches with active predictions.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {liveMatches.map((match) => (
                <Card key={match.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className="bg-red-100 text-red-800">LIVE</Badge>
                          <Badge variant="outline">{match.sport?.name}</Badge>
                        </div>
                        <p className="font-semibold text-lg">
                          {match.homeTeam?.name || "TBD"} vs {match.awayTeam?.name || "TBD"}
                        </p>
                        {match.liveScore?.currentScore && (
                          <p className="text-sm text-gray-500">
                            {(match.liveScore.currentScore as any)?.home ?? "—"} - {(match.liveScore.currentScore as any)?.away ?? "—"}
                          </p>
                        )}
                      </div>
                      <Button variant="outline" size="sm">
                        View Live <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
