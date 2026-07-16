'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trophy, Medal, TrendingUp, Star, Crown, Loader2 } from 'lucide-react';

interface Ranking {
  rank: number;
  name: string;
  team: string;
  sport: string;
  rating: number;
  matches: number;
  points: number;
  change: number;
}

const defaultRankings: Ranking[] = [
  { rank: 1, name: 'Virat Kohli', team: 'India', sport: 'Cricket', rating: 920, matches: 120, points: 12500, change: 2 },
  { rank: 2, name: 'Joe Root', team: 'England', sport: 'Cricket', rating: 910, matches: 115, points: 12200, change: -1 },
  { rank: 3, name: 'Steve Smith', team: 'Australia', sport: 'Cricket', rating: 905, matches: 110, points: 11800, change: 1 },
  { rank: 4, name: 'Babar Azam', team: 'Pakistan', sport: 'Cricket', rating: 895, matches: 100, points: 11500, change: 0 },
  { rank: 5, name: 'Kane Williamson', team: 'New Zealand', sport: 'Cricket', rating: 890, matches: 105, points: 11200, change: -2 },
  { rank: 6, name: 'Rohit Sharma', team: 'India', sport: 'Cricket', rating: 885, matches: 112, points: 11000, change: 3 },
  { rank: 7, name: 'David Warner', team: 'Australia', sport: 'Cricket', rating: 880, matches: 108, points: 10800, change: -1 },
  { rank: 8, name: 'Ben Stokes', team: 'England', sport: 'Cricket', rating: 875, matches: 95, points: 10500, change: 5 },
  { rank: 9, name: 'Pat Cummins', team: 'Australia', sport: 'Cricket', rating: 870, matches: 80, points: 10200, change: 0 },
  { rank: 10, name: 'Jasprit Bumrah', team: 'India', sport: 'Cricket', rating: 865, matches: 75, points: 10000, change: 2 },
];

export default function RankingsPage() {
  const [rankings, setRankings] = useState<Ranking[]>(defaultRankings);
  const [sport, setSport] = useState('cricket');
  const [loading, setLoading] = useState(false);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Trophy className="h-8 w-8 text-yellow-500" />
            Global Rankings
          </h1>
          <p className="text-muted-foreground mt-1">Official player rankings across all sports</p>
        </div>
        <Select value={sport} onValueChange={setSport}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="cricket">Cricket</SelectItem>
            <SelectItem value="football">Football</SelectItem>
            <SelectItem value="basketball">Basketball</SelectItem>
            <SelectItem value="tennis">Tennis</SelectItem>
            <SelectItem value="f1">Formula 1</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Top 3 Podium */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[rankings[1], rankings[0], rankings[2]].map((player, i) => (
          <Card key={player.rank} className={`text-center ${
            i === 1 ? 'ring-2 ring-yellow-400 scale-105' : ''
          }`}>
            <CardContent className="p-6">
              <div className={`w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center text-2xl font-bold ${
                i === 1 ? 'bg-yellow-100 text-yellow-700' :
                i === 0 ? 'bg-gray-100 text-gray-700' :
                'bg-orange-100 text-orange-700'
              }`}>
                {i === 1 ? <Crown className="h-8 w-8" /> : player.rank}
              </div>
              <h3 className="font-bold text-lg">{player.name}</h3>
              <p className="text-sm text-muted-foreground">{player.team}</p>
              <div className="mt-2">
                <p className="text-xl font-bold text-blue-600">{player.rating}</p>
                <p className="text-xs text-muted-foreground">Rating</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Full Rankings Table */}
      <Card>
        <CardHeader>
          <CardTitle>Complete Rankings</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            {rankings.map((player) => (
              <div key={player.rank} className="flex items-center justify-between p-4 hover:bg-accent transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    player.rank <= 3 ? 'bg-yellow-100 text-yellow-700' : 'bg-muted text-muted-foreground'
                  }`}>
                    {player.rank}
                  </div>
                  <div>
                    <p className="font-semibold">{player.name}</p>
                    <p className="text-sm text-muted-foreground">{player.team} • {player.matches} matches</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="font-bold">{player.rating}</p>
                    <p className="text-xs text-muted-foreground">Rating</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{player.points.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Points</p>
                  </div>
                  <div className={`text-sm font-medium ${
                    player.change > 0 ? 'text-green-600' : player.change < 0 ? 'text-red-600' : 'text-muted-foreground'
                  }`}>
                    {player.change > 0 ? `+${player.change}` : player.change}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
