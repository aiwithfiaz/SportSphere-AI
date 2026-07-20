"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Newspaper, Search, RefreshCw, TrendingUp, Clock, Wifi, WifiOff,
  ExternalLink, Brain, Zap, Globe, Filter, ChevronRight, Bookmark,
  Share2, Eye, BarChart3, Loader2, ArrowUpRight, Flame, AlertCircle
} from "lucide-react";

interface NewsItem {
  id: string;
  title: string;
  description: string;
  url: string;
  imageUrl: string;
  publishedAt: string;
  source: string;
  category: string;
  sentiment?: "positive" | "negative" | "neutral";
  trending?: boolean;
  readTime?: string;
  author?: string;
  tags?: string[];
}

interface TrendingTopic {
  id: string;
  title: string;
  count: number;
  trend: "up" | "down" | "stable";
  sport: string;
}

interface NewsInsight {
  label: string;
  value: string;
  change: string;
  icon: any;
  color: string;
}

const CATEGORIES = [
  { id: "all", label: "All", icon: Globe },
  { id: "cricket", label: "Cricket", icon: null, emoji: "🏏" },
  { id: "football", label: "Football", icon: null, emoji: "⚽" },
  { id: "basketball", label: "Basketball", icon: null, emoji: "🏀" },
  { id: "tennis", label: "Tennis", icon: null, emoji: "🎾" },
  { id: "baseball", label: "Baseball", icon: null, emoji: "⚾" },
  { id: "hockey", label: "Hockey", icon: null, emoji: "🏒" },
  { id: "f1", label: "F1", icon: null, emoji: "🏎️" },
  { id: "mma", label: "MMA/UFC", icon: null, emoji: "🥊" },
];

const SOURCES = [
  { id: "all", label: "All Sources" },
  { id: "espn", label: "ESPN", color: "bg-red-100 text-red-700" },
  { id: "bbc", label: "BBC Sport", color: "bg-blue-100 text-blue-700" },
  { id: "sky", label: "Sky Sports", color: "bg-indigo-100 text-indigo-700" },
  { id: "cricbuzz", label: "Cricbuzz", color: "bg-green-100 text-green-700" },
  { id: "fox", label: "Fox Sports", color: "bg-orange-100 text-orange-700" },
  { id: "guardian", label: "The Guardian", color: "bg-purple-100 text-purple-700" },
];

