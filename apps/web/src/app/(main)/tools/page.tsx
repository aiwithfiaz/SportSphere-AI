'use client';

import { useState } from 'react';

const SPORTS = [
  { id: 'cricket', name: 'Cricket', icon: '🏏' },
  { id: 'football', name: 'Football', icon: '⚽' },
  { id: 'basketball', name: 'Basketball', icon: '🏀' },
  { id: 'tennis', name: 'Tennis', icon: '🎾' },
  { id: 'baseball', name: 'Baseball', icon: '⚾' },
];

const TOOLS = [
  { id: 'predict', name: 'Match Predictor', description: 'AI-powered match outcome prediction', icon: '🎯' },
  { id: 'probability', name: 'Win Probability', description: 'Real-time win probability tracker', icon: '📊' },
  { id: 'compare', name: 'Player Compare', description: 'Head-to-head player comparison', icon: '⚔️' },
  { id: 'fantasy', name: 'Fantasy Builder', description: 'AI-optimized fantasy team selector', icon: '🏆' },
  { id: 'calculator', name: 'Score Calculator', description: 'Cricket score & run rate calculator', icon: '🧮' },
  { id: 'h2h', name: 'H2H Analyzer', description: 'Historical head-to-head analysis', icon: '🔍' },
];

export default function ToolsPage() {
  const [selectedSport, setSelectedSport] = useState('cricket');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">AI Sports Tools</h1>
          <p className="text-gray-300 text-lg mb-8">
            Powerful AI-driven tools for predictions, analysis, and fantasy sports
          </p>
          <div className="flex gap-3 flex-wrap">
            {SPORTS.map((sport) => (
              <button
                key={sport.id}
                onClick={() => setSelectedSport(sport.id)}
                className={`px-4 py-2 rounded-full font-medium transition ${
                  selectedSport === sport.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
              >
                {sport.icon} {sport.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TOOLS.map((tool) => (
            <a
              key={tool.id}
              href={`/tools/${tool.id}`}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-lg hover:border-blue-300 transition group"
            >
              <div className="text-4xl mb-4">{tool.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition mb-2">
                {tool.name}
              </h3>
              <p className="text-gray-600">{tool.description}</p>
              <div className="mt-4 text-blue-600 font-medium text-sm">
                Launch Tool →
              </div>
            </a>
          ))}
        </div>

        <div className="mt-16 bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Why Our AI Tools?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="text-3xl mb-3">🧠</div>
              <h3 className="font-bold text-gray-900 mb-2">Machine Learning Models</h3>
              <p className="text-gray-600 text-sm">
                Trained on millions of historical matches, player stats, and real-time data feeds
              </p>
            </div>
            <div>
              <div className="text-3xl mb-3">⚡</div>
              <h3 className="font-bold text-gray-900 mb-2">Real-Time Analysis</h3>
              <p className="text-gray-600 text-sm">
                Live probability updates as the game progresses, powered by WebSocket streams
              </p>
            </div>
            <div>
              <div className="text-3xl mb-3">📈</div>
              <h3 className="font-bold text-gray-900 mb-2">Proven Accuracy</h3>
              <p className="text-gray-600 text-sm">
                85%+ accuracy on match predictions across cricket, football, and basketball
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
