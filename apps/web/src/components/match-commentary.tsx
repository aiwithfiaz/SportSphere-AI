'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Circle } from 'lucide-react';

interface Commentary {
  id: string;
  over: number | null;
  ball: number | null;
  content: string;
  eventType: string | null;
  runs: number | null;
  wicket: boolean;
  createdAt: string;
}

interface MatchCommentaryProps {
  matchId: string;
}

export function MatchCommentary({ matchId }: MatchCommentaryProps) {
  const [commentary, setCommentary] = useState<Commentary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCommentary();
  }, [matchId]);

  const fetchCommentary = async () => {
    try {
      const res = await fetch(`/api/v1/matches/${matchId}`);
      const data = await res.json();
      if (data.success && data.data?.commentary) {
        setCommentary(data.data.commentary);
      }
    } catch {} finally {
      setLoading(false);
    }
  };

  const getEventBadge = (commentary: Commentary) => {
    if (commentary.wicket) return <Badge className="bg-red-500 text-xs">WICKET</Badge>;
    if (commentary.eventType === 'FOUR') return <Badge className="bg-blue-500 text-xs">4</Badge>;
    if (commentary.eventType === 'SIX') return <Badge className="bg-purple-500 text-xs">6</Badge>;
    if (commentary.eventType === 'WIDE' || commentary.eventType === 'NO_BALL') return <Badge variant="secondary" className="text-xs">{commentary.eventType}</Badge>;
    if (commentary.runs && commentary.runs > 0) return <Badge variant="outline" className="text-xs">{commentary.runs} runs</Badge>;
    return null;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Commentary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse flex gap-3">
                <div className="h-8 w-8 bg-muted rounded-full" />
                <div className="flex-1">
                  <div className="h-4 bg-muted rounded w-1/4 mb-2" />
                  <div className="h-3 bg-muted rounded w-3/4" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (commentary.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Commentary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-muted-foreground">
            <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No commentary available yet</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Live Commentary
          <Badge variant="secondary" className="ml-auto">{commentary.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-1 max-h-[500px] overflow-y-auto">
          {commentary.map((item) => (
            <div
              key={item.id}
              className={`flex gap-3 p-3 rounded-lg transition-colors hover:bg-accent/50 ${
                item.wicket ? 'bg-red-50 dark:bg-red-950/20 border-l-2 border-red-500' : ''
              } ${item.eventType === 'SIX' ? 'bg-purple-50 dark:bg-purple-950/20 border-l-2 border-purple-500' : ''} ${
                item.eventType === 'FOUR' ? 'bg-blue-50 dark:bg-blue-950/20 border-l-2 border-blue-500' : ''
              }`}
            >
              <div className="flex-shrink-0 mt-0.5">
                {item.wicket ? (
                  <Circle className="h-3 w-3 text-red-500 fill-red-500" />
                ) : item.eventType === 'SIX' ? (
                  <Circle className="h-3 w-3 text-purple-500 fill-purple-500" />
                ) : item.eventType === 'FOUR' ? (
                  <Circle className="h-3 w-3 text-blue-500 fill-blue-500" />
                ) : (
                  <Circle className="h-3 w-3 text-gray-300" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  {item.over != null && (
                    <span className="text-xs font-mono text-muted-foreground">
                      {Math.floor(item.over)}.{item.ball || Math.floor((item.over % 1) * 10)}
                    </span>
                  )}
                  {getEventBadge(item)}
                </div>
                <p className="text-sm mt-1">{item.content}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date(item.createdAt).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
