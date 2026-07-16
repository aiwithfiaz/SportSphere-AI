'use client';

import { useState } from 'react';

const SPORTS = ['Cricket', 'Football', 'Basketball', 'Tennis', 'MMA', 'Baseball', 'Hockey'];
const PLATFORMS = ['All', 'YouTube', 'Twitch'];

export default function VideoPage() {
  const [sport, setSport] = useState('Cricket');
  const [platform, setPlatform] = useState('All');
  const [streams, setStreams] = useState<Array<{ id: string; title: string; thumbnail: string; channel: string; embedUrl: string; platform: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [selectedStream, setSelectedStream] = useState<typeof streams[0] | null>(null);

  const fetchStreams = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ sport: sport.toLowerCase() });
      if (platform !== 'All') params.set('platform', platform.toLowerCase());
      const res = await fetch(`/api/v1/video/streams?${params}`);
      const data = await res.json();
      setStreams(data.data || []);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const SAMPLE_HIGHLIGHTS = [
    { id: 'h1', title: 'India vs Australia - Best Moments', thumbnail: '', channel: 'ESPNcricinfo', sport: 'Cricket', duration: '12:34', views: '2.5M' },
    { id: 'h2', title: 'Champions League Top 10 Goals', thumbnail: '', channel: 'UEFA', sport: 'Football', duration: '8:21', views: '5.1M' },
    { id: 'h3', title: 'NBA Dunk of the Year', thumbnail: '', channel: 'NBA', sport: 'Basketball', duration: '3:45', views: '1.8M' },
    { id: 'h4', title: 'Wimbledon Final Highlights', thumbnail: '', channel: 'Wimbledon', sport: 'Tennis', duration: '15:02', views: '3.2M' },
    { id: 'h5', title: 'IPL 2026 Mega Auction Recap', thumbnail: '', channel: 'IPL', sport: 'Cricket', duration: '22:15', views: '8.4M' },
    { id: 'h6', title: 'Premier League Goal of the Month', thumbnail: '', channel: 'PL', sport: 'Football', duration: '6:30', views: '4.3M' },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="bg-gradient-to-r from-red-900 to-red-700 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">🎬 Live Sports & Highlights</h1>
          <p className="text-red-200 text-lg">
            Watch live streams, highlights, and replays from around the world
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {selectedStream && (
          <div className="mb-8">
            <div className="bg-black rounded-xl overflow-hidden aspect-video">
              <iframe
                src={selectedStream.embedUrl}
                className="w-full h-full"
                allowFullScreen
                title={selectedStream.title}
              />
            </div>
            <div className="flex justify-between items-center mt-3">
              <div>
                <h2 className="text-xl font-bold">{selectedStream.title}</h2>
                <p className="text-gray-400">{selectedStream.channel}</p>
              </div>
              <button
                onClick={() => setSelectedStream(null)}
                className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg transition"
              >
                Close
              </button>
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-4 mb-8">
          <div className="flex gap-2">
            {SPORTS.map((s) => (
              <button
                key={s}
                onClick={() => setSport(s)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                  sport === s ? 'bg-red-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            {PLATFORMS.map((p) => (
              <button
                key={p}
                onClick={() => setPlatform(p)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                  platform === p ? 'bg-white text-gray-900' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
          <button
            onClick={fetchStreams}
            className="px-6 py-2 bg-red-600 rounded-full text-sm font-medium hover:bg-red-700 transition"
          >
            🔴 Find Live Streams
          </button>
        </div>

        {streams.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-4">🔴 Live Streams</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {streams.map((stream) => (
                <button
                  key={stream.id}
                  onClick={() => setSelectedStream(stream)}
                  className="text-left bg-gray-800 rounded-xl overflow-hidden hover:bg-gray-750 transition"
                >
                  <div className="aspect-video bg-gray-800 flex items-center justify-center relative">
                    <span className="text-4xl">📺</span>
                    <span className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-0.5 rounded font-bold">
                      LIVE
                    </span>
                  </div>
                  <div className="p-3">
                    <div className="font-bold text-sm">{stream.title}</div>
                    <div className="text-xs text-gray-400 mt-1">{stream.channel}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        <div>
          <h2 className="text-2xl font-bold mb-4">🎬 Popular Highlights</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {SAMPLE_HIGHLIGHTS.filter((h) => sport === 'All' || h.sport === sport).map((video) => (
              <div key={video.id} className="bg-gray-800 rounded-xl overflow-hidden hover:bg-gray-750 transition cursor-pointer">
                <div className="aspect-video bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center relative">
                  <span className="text-5xl">▶️</span>
                  <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-0.5 rounded">
                    {video.duration}
                  </span>
                </div>
                <div className="p-3">
                  <div className="font-bold text-sm">{video.title}</div>
                  <div className="text-xs text-gray-400 mt-1">
                    {video.channel} · {video.views} views
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
