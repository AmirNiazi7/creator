import React, { useState } from 'react';
import { Search, TrendingUp, ExternalLink, FileText, Users } from 'lucide-react';

const MOCK_COMPETITORS = [
  {
    id: 1,
    channelName: 'Tech Daily Reviews',
    similarity: 94,
    subscribers: '2.1M',
    avgViews: 650000,
    commonTopics: ['Tech Reviews', 'Unboxing', 'Product Comparisons'],
    thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=100'
  },
  {
    id: 2,
    channelName: 'Gadget Guru',
    similarity: 89,
    subscribers: '1.8M',
    avgViews: 520000,
    commonTopics: ['Latest Tech', 'Reviews', 'Tech Tips'],
    thumbnail: 'https://images.unsplash.com/photo-1593642532973-d31b6557fa68?w=100'
  },
  {
    id: 3,
    channelName: 'Tech Insider Pro',
    similarity: 86,
    subscribers: '1.5M',
    avgViews: 480000,
    commonTopics: ['Product Reviews', 'Tech News', 'Comparisons'],
    thumbnail: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=100'
  },
  {
    id: 4,
    channelName: 'Digital Trends',
    similarity: 82,
    subscribers: '3.2M',
    avgViews: 720000,
    commonTopics: ['Technology', 'Reviews', 'Unboxing'],
    thumbnail: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=100'
  },
  {
    id: 5,
    channelName: 'Modern Tech',
    similarity: 78,
    subscribers: '980K',
    avgViews: 380000,
    commonTopics: ['Tech Reviews', 'How-To', 'Product Tests'],
    thumbnail: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=100'
  },
];

const MOCK_ANALYSIS = {
  channelName: 'Tech Reviews Daily',
  extractedData: {
    commonTitles: [
      'iPhone 15 Pro Max Review - Is it Worth It?',
      'Top 5 Budget Smartphones 2024',
      'Samsung Galaxy S24 Ultra Unboxing'
    ],
    commonDescriptions: [
      'In-depth tech reviews and honest opinions',
      'Latest gadget unboxings and comparisons',
      'Helping you make smart tech decisions'
    ],
    commonTags: ['tech', 'review', 'unboxing', 'comparison', 'smartphone', 'gadgets'],
    transcriptInsights: [
      'Strong hook in first 3 seconds',
      'Problem-solution framework',
      'Clear CTA at the end',
      'Casual, friendly tone'
    ]
  }
};

