"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Brain, Target, TrendingUp, Users, BarChart3, Zap, ChevronRight,
  Trophy, Shield, Activity, Sparkles, LineChart, Globe, Search,
  ArrowRight, Star, Clock, CheckCircle2, AlertCircle, Flame
} from "lucide-react";
import Link from "next/link";

interface Tool {
  id: string;
  name: string;
  description: string;
  icon: string;
  href: string;
  category: string;
  badge?: string;
  badgeColor?: string;
  features: string[];
  accuracy?: string;
  usageCount?: string;
  isNew?: boolean;
  isPremium?: boolean;
}

const TOOLS: Tool[] = [
  {
    id: "predict",
    name: "AI Match Predictor",
    description: "Get AI-powered match outcome predictions with win probabilities and key factor analysis",
    icon: "🎯",
    href: "/predictions",
    category: "predictions",
    badge: "Most Popular",
    badgeColor: "bg-blue-100 text-blue-700",
    features: ["Win Probability", "Key Factors", "AI Summary", "Confidence Score"],
    accuracy: "81%",
    usageCount: "37.3K",
  },
  {
    id: "probability",
    name: "Live Win Probability",
    description: "Real-time win probability tracker that updates as the match progresses ball-by-ball",
    icon: "📊",
    href: "/tools/probability",
    category: "live",
    badge: "LIVE",
    badgeColor: "bg-red-100 text-red-700",
    features: ["Real-time Updates", "Over-by-Over", "Required Rate", "Momentum Tracker"],
    accuracy: "85%",
    usageCount: "12.8K",
    isNew: true,
  },
  {
    id: "compare",
    name: "Player Comparison",
    description: "Advanced head-to-head player comparison with AI-powered insights and visual analytics",
    icon: "⚔️",
    href: "/tools/compare",
    category: "analysis",
    features: ["Stat Comparison", "Career Charts", "H2H Record", "AI Insights"],
    accuracy: "90%",
    usageCount: "8.5K",
  },
  {
    id: "h2h",
    name: "H2H Analyzer",
    description: "Deep historical head-to-head analysis with venue-specific data and trend analysis",
    icon: "🔍",
    href: "/tools/h2h",
    category: "analysis",
    features: ["Historical Data", "Venue Analysis", "Trend Patterns", "Win Streaks"],
    accuracy: "88%",
    usageCount: "6.2K",
  },
  {
    id: "fantasy",
    name: "Fantasy Team Builder",
    description: "AI-optimized fantasy team selector with captain picks and differential suggestions",
    icon: "🏆",
    href: "/tools/fantasy",
    category: "fantasy",
    badge: "Premium",
    badgeColor: "bg-yellow-100 text-yellow-700",
    features: ["AI Captain Pick", "Differential Tips", "Budget Optimizer", "Form Analysis"],
    accuracy: "78%",
    usageCount: "15.3K",
    isPremium: true,
  },
  {
    id: "calculator",
    name: "Score Calculator",
    description: "Cricket score & run rate calculator with required rate and projection tools",
    icon: "🧮",
    href: "/tools/calculator",
    category: "tools",
    features: ["Run Rate Calc", "Required Rate", "Target Projection", "Wicket Analysis"],
    accuracy: "100%",
    usageCount: "22.1K",
  },
  {
    id: "injury",
    name: "Injury Impact Analysis",
    description: "AI analysis of how player injuries affect team performance and match outcomes",
    icon: "🏥",
    href: "/tools/injury",
    category: "analysis",
    badge: "New",
    badgeColor: "bg-green-100 text-green-700",
    features: ["Injury Impact", "Team Strength", "Replacement Analysis", "Recovery Timeline"],
    isNew: true,
  },
  {
    id: "weather",
    name: "Weather Impact",
    description: "How weather conditions affect match outcomes across different sports",
    icon: "🌤️",
    href: "/tools/weather",
    category: "analysis",
    badge: "New",
    badgeColor: "bg-green-100 text-green-700",
    features: ["Weather Forecast", "Pitch Impact", "Toss Advantage", "Historical Weather"],
    isNew: true,
  },
  {
    id: "venue",
    name: "Venue Analyzer",
    description: "Historical venue data including pitch reports, averages, and ground-specific statistics",
    icon: "🏟️",
    href: "/tools/venue",
    category: "analysis",
    features: ["Pitch Report", "Ground Stats", "Average Scores", "Toss Impact"],
    accuracy: "92%",
    usageCount: "5.8K",
    isNew: true,
  },
  {
    id: "sentiment",
    name: "Fan Sentiment Analysis",
    description: "Real-time fan sentiment tracking from social media and fan reactions",
    icon: "💬",
    href: "/tools/sentiment",
    category: "social",
    badge: "Beta",
    badgeColor: "bg-purple-100 text-purple-700",
    features: ["Social Media", "Fan Mood", "Team Support", "Trending Topics"],
    isNew: true,
  },
  {
    id: "odds",
    name: "Odds Comparison",
    description: "Compare betting odds across multiple bookmakers for best value",
    icon: "💰",
    href: "/tools/odds",
    category: "predictions",
    features: ["Multi-Bookmaker", "Value Bets", "Odds History", "Line Movement"],
    usageCount: "9.4K",
  },
  {
    id: "accumulator",
    name: "Accumulator Builder",
    description: "AI-powered accumulator builder with risk assessment and value detection",
    icon: "🎰",
    href: "/tools/accumulator",
    category: "predictions",
    badge: "Premium",
    badgeColor: "bg-yellow-100 text-yellow-700",
    features: ["Risk Assessment", "Value Detection", "AI Selections", "Stake Calculator"],
    isPremium: true,
  },
];

