"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LiveIndicator } from "@/components/sports/live-indicator";

export interface Team {
  name: string;
  logo?: string;
  score?: number;
}

export interface Match {
  id: string;
  homeTeam: Team;
  awayTeam: Team;
  status: "live" | "upcoming" | "finished";
  league?: string;
  time?: string;
  venue?: string;
}

export interface MatchCardProps extends React.HTMLAttributes<HTMLDivElement> {
  match: Match;
  onClick?: () => void;
}

const MatchCard = React.forwardRef<HTMLDivElement, MatchCardProps>(
  ({ className, match, onClick, ...props }, ref) => {
    const getStatusBadge = () => {
      switch (match.status) {
        case "live":
          return <Badge variant="live">LIVE</Badge>;
        case "upcoming":
          return <Badge variant="upcoming">UPCOMING</Badge>;
        case "finished":
          return <Badge variant="secondary">FT</Badge>;
        default:
          return null;
      }
    };

    return (
      <Card
        ref={ref}
        className={cn(
          "transition-all hover:shadow-md hover:-translate-y-1 cursor-pointer",
          match.status === "live" && "border-red-500/50",
          className
        )}
        onClick={onClick}
        role="button"
        tabIndex={0}
        aria-label={`Match: ${match.homeTeam.name} vs ${match.awayTeam.name}`}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onClick?.();
          }
        }}
        {...props}
      >
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {match.league}
            </CardTitle>
            <div className="flex items-center gap-2">
              {match.status === "live" && <LiveIndicator />}
              {getStatusBadge()}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between space-x-4">
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={match.homeTeam.logo} alt={match.homeTeam.name} />
                <AvatarFallback>{match.homeTeam.name.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <span className="font-medium">{match.homeTeam.name}</span>
            </div>
            <div className="text-center">
              {match.status === "live" || match.status === "finished" ? (
                <div className="text-xl font-bold">
                  {match.homeTeam.score} - {match.awayTeam.score}
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">vs</div>
              )}
              {match.time && (
                <div className="text-xs text-muted-foreground">{match.time}</div>
              )}
            </div>
            <div className="flex items-center space-x-3">
              <span className="font-medium">{match.awayTeam.name}</span>
              <Avatar className="h-10 w-10">
                <AvatarImage src={match.awayTeam.logo} alt={match.awayTeam.name} />
                <AvatarFallback>{match.awayTeam.name.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </CardContent>
        {match.venue && (
          <CardFooter className="pt-2">
            <p className="text-xs text-muted-foreground w-full text-center">
              {match.venue}
            </p>
          </CardFooter>
        )}
      </Card>
    );
  }
);
MatchCard.displayName = "MatchCard";

export { MatchCard };
