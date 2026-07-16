'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  Trophy,
  Star,
  Swords,
  Shield,
  Target,
  Flame,
  Crown,
  Zap,
  ArrowRight,
  Lock,
} from 'lucide-react';

const features = [
  {
    icon: Users,
    title: 'Create Your Team',
    description: 'Build your dream team from real players across multiple sports',
    color: 'text-blue-600',
    bg: 'bg-blue-500/10',
  },
  {
    icon: Trophy,
    title: 'Win Prizes',
    description: 'Compete in leagues and tournaments to win exciting prizes',
    color: 'text-yellow-600',
    bg: 'bg-yellow-500/10',
  },
  {
    icon: Star,
    title: 'Player Ratings',
    description: 'Dynamic player ratings based on real match performance',
    color: 'text-purple-600',
    bg: 'bg-purple-500/10',
  },
  {
    icon: Swords,
    title: 'Head-to-Head',
    description: 'Challenge friends in private leagues and head-to-head contests',
    color: 'text-red-600',
    bg: 'bg-red-500/10',
  },
];

const liveMatches = [
  { homeTeam: 'India', awayTeam: 'Australia', sport: 'Cricket', status: 'Live', score: '245/4 (45.2)' },
  { homeTeam: 'Liverpool', awayTeam: 'Manchester City', sport: 'Football', status: 'Live', score: "2-1 (72')" },
  { homeTeam: 'Lakers', awayTeam: 'Warriors', sport: 'Basketball', status: 'Live', score: '98-102 (Q4)' },
];

const topPlayers = [
  { name: 'Virat Kohli', team: 'India', sport: 'Cricket', points: 1250, rank: 1 },
  { name: 'Lionel Messi', team: 'Inter Miami', sport: 'Football', points: 1180, rank: 2 },
  { name: 'LeBron James', team: 'Lakers', sport: 'Basketball', points: 1120, rank: 3 },
  { name: 'Rohit Sharma', team: 'India', sport: 'Cricket', points: 1050, rank: 4 },
];

export default function FantasyPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white p-8 md:p-12 mb-8">
        <div className="relative z-10">
          <Badge className="bg-white/20 text-white border-0 mb-4">Fantasy Sports</Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Build Your Dream Team
          </h1>
          <p className="text-lg text-white/80 max-w-2xl mb-6">
            Create your fantasy team, make predictions, and compete with millions of sports fans worldwide.
            Real players, real points, real prizes!
          </p>
          <div className="flex gap-3">
            <Button size="lg" className="bg-white text-purple-600 hover:bg-white/90">
              Create Team
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
            <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
              How It Works
            </Button>
          </div>
        </div>
        <div className="absolute right-0 top-0 w-1/3 h-full opacity-10">
          <Trophy className="h-full w-full" />
        </div>
      </div>

      {/* Live Matches for Fantasy */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Live Matches</h2>
          <Badge className="bg-red-500 animate-pulse">
            <Flame className="h-3 w-3 mr-1" /> Live Now
          </Badge>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {liveMatches.map((match, i) => (
            <Card key={i} className="hover:shadow-lg transition-shadow cursor-pointer border-red-200">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <Badge variant="outline">{match.sport}</Badge>
                  <Badge className="bg-red-500">Live</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{match.homeTeam}</span>
                    <span className="text-sm text-muted-foreground">vs</span>
                    <span className="font-medium">{match.awayTeam}</span>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-blue-600">{match.score}</p>
                  </div>
                  <Button className="w-full" size="sm">
                    <Users className="h-4 w-4 mr-2" />
                    Join Contest
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">How Fantasy Works</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, i) => (
            <Card key={i} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className={`w-12 h-12 rounded-lg ${feature.bg} flex items-center justify-center mb-4`}>
                  <feature.icon className={`h-6 w-6 ${feature.color}`} />
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Top Players */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Top Fantasy Players</h2>
        <Card>
          <CardContent className="p-0">
            <div className="divide-y">
              {topPlayers.map((player) => (
                <div key={player.rank} className="flex items-center justify-between p-4 hover:bg-accent transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                      player.rank === 1 ? 'bg-yellow-100 text-yellow-700' :
                      player.rank === 2 ? 'bg-gray-100 text-gray-700' :
                      player.rank === 3 ? 'bg-orange-100 text-orange-700' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      {player.rank}
                    </div>
                    <div>
                      <p className="font-medium">{player.name}</p>
                      <p className="text-sm text-muted-foreground">{player.team} • {player.sport}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-blue-600">{player.points.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Points</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* CTA */}
      <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
        <CardContent className="p-8 text-center">
          <Crown className="h-12 w-12 mx-auto mb-4 text-yellow-300" />
          <h2 className="text-2xl font-bold mb-2">Go Premium for Exclusive Contests</h2>
          <p className="text-white/80 mb-4 max-w-md mx-auto">
            Access premium leagues, higher prize pools, and exclusive player stats with SportSphere Premium.
          </p>
          <Button className="bg-white text-purple-600 hover:bg-white/90">
            <Zap className="h-4 w-4 mr-2" />
            Upgrade to Premium
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
