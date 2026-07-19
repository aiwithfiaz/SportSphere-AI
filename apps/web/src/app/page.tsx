export const dynamic = 'force-dynamic';

import { Metadata } from "next";
import { TrendingUp, Newspaper, Trophy, Zap, ArrowRight } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MatchCard, Match } from "@/components/sports/match-card";
import { HeroSection } from "@/components/home/hero-section";
import { StatsSection } from "@/components/home/stats-section";
import { PartnersSection } from "@/components/home/partners-section";
import { AIFeaturesSection } from "@/components/home/ai-features-section";
import { TrustpilotSection } from "@/components/home/trustpilot-section";
import { FAQSection } from "@/components/home/faq-section";
import { SubscriptionSection } from "@/components/home/subscription-section";
import { NewsletterSection } from "@/components/home/newsletter-section";

export const metadata: Metadata = {
  title: "SportSphere AI - Intelligent Sports Analytics",
  description: "The world's most advanced AI-powered sports platform. Real-time live scores, AI predictions, fantasy sports, and comprehensive coverage of 50+ sports.",
};

async function getLiveMatches() {
  try {
    return await prisma.match.findMany({
      where: { status: { in: ["LIVE", "IN_PROGRESS"] } },
      include: { sport: true, tournament: true, homeTeam: true, awayTeam: true, venue: true, liveScore: true },
      orderBy: { scheduledAt: "desc" },
      take: 6,
    });
  } catch { return []; }
}

async function getUpcomingMatches() {
  try {
    return await prisma.match.findMany({
      where: { status: "SCHEDULED" },
      include: { sport: true, tournament: true, homeTeam: true, awayTeam: true, venue: true },
      orderBy: { scheduledAt: "asc" },
      take: 6,
    });
  } catch { return []; }
}

async function getLatestNews() {
  try {
    return await prisma.article.findMany({
      where: { status: "PUBLISHED" },
      include: { author: true, sport: true },
      orderBy: { publishedAt: "desc" },
      take: 4,
    });
  } catch { return []; }
}

async function getSports() {
  try {
    return await prisma.sport.findMany({
      where: { isActive: true },
      include: { _count: { select: { matches: true, teams: true } } },
      orderBy: { name: "asc" },
    });
  } catch { return []; }
}

function transformMatch(dbMatch: any): Match {
  return {
    id: dbMatch.id,
    homeTeam: { name: dbMatch.homeTeam?.name || "TBD", logo: dbMatch.homeTeam?.logo || undefined, score: dbMatch.homeScore || undefined },
    awayTeam: { name: dbMatch.awayTeam?.name || "TBD", logo: dbMatch.awayTeam?.logo || undefined, score: dbMatch.awayScore || undefined },
    status: dbMatch.status === "LIVE" || dbMatch.status === "IN_PROGRESS" ? "live" : dbMatch.status === "SCHEDULED" ? "upcoming" : "finished",
    league: dbMatch.tournament?.name || dbMatch.sport?.name || "",
    time: dbMatch.scheduledAt ? new Date(dbMatch.scheduledAt).toLocaleTimeString() : undefined,
    venue: dbMatch.venue?.name || undefined,
  };
}

export default async function HomePage() {
  const [liveMatches, upcomingMatches, latestNews, sports] = await Promise.all([
    getLiveMatches(),
    getUpcomingMatches(),
    getLatestNews(),
    getSports(),
  ]);

  return (
    <main className="min-h-screen">
      {/* 1. Hero Section with Auto-Slider (10 images) */}
      <HeroSection />

      {/* 2. Partners / Data Providers */}
      <PartnersSection />

      {/* 3. Platform Stats */}
      <StatsSection />

      {/* 4. Sports Grid */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-10">
            <Badge variant="outline" className="mb-4">Explore Sports</Badge>
            <h2 className="text-3xl font-bold">Coverage Across 50+ Sports</h2>
            <p className="text-muted-foreground mt-2">From Cricket to Football, NBA to NHL - we've got you covered</p>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {sports.map((sport) => (
              <Link key={sport.id} href={`/matches?sport=${sport.slug}`} className="block">
                <Card className="hover:border-primary/50 hover:shadow-md transition-all text-center group">
                  <CardContent className="p-4">
                    <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">{sport.icon}</div>
                    <p className="font-medium text-sm">{sport.name}</p>
                    <p className="text-xs text-muted-foreground">{sport._count.matches} matches</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 5. AI Features Showcase */}
      <AIFeaturesSection />

      {/* 6. Live Matches */}
      {liveMatches.length > 0 && (
        <section className="px-4 py-16 sm:px-6 lg:px-8 bg-muted/30">
          <div className="mx-auto max-w-7xl">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <Badge className="bg-red-100 text-red-800 animate-pulse">LIVE</Badge>
                <h2 className="text-2xl font-bold">Live Matches</h2>
              </div>
              <Link href="/matches">
                <Button variant="outline" size="sm">View All <ArrowRight className="h-4 w-4 ml-1" /></Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {liveMatches.map((match) => (
                <MatchCard key={match.id} match={transformMatch(match)} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 7. Upcoming Matches */}
      {upcomingMatches.length > 0 && (
        <section className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold">Upcoming Matches</h2>
              <Link href="/matches">
                <Button variant="outline" size="sm">View All <ArrowRight className="h-4 w-4 ml-1" /></Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingMatches.map((match) => (
                <MatchCard key={match.id} match={transformMatch(match)} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 8. Latest News */}
      {latestNews.length > 0 && (
        <section className="px-4 py-16 sm:px-6 lg:px-8 bg-muted/30">
          <div className="mx-auto max-w-7xl">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <Newspaper className="h-6 w-6" />
                <h2 className="text-2xl font-bold">Latest News</h2>
              </div>
              <Link href="/news">
                <Button variant="outline" size="sm">View All <ArrowRight className="h-4 w-4 ml-1" /></Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {latestNews.map((article) => (
                <Link key={article.id} href={`/news/${article.slug}`} className="block">
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    {article.coverImage && (
                      <div className="h-40 bg-slate-200 overflow-hidden">
                        <img src={article.coverImage} alt={article.title} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        {article.sport && <Badge variant="outline" className="text-xs">{article.sport.name}</Badge>}
                        {article.publishedAt && (
                          <span className="text-xs text-muted-foreground">{new Date(article.publishedAt).toLocaleDateString()}</span>
                        )}
                      </div>
                      <h3 className="font-semibold line-clamp-2 mb-2">{article.title}</h3>
                      {article.excerpt && <p className="text-sm text-muted-foreground line-clamp-2">{article.excerpt}</p>}
                      {article.author && (
                        <p className="text-xs text-muted-foreground/70 mt-2">By {article.author.displayName || "Unknown"}</p>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 9. Trustpilot / Reviews Section */}
      <TrustpilotSection />

      {/* 10. Subscription Plans */}
      <SubscriptionSection />

      {/* 11. FAQ Section */}
      <FAQSection />

      {/* 12. Newsletter Subscription */}
      <NewsletterSection />

      {/* 13. Final CTA */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
            <CardContent className="p-12">
              <Trophy className="h-12 w-12 mx-auto mb-4 opacity-80" />
              <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
              <p className="text-lg opacity-90 mb-8">
                Join 2 million+ sports enthusiasts using AI-powered analytics. Start free today.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/register">
                  <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                    Create Free Account
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
                <Link href="/premium">
                  <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 w-full sm:w-auto">
                    View Premium Plans
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}
