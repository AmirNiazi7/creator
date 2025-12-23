import React from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp, BarChart3, Search, Users, FileText, Upload,
  Play, Bookmark, Clock, Wand2, Sparkles, ArrowRight
} from 'lucide-react';

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const quickActions = [
    { name: 'Find Viral Content', path: '/viral-content', icon: TrendingUp, color: 'from-blue-400 to-blue-500' },
    { name: 'Analyze Channel', path: '/shorts-analytics', icon: BarChart3, color: 'from-blue-500 to-cyan-400' },
    { name: 'Find Competitors', path: '/competitor-finder', icon: Users, color: 'from-cyan-400 to-blue-400' },
    { name: 'Analyze Script', path: '/script-analyzer', icon: FileText, color: 'from-blue-300 to-blue-400' },
    { name: 'Rewrite Script', path: '/script-rewriter', icon: Wand2, color: 'from-blue-400 to-sky-400' },
    { name: 'Post Content', path: '/manual-posting', icon: Upload, color: 'from-sky-500 to-blue-500' },
  ];

  const recentVideos = [
    { id: 1, title: '10 Viral Dance Trends You Need to Try', platform: 'TikTok', views: '2.5M', thumbnail: 'https://images.unsplash.com/photo-1547153760-18fc9498c17f?w=400' },
    { id: 2, title: 'How I Gained 100K Followers in 30 Days', platform: 'Instagram', views: '890K', thumbnail: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400' },
    { id: 3, title: 'Top 5 Editing Tricks for Viral Shorts', platform: 'YouTube', views: '1.2M', thumbnail: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?w=400' },
  ];

  const recentScripts = [
    { id: 1, title: 'Fitness Motivation Hook', type: 'Analyzed', date: '2 hours ago' },
    { id: 2, title: 'Product Review Template', type: 'Rewritten', date: '5 hours ago' },
    { id: 3, title: 'Storytelling Framework', type: 'Analyzed', date: '1 day ago' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 relative z-10">
      {/* Welcome */}
      <div className="fade-in">
        <h1 className="mb-2 flex items-center gap-2">
          <span className="gradient-text">Welcome back, {user.name || 'Creator'}!</span>
          <Sparkles className="w-6 h-6 text-blue-500 animate-pulse" />
        </h1>
        <p className="text-gray-400">Here's what's happening with your content today</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 stagger-children">
        <div className="bg-zinc-900/50 backdrop-blur-xl rounded-xl border border-zinc-800/50 p-6 card-hover relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition-colors">
                <Bookmark className="w-6 h-6 text-blue-500" />
              </div>
            </div>
            <p className="text-gray-400 mb-1">Saved Videos</p>
            <p className="text-white">24</p>
          </div>
        </div>

        <div className="bg-zinc-900/50 backdrop-blur-xl rounded-xl border border-zinc-800/50 p-6 card-hover relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition-colors">
                <FileText className="w-6 h-6 text-blue-500" />
              </div>
            </div>
            <p className="text-gray-400 mb-1">Saved Scripts</p>
            <p className="text-white">12</p>
          </div>
        </div>

        <div className="bg-zinc-900/50 backdrop-blur-xl rounded-xl border border-zinc-800/50 p-6 card-hover relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition-colors">
                <Search className="w-6 h-6 text-blue-500" />
              </div>
            </div>
            <p className="text-gray-400 mb-1">Channels Analyzed</p>
            <p className="text-white">38</p>
          </div>
        </div>

        <div className="bg-zinc-900/50 backdrop-blur-xl rounded-xl border border-zinc-800/50 p-6 card-hover relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition-colors">
                <Upload className="w-6 h-6 text-blue-500" />
              </div>
            </div>
            <p className="text-gray-400 mb-1">Posts This Month</p>
            <p className="text-white">15</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 stagger-children">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.path}
                to={action.path}
                className="bg-zinc-900/50 backdrop-blur-xl rounded-xl border border-zinc-800/50 p-6 card-hover group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative">
                  <div className={`w-12 h-12 bg-gradient-to-r ${action.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all shadow-lg shadow-blue-500/20`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-white mb-1">{action.name}</h3>
                  <p className="text-gray-400 flex items-center gap-1 group-hover:text-blue-500 transition-colors">
                    Get started 
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Two column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Videos */}
        <div className="bg-zinc-900/50 backdrop-blur-xl rounded-xl border border-zinc-800/50 p-6 slide-in-up">
          <div className="flex items-center justify-between mb-4">
            <h2>Recently Saved Videos</h2>
            <Link to="/viral-content" className="text-blue-500 hover:text-blue-400 transition-colors flex items-center gap-1">
              View all
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-4">
            {recentVideos.map((video, index) => (
              <div 
                key={video.id} 
                className="flex gap-4 group cursor-pointer p-2 rounded-lg hover:bg-zinc-800/50 transition-all"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative w-32 h-20 rounded-lg overflow-hidden bg-zinc-800 flex-shrink-0">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform scale-0 group-hover:scale-100">
                      <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                    </div>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white truncate mb-1 group-hover:text-blue-500 transition-colors">{video.title}</p>
                  <p className="text-gray-500">{video.platform}</p>
                  <p className="text-gray-400">{video.views} views</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Scripts */}
        <div className="bg-zinc-900/50 backdrop-blur-xl rounded-xl border border-zinc-800/50 p-6 slide-in-up">
          <div className="flex items-center justify-between mb-4">
            <h2>Recently Saved Scripts</h2>
            <Link to="/script-analyzer" className="text-blue-500 hover:text-blue-400 transition-colors flex items-center gap-1">
              View all
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-4">
            {recentScripts.map((script, index) => (
              <div 
                key={script.id} 
                className="flex items-start gap-4 p-4 rounded-lg hover:bg-zinc-800/50 cursor-pointer transition-all group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="p-3 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition-colors">
                  <FileText className="w-5 h-5 text-blue-500" />
                </div>
                <div className="flex-1">
                  <p className="text-white mb-1 group-hover:text-blue-500 transition-colors">{script.title}</p>
                  <div className="flex items-center gap-2 text-gray-400">
                    <span className="px-2 py-1 bg-blue-500/10 text-blue-400 rounded border border-blue-500/20">
                      {script.type}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {script.date}
                    </span>
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