export default function CompetitorFinder() {
  const [channelUrl, setChannelUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const handleAnalyze = () => {
    if (!channelUrl) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setAnalyzed(true);
    }, 2500);
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
          <Users className="w-8 h-8 text-blue-400" />
          Competitor Finder
        </h1>
        <p className="text-gray-400">Discover similar channels and analyze their content strategy</p>
      </div>

      {/* Input */}
      <div className="bg-zinc-900/50 backdrop-blur-xl rounded-xl border border-zinc-800/50 p-6 slide-in-up">
        <label className="block text-gray-300 mb-3">Your YouTube Channel URL</label>
        <div className="flex gap-3">
          <div className="flex-1 relative group">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5 group-focus-within:text-blue-400 transition-colors" />
            <input
              type="text"
              value={channelUrl}
              onChange={(e) => setChannelUrl(e.target.value)}
              placeholder="https://youtube.com/@yourchannel"
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
                Finding...
              </>
            ) : (
              <>
                <Users className="w-5 h-5" />
                Find Competitors
              </>
            )}
          </button>
        </div>
      </div>

      {analyzed && (
        <>
          {/* Channel Analysis */}
          <div className="bg-zinc-900/50 backdrop-blur-xl rounded-xl border border-zinc-800/50 p-6 card-hover">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="mb-1">Channel Analysis</h2>
                <p className="text-gray-400">{MOCK_ANALYSIS.channelName}</p>
              </div>
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="px-4 py-2 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-lg hover:bg-blue-500/30 transition-all"
              >
                {showDetails ? 'Hide' : 'Show'} Details
              </button>
            </div>

            {showDetails && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Common Titles */}
                <div className="p-4 bg-zinc-800/50 rounded-lg">
                  <h3 className="text-white mb-3 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-400" />
                    Common Title Patterns
                  </h3>
                  <ul className="space-y-2">
                    {MOCK_ANALYSIS.extractedData.commonTitles.map((title, index) => (
                      <li key={index} className="text-gray-400 pl-4 border-l-2 border-blue-400">
                        {title}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Common Tags */}
                <div className="p-4 bg-zinc-800/50 rounded-lg">
                  <h3 className="text-white mb-3 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-400" />
                    Common Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {MOCK_ANALYSIS.extractedData.commonTags.map((tag, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-full">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Description Patterns */}
                <div className="p-4 bg-zinc-800/50 rounded-lg">
                  <h3 className="text-white mb-3 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-400" />
                    Description Patterns
                  </h3>
                  <ul className="space-y-2">
                    {MOCK_ANALYSIS.extractedData.commonDescriptions.map((desc, index) => (
                      <li key={index} className="text-gray-400 pl-4 border-l-2 border-blue-500">
                        {desc}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Transcript Insights */}
                <div className="p-4 bg-zinc-800/50 rounded-lg">
                  <h3 className="text-white mb-3 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-400" />
                    Transcript Insights
                  </h3>
                  <ul className="space-y-2">
                    {MOCK_ANALYSIS.extractedData.transcriptInsights.map((insight, index) => (
                      <li key={index} className="text-gray-400 flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        {insight}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Similar Channels */}
          <div className="bg-zinc-900/50 backdrop-blur-xl rounded-xl border border-zinc-800/50 p-6">
            <h2 className="mb-6">Similar Competitors (By Content Similarity)</h2>
            <div className="space-y-4">
              {MOCK_COMPETITORS.map((competitor) => (
                <div
                  key={competitor.id}
                  className="flex items-start gap-4 p-4 border border-zinc-700 rounded-lg hover:border-blue-400/50 hover:bg-zinc-800/50 transition-all"
                >
                  <img
                    src={competitor.thumbnail}
                    alt={competitor.channelName}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-white mb-1">{competitor.channelName}</h3>
                        <p className="text-gray-400">{competitor.subscribers} subscribers</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-24 bg-zinc-700 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-blue-400 to-blue-500 h-2 rounded-full"
                              style={{ width: `${competitor.similarity}%` }}
                            ></div>
                          </div>
                          <span className="text-blue-400">{competitor.similarity}%</span>
                        </div>
                        <p className="text-gray-400">similarity</p>
                      </div>
                    </div>

                    <div className="mb-3">
                      <p className="text-gray-400 mb-2">Common Topics:</p>
                      <div className="flex flex-wrap gap-2">
                        {competitor.commonTopics.map((topic, index) => (
                          <span key={index} className="px-3 py-1 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-full">
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 text-gray-400">
                        <TrendingUp className="w-4 h-4" />
                        {formatNumber(competitor.avgViews)} avg views
                      </div>
                      <button className="ml-auto px-4 py-2 bg-gradient-to-r from-blue-500/80 to-blue-600/80 text-white rounded-lg hover:shadow-lg hover:shadow-blue-500/30 transition-all flex items-center gap-2">
                        <ExternalLink className="w-4 h-4" />
                        Visit Channel
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Insights */}
          <div className="bg-gradient-to-r from-blue-500/10 to-sky-500/10 border border-blue-500/30 rounded-xl p-6 backdrop-blur-xl">
            <h3 className="text-white mb-3">💡 Key Insights</h3>
            <ul className="space-y-2 text-gray-400">
              <li className="flex items-start gap-2">
                <span className="text-blue-400">•</span>
                Your top competitor (94% similarity) has 2.1M subscribers with 650K average views
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400">•</span>
                Common successful patterns: Strong hooks, problem-solution framework, clear CTAs
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400">•</span>
                Most used tags: #tech, #review, #unboxing, #comparison
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400">•</span>
                Consider analyzing these competitors' top-performing videos for content ideas
              </li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
