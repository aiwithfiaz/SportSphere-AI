'use client';

import { useState, useEffect, useCallback } from 'react';

interface NewsItem {
  id: string;
  title: string;
  description: string;
  url: string;
  imageUrl: string;
  publishedAt: string;
  source: string;
  category: string;
}

const CATEGORIES = ['All', 'Cricket', 'Football', 'Basketball', 'Tennis', 'American Football'];

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchNews = useCallback(async () => {
    setLoading(true);
    try {
      const sportParam = category !== 'All' ? `?sport=${category.toLowerCase()}` : '';
      const res = await fetch(`/api/v1/news/feed${sportParam}`);
      const data = await res.json();
      setNews(data.data || []);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  }, [category]);

  useEffect(() => {
    fetchNews();
    const interval = setInterval(fetchNews, 120000);
    return () => clearInterval(interval);
  }, [fetchNews]);

  const filtered = news.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getSourceColor = (source: string) => {
    if (source.includes('ESPN')) return 'bg-red-100 text-red-700';
    if (source.includes('BBC')) return 'bg-blue-100 text-blue-700';
    if (source.includes('SKY')) return 'bg-indigo-100 text-indigo-700';
    if (source.includes('CRICBUZZ')) return 'bg-green-100 text-green-700';
    return 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-red-700 to-rose-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">📰 Sports News</h1>
          <p className="text-red-100 text-lg">Aggregated from ESPN, BBC Sport, Sky Sports, and Cricbuzz</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Search news..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2"
          />
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                  category === cat
                    ? 'bg-red-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-gray-500">Loading news feeds...</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-4">{filtered.length} articles found</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((item) => (
                <a
                  key={item.id}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200 hover:shadow-lg transition group"
                >
                  {item.imageUrl && (
                    <div className="h-48 bg-gray-200 overflow-hidden">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded ${getSourceColor(item.source)}`}>
                        {item.source}
                      </span>
                      <span className="text-xs text-gray-400">{item.category}</span>
                    </div>
                    <h3 className="font-bold text-gray-900 group-hover:text-red-600 transition line-clamp-2 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-3">{item.description}</p>
                    <div className="text-xs text-gray-400 mt-3">
                      {new Date(item.publishedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                </a>
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                <div className="text-6xl mb-4">📰</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No articles found</h3>
                <p className="text-gray-500">Try a different category or search term</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
