'use client';

import { useState } from 'react';

export default function ProbabilityPage() {
  const [totalOvers, setTotalOvers] = useState(50);
  const [targetScore, setTargetScore] = useState(250);
  const [currentScore, setCurrentScore] = useState(120);
  const [currentWickets, setCurrentWickets] = useState(3);
  const [currentOver, setCurrentOver] = useState(20);
  const [data, setData] = useState<Array<{ over: number; homeWin: number; awayWin: number; draw: number }>>([]);
  const [loading, setLoading] = useState(false);

  const calculate = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/ai/probability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ totalOvers, targetScore, currentScore, currentWickets, currentOver }),
      });
      const result = await res.json();
      setData(result.data || []);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-green-600 to-emerald-700 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">📊 Win Probability Tracker</h1>
          <p className="text-green-100 text-lg">Real-time win probability as the match progresses</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Match Situation</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Total Overs</label>
                <input
                  type="number"
                  value={totalOvers}
                  onChange={(e) => setTotalOvers(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Target Score</label>
                <input
                  type="number"
                  value={targetScore}
                  onChange={(e) => setTargetScore(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Current Score</label>
                <input
                  type="number"
                  value={currentScore}
                  onChange={(e) => setCurrentScore(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Wickets Down</label>
                <input
                  type="number"
                  value={currentWickets}
                  onChange={(e) => setCurrentWickets(Number(e.target.value))}
                  min={0}
                  max={10}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Current Over</label>
                <input
                  type="number"
                  value={currentOver}
                  onChange={(e) => setCurrentOver(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
              <button
                onClick={calculate}
                disabled={loading}
                className="w-full bg-green-600 text-white py-2 rounded-lg font-bold hover:bg-green-700 disabled:opacity-50 transition"
              >
                {loading ? 'Calculating...' : 'Calculate Probability'}
              </button>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            {data.length > 0 && (
              <>
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">Win Probability Over Time</h2>
                  <div className="space-y-3">
                    {data.map((point) => (
                      <div key={point.over} className="flex items-center gap-3">
                        <span className="text-xs font-mono text-gray-500 w-12">Over {point.over}</span>
                        <div className="flex-1 flex gap-1 h-6">
                          <div
                            className="bg-green-500 rounded-l"
                            style={{ width: `${point.homeWin}%` }}
                            title={`Batting: ${point.homeWin}%`}
                          />
                          <div
                            className="bg-yellow-400"
                            style={{ width: `${point.draw}%` }}
                            title={`Draw: ${point.draw}%`}
                          />
                          <div
                            className="bg-blue-500 rounded-r"
                            style={{ width: `${point.awayWin}%` }}
                            title={`Bowling: ${point.awayWin}%`}
                          />
                        </div>
                        <span className="text-xs text-gray-600 w-20 text-right">
                          {point.homeWin}/{point.awayWin}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-6 mt-4 text-xs">
                    <span className="flex items-center gap-1">
                      <span className="w-3 h-3 bg-green-500 rounded" /> Batting Team
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-3 h-3 bg-yellow-400 rounded" /> Draw
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-3 h-3 bg-blue-500 rounded" /> Bowling Team
                    </span>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">Current Situation</h2>
                  <div className="grid grid-cols-4 gap-4 text-center">
                    <div className="bg-green-50 rounded-lg p-3">
                      <div className="text-2xl font-bold text-green-600">{data[data.length - 1].homeWin}%</div>
                      <div className="text-xs text-gray-600">Batting Win</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-2xl font-bold text-gray-600">{data[data.length - 1].draw}%</div>
                      <div className="text-xs text-gray-600">Draw/Tie</div>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-3">
                      <div className="text-2xl font-bold text-blue-600">{data[data.length - 1].awayWin}%</div>
                      <div className="text-xs text-gray-600">Bowling Win</div>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-3">
                      <div className="text-2xl font-bold text-purple-600">
                        {(targetScore - currentScore) / Math.max(totalOvers - currentOver, 1)}
                      </div>
                      <div className="text-xs text-gray-600">Required RR</div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {data.length === 0 && (
              <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-200 text-center">
                <div className="text-6xl mb-4">📊</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Enter match details to calculate</h3>
                <p className="text-gray-500">
                  Fill in the match situation on the left and click Calculate to see how the win probability changes over time
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
