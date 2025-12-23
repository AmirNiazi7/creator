import React, { useState } from 'react';
import { Play, Download, Bookmark, Filter, Search, ExternalLink, TrendingUp } from 'lucide-react';

const MOCK_VIDEOS = [
  {
    id: 1,
    title: 'POV: When you finally master that dance trend',
    platform: 'TikTok',
    hashtags: ['#fyp', '#dance', '#trending'],
    views: '3.2M',
    likes: '450K',
    duration: '0:15',
    region: 'US',
    thumbnail: 'https://images.unsplash.com/photo-1547153760-18fc9498c17f?w=400',
    trending: 'daily'
  },
  {
    id: 2,
    title: 'This productivity hack changed my life',
    platform: 'Instagram',
    hashtags: ['#productivity', '#lifehack', '#reels'],
    views: '1.8M',
    likes: '320K',
    duration: '0:22',
    region: 'Global',
    thumbnail: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=400',
    trending: 'weekly'
  },
  {
    id: 3,
    title: 'The plot twist at the end! 😱',
    platform: 'TikTok',
    hashtags: ['#plottwist', '#viral', '#comedy'],
    views: '5.1M',
    likes: '890K',
    duration: '0:28',
    region: 'US',
    thumbnail: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400',
    trending: 'daily'
  },
  {
    id: 4,
    title: 'Easy 5-minute recipe everyone loves',
    platform: 'Instagram',
    hashtags: ['#cooking', '#recipe', '#foodie'],
    views: '2.4M',
    likes: '540K',
    duration: '0:45',
    region: 'Global',
    thumbnail: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=400',
    trending: 'weekly'
  },
  {
    id: 5,
    title: 'Wait for it... the ending is everything',
    platform: 'TikTok',
    hashtags: ['#waitforit', '#satisfying', '#viral'],
    views: '4.7M',
    likes: '720K',
    duration: '0:18',
    region: 'US',
    thumbnail: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=400',
    trending: 'daily'
  },
  {
    id: 6,
    title: 'Behind the scenes of my setup',
    platform: 'Instagram',
    hashtags: ['#behindthescenes', '#creator', '#setup'],
    views: '1.2M',
    likes: '280K',
    duration: '0:35',
    region: 'Global',
    thumbnail: 'https://images.unsplash.com/photo-1551818255-e6e10975bc17?w=400',
    trending: 'weekly'
  },
];

