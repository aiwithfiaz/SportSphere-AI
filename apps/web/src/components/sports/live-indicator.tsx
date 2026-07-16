"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface LiveIndicatorProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
}

const LiveIndicator = React.forwardRef<HTMLDivElement, LiveIndicatorProps>(
  ({ className, size = "md", ...props }, ref) => {
    const sizeClasses = {
      sm: "h-2 w-2",
      md: "h-3 w-3",
      lg: "h-4 w-4",
    };

    return (
      <div
        ref={ref}
        className={cn("relative", className)}
        aria-hidden="true"
        {...props}
      >
        <div
          className={cn(
            "rounded-full bg-red-500",
            sizeClasses[size]
          )}
        />
        <div
          className={cn(
            "absolute inset-0 rounded-full bg-red-500 animate-ping",
            sizeClasses[size]
          )}
        />
      </div>
    );
  }
);
LiveIndicator.displayName = "LiveIndicator";

export { LiveIndicator };