const CATEGORIES = [
  { id: "all", label: "All Tools", icon: Globe },
  { id: "predictions", label: "Predictions", icon: Target },
  { id: "analysis", label: "Analysis", icon: BarChart3 },
  { id: "live", label: "Live Tools", icon: Activity },
  { id: "fantasy", label: "Fantasy", icon: Trophy },
  { id: "tools", label: "Utilities", icon: Zap },
  { id: "social", label: "Social", icon: Users },
];

const SPORTS = [
  { id: "cricket", name: "Cricket", icon: "🏏" },
  { id: "football", name: "Football", icon: "⚽" },
  { id: "basketball", name: "Basketball", icon: "🏀" },
  { id: "tennis", name: "Tennis", icon: "🎾" },
  { id: "baseball", name: "Baseball", icon: "⚾" },
  { id: "hockey", name: "Hockey", icon: "🏒" },
];

const AI_FEATURES = [
  { title: "Machine Learning Models", description: "Trained on 2M+ historical matches across 6 sports with continuous learning", icon: Brain, color: "text-purple-500" },
  { title: "Real-Time Analysis", description: "Live probability updates powered by WebSocket streams and instant data processing", icon: Zap, color: "text-yellow-500" },
  { title: "Proven Accuracy", description: "81%+ accuracy on match predictions validated by independent analysis", icon: Target, color: "text-green-500" },
  { title: "Multi-Sport Coverage", description: "Comprehensive coverage of Cricket, Football, Basketball, Tennis, Baseball, and Hockey", icon: Globe, color: "text-blue-500" },
];

