'use client';

import { useState } from 'react';

export default function PredictPage() {
  const [sport, setSport] = useState('cricket');
  const [homeTeam, setHomeTeam] = useState('');
  const [awayTeam, setAwayTeam] = useState('');
  const [homeStrength, setHomeStrength] = useState(60);
  const [awayStrength, setAwayStrength] = useState(50);
  const [homeForm, setHomeForm] = useState('W,W,L,W,W');
  const [awayForm, setAwayForm] = useState('L,W,W,L,W');
  const [homeH2H, setHomeH2H] = useState(5);
  const [awayH2H, setAwayH2H] = useState(3);
  const [draws, setDraws] = useState(2);
  const [isHome, setIsHome] = useState(true);
  const [prediction, setPrediction] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(false);

  const handlePredict = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/ai/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          homeStrength: homeStrength / 100,
          awayStrength: awayStrength / 100,
          homeForm: homeForm.split(',').map((f) => f.trim()),
          awayForm: awayForm.split(',').map((f) => f.trim()),
          homeH2HWins: homeH2H,
          awayH2HWins: awayH2H,
          draws,
          isHome,
        }),
      });
      const data = await res.json();
      setPrediction(data.data);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">🎯 AI Match Predictor</h1>
          <p className="text-blue-100 text-lg">
            Get AI-powered predictions with win probabilities and key factors
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Match Details</h2>

            <div className="space-y-4">
              <div className="flex gap-4">
                <select
                  value={sport}
                  onChange={(e) => setSport(e.target.value)}
                  className="flex-1 border border-gray-300 rounded-lg px-4 py-2"
                >
                  <option value="cricket">Cricket</option>
                  <option value="football">Football</option>
                  <option value="basketball">Basketball</option>
                  <option value="tennis">Tennis</option>
                </select>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={isHome}
                    onChange={(e) => setIsHome(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">Home Advantage</span>
                </label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Home Team"
                  value={homeTeam}
                  onChange={(e) => setHomeTeam(e.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-2"
                />
                <input
                  type="text"
                  placeholder="Away Team"
                  value={awayTeam}
                  onChange={(e) => setAwayTeam(e.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Home Strength: {homeStrength}%
                  </label>
                  <input
                    type="range"
                    min={10}
                    max={95}
                    value={homeStrength}
                    onChange={(e) => setHomeStrength(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Away Strength: {awayStrength}%
                  </label>
                  <input
                    type="range"
                    min={10}
                    max={95}
                    value={awayStrength}
                    onChange={(e) => setAwayStrength(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Home Recent Form (W,L,W,W,L)"
                  value={homeForm}
                  onChange={(e) => setHomeForm(e.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-2"
                />
                <input
                  type="text"
                  placeholder="Away Recent Form (L,W,W,L,W)"
                  value={awayForm}
                  onChange={(e) => setAwayForm(e.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-2"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Home H2H Wins</label>
                  <input
                    type="number"
                    value={homeH2H}
                    onChange={(e) => setHomeH2H(Number(e.target.value))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Away H2H Wins</label>
                  <input
                    type="number"
                    value={awayH2H}
                    onChange={(e) => setAwayH2H(Number(e.target.value))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Draws</label>
                  <input
                    type="number"
                    value={draws}
                    onChange={(e) => setDraws(Number(e.target.value))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
              </div>

              <button
                onClick={handlePredict}
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50 transition"
              >
                {loading ? 'Analyzing...' : '🚀 Predict Match Outcome'}
              </button>
            </div>
          </div>

          {prediction && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Prediction Result</h2>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="text-3xl font-bold text-green-600">
                      {(prediction as { homeWin: number }).homeWin}%
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      {homeTeam || 'Home'} Win
                    </div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="text-3xl font-bold text-gray-600">
                      {(prediction as { draw: number }).draw}%
                    </div>
                    <div className="text-sm text-gray-600 mt-1">Draw</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="text-3xl font-bold text-blue-600">
                      {(prediction as { awayWin: number }).awayWin}%
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      {awayTeam || 'Away'} Win
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Confidence</span>
                    <span className="font-bold text-blue-600">
                      {(prediction as { confidence: number }).confidence}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${(prediction as { confidence: number }).confidence}%` }}
                    />
                  </div>
                </div>

                <p className="text-gray-700 text-sm leading-relaxed">
                  {(prediction as { summary: string }).summary}
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h3 className="font-bold text-gray-900 mb-4">Key Factors</h3>
                <div className="space-y-3">
                  {((prediction as { factors: Array<{ name: string; impact: number; detail: string }> }).factors || []).map((f, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                          f.impact > 0 ? 'bg-green-500' : f.impact < 0 ? 'bg-red-500' : 'bg-gray-400'
                        }`}
                      >
                        {f.impact > 0 ? '+' : ''}{f.impact}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-sm text-gray-900">{f.name}</div>
                        <div className="text-xs text-gray-500">{f.detail}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
