"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Brain, Target, TrendingUp, Trophy, Zap, ChevronRight, BarChart3,
  RefreshCw, Activity, AlertCircle, CheckCircle2, Clock, Users,
  LineChart, PieChart, ArrowRight, Sparkles, Shield, Flame, Star
} from "lucide-react";

interface MatchPrediction {
  id: string;
  homeTeam: string;
  awayTeam: string;
  sport: string;
  league: string;
  scheduledAt: string;
  homeWin: number;
  awayWin: number;
  draw: number;
  confidence: number;
  keyFactors: string[];
  aiSummary: string;
  venue?: string;
  isLive?: boolean;
  liveScore?: { home: number; away: number };
}

interface AISportInsight {
  sport: string;
  icon: string;
  accuracy: number;
  predictions: number;
  trend: string;
  topPick: string;
  modelVersion: string;
}

const SPORT_INSIGHTS: AISportInsight[] = [
  { sport: "Cricket", icon: "🏏", accuracy: 82.5, predictions: 12450, trend: "+3.2%", topPick: "India vs Australia", modelVersion: "v3.2" },
  { sport: "Football", icon: "⚽", accuracy: 78.8, predictions: 8230, trend: "+5.1%", topPick: "Man City vs Liverpool", modelVersion: "v2.8" },
  { sport: "Basketball", icon: "🏀", accuracy: 85.2, predictions: 6100, trend: "+2.4%", topPick: "Lakers vs Celtics", modelVersion: "v3.0" },
  { sport: "Tennis", icon: "🎾", accuracy: 80.1, predictions: 4560, trend: "+1.8%", topPick: "Alcaraz vs Djokovic", modelVersion: "v2.5" },
  { sport: "Baseball", icon: "⚾", accuracy: 77.3, predictions: 3200, trend: "+4.0%", topPick: "Dodgers vs Yankees", modelVersion: "v2.3" },
  { sport: "Hockey", icon: "🏒", accuracy: 79.5, predictions: 2800, trend: "+2.8%", topPick: "Oilers vs Panthers", modelVersion: "v2.1" },
];

const SAMPLE_PREDICTIONS: MatchPrediction[] = [
  {
    id: "1", homeTeam: "India", awayTeam: "Australia", sport: "Cricket", league: "Test Series",
    scheduledAt: "2026-07-25T10:00:00Z", homeWin: 62, awayWin: 28, draw: 10, confidence: 87,
    keyFactors: ["Home advantage", "Recent form 4-1", "Bowling attack superior", "Pitch conditions favor spin"],
    aiSummary: "India has a significant advantage based on home conditions and recent form. Their bowling attack has been exceptional in the series.",
    venue: "Mumbai Cricket Stadium",
  },
  {
    id: "2", homeTeam: "Manchester City", awayTeam: "Liverpool", sport: "Football", league: "Premier League",
    scheduledAt: "2026-07-26T15:00:00Z", homeWin: 45, awayWin: 32, draw: 23, confidence: 74,
    keyFactors: ["Home advantage", "Squad depth", "Historical H2H close", "Tactical battle"],
    aiSummary: "A tightly contested match expected. City's home record gives them a slight edge, but Liverpool's counter-attacking threat is significant.",
    venue: "Etihad Stadium",
  },
  {
    id: "3", homeTeam: "Lakers", awayTeam: "Celtics", sport: "Basketball", league: "NBA",
    scheduledAt: "2026-07-27T20:00:00Z", homeWin: 55, awayWin: 45, draw: 0, confidence: 82,
    keyFactors: ["Home court advantage", "Star player matchup", "Bench depth", "Recent head-to-head"],
    aiSummary: "Lakers' home court advantage and LeBron's playoff experience give them the edge in this classic rivalry matchup.",
    venue: "Crypto.com Arena",
  },
  {
    id: "4", homeTeam: "Carlos Alcaraz", awayTeam: "Novak Djokovic", sport: "Tennis", league: "Wimbledon Final",
    scheduledAt: "2026-07-28T14:00:00Z", homeWin: 68, awayWin: 32, draw: 0, confidence: 91,
    keyFactors: ["Current form dominant", "Surface preference", "Age advantage", "Recent H2H 3-0"],
    aiSummary: "Alcaraz's current form and surface adaptability make him the clear favorite. Djokovic's experience may not be enough against the younger Spaniard.",
    venue: "Centre Court, Wimbledon",
  },
  {
    id: "5", homeTeam: "Real Madrid", awayTeam: "Barcelona", sport: "Football", league: "La Liga",
    scheduledAt: "2026-07-29T21:00:00Z", homeWin: 42, awayWin: 38, draw: 20, confidence: 71,
    keyFactors: ["El Clasico factor", "Squad injuries", "Tactical setup", "Recent form"],
    aiSummary: "El Clasico matches are always unpredictable. Real Madrid's home advantage is slightly offset by Barcelona's improved form this season.",
    venue: "Santiago Bernabeu",
  },
  {
    id: "6", homeTeam: "Denver Nuggets", awayTeam: "OKC Thunder", sport: "Basketball", league: "NBA Playoffs",
    scheduledAt: "2026-07-30T19:00:00Z", homeWin: 52, awayWin: 48, draw: 0, confidence: 76,
    keyFactors: ["Jokic dominance", "Home altitude advantage", "Thunder's young energy", "Playoff experience"],
    aiSummary: "A closely matched playoff series. Jokic's experience gives Nuggets a slight edge, but Thunder's athleticism poses a significant challenge.",
    venue: "Ball Arena",
  },
];