export default function ToolsPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSport, setSelectedSport] = useState("cricket");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTools = TOOLS.filter((tool) => {
    const matchesCategory = selectedCategory === "all" || tool.category === selectedCategory;
    const matchesSearch =
      searchQuery === "" ||
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold mb-4 flex items-center justify-center gap-3">
              <Brain className="h-12 w-12 text-purple-400" />
              AI Sports Tools
            </h1>
            <p className="text-gray-300 text-xl max-w-2xl mx-auto">
              Powerful AI-driven tools for predictions, analysis, and fantasy sports.
              Powered by machine learning trained on millions of matches.
            </p>
          </div>

          {/* Sport Selector */}
          <div className="flex justify-center gap-3 flex-wrap">
            {SPORTS.map((s) => (
              <button
                key={s.id}
                onClick={() => setSelectedSport(s.id)}
                className={`px-5 py-2.5 rounded-full font-medium transition-all ${
                  selectedSport === s.id
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/25"
                    : "bg-white/10 hover:bg-white/20 text-white"
                }`}
              >
                {s.icon} {s.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* AI Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {AI_FEATURES.map((feature) => (
            <Card key={feature.title} className="dark:bg-gray-900">
              <CardContent className="p-4">
                <feature.icon className={`h-8 w-8 ${feature.color} mb-2`} />
                <h3 className="font-bold text-sm">{feature.title}</h3>
                <p className="text-xs text-muted-foreground mt-1">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Category Tabs & Search */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList className="flex-wrap h-auto gap-1">
              {CATEGORIES.map((cat) => (
                <TabsTrigger key={cat.id} value={cat.id} className="gap-1">
                  <cat.icon className="h-3 w-3" />
                  {cat.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border rounded-lg text-sm bg-white dark:bg-gray-900"
            />
          </div>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTools.map((tool) => (
            <Link key={tool.id} href={tool.href}>
              <Card className="h-full dark:bg-gray-900 hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-700 transition-all group cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-4xl">{tool.icon}</div>
                    <div className="flex gap-1">
                      {tool.badge && (
                        <Badge className={tool.badgeColor}>{tool.badge}</Badge>
                      )}
                      {tool.isNew && <Badge className="bg-green-100 text-green-700">New</Badge>}
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 transition mb-2">
                    {tool.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                    {tool.description}
                  </p>

                  {/* Features */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {tool.features.map((feature) => (
                      <Badge key={feature} variant="outline" className="text-[10px]">
                        {feature}
                      </Badge>
                    ))}
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                    {tool.accuracy && (
                      <span className="flex items-center gap-1">
                        <Target className="h-3 w-3" /> {tool.accuracy} accuracy
                      </span>
                    )}
                    {tool.usageCount && (
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" /> {tool.usageCount} uses
                      </span>
                    )}
                  </div>

                  {/* Launch Button */}
                  <div className="flex items-center justify-between">
                    <span className="text-blue-600 font-medium text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                      Launch Tool <ArrowRight className="h-4 w-4" />
                    </span>
                    {tool.isPremium && (
                      <Badge className="bg-yellow-100 text-yellow-700 text-[10px]">
                        <Star className="h-2 w-2 mr-1" /> Premium
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {filteredTools.length === 0 && (
          <Card className="dark:bg-gray-900">
            <CardContent className="p-12 text-center">
              <AlertCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No tools found</h3>
              <p className="text-muted-foreground">Try a different category or search term</p>
            </CardContent>
          </Card>
        )}

        {/* Why Our AI Section */}
        <Card className="mt-12 dark:bg-gray-900">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-center mb-8">Why Our AI Tools?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Brain className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="font-bold text-lg mb-2">Deep Learning Models</h3>
                <p className="text-sm text-muted-foreground">
                  Neural networks trained on 2M+ historical matches with feature engineering
                  covering 50+ statistical parameters per match.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="font-bold text-lg mb-2">Real-Time Processing</h3>
                <p className="text-sm text-muted-foreground">
                  Live data streams processed in milliseconds with WebSocket updates and
                  automatic model retraining on new data.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="font-bold text-lg mb-2">Transparent & Explainable</h3>
                <p className="text-sm text-muted-foreground">
                  Every prediction comes with key factors, confidence scores, and
                  AI-generated summaries so you understand the reasoning.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Access Links */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link href="/predictions" className="text-center p-4 bg-white dark:bg-gray-900 rounded-xl border hover:shadow-md transition">
            <Target className="h-6 w-6 text-blue-500 mx-auto mb-2" />
            <p className="text-sm font-medium">Predictions</p>
          </Link>
          <Link href="/rankings" className="text-center p-4 bg-white dark:bg-gray-900 rounded-xl border hover:shadow-md transition">
            <Trophy className="h-6 w-6 text-yellow-500 mx-auto mb-2" />
            <p className="text-sm font-medium">Rankings</p>
          </Link>
          <Link href="/tools/h2h" className="text-center p-4 bg-white dark:bg-gray-900 rounded-xl border hover:shadow-md transition">
            <BarChart3 className="h-6 w-6 text-green-500 mx-auto mb-2" />
            <p className="text-sm font-medium">H2H Analysis</p>
          </Link>
          <Link href="/tools/fantasy" className="text-center p-4 bg-white dark:bg-gray-900 rounded-xl border hover:shadow-md transition">
            <Flame className="h-6 w-6 text-red-500 mx-auto mb-2" />
            <p className="text-sm font-medium">Fantasy Builder</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
