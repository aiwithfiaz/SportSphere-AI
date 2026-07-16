'use client';

import { useState } from 'react';

export default function CalculatorPage() {
  const [runs, setRuns] = useState(0);
  const [wickets, setWickets] = useState(0);
  const [overs, setOvers] = useState(0);
  const [balls, setBalls] = useState(0);
  const [target, setTarget] = useState(0);
  const [targetOvers, setTargetOvers] = useState(50);

  const totalBalls = overs * 6 + balls;
  const runRate = totalBalls > 0 ? ((runs / totalBalls) * 6).toFixed(2) : '0.00';
  const requiredRunRate = target > 0 && targetOvers > 0 ? ((target - runs) / Math.max(targetOvers * 6 - totalBalls, 1) * 6).toFixed(2) : '-';
  const projectedScore = totalBalls > 0 ? Math.round((runs / totalBalls) * targetOvers * 6) : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-teal-600 to-cyan-700 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">🧮 Cricket Calculator</h1>
          <p className="text-teal-100 text-lg">Calculate run rates, required rates, and projected scores</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Current Score</h2>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Runs</label>
                  <input type="number" value={runs} onChange={(e) => setRuns(Number(e.target.value))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-lg font-bold" />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Wickets</label>
                  <input type="number" value={wickets} onChange={(e) => setWickets(Number(e.target.value))}
                    min={0} max={10}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-lg font-bold" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Overs</label>
                  <input type="number" value={overs} onChange={(e) => setOvers(Number(e.target.value))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Balls</label>
                  <input type="number" value={balls} onChange={(e) => setBalls(Number(e.target.value))}
                    min={0} max={5}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Target</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Target Score</label>
                <input type="number" value={target} onChange={(e) => setTarget(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-lg font-bold" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Total Overs</label>
                <input type="number" value={targetOvers} onChange={(e) => setTargetOvers(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 text-center">
            <div className="text-3xl font-bold text-teal-600">{runRate}</div>
            <div className="text-sm text-gray-600 mt-1">Current Run Rate</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 text-center">
            <div className="text-3xl font-bold text-orange-600">{requiredRunRate}</div>
            <div className="text-sm text-gray-600 mt-1">Required Run Rate</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 text-center">
            <div className="text-3xl font-bold text-blue-600">{projectedScore}</div>
            <div className="text-sm text-gray-600 mt-1">Projected Score</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 text-center">
            <div className="text-3xl font-bold text-purple-600">{target - runs > 0 ? target - runs : 0}</div>
            <div className="text-sm text-gray-600 mt-1">Runs Needed</div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mt-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Ball-by-Ball Analysis</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Overs Left</th>
                  <th className="text-right py-2">Balls Left</th>
                  <th className="text-right py-2">Runs Needed</th>
                  <th className="text-right py-2">Req. R/R</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: Math.min(10, Math.max(0, targetOvers - overs)) }, (_, i) => {
                  const over = overs + i + 1;
                  const ballsLeft = targetOvers * 6 - over * 6;
                  const runsNeeded = target - runs;
                  const rrr = ballsLeft > 0 ? ((runsNeeded / ballsLeft) * 6).toFixed(2) : 'N/A';
                  return (
                    <tr key={i} className="border-b last:border-0">
                      <td className="py-2">{over}</td>
                      <td className="text-right py-2">{ballsLeft}</td>
                      <td className="text-right py-2 font-bold">{runsNeeded}</td>
                      <td className={`text-right py-2 font-bold ${parseFloat(rrr) > 12 ? 'text-red-600' : parseFloat(rrr) > 8 ? 'text-orange-600' : 'text-green-600'}`}>
                        {rrr}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
