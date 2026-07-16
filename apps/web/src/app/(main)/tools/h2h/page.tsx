'use client';

import { useState } from 'react';

export default function H2HComparePage() {
  const [team1, setTeam1] = useState('');
  const [team2, setTeam2] = useState('');
  const [sport, setSport] = useState('cricket');
  const [result, setResult] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(false);

  const SAMPLE_H2H = {
    cricket: [
      { t1: 'India', t2: 'Australia', matches: 130, t1Wins: 56, t2Wins: 62, draws: 11, ties: 1, last5: ['W', 'L', 'W', 'W', 'L'] },
      { t1: 'India', t2: 'England', matches: 126, t1Wins: 51, t2Wins: 49, draws: 25, ties: 1, last5: ['W', 'W', 'L', 'W', 'D'] },
      { t1: 'Australia', t2: 'England', matches: 150, t1Wins: 60, t2Wins: 55, draws: 33, ties: 2, last5: ['L', 'W', 'W', 'L', 'W'] },
      { t1: 'Pakistan', t2: 'India', matches: 73, t1Wins: 20, t2Wins: 48, draws: 5, ties: 0, last5: ['L', 'L', 'W', 'L', 'W'] },
      { t1: 'South Africa', t2: 'Australia', matches: 100, t1Wins: 30, t2Wins: 52, draws: 17, ties: 1, last5: ['W', 'L', 'L', 'W', 'D'] },
    ],
    football: [
      { t1: 'Barcelona', t2: 'Real Madrid', matches: 253, t1Wins: 97, t2Wins: 100, draws: 56, ties: 0, last5: ['W', 'L', 'D', 'W', 'L'] },
      { t1: 'Man United', t2: 'Liverpool', matches: 211, t1Wins: 68, t2Wins: 79, draws: 64, ties: 0, last5: ['L', 'W', 'D', 'L', 'W'] },
      { t1: 'Bayern Munich', t2: 'Borussia Dortmund', matches: 132, t1Wins: 66, t2Wins: 32, draws: 34, ties: 0, last5: ['W', 'W', 'L', 'W', 'D'] },
      { t1: 'Arsenal', t2: 'Chelsea', matches: 175, t1Wins: 65, t2Wins: 63, draws: 47, ties: 0, last5: ['W', 'D', 'L', 'W', 'W'] },
    ],
    basketball: [
      { t1: 'Lakers', t2: 'Celtics', matches: 300, t1Wins: 130, t2Wins: 162, draws: 8, ties: 0, last5: ['W', 'L', 'L', 'W', 'L'] },
      { t1: 'Warriors', t2: 'Cavaliers', matches: 50, t1Wins: 28, t2Wins: 22, draws: 0, ties: 0, last5: ['W', 'W', 'L', 'W', 'W'] },
    ],
  };

  const handleSearch = () => {
    setLoading(true);
    setTimeout(() => {
      const data = (SAMPLE_H2H as Record<string, Array<Record<string, unknown>>>)[sport] || [];
      const match = data.find(
        (h) =>
          (h.t1 as string).toLowerCase().includes(team1.toLowerCase()) &&
          (h.t2 as string).toLowerCase().includes(team2.toLowerCase())
      ) || data.find(
        (h) =>
          (h.t2 as string).toLowerCase().includes(team1.toLowerCase()) &&
          (h.t1 as string).toLowerCase().includes(team2.toLowerCase())
      );
      setResult(match || null);
      setLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-indigo-700 to-purple-700 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">🔍 Head-to-Head Analyzer</h1>
          <p className="text-indigo-100 text-lg">Historical matchup data and statistical analysis</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <select
              value={sport}
              onChange={(e) => setSport(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2"
            >
              <option value="cricket">Cricket</option>
              <option value="football">Football</option>
              <option value="basketball">Basketball</option>
            </select>
            <input
              type="text"
              placeholder="Team 1"
              value={team1}
              onChange={(e) => setTeam1(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2"
            />
            <input
              type="text"
              placeholder="Team 2"
              value={team2}
              onChange={(e) => setTeam2(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2"
            />
            <button
              onClick={handleSearch}
              disabled={loading}
              className="bg-indigo-600 text-white py-2 rounded-lg font-bold hover:bg-indigo-700 disabled:opacity-50 transition"
            >
              {loading ? 'Searching...' : '🔍 Analyze'}
            </button>
          </div>
        </div>

        {result ? (
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {(result.t1 as string)} vs {(result.t2 as string)}
              </h2>
              <p className="text-gray-500">{result.matches as number} total matches</p>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-green-50 rounded-xl p-6 text-center border border-green-200">
                <div className="text-4xl font-bold text-green-600">{result.t1Wins as number}</div>
                <div className="text-sm text-gray-600 mt-1">{result.t1 as string} Wins</div>
                <div className="text-xs text-green-600 mt-2">
                  {Math.round(((result.t1Wins as number) / (result.matches as number)) * 100)}%
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl p-6 text-center border border-gray-200">
                <div className="text-4xl font-bold text-gray-600">{result.draws as number}</div>
                <div className="text-sm text-gray-600 mt-1">Draws</div>
                <div className="text-xs text-gray-500 mt-2">
                  {Math.round(((result.draws as number) / (result.matches as number)) * 100)}%
                </div>
              </div>
              <div className="bg-blue-50 rounded-xl p-6 text-center border border-blue-200">
                <div className="text-4xl font-bold text-blue-600">{result.t2Wins as number}</div>
                <div className="text-sm text-gray-600 mt-1">{result.t2 as string} Wins</div>
                <div className="text-xs text-blue-600 mt-2">
                  {Math.round(((result.t2Wins as number) / (result.matches as number)) * 100)}%
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="font-bold text-gray-900 mb-4">Last 5 Meetings</h3>
              <div className="flex gap-3 justify-center">
                {(result.last5 as string[]).map((r, i) => (
                  <div
                    key={i}
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${
                      r === 'W' ? 'bg-green-500' : r === 'L' ? 'bg-red-500' : 'bg-gray-400'
                    }`}
                  >
                    {r}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="font-bold text-gray-900 mb-4">Win Distribution</h3>
              <div className="w-full h-8 bg-gray-100 rounded-full overflow-hidden flex">
                <div
                  className="bg-green-500 h-full flex items-center justify-center text-white text-xs font-bold"
                  style={{ width: `${((result.t1Wins as number) / (result.matches as number)) * 100}%` }}
                >
                  {Math.round(((result.t1Wins as number) / (result.matches as number)) * 100)}%
                </div>
                <div
                  className="bg-gray-300 h-full flex items-center justify-center text-gray-700 text-xs font-bold"
                  style={{ width: `${((result.draws as number) / (result.matches as number)) * 100}%` }}
                >
                  {Math.round(((result.draws as number) / (result.matches as number)) * 100)}%
                </div>
                <div
                  className="bg-blue-500 h-full flex items-center justify-center text-white text-xs font-bold"
                  style={{ width: `${((result.t2Wins as number) / (result.matches as number)) * 100}%` }}
                >
                  {Math.round(((result.t2Wins as number) / (result.matches as number)) * 100)}%
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-200 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Search for a matchup</h3>
            <p className="text-gray-500 mb-6">Enter two team names above to see their head-to-head record</p>
            <div className="text-sm text-gray-400">
              <p className="font-medium mb-2">Popular matchups:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {['India vs Australia', 'Barcelona vs Real Madrid', 'Lakers vs Celtics'].map((m) => {
                  const [t1, t2] = m.split(' vs ');
                  return (
                    <button
                      key={m}
                      onClick={() => { setTeam1(t1); setTeam2(t2); }}
                      className="px-3 py-1 bg-gray-100 rounded-full hover:bg-gray-200 transition text-gray-700"
                    >
                      {m}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
