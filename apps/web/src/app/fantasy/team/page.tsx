"use client";

import { useState } from "react";
import {
  Trophy,
  Users,
  Star,
  Filter,
  Search,
  Plus,
  Minus,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const availablePlayers = [
  {
    id: "1",
    name: "Virat Kohli",
    team: "India",
    role: "Batsman",
    points: 892,
    credit: 10.5,
    selected: false,
  },
  {
    id: "2",
    name: "Jasprit Bumrah",
    team: "India",
    role: "Bowler",
    points: 756,
    credit: 9.5,
    selected: false,
  },
  {
    id: "3",
    name: "Pat Cummins",
    team: "Australia",
    role: "Bowler",
    points: 698,
    credit: 9.0,
    selected: false,
  },
  {
    id: "4",
    name: "Steve Smith",
    team: "Australia",
    role: "Batsman",
    points: 723,
    credit: 9.5,
    selected: false,
  },
  {
    id: "5",
    name: "Rohit Sharma",
    team: "India",
    role: "Batsman",
    points: 687,
    credit: 9.0,
    selected: false,
  },
  {
    id: "6",
    name: "Travis Head",
    team: "Australia",
    role: "All-rounder",
    points: 654,
    credit: 8.5,
    selected: false,
  },
];

export default function TeamBuilderPage() {
  const [team, setTeam] = useState<string[]>([]);
  const [captain, setCaptain] = useState<string | null>(null);
  const [viceCaptain, setViceCaptain] = useState<string | null>(null);

  const totalCredits = 100;
  const usedCredits = team.reduce((sum, playerId) => {
    const player = availablePlayers.find((p) => p.id === playerId);
    return sum + (player?.credit || 0);
  }, 0);

  const togglePlayer = (playerId: string) => {
    if (team.includes(playerId)) {
      setTeam(team.filter((id) => id !== playerId));
      if (captain === playerId) setCaptain(null);
      if (viceCaptain === playerId) setViceCaptain(null);
    } else if (team.length < 11) {
      setTeam([...team, playerId]);
    }
  };

  const selectCaptain = (playerId: string) => {
    if (team.includes(playerId)) {
      setCaptain(playerId === captain ? null : playerId);
    }
  };

  const selectViceCaptain = (playerId: string) => {
    if (team.includes(playerId) && playerId !== captain) {
      setViceCaptain(playerId === viceCaptain ? null : playerId);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Build Your Team</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Select 11 players for your fantasy team.
          </p>
        </div>
        <Button disabled={team.length !== 11}>
          <Check className="h-4 w-4 mr-2" />
          Save Team
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Team Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Your Team ({team.length}/11)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Credits Used</span>
                  <span className="font-medium">
                    {usedCredits.toFixed(1)} / {totalCredits}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{
                      width: `${(usedCredits / totalCredits) * 100}%`,
                    }}
                  />
                </div>

                {team.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-medium mb-2">Selected Players</p>
                    <div className="space-y-2">
                      {team.map((playerId) => {
                        const player = availablePlayers.find(
                          (p) => p.id === playerId
                        );
                        return (
                          <div
                            key={playerId}
                            className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800/50 rounded"
                          >
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarFallback className="text-xs">
                                  {player?.name.slice(0, 2)}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-sm">{player?.name}</span>
                            </div>
                            <div className="flex gap-1">
                              <Button
                                variant={
                                  captain === playerId ? "default" : "outline"
                                }
                                size="sm"
                                className="h-6 px-2 text-xs"
                                onClick={() => selectCaptain(playerId)}
                              >
                                C
                              </Button>
                              <Button
                                variant={
                                  viceCaptain === playerId
                                    ? "default"
                                    : "outline"
                                }
                                size="sm"
                                className="h-6 px-2 text-xs"
                                onClick={() => selectViceCaptain(playerId)}
                              >
                                VC
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {team.length === 11 && (
                  <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <p className="text-sm text-green-800 dark:text-green-200">
                      Team complete! Select Captain (2x) and Vice Captain (1.5x)
                      points.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Player Selection */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Select Players</CardTitle>
                <div className="flex gap-2">
                  <Select defaultValue="all">
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      <SelectItem value="batsman">Batsman</SelectItem>
                      <SelectItem value="bowler">Bowler</SelectItem>
                      <SelectItem value="all-rounder">All-rounder</SelectItem>
                      <SelectItem value="wicket-keeper">Wicket-keeper</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select defaultValue="points">
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="points">Points</SelectItem>
                      <SelectItem value="credit">Credit</SelectItem>
                      <SelectItem value="name">Name</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {availablePlayers.map((player) => (
                  <div
                    key={player.id}
                    className={`flex items-center justify-between p-4 rounded-lg border ${
                      team.includes(player.id)
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                        : "border-gray-200 dark:border-gray-700"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarFallback>{player.name.slice(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{player.name}</p>
                        <p className="text-sm text-gray-600">
                          {player.team} • {player.role}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-medium">{player.points} pts</p>
                        <p className="text-sm text-gray-600">
                          {player.credit} Cr
                        </p>
                      </div>
                      <Button
                        variant={team.includes(player.id) ? "default" : "outline"}
                        size="sm"
                        onClick={() => togglePlayer(player.id)}
                        disabled={
                          !team.includes(player.id) && team.length >= 11
                        }
                      >
                        {team.includes(player.id) ? (
                          <Minus className="h-4 w-4" />
                        ) : (
                          <Plus className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
