import React, { useState } from 'react';
import { Search, TrendingUp, TrendingDown, BarChart3, Play, AlertCircle, Youtube } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const MOCK_CHANNEL_DATA = {
  channelName: 'Tech Reviews Daily',
  totalShorts: 47,
  avgViews: 245000,
  uploadFrequency: '3.2 per week',
  totalViews: 11515000,
  subscriberCount: '850K',
};

const MOCK_PERFORMANCE_DATA = [
  { date: 'Week 1', views: 180000 },
  { date: 'Week 2', views: 220000 },
  { date: 'Week 3', views: 195000 },
  { date: 'Week 4', views: 310000 },
  { date: 'Week 5', views: 270000 },
  { date: 'Week 6', views: 240000 },
  { date: 'Week 7', views: 290000 },
  { date: 'Week 8', views: 315000 },
];

const MOCK_VIDEOS = [
  { id: 1, title: 'iPhone 15 Pro Review - Worth It?', views: 780000, likes: 45000, published: '3 days ago', isOutlier: true, thumbnail: 'https://images.unsplash.com/photo-1592286927505-128b282aec4c?w=400' },
  { id: 2, title: 'Top 5 Budget Phones 2024', views: 520000, likes: 32000, published: '1 week ago', isOutlier: true, thumbnail: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400' },
  { id: 3, title: 'Samsung Galaxy S24 Unboxing', views: 310000, likes: 21000, published: '2 weeks ago', isOutlier: false, thumbnail: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400' },
  { id: 4, title: 'Best Camera Phones Compared', views: 245000, likes: 18000, published: '2 weeks ago', isOutlier: false, thumbnail: 'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79b2?w=400' },
  { id: 5, title: 'Android vs iOS in 60 Seconds', views: 890000, likes: 67000, published: '3 weeks ago', isOutlier: true, thumbnail: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400' },
  { id: 6, title: 'Hidden iPhone Features You Need', views: 220000, likes: 15000, published: '1 month ago', isOutlier: false, thumbnail: 'https://images.unsplash.com/photo-1603791239531-a82d3d67e3ad?w=400' },
];

export default function ShortsAnalytics() {
  const [channelUrl, setChannelUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);

  const handleAnalyze = () => {
    if (!channelUrl) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setAnalyzed(true);
    }, 2000);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(0) + 'K';
    return num.toString();
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 relative z-10">
      {/* Header */}
      <div className="fade-in">
        <h1 className="mb-2 flex items-center gap-2">
          <Youtube className="w-8 h-8 text-blue-400" />
          YouTube Shorts Analytics
        </h1>
        <p className="text-gray-400">Analyze performance metrics for any YouTube channel's Shorts</p>
      </div>

      {/* Input */}
      <div className="bg-zinc-900/50 backdrop-blur-xl rounded-xl border border-zinc-800/50 p-6 slide-in-up">
        <label className="block text-gray-300 mb-3">YouTube Channel URL</label>
        <div className="flex gap-3">
          <div className="flex-1 relative group">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5 group-focus-within:text-blue-400 transition-colors" />
            <input
              type="text"
              value={channelUrl}
              onChange={(e) => setChannelUrl(e.target.value)}
              placeholder="https://youtube.com/@channelname"
              className="w-full pl-10 pr-4 py-3 bg-black/40 border border-zinc-700 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 text-white placeholder-gray-500"
            />
          </div>
          <button
            onClick={handleAnalyze}
            disabled={!channelUrl || loading}
            className="px-8 py-3 bg-gradient-to-r from-blue-500/80 to-blue-600/80 text-white rounded-lg hover:shadow-lg hover:shadow-blue-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Analyzing...
              </>
            ) : (
              <>
                <BarChart3 className="w-5 h-5" />
                Analyze Channel
              </>
            )}
          </button>
        </div>
      </div>

      {analyzed && (
        <>
          {/* Channel Overview */}
          <div className="bg-zinc-900/50 backdrop-blur-xl rounded-xl border border-zinc-800/50 p-6 card-hover">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="mb-1">{MOCK_CHANNEL_DATA.channelName}</h2>
                <p className="text-gray-400">{MOCK_CHANNEL_DATA.subscriberCount} subscribers</p>
              </div>
              <div className="px-4 py-2 bg-green-500/20 text-green-400 border border-green-500/30 rounded-lg flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Growing
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <p className="text-gray-400 mb-2">Total Shorts</p>
                <p className="text-white">{MOCK_CHANNEL_DATA.totalShorts}</p>
              </div>
              <div>
                <p className="text-gray-400 mb-2">Average Views</p>
                <p className="text-white">{formatNumber(MOCK_CHANNEL_DATA.avgViews)}</p>
              </div>
              <div>
                <p className="text-gray-400 mb-2">Upload Frequency</p>
                <p className="text-white">{MOCK_CHANNEL_DATA.uploadFrequency}</p>
              </div>
              <div>
                <p className="text-gray-400 mb-2">Total Views</p>
                <p className="text-white">{formatNumber(MOCK_CHANNEL_DATA.totalViews)}</p>
              </div>
            </div>
          </div>

          {/* Performance Chart */}
          <div className="bg-zinc-900/50 backdrop-blur-xl rounded-xl border border-zinc-800/50 p-6 card-hover">
            <h2 className="mb-6">Performance Trend (Last 8 Weeks)</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={MOCK_PERFORMANCE_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="date" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip 
                  formatter={(value: number) => formatNumber(value)}
                  contentStyle={{ 
                    backgroundColor: '#1a1a1a', 
                    border: '1px solid #333', 
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
                <Line type="monotone" dataKey="views" stroke="#4196E0" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Outlier Detection */}
          <div className="bg-gradient-to-r from-blue-500/10 to-sky-500/10 border border-blue-500/30 rounded-xl p-6 backdrop-blur-xl">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-white mb-2">Outlier Videos Detected</h3>
                <p className="text-gray-400">
                  3 videos are performing 2× better than the channel average. These videos may contain winning formulas worth analyzing!
                </p>
              </div>
            </div>
          </div>

          {/* Recent Videos */}
          <div className="bg-zinc-900/50 backdrop-blur-xl rounded-xl border border-zinc-800/50 p-6">
            <h2 className="mb-6">Recent Shorts Performance</h2>
            <div className="space-y-4">
              {MOCK_VIDEOS.map((video) => (
                <div
                  key={video.id}
                  className={`flex gap-4 p-4 rounded-lg border-2 transition-all group ${
                    video.isOutlier
                      ? 'border-blue-500/30 bg-blue-500/5'
                      : 'border-zinc-700 hover:border-zinc-600 bg-zinc-800/30'
                  }`}
                >
                  <div className="relative w-32 h-20 rounded-lg overflow-hidden bg-zinc-800 flex-shrink-0">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center cursor-pointer">
                      <div className="w-10 h-10 bg-blue-500/80 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform scale-0 group-hover:scale-100">
                        <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-white line-clamp-2">{video.title}</p>
                      {video.isOutlier && (
                        <span className="px-3 py-1 bg-blue-500/80 text-white rounded-full whitespace-nowrap flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" />
                          Outlier
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-gray-400">
                      <span>{formatNumber(video.views)} views</span>
                      <span>{formatNumber(video.likes)} likes</span>
                      <span>{video.published}</span>
                    </div>
                    <div className="mt-2">
                      <div className="w-full bg-zinc-800 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            video.isOutlier ? 'bg-gradient-to-r from-blue-500 to-blue-600' : 'bg-gradient-to-r from-blue-400/50 to-blue-500/50'
                          }`}
                          style={{ width: `${Math.min((video.views / MOCK_CHANNEL_DATA.avgViews) * 50, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}