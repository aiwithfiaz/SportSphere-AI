'use client';

import { useState } from 'react';

export default function ComparePage() {
  const [player1Name, setPlayer1Name] = useState('');
  const [player2Name, setPlayer2Name] = useState('');
  const [player1Stats, setPlayer1Stats] = useState({ runs: 0, avg: 0, sr: 0, fifties: 0, hundreds: 0, wickets: 0 });
  const [player2Stats, setPlayer2Stats] = useState({ runs: 0, avg: 0, sr: 0, fifties: 0, hundreds: 0, wickets: 0 });
  const [result, setResult] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCompare = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/ai/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ player1Name, player1Stats, player2Name, player2Stats }),
      });
      const data = await res.json();
      setResult(data.data);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const updateStat = (player: 'p1' | 'p2', key: string, value: number) => {
    if (player === 'p1') setPlayer1Stats((prev) => ({ ...prev, [key]: value }));
    else setPlayer2Stats((prev) => ({ ...prev, [key]: value }));
  };

  const StatInput = ({ label, p1Key, p2Key }: { label: string; p1Key: string; p2Key: string }) => (
    <div className="grid grid-cols-3 gap-2 items-center">
      <input
        type="number"
        value={(player1Stats as Record<string, number>)[p1Key] || 0}
        onChange={(e) => updateStat('p1', p1Key, Number(e.target.value))}
        className="border border-gray-300 rounded px-2 py-1 text-sm text-right"
      />
      <div className="text-center text-sm font-medium text-gray-600">{label}</div>
      <input
        type="number"
        value={(player2Stats as Record<string, number>)[p2Key] || 0}
        onChange={(e) => updateStat('p2', p2Key, Number(e.target.value))}
        className="border border-gray-300 rounded px-2 py-1 text-sm"
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">⚔️ Player Comparison</h1>
          <p className="text-red-100 text-lg">Head-to-head statistical comparison with AI analysis</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="grid grid-cols-3 gap-4 mb-6">
            <input
              type="text"
              placeholder="Player 1 Name"
              value={player1Name}
              onChange={(e) => setPlayer1Name(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 text-center font-bold"
            />
            <div className="flex items-center justify-center text-2xl font-bold text-gray-400">VS</div>
            <input
              type="text"
              placeholder="Player 2 Name"
              value={player2Name}
              onChange={(e) => setPlayer2Name(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 text-center font-bold"
            />
          </div>

          <div className="space-y-2 mb-6">
            <StatInput label="Runs" p1Key="runs" p2Key="runs" />
            <StatInput label="Average" p1Key="avg" p2Key="avg" />
            <StatInput label="Strike Rate" p1Key="sr" p2Key="sr" />
            <StatInput label="50s" p1Key="fifties" p2Key="fifties" />
            <StatInput label="100s" p1Key="hundreds" p2Key="hundreds" />
            <StatInput label="Wickets" p1Key="wickets" p2Key="wickets" />
          </div>

          <button
            onClick={handleCompare}
            disabled={loading}
            className="w-full bg-red-600 text-white py-3 rounded-lg font-bold hover:bg-red-700 disabled:opacity-50 transition"
          >
            {loading ? 'Analyzing...' : '⚔️ Compare Players'}
          </button>
        </div>

        {result && (
          <div className="mt-8 space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="text-center mb-6">
                <div className="text-sm text-gray-500 mb-1">Winner</div>
                <div className="text-3xl font-bold text-green-600">
                  🏆 {(result as { winner: string }).winner}
                </div>
              </div>
              <p className="text-gray-700 text-center">{(result as { analysis: string }).analysis}</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="font-bold text-gray-900 mb-4">Category Breakdown</h3>
              <div className="space-y-3">
                {((result as { strengths: Array<{ player: string; area: string; value: number }> }).strengths || []).map((s, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="w-20 text-sm font-medium text-gray-600 capitalize">{s.area}</span>
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full"
                        style={{ width: `${Math.min((s.value / (s.area === 'avg' ? 60 : s.area === 'sr' ? 150 : s.area === 'wickets' ? 400 : 2000)) * 100, 100)}%` }}
                      />
                    </div>
                    <span className="w-24 text-sm font-bold text-gray-900">{s.value}</span>
                    <span className="text-xs text-gray-500 w-32 truncate">{s.player}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