export default function PredictionsPage() {
  const [sport, setSport] = useState("all");
  const [predictions, setPredictions] = useState<MatchPrediction[]>(SAMPLE_PREDICTIONS);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("upcoming");

  const filteredPredictions = predictions.filter(
    (p) => sport === "all" || p.sport.toLowerCase() === sport
  );

  const upcomingPredictions = filteredPredictions.filter((p) => !p.isLive);
  const livePredictions = filteredPredictions.filter((p) => p.isLive);

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 85) return "text-green-600 bg-green-50 dark:bg-green-950/20";
    if (confidence >= 70) return "text-blue-600 bg-blue-50 dark:bg-blue-950/20";
    return "text-yellow-600 bg-yellow-50 dark:bg-yellow-950/20";
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white py-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold flex items-center gap-3">
                <Brain className="h-10 w-10" />
                AI Predictions
              </h1>
              <p className="text-blue-100 text-lg mt-1">
                Machine learning-powered match predictions with real-time probability analysis
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="bg-green-500/20 text-white gap-1">
                <Zap className="h-3 w-3" /> Model Active
              </Badge>
              <Badge className="bg-white/10 text-white gap-1">
                <Activity className="h-3 w-3" /> v3.2
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* AI Model Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="dark:bg-gray-900">
            <CardContent className="p-4 text-center">
              <Target className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <p className="text-2xl font-bold">81.2%</p>
              <p className="text-xs text-muted-foreground">Overall Accuracy</p>
              <p className="text-xs text-green-600 mt-1">+1.8% this month</p>
            </CardContent>
          </Card>
          <Card className="dark:bg-gray-900">
            <CardContent className="p-4 text-center">
              <TrendingUp className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <p className="text-2xl font-bold">37,340</p>
              <p className="text-xs text-muted-foreground">Predictions Made</p>
              <p className="text-xs text-green-600 mt-1">+2,340 this week</p>
            </CardContent>
          </Card>
          <Card className="dark:bg-gray-900">
            <CardContent className="p-4 text-center">
              <Trophy className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
              <p className="text-2xl font-bold">6</p>
              <p className="text-xs text-muted-foreground">Sports Covered</p>
              <p className="text-xs text-green-600 mt-1">+2 new sports</p>
            </CardContent>
          </Card>
          <Card className="dark:bg-gray-900">
            <CardContent className="p-4 text-center">
              <Sparkles className="h-8 w-8 text-purple-500 mx-auto mb-2" />
              <p className="text-2xl font-bold">Live</p>
              <p className="text-xs text-muted-foreground">Model Status</p>
              <p className="text-xs text-green-600 mt-1">99.9% uptime</p>
            </CardContent>
          </Card>
        </div>

        {/* Sport-Specific Accuracy */}
        <Card className="mb-6 dark:bg-gray-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-500" />
              AI Model Performance by Sport
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {SPORT_INSIGHTS.map((sport) => (
                <div
                  key={sport.sport}
                  className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                    sport.sport.toLowerCase() === (sport === "all" ? "" : sport)
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20"
                      : ""
                  }`}
                  onClick={() => setSport(sport.sport.toLowerCase())}
                >
                  <div className="text-3xl mb-2">{sport.icon}</div>
                  <p className="font-semibold text-sm">{sport.sport}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <p className="text-lg font-bold text-green-600">{sport.accuracy}%</p>
                    <Badge variant="secondary" className="text-[10px]">{sport.trend}</Badge>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    {sport.predictions.toLocaleString()} predictions
                  </p>
                  <p className="text-[10px] text-muted-foreground">{sport.modelVersion}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Sport Filter */}
        <div className="flex items-center gap-3 mb-6">
          <Tabs value={sport} onValueChange={setSport}>
            <TabsList>
              <TabsTrigger value="all">All Sports</TabsTrigger>
              <TabsTrigger value="cricket">🏏 Cricket</TabsTrigger>
              <TabsTrigger value="football">⚽ Football</TabsTrigger>
              <TabsTrigger value="basketball">🏀 Basketball</TabsTrigger>
              <TabsTrigger value="tennis">🎾 Tennis</TabsTrigger>
              <TabsTrigger value="baseball">⚾ Baseball</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Predictions Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredPredictions.map((prediction) => (
            <Card key={prediction.id} className="dark:bg-gray-900 hover:shadow-lg transition-all">
              <CardContent className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{prediction.sport}</Badge>
                    <Badge variant="secondary">{prediction.league}</Badge>
                    {prediction.isLive && (
                      <Badge className="bg-red-500 animate-pulse">LIVE</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {new Date(prediction.scheduledAt).toLocaleDateString("en-US", {
                        month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>

                {/* Teams and Score */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex-1 text-center">
                    <p className="text-lg font-bold">{prediction.homeTeam}</p>
                    {prediction.isLive && prediction.liveScore && (
                      <p className="text-2xl font-bold text-green-600">{prediction.liveScore.home}</p>
                    )}
                  </div>
                  <div className="px-4">
                    {prediction.isLive ? (
                      <Badge className="bg-red-100 text-red-800">LIVE</Badge>
                    ) : (
                      <span className="text-sm text-muted-foreground">vs</span>
                    )}
                  </div>
                  <div className="flex-1 text-center">
                    <p className="text-lg font-bold">{prediction.awayTeam}</p>
                    {prediction.isLive && prediction.liveScore && (
                      <p className="text-2xl font-bold text-green-600">{prediction.liveScore.away}</p>
                    )}
                  </div>
                </div>

                {/* Prediction Bars */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium w-20 text-right">{prediction.homeTeam}</span>
                    <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-green-500 h-full rounded-l-full transition-all"
                        style={{ width: `${prediction.homeWin}%` }}
                      />
                    </div>
                    <span className="text-xs font-bold w-12">{prediction.homeWin}%</span>
                  </div>
                  {prediction.draw > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium w-20 text-right text-muted-foreground">Draw</span>
                      <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                        <div
                          className="bg-yellow-400 h-full transition-all"
                          style={{ width: `${prediction.draw}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold w-12">{prediction.draw}%</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium w-20 text-right">{prediction.awayTeam}</span>
                    <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-blue-500 h-full rounded-r-full transition-all"
                        style={{ width: `${prediction.awayWin}%` }}
                      />
                    </div>
                    <span className="text-xs font-bold w-12">{prediction.awayWin}%</span>
                  </div>
                </div>

                {/* Confidence */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Brain className="h-4 w-4 text-purple-500" />
                    <span className="text-sm font-medium">AI Confidence</span>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-bold ${getConfidenceColor(prediction.confidence)}`}>
                    {prediction.confidence}%
                  </div>
                </div>

                {/* Key Factors */}
                <div className="mb-4">
                  <p className="text-xs font-medium text-muted-foreground mb-2">Key Factors:</p>
                  <div className="flex flex-wrap gap-1">
                    {prediction.keyFactors.map((factor, i) => (
                      <Badge key={i} variant="outline" className="text-[10px]">
                        {factor}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* AI Summary */}
                <div className="p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                  <div className="flex items-center gap-1 mb-1">
                    <Sparkles className="h-3 w-3 text-purple-500" />
                    <span className="text-xs font-medium text-purple-700 dark:text-purple-400">AI Analysis</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{prediction.aiSummary}</p>
                </div>

                {prediction.venue && (
                  <p className="text-xs text-muted-foreground mt-2 text-center">{prediction.venue}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* AI Model Info */}
        <Card className="mt-6 dark:bg-gray-900">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="h-5 w-5 text-green-500" />
              <h3 className="font-bold">About Our AI Model</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
              <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                <p className="font-medium text-blue-700 dark:text-blue-400">Data Sources</p>
                <p className="text-muted-foreground mt-1">50+ data providers including ESPN, Cricbuzz, and live APIs</p>
              </div>
              <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                <p className="font-medium text-green-700 dark:text-green-400">Training Data</p>
                <p className="text-muted-foreground mt-1">2M+ historical matches across 6 sports</p>
              </div>
              <div className="p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                <p className="font-medium text-purple-700 dark:text-purple-400">Model Type</p>
                <p className="text-muted-foreground mt-1">Ensemble ML with real-time feature updates</p>
              </div>
              <div className="p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg">
                <p className="font-medium text-yellow-700 dark:text-yellow-400">Last Updated</p>
                <p className="text-muted-foreground mt-1">Model retrained weekly with latest data</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