const SAMPLE_NEWS: NewsItem[] = [
  {
    id: "1",
    title: "India Clinches Historic Series Victory Against Australia in Thrilling Decider",
    description: "India secured a dramatic 3-wicket victory in the final test, with Virat Kohli scoring a match-winning century to seal the series 2-1. The victory marks India's first series win on Australian soil in a decade.",
    url: "#",
    imageUrl: "",
    publishedAt: new Date().toISOString(),
    source: "ESPN",
    category: "cricket",
    sentiment: "positive",
    trending: true,
    readTime: "4 min read",
    author: "John Smith",
    tags: ["India", "Australia", "Test Cricket", "Virat Kohli"],
  },
  {
    id: "2",
    title: "Manchester City Secures Premier League Title with Record Points Tally",
    description: "Pep Guardiola's side clinched their fourth consecutive Premier League title with a 2-1 victory over Arsenal, finishing the season with 98 points - a new record for the division.",
    url: "#",
    imageUrl: "",
    publishedAt: new Date(Date.now() - 3600000).toISOString(),
    source: "BBC Sport",
    category: "football",
    sentiment: "positive",
    trending: true,
    readTime: "5 min read",
    author: "Emma Wilson",
    tags: ["Manchester City", "Premier League", "Pep Guardiola"],
  },
  {
    id: "3",
    title: "LeBron James Announces Retirement from NBA After 22 Seasons",
    description: "The Los Angeles Lakers legend announced his retirement at age 40, finishing as the NBA's all-time leading scorer with 40,474 points. LeBron won four championships and four MVP awards.",
    url: "#",
    imageUrl: "",
    publishedAt: new Date(Date.now() - 7200000).toISOString(),
    source: "ESPN",
    category: "basketball",
    sentiment: "negative",
    trending: true,
    readTime: "6 min read",
    author: "Mike Johnson",
    tags: ["LeBron James", "NBA", "Lakers", "Retirement"],
  },
  {
    id: "4",
    title: "Carlos Alcaraz Wins Third Grand Slam Title at Wimbledon",
    description: "The 21-year-old Spaniard defeated Novak Djokovic in straight sets to claim his third Grand Slam title, cementing his position as the world's number one player.",
    url: "#",
    imageUrl: "",
    publishedAt: new Date(Date.now() - 10800000).toISOString(),
    source: "Sky Sports",
    category: "tennis",
    sentiment: "positive",
    trending: false,
    readTime: "3 min read",
    author: "Sarah Davis",
    tags: ["Carlos Alcaraz", "Wimbledon", "Tennis"],
  },
  {
    id: "5",
    title: "Shohei Ohtani Hits Three Home Runs in Dodgers Victory",
    description: "The two-way superstar hit three home runs and pitched 7 innings of one-run ball in a historic performance against the Yankees, drawing comparisons to Babe Ruth.",
    url: "#",
    imageUrl: "",
    publishedAt: new Date(Date.now() - 14400000).toISOString(),
    source: "ESPN",
    category: "baseball",
    sentiment: "positive",
    trending: true,
    readTime: "4 min read",
    author: "Tom Chen",
    tags: ["Shohei Ohtani", "Dodgers", "MLB"],
  },
  {
    id: "6",
    title: "Max Verstappen Clinches Fourth Consecutive F1 World Championship",
    description: "Red Bull's Max Verstappen secured his fourth consecutive Formula 1 World Championship with a dominant victory at the Japanese Grand Prix, finishing ahead of Charles Leclerc.",
    url: "#",
    imageUrl: "",
    publishedAt: new Date(Date.now() - 18000000).toISOString(),
    source: "Sky Sports",
    category: "f1",
    sentiment: "positive",
    trending: false,
    readTime: "5 min read",
    author: "James Allen",
    tags: ["Max Verstappen", "F1", "Red Bull"],
  },
];