export default function ViralContent() {
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [selectedTrending, setSelectedTrending] = useState<string>('daily');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [savedVideos, setSavedVideos] = useState<number[]>([]);

  const filteredVideos = MOCK_VIDEOS.filter(video => {
    if (selectedPlatform !== 'all' && video.platform !== selectedPlatform) return false;
    if (video.trending !== selectedTrending) return false;
    if (searchQuery && !video.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !video.hashtags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))) {
      return false;
    }
    return true;
  });

  const toggleSave = (videoId: number) => {
    setSavedVideos(prev =>
      prev.includes(videoId)
        ? prev.filter(id => id !== videoId)
        : [...prev, videoId]
    );
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 relative z-10">
      {/* Header */}
      <div className="fade-in">
        <h1 className="mb-2 flex items-center gap-2">
          <TrendingUp className="w-8 h-8 text-blue-400" />
          Viral Content Discovery
        </h1>
        <p className="text-gray-400">Discover trending content from TikTok and Instagram</p>
      </div>

      {/* Controls */}
      <div className="bg-zinc-900/50 backdrop-blur-xl rounded-xl border border-zinc-800/50 p-6 slide-in-up">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Trending Period */}
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedTrending('daily')}
              className={`px-6 py-2 rounded-lg transition-all ${
                selectedTrending === 'daily'
                  ? 'bg-gradient-to-r from-blue-500/80 to-blue-600/80 text-white shadow-lg shadow-blue-500/20'
                  : 'bg-zinc-800/50 text-gray-300 hover:bg-zinc-700/50'
              }`}
            >
              Daily Trending
            </button>
            <button
              onClick={() => setSelectedTrending('weekly')}
              className={`px-6 py-2 rounded-lg transition-all ${
                selectedTrending === 'weekly'
                  ? 'bg-gradient-to-r from-blue-500/80 to-blue-600/80 text-white shadow-lg shadow-blue-500/20'
                  : 'bg-zinc-800/50 text-gray-300 hover:bg-zinc-700/50'
              }`}
            >
              Weekly Trending
            </button>
          </div>

          {/* Platform Filter */}
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedPlatform('all')}
              className={`px-4 py-2 rounded-lg transition-all ${
                selectedPlatform === 'all'
                  ? 'bg-blue-500/20 text-blue-400 border-2 border-blue-500/30'
                  : 'bg-zinc-800/50 text-gray-300 hover:bg-zinc-700/50'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setSelectedPlatform('TikTok')}
              className={`px-4 py-2 rounded-lg transition-all ${
                selectedPlatform === 'TikTok'
                  ? 'bg-blue-500/20 text-blue-400 border-2 border-blue-500/30'
                  : 'bg-zinc-800/50 text-gray-300 hover:bg-zinc-700/50'
              }`}
            >
              TikTok
            </button>
            <button
              onClick={() => setSelectedPlatform('Instagram')}
              className={`px-4 py-2 rounded-lg transition-all ${
                selectedPlatform === 'Instagram'
                  ? 'bg-blue-500/20 text-blue-400 border-2 border-blue-500/30'
                  : 'bg-zinc-800/50 text-gray-300 hover:bg-zinc-700/50'
              }`}
            >
              Instagram
            </button>
          </div>

          {/* Search */}
          <div className="flex-1">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5 group-focus-within:text-blue-400 transition-colors" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title or hashtag..."
                className="w-full pl-10 pr-4 py-2 bg-black/40 border border-zinc-700 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 text-white placeholder-gray-500"
              />
            </div>
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 border border-zinc-700 bg-zinc-800/50 text-gray-300 rounded-lg hover:bg-zinc-700/50 hover:border-blue-400/50 flex items-center gap-2 transition-all"
          >
            <Filter className="w-5 h-5" />
            Filters
          </button>
        </div>

        {/* Additional Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-zinc-800 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-300 mb-2">Region</label>
              <select className="w-full px-4 py-2 bg-black/40 border border-zinc-700 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 text-white">
                <option>All Regions</option>
                <option>US</option>
                <option>UK</option>
                <option>Global</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-300 mb-2">Duration</label>
              <select className="w-full px-4 py-2 bg-black/40 border border-zinc-700 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 text-white">
                <option>All Durations</option>
                <option>0-15s</option>
                <option>15-30s</option>
                <option>30s+</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-300 mb-2">Min Views</label>
              <select className="w-full px-4 py-2 bg-black/40 border border-zinc-700 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 text-white">
                <option>Any</option>
                <option>1M+</option>
                <option>2M+</option>
                <option>5M+</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-gray-400">
          Showing {filteredVideos.length} viral videos
        </p>
        <p className="text-gray-400">
          {savedVideos.length} videos saved to Idea Board
        </p>
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
        {filteredVideos.map((video) => (
          <div
            key={video.id}
            className="bg-zinc-900/50 backdrop-blur-xl rounded-xl border border-zinc-800/50 overflow-hidden card-hover group"
          >
            {/* Thumbnail */}
            <div className="relative aspect-[9/16] bg-zinc-800 overflow-hidden">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center">
                <div className="w-16 h-16 bg-blue-500/80 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform scale-0 group-hover:scale-100">
                  <Play className="w-8 h-8 text-white fill-white ml-1" />
                </div>
              </div>
              <div className="absolute top-3 left-3 px-2 py-1 bg-black/70 backdrop-blur-sm text-white rounded">
                {video.duration}
              </div>
              <div className="absolute top-3 right-3 px-3 py-1 bg-blue-500/80 backdrop-blur-sm text-white rounded-full">
                {video.platform}
              </div>
            </div>

            {/* Content */}
            <div className="p-4 space-y-3">
              <p className="text-white line-clamp-2">{video.title}</p>
              
              <div className="flex flex-wrap gap-1">
                {video.hashtags.map((tag, index) => (
                  <span key={index} className="text-blue-400">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between text-gray-400">
                <span>{video.views} views</span>
                <span>{video.likes} likes</span>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <button className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500/80 to-blue-600/80 text-white rounded-lg hover:shadow-lg hover:shadow-blue-500/30 transition-all flex items-center justify-center gap-2">
                  <Download className="w-4 h-4" />
                  Download
                </button>
                <button
                  onClick={() => toggleSave(video.id)}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    savedVideos.includes(video.id)
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                      : 'bg-zinc-800/50 text-gray-300 hover:bg-zinc-700/50'
                  }`}
                >
                  <Bookmark className={`w-4 h-4 ${savedVideos.includes(video.id) ? 'fill-current' : ''}`} />
                </button>
                <button className="px-4 py-2 bg-zinc-800/50 text-gray-300 rounded-lg hover:bg-zinc-700/50 hover:text-blue-400 transition-all">
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}