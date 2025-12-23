import React, { useState } from 'react';
import { Search, SlidersHorizontal, TrendingUp, Eye, Upload, Calendar, Filter } from 'lucide-react';

const MOCK_CREATORS = [
  {
    id: 1,
    channelName: 'FitLife Pro',
    niche: 'Fitness',
    shorts: 125,
    avgViews: 450000,
    subscribers: '1.2M',
    growth: '+15%',
    lastUpload: '2 days ago',
    thumbnail: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=100'
  },
  {
    id: 2,
    channelName: 'Tech Wizards',
    niche: 'Technology',
    shorts: 89,
    avgViews: 780000,
    subscribers: '2.5M',
    growth: '+22%',
    lastUpload: '1 day ago',
    thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=100'
  },
  {
    id: 3,
    channelName: 'Cooking Made Easy',
    niche: 'Food',
    shorts: 210,
    avgViews: 320000,
    subscribers: '890K',
    growth: '+8%',
    lastUpload: '4 hours ago',
    thumbnail: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=100'
  },
  {
    id: 4,
    channelName: 'Gaming Legends',
    niche: 'Gaming',
    shorts: 156,
    avgViews: 920000,
    subscribers: '3.1M',
    growth: '+31%',
    lastUpload: '6 hours ago',
    thumbnail: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=100'
  },
  {
    id: 5,
    channelName: 'Beauty Secrets',
    niche: 'Beauty',
    shorts: 178,
    avgViews: 560000,
    subscribers: '1.8M',
    growth: '+18%',
    lastUpload: '1 day ago',
    thumbnail: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=100'
  },
  {
    id: 6,
    channelName: 'Travel Tales',
    niche: 'Travel',
    shorts: 94,
    avgViews: 410000,
    subscribers: '950K',
    growth: '+12%',
    lastUpload: '3 days ago',
    thumbnail: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=100'
  },
];

export default function AdvancedSearch() {
  const [filters, setFilters] = useState({
    minShorts: '',
    maxShorts: '',
    minAvgViews: '',
    minGrowth: '',
    niche: 'all',
    uploadActivity: 'all'
  });
  const [sortBy, setSortBy] = useState('avgViews');
  const [showFilters, setShowFilters] = useState(true);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(0) + 'K';
    return num.toString();
  };

  const filteredCreators = MOCK_CREATORS.filter(creator => {
    if (filters.minShorts && creator.shorts < parseInt(filters.minShorts)) return false;
    if (filters.maxShorts && creator.shorts > parseInt(filters.maxShorts)) return false;
    if (filters.minAvgViews && creator.avgViews < parseInt(filters.minAvgViews)) return false;
    if (filters.niche !== 'all' && creator.niche !== filters.niche) return false;
    return true;
  }).sort((a, b) => {
    if (sortBy === 'avgViews') return b.avgViews - a.avgViews;
    if (sortBy === 'shorts') return b.shorts - a.shorts;
    if (sortBy === 'growth') return parseInt(b.growth) - parseInt(a.growth);
    return 0;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6 relative z-10">
      {/* Header */}
      <div className="fade-in">
        <h1 className="mb-2 flex items-center gap-2">
          <Search className="w-8 h-8 text-blue-400" />
          Advanced Creator Search
        </h1>
        <p className="text-gray-400">Discover and filter YouTube creators by performance metrics</p>
      </div>

      {/* Filters */}
      <div className="bg-zinc-900/50 backdrop-blur-xl rounded-xl border border-zinc-800/50 p-6 slide-in-up">
        <div className="flex items-center justify-between mb-4">
          <h2>Search Filters</h2>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 bg-zinc-800/50 text-gray-300 rounded-lg hover:bg-zinc-700/50 hover:text-blue-400 transition-all flex items-center gap-2"
          >
            <SlidersHorizontal className="w-4 h-4" />
            {showFilters ? 'Hide' : 'Show'} Filters
          </button>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-300 mb-2">Min Shorts Count</label>
              <input
                type="number"
                value={filters.minShorts}
                onChange={(e) => setFilters({ ...filters, minShorts: e.target.value })}
                placeholder="e.g., 50"
                className="w-full px-4 py-2 bg-black/40 border border-zinc-700 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 text-white placeholder-gray-500"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Max Shorts Count</label>
              <input
                type="number"
                value={filters.maxShorts}
                onChange={(e) => setFilters({ ...filters, maxShorts: e.target.value })}
                placeholder="e.g., 200"
                className="w-full px-4 py-2 bg-black/40 border border-zinc-700 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 text-white placeholder-gray-500"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Min Avg Views</label>
              <input
                type="number"
                value={filters.minAvgViews}
                onChange={(e) => setFilters({ ...filters, minAvgViews: e.target.value })}
                placeholder="e.g., 100000"
                className="w-full px-4 py-2 bg-black/40 border border-zinc-700 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 text-white placeholder-gray-500"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Niche</label>
              <select
                value={filters.niche}
                onChange={(e) => setFilters({ ...filters, niche: e.target.value })}
                className="w-full px-4 py-2 bg-black/40 border border-zinc-700 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 text-white"
              >
                <option value="all">All Niches</option>
                <option value="Fitness">Fitness</option>
                <option value="Technology">Technology</option>
                <option value="Food">Food</option>
                <option value="Gaming">Gaming</option>
                <option value="Beauty">Beauty</option>
                <option value="Travel">Travel</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Upload Activity</label>
              <select
                value={filters.uploadActivity}
                onChange={(e) => setFilters({ ...filters, uploadActivity: e.target.value })}
                className="w-full px-4 py-2 bg-black/40 border border-zinc-700 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 text-white"
              >
                <option value="all">All Activity</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2 bg-black/40 border border-zinc-700 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 text-white"
              >
                <option value="avgViews">Average Views</option>
                <option value="shorts">Shorts Count</option>
                <option value="growth">Growth Rate</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      <div className="bg-zinc-900/50 backdrop-blur-xl rounded-xl border border-zinc-800/50 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2>Search Results</h2>
          <p className="text-gray-400">{filteredCreators.length} creators found</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="text-left py-3 px-4 text-gray-300">Channel</th>
                <th className="text-left py-3 px-4 text-gray-300">Niche</th>
                <th className="text-left py-3 px-4 text-gray-300">Shorts</th>
                <th className="text-left py-3 px-4 text-gray-300">Avg Views</th>
                <th className="text-left py-3 px-4 text-gray-300">Subscribers</th>
                <th className="text-left py-3 px-4 text-gray-300">Growth</th>
                <th className="text-left py-3 px-4 text-gray-300">Last Upload</th>
                <th className="text-left py-3 px-4 text-gray-300">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredCreators.map((creator) => (
                <tr key={creator.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-all">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={creator.thumbnail}
                        alt={creator.channelName}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <span className="text-white">{creator.channelName}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="px-3 py-1 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-full">
                      {creator.niche}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-gray-400">
                    <div className="flex items-center gap-1">
                      <Upload className="w-4 h-4" />
                      {creator.shorts}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-gray-400">
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {formatNumber(creator.avgViews)}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-gray-400">{creator.subscribers}</td>
                  <td className="py-4 px-4">
                    <span className="text-green-400 flex items-center gap-1">
                      <TrendingUp className="w-4 h-4" />
                      {creator.growth}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-gray-400">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {creator.lastUpload}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <button className="px-4 py-2 bg-gradient-to-r from-blue-500/80 to-blue-600/80 text-white rounded-lg hover:shadow-lg hover:shadow-blue-500/30 transition-all">
                      Analyze
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}