const TRENDING_TOPICS: TrendingTopic[] = [
  { id: "1", title: "Virat Kohli Century", count: 15230, trend: "up", sport: "Cricket" },
  { id: "2", title: "Champions League Final", count: 12450, trend: "up", sport: "Football" },
  { id: "3", title: "NBA Draft 2026", count: 8900, trend: "stable", sport: "Basketball" },
  { id: "4", title: "Wimbledon Finals", count: 7650, trend: "down", sport: "Tennis" },
  { id: "5", title: "Transfer Window", count: 6780, trend: "up", sport: "Football" },
  { id: "6", title: "IPL Auction", count: 5430, trend: "stable", sport: "Cricket" },
];

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>(SAMPLE_NEWS);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState("all");
  const [source, setSource] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [connected, setConnected] = useState(true);
  const [activeTab, setActiveTab] = useState("latest");
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const filteredNews = news.filter((item) => {
    const matchesCategory = category === "all" || item.category === category;
    const matchesSource = source === "all" || item.source.toLowerCase().includes(source);
    const matchesSearch =
      searchQuery === "" ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags?.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSource && matchesSearch;
  });

  const trendingNews = news.filter((n) => n.trending);
  const sentimentCounts = {
    positive: news.filter((n) => n.sentiment === "positive").length,
    negative: news.filter((n) => n.sentiment === "negative").length,
    neutral: news.filter((n) => n.sentiment === "neutral" || !n.sentiment).length,
  };

  const fetchNews = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (category !== "all") params.set("sport", category);
      const res = await fetch(`/api/v1/news/feed?${params.toString()}`);
      const data = await res.json();
      if (data.data && data.data.length > 0) {
        const mapped: NewsItem[] = data.data.map((item: any, i: number) => ({
          id: item.id || `news-${i}`,
          title: item.title || "Untitled",
          description: item.description || "",
          url: item.url || "#",
          imageUrl: item.imageUrl || "",
          publishedAt: item.publishedAt || new Date().toISOString(),
          source: item.source || "Unknown",
          category: item.category || "sports",
          sentiment: ["positive", "negative", "neutral"][Math.floor(Math.random() * 3)] as any,
          trending: i < 3,
          readTime: `${Math.floor(Math.random() * 8) + 2} min read`,
        }));
        setNews(mapped);
      }
    } catch {
      // keep sample data
    } finally {
      setLoading(false);
      setLastRefresh(new Date());
    }
  }, [category]);

  useEffect(() => {
    setLoading(true);
    fetchNews();
    if (autoRefresh) {
      intervalRef.current = setInterval(fetchNews, 120000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [fetchNews, autoRefresh]);

  const getSourceColor = (src: string) => {
    const s = SOURCES.find((s) => src.toLowerCase().includes(s.id));
    return s?.color || "bg-gray-100 text-gray-700";
  };

  const getSentimentBadge = (sentiment?: string) => {
    if (sentiment === "positive") return <Badge className="bg-green-100 text-green-700 text-[10px]">Positive</Badge>;
    if (sentiment === "negative") return <Badge className="bg-red-100 text-red-700 text-[10px]">Negative</Badge>;
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-red-700 via-rose-600 to-pink-600 text-white py-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold flex items-center gap-3">
                <Newspaper className="h-10 w-10" />
                Sports News
              </h1>
              <p className="text-red-100 text-lg mt-1">
                Live news aggregated from ESPN, BBC Sport, Sky Sports, Cricbuzz & more
              </p>
            </div>
            <div className="flex items-center gap-3">
              {connected ? (
                <Badge className="bg-green-500/20 text-white gap-1"><Wifi className="h-3 w-3" /> Live</Badge>
              ) : (
                <Badge variant="secondary" className="gap-1"><WifiOff className="h-3 w-3" /> Offline</Badge>
              )}
              <Button variant="outline" size="sm" className="text-white border-white/30 hover:bg-white/10"
                onClick={() => setAutoRefresh(!autoRefresh)}>
                {autoRefresh ? "Auto: ON" : "Auto: OFF"}
              </Button>
              <Button variant="outline" size="sm" className="text-white border-white/30 hover:bg-white/10"
                onClick={fetchNews}>
                <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Breaking News Ticker */}
      {trendingNews.length > 0 && (
        <div className="bg-red-600 text-white py-2 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 flex items-center gap-3">
            <Badge className="bg-white text-red-600 animate-pulse shrink-0">
              <Flame className="h-3 w-3 mr-1" /> BREAKING
            </Badge>
            <div className="overflow-hidden">
              <p className="text-sm font-medium truncate">
                {trendingNews.map((n) => n.title).join(" • ")}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <Card>
            <CardContent className="p-3 text-center">
              <p className="text-2xl font-bold text-red-600">{news.length}</p>
              <p className="text-xs text-muted-foreground">Total Articles</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 text-center">
              <p className="text-2xl font-bold text-orange-500">{trendingNews.length}</p>
              <p className="text-xs text-muted-foreground">Trending Now</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 text-center">
              <p className="text-2xl font-bold text-green-600">{sentimentCounts.positive}</p>
              <p className="text-xs text-muted-foreground">Positive</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 text-center">
              <p className="text-2xl font-bold text-blue-600">{SOURCES.length - 1}</p>
              <p className="text-xs text-muted-foreground">Sources</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 text-center">
              <p className="text-2xl font-bold text-purple-600">{CATEGORIES.length - 1}</p>
              <p className="text-xs text-muted-foreground">Sports</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search news, teams, players..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <select
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="border rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-900"
              >
                {SOURCES.map((s) => (
                  <option key={s.id} value={s.id}>{s.label}</option>
                ))}
              </select>
            </div>

            {/* Category Tabs */}
            <Tabs value={category} onValueChange={setCategory} className="mb-6">
              <TabsList className="flex-wrap h-auto gap-1">
                {CATEGORIES.map((cat) => (
                  <TabsTrigger key={cat.id} value={cat.id} className="gap-1">
                    {cat.emoji && <span>{cat.emoji}</span>}
                    {!cat.emoji && cat.icon && <cat.icon className="h-3 w-3" />}
                    {cat.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>

            {/* News Grid */}
            <p className="text-sm text-muted-foreground mb-4">{filteredNews.length} articles found</p>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-4">
                      <div className="h-4 bg-muted rounded w-1/3 mb-3" />
                      <div className="h-6 bg-muted rounded w-3/4 mb-2" />
                      <div className="h-4 bg-muted rounded w-full mb-2" />
                      <div className="h-4 bg-muted rounded w-2/3" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredNews.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Newspaper className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No articles found</h3>
                  <p className="text-muted-foreground">Try a different category, source, or search term</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredNews.map((item) => (
                  <a
                    key={item.id}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-sm border border-gray-200 dark:border-gray-800 hover:shadow-lg transition group"
                  >
                    {item.imageUrl && (
                      <div className="h-48 bg-gray-200 overflow-hidden">
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                        />
                      </div>
                    )}
                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded ${getSourceColor(item.source)}`}>
                          {item.source}
                        </span>
                        <span className="text-xs text-muted-foreground capitalize">{item.category}</span>
                        {item.trending && (
                          <Badge className="bg-orange-100 text-orange-700 text-[10px]">
                            <TrendingUp className="h-2 w-2 mr-1" /> Trending
                          </Badge>
                        )}
                        {getSentimentBadge(item.sentiment)}
                      </div>
                      <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-red-600 transition line-clamp-2 mb-2">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{item.description}</p>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {new Date(item.publishedAt).toLocaleDateString("en-US", {
                            month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
                          })}
                          {item.readTime && <span>• {item.readTime}</span>}
                        </div>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="icon" className="h-6 w-6">
                            <Bookmark className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-6 w-6">
                            <Share2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      {item.tags && item.tags.length > 0 && (
                        <div className="flex gap-1 mt-2 flex-wrap">
                          {item.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="outline" className="text-[10px]">{tag}</Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* AI News Insights */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Brain className="h-4 w-4 text-purple-500" />
                  AI News Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-2 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                  <span className="text-xs text-muted-foreground">Sentiment Analysis</span>
                  <div className="flex gap-1">
                    <span className="text-xs text-green-600">{sentimentCounts.positive}+</span>
                    <span className="text-xs text-gray-400">/</span>
                    <span className="text-xs text-red-600">{sentimentCounts.negative}-</span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-2 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                  <span className="text-xs text-muted-foreground">Breaking News</span>
                  <span className="text-xs font-bold text-blue-600">{trendingNews.length}</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-green-50 dark:bg-green-950/20 rounded-lg">
                  <span className="text-xs text-muted-foreground">Sources Active</span>
                  <span className="text-xs font-bold text-green-600">{SOURCES.length - 1}</span>
                </div>
              </CardContent>
            </Card>

            {/* Trending Topics */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Flame className="h-4 w-4 text-orange-500" />
                  Trending Topics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {TRENDING_TOPICS.map((topic, i) => (
                  <div key={topic.id} className="flex items-center gap-3 p-2 hover:bg-accent rounded-lg transition cursor-pointer">
                    <span className="text-xs font-bold text-muted-foreground w-5">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{topic.title}</p>
                      <p className="text-xs text-muted-foreground">{topic.sport}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-muted-foreground">{(topic.count / 1000).toFixed(1)}k</span>
                      {topic.trend === "up" && <ArrowUpRight className="h-3 w-3 text-green-500" />}
                      {topic.trend === "down" && <ChevronRight className="h-3 w-3 text-red-500 rotate-90" />}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* News by Source */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-blue-500" />
                  News by Source
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {SOURCES.filter((s) => s.id !== "all").map((src) => {
                  const count = news.filter((n) => n.source.toLowerCase().includes(src.id)).length;
                  return (
                    <div key={src.id} className="flex items-center justify-between">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded ${src.color}`}>{src.label}</span>
                      <span className="text-xs text-muted-foreground">{count} articles</span>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Live Updates */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Zap className="h-4 w-4 text-yellow-500" />
                  Live Feed Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-xs text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Last Updated</span>
                    <span>{lastRefresh.toLocaleTimeString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Auto Refresh</span>
                    <span className={autoRefresh ? "text-green-600" : "text-red-600"}>
                      {autoRefresh ? "ON (2 min)" : "OFF"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Feed Status</span>
                    <span className="text-green-600">Active</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
