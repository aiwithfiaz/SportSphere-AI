"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { LiveIndicator } from "@/components/sports/live-indicator";

export interface ScoreWidgetProps extends React.HTMLAttributes<HTMLDivElement> {
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  status: "live" | "upcoming" | "finished";
  time?: string;
}

const ScoreWidget = React.forwardRef<HTMLDivElement, ScoreWidgetProps>(
  ({ className, homeTeam, awayTeam, homeScore, awayScore, status, time, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-lg border bg-card p-4 shadow-sm",
          status === "live" && "border-red-500/50 animate-pulse-glow",
          className
        )}
        role="status"
        aria-label={`Score: ${homeTeam} ${homeScore} - ${awayScore} ${awayTeam}`}
        {...props}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {status === "live" && <LiveIndicator size="sm" />}
            <span className="text-xs font-medium text-muted-foreground uppercase">
              {status === "live" ? "LIVE" : status === "upcoming" ? "UPCOMING" : "FT"}
            </span>
          </div>
          {time && (
            <span className="text-xs text-muted-foreground">{time}</span>
          )}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex-1 text-left">
            <div className="font-medium truncate">{homeTeam}</div>
          </div>
          <div className="flex items-center gap-3 px-4">
            <span className="text-2xl font-bold tabular-nums">{homeScore}</span>
            <span className="text-muted-foreground">-</span>
            <span className="text-2xl font-bold tabular-nums">{awayScore}</span>
          </div>
          <div className="flex-1 text-right">
            <div className="font-medium truncate">{awayTeam}</div>
          </div>
        </div>
      </div>
    );
  }
);
ScoreWidget.displayName = "ScoreWidget";

export { ScoreWidget };
