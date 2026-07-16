'use client';

import { useState, useEffect, useCallback } from 'react';

interface CricbuzzMatch {
  id: string;
  series: string;
  description: string;
  matchNumber: string;
  type: string;
  state: string;
  status: string;
}

export default function CricbuzzPage() {
  const [matches, setMatches] = useState<CricbuzzMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMatch, setSelectedMatch] = useState<string | null>(null);
  const [scoreData, setScoreData] = useState<Record<string, unknown> | null>(null);

  const fetchMatches = useCallback(async () => {
    try {
      const res = await fetch('/api/v1/cricbuzz/matches');
      const data = await res.json();
      setMatches(data.data || []);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchMatches();
    const interval = setInterval(fetchMatches, 30000);
    return () => clearInterval(interval);
  }, [fetchMatches]);

  useEffect(() => {
    if (!selectedMatch) return;
    const fetchScore = async () => {
      try {
        const res = await fetch(`/api/v1/cricbuzz/live?matchId=${selectedMatch}`);
        const data = await res.json();
        setScoreData(data.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchScore();
    const interval = setInterval(fetchScore, 10000);
    return () => clearInterval(interval);
  }, [selectedMatch]);

  const liveMatches = matches.filter((m) => m.state === 'live' || m.state === 'inprogress');
  const upcomingMatches = matches.filter((m) => m.state === 'nextlive' || m.state === 'upcoming');
  const completedMatches = matches.filter((m) => m.state === 'complete' || m.state === 'result');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-green-700 to-emerald-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">🏏</span>
            <h1 className="text-4xl font-bold">Cricbuzz Live Scores</h1>
          </div>
          <p className="text-green-100 text-lg">
            Real-time cricket scores powered by Cricbuzz syndication API
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-gray-500">Loading matches...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-6">
              {liveMatches.length > 0 && (
                <div>
                  <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    Live Matches ({liveMatches.length})
                  </h2>
                  <div className="space-y-2">
                    {liveMatches.map((match) => (
                      <button
                        key={match.id}
                        onClick={() => setSelectedMatch(match.id)}
                        className={`w-full text-left p-4 rounded-lg border transition ${
                          selectedMatch === match.id
                            ? 'bg-green-50 border-green-300 shadow-sm'
                            : 'bg-white border-gray-200 hover:border-green-200'
                        }`}
                      >
                        <div className="text-xs text-green-600 font-medium">{match.series}</div>
                        <div className="font-bold text-gray-900 text-sm mt-1">{match.description}</div>
                        <div className="text-xs text-gray-500 mt-1">{match.type} · {match.status || match.state}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {upcomingMatches.length > 0 && (
                <div>
                  <h2 className="text-lg font-bold text-gray-900 mb-3">Upcoming ({upcomingMatches.length})</h2>
                  <div className="space-y-2">
                    {upcomingMatches.map((match) => (
                      <button
                        key={match.id}
                        onClick={() => setSelectedMatch(match.id)}
                        className="w-full text-left p-3 rounded-lg bg-white border border-gray-200 hover:border-gray-300 transition"
                      >
                        <div className="text-xs text-blue-600 font-medium">{match.series}</div>
                        <div className="font-medium text-gray-900 text-sm">{match.description}</div>
                        <div className="text-xs text-gray-500">{match.type}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {completedMatches.length > 0 && (
                <div>
                  <h2 className="text-lg font-bold text-gray-900 mb-3">Completed ({completedMatches.length})</h2>
                  <div className="space-y-2">
                    {completedMatches.map((match) => (
                      <div key={match.id} className="p-3 rounded-lg bg-gray-100 border border-gray-200">
                        <div className="text-xs text-gray-500 font-medium">{match.series}</div>
                        <div className="font-medium text-gray-700 text-sm">{match.description}</div>
                        <div className="text-xs text-gray-500">{match.status}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {!loading && matches.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-4xl mb-2">🏏</div>
                  <p>No matches found. Check back later!</p>
                </div>
              )}
            </div>

            <div className="lg:col-span-2">
              {selectedMatch && scoreData ? (
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Live Scorecard</h2>
                  <pre className="text-sm text-gray-700 bg-gray-50 p-4 rounded-lg overflow-auto max-h-96">
                    {JSON.stringify(scoreData, null, 2)}
                  </pre>
                </div>
              ) : (
                <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-200 text-center">
                  <div className="text-6xl mb-4">🏏</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Select a match</h3>
                  <p className="text-gray-500">
                    Click on any live or upcoming match to see the detailed scorecard
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
