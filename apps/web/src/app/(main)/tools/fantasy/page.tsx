'use client';

import { useState } from 'react';

const SAMPLE_PLAYERS = [
  { name: 'Virat Kohli', team: 'India', role: 'Batsman', recentPoints: [85, 92, 78, 88, 95], credits: 11 },
  { name: 'Rohit Sharma', team: 'India', role: 'Batsman', recentPoints: [72, 80, 65, 90, 70], credits: 10 },
  { name: 'Jasprit Bumrah', team: 'India', role: 'Bowler', recentPoints: [90, 85, 88, 92, 80], credits: 10 },
  { name: 'Ravindra Jadeja', team: 'India', role: 'All-rounder', recentPoints: [75, 82, 70, 85, 78], credits: 9 },
  { name: 'Jos Buttler', team: 'England', role: 'Wicketkeeper', recentPoints: [88, 75, 82, 90, 85], credits: 10 },
  { name: 'Ben Stokes', team: 'England', role: 'All-rounder', recentPoints: [70, 85, 65, 80, 72], credits: 10 },
  { name: 'Pat Cummins', team: 'Australia', role: 'Bowler', recentPoints: [82, 78, 85, 80, 88], credits: 9 },
  { name: 'David Warner', team: 'Australia', role: 'Batsman', recentPoints: [65, 72, 80, 70, 75], credits: 9 },
  { name: 'Kane Williamson', team: 'New Zealand', role: 'Batsman', recentPoints: [80, 75, 82, 78, 85], credits: 10 },
  { name: 'Trent Boult', team: 'New Zealand', role: 'Bowler', recentPoints: [78, 82, 75, 80, 72], credits: 8 },
  { name: 'Shakib Al Hasan', team: 'Bangladesh', role: 'All-rounder', recentPoints: [72, 68, 75, 70, 78], credits: 8 },
  { name: 'Kagiso Rabada', team: 'South Africa', role: 'Bowler', recentPoints: [80, 85, 78, 82, 88], credits: 9 },
];

export default function FantasyPage() {
  const [budget, setBudget] = useState(100);
  const [team, setTeam] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(false);

  const generateTeam = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/ai/fantasy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ players: SAMPLE_PLAYERS, budget }),
      });
      const data = await res.json();
      setTeam(data.data);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">🏆 AI Fantasy Team Builder</h1>
          <p className="text-purple-100 text-lg">
            Let AI select the optimal fantasy team within your budget
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Budget & Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Budget: {budget} credits</label>
                <input
                  type="range"
                  min={50}
                  max={150}
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  className="w-full"
                />
              </div>
              <button
                onClick={generateTeam}
                disabled={loading}
                className="w-full bg-purple-600 text-white py-3 rounded-lg font-bold hover:bg-purple-700 disabled:opacity-50 transition"
              >
                {loading ? 'Building...' : '🤖 Build AI Team'}
              </button>
            </div>

            <div className="mt-6">
              <h3 className="font-bold text-gray-900 mb-3">Available Players</h3>
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {SAMPLE_PLAYERS.map((p, i) => (
                  <div key={i} className="flex justify-between items-center text-sm p-2 bg-gray-50 rounded">
                    <div>
                      <div className="font-medium">{p.name}</div>
                      <div className="text-xs text-gray-500">{p.team} · {p.role}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{p.credits}cr</div>
                      <div className="text-xs text-green-600">
                        {Math.round(p.recentPoints.reduce((a, b) => a + b, 0) / p.recentPoints.length)}pts
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {team && (
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-900">Your AI Team</h2>
                  <div className="flex gap-4 text-sm">
                    <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-bold">
                      {(team as { totalCredits: number }).totalCredits}/
                      {budget} credits
                    </span>
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-bold">
                      {(team as { totalPoints: number }).totalPoints} pts
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  {((team as { players: Array<{ name: string; team: string; role: string; points: number; credits: number; isCaptain: boolean; isViceCaptain: boolean }> }).players || []).map((p, i) => (
                    <div
                      key={i}
                      className={`flex items-center justify-between p-3 rounded-lg border ${
                        p.isCaptain ? 'bg-yellow-50 border-yellow-300' :
                        p.isViceCaptain ? 'bg-blue-50 border-blue-300' :
                        'bg-white border-gray-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-gray-400 w-6">{i + 1}</span>
                        <div>
                          <div className="font-medium text-gray-900">
                            {p.name}
                            {p.isCaptain && <span className="ml-2 text-xs bg-yellow-200 text-yellow-800 px-2 py-0.5 rounded">C</span>}
                            {p.isViceCaptain && <span className="ml-2 text-xs bg-blue-200 text-blue-800 px-2 py-0.5 rounded">VC</span>}
                          </div>
                          <div className="text-xs text-gray-500">{p.team} · {p.role}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-gray-900">{p.points}pts</div>
                        <div className="text-xs text-gray-500">{p.credits}cr</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-bold text-sm text-gray-900 mb-2">AI Analysis</h3>
                  <p className="text-sm text-gray-600">{(team as { analysis: string }).analysis}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
