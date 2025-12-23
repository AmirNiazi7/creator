import React, { useState } from 'react';
import { Upload, Check, X, Play, Image as ImageIcon, Video } from 'lucide-react';

export default function ManualPosting() {
  const [connectedPlatforms, setConnectedPlatforms] = useState({
    tiktok: false,
    instagram: false,
    youtube: false
  });
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string>('');
  const [caption, setCaption] = useState('');
  const [hashtags, setHashtags] = useState('');
  const [posting, setPosting] = useState(false);
  const [posted, setPosted] = useState(false);

  const handleConnect = (platform: keyof typeof connectedPlatforms) => {
    setConnectedPlatforms(prev => ({ ...prev, [platform]: true }));
  };

  const handleDisconnect = (platform: keyof typeof connectedPlatforms) => {
    setConnectedPlatforms(prev => ({ ...prev, [platform]: false }));
    setSelectedPlatforms(prev => prev.filter(p => p !== platform));
  };

  const togglePlatform = (platform: string) => {
    setSelectedPlatforms(prev =>
      prev.includes(platform)
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    );
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
      setVideoPreview(URL.createObjectURL(file));
    }
  };

  const handlePost = () => {
    if (!videoFile || selectedPlatforms.length === 0) return;
    setPosting(true);
    setTimeout(() => {
      setPosting(false);
      setPosted(true);
      setTimeout(() => setPosted(false), 3000);
    }, 2000);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 relative z-10">
      {/* Header */}
      <div className="fade-in">
        <h1 className="mb-2 flex items-center gap-2">
          <Upload className="w-8 h-8 text-orange-400" />
          Manual Posting
        </h1>
        <p className="text-gray-400">Upload and post your content to multiple platforms</p>
      </div>

      {/* Platform Connections */}
      <div className="bg-zinc-900/50 backdrop-blur-xl rounded-xl border border-zinc-800/50 p-6 slide-in-up">
        <h2 className="mb-4">Connected Platforms</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* TikTok */}
          <div className={`border-2 rounded-lg p-4 transition-all ${
            connectedPlatforms.tiktok ? 'border-purple-600 bg-purple-50' : 'border-gray-200'
          }`}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center">
                  <span className="text-white">TT</span>
                </div>
                <div>
                  <h3 className="text-gray-800">TikTok</h3>
                  <p className="text-gray-600">
                    {connectedPlatforms.tiktok ? 'Connected' : 'Not connected'}
                  </p>
                </div>
              </div>
              {connectedPlatforms.tiktok && (
                <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
            {connectedPlatforms.tiktok ? (
              <button
                onClick={() => handleDisconnect('tiktok')}
                className="w-full px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-all"
              >
                Disconnect
              </button>
            ) : (
              <button
                onClick={() => handleConnect('tiktok')}
                className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all"
              >
                Connect
              </button>
            )}
          </div>

          {/* Instagram */}
          <div className={`border-2 rounded-lg p-4 transition-all ${
            connectedPlatforms.instagram ? 'border-purple-600 bg-purple-50' : 'border-gray-200'
          }`}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 via-pink-500 to-orange-500 rounded-lg"></div>
                <div>
                  <h3 className="text-gray-800">Instagram</h3>
                  <p className="text-gray-600">
                    {connectedPlatforms.instagram ? 'Connected' : 'Not connected'}
                  </p>
                </div>
              </div>
              {connectedPlatforms.instagram && (
                <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
            {connectedPlatforms.instagram ? (
              <button
                onClick={() => handleDisconnect('instagram')}
                className="w-full px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-all"
              >
                Disconnect
              </button>
            ) : (
              <button
                onClick={() => handleConnect('instagram')}
                className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all"
              >
                Connect
              </button>
            )}
          </div>

          {/* YouTube */}
          <div className={`border-2 rounded-lg p-4 transition-all ${
            connectedPlatforms.youtube ? 'border-purple-600 bg-purple-50' : 'border-gray-200'
          }`}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xl">▶</span>
                </div>
                <div>
                  <h3 className="text-gray-800">YouTube</h3>
                  <p className="text-gray-600">
                    {connectedPlatforms.youtube ? 'Connected' : 'Not connected'}
                  </p>
                </div>
              </div>
              {connectedPlatforms.youtube && (
                <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
            {connectedPlatforms.youtube ? (
              <button
                onClick={() => handleDisconnect('youtube')}
                className="w-full px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-all"
              >
                Disconnect
              </button>
            ) : (
              <button
                onClick={() => handleConnect('youtube')}
                className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all"
              >
                Connect
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Upload Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Video Upload */}
        <div className="bg-zinc-900/50 backdrop-blur-xl rounded-xl border border-zinc-800/50 p-6">
          <h2 className="mb-4">Upload Video</h2>
          
          {!videoPreview ? (
            <label className="block">
              <div className="border-2 border-dashed border-zinc-700 rounded-lg p-12 text-center cursor-pointer hover:border-orange-400 hover:bg-orange-500/5 transition-all">
                <Upload className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-300 mb-2">Click to upload video</p>
                <p className="text-gray-400">or drag and drop</p>
                <p className="text-gray-500 mt-2">MP4, MOV up to 500MB</p>
              </div>
              <input
                type="file"
                accept="video/*"
                onChange={handleVideoChange}
                className="hidden"
              />
            </label>
          ) : (
            <div className="space-y-4">
              <div className="relative aspect-[9/16] bg-black rounded-lg overflow-hidden max-w-xs mx-auto">
                <video src={videoPreview} controls className="w-full h-full object-contain" />
              </div>
              <div className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Video className="w-5 h-5 text-orange-400" />
                  <div>
                    <p className="text-white">{videoFile?.name}</p>
                    <p className="text-gray-400">
                      {videoFile ? (videoFile.size / (1024 * 1024)).toFixed(2) : '0'} MB
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setVideoFile(null);
                    setVideoPreview('');
                  }}
                  className="p-2 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Post Details */}
        <div className="bg-zinc-900/50 backdrop-blur-xl rounded-xl border border-zinc-800/50 p-6">
          <h2 className="mb-4">Post Details</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-gray-300 mb-2">Caption</label>
              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Write your caption here..."
                className="w-full h-32 p-4 bg-black/40 border border-zinc-700 rounded-lg focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 resize-none text-white placeholder-gray-500"
              />
              <span className="text-gray-400">{caption.length} characters</span>
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Hashtags</label>
              <input
                type="text"
                value={hashtags}
                onChange={(e) => setHashtags(e.target.value)}
                placeholder="#viral #trending #fyp"
                className="w-full px-4 py-3 bg-black/40 border border-zinc-700 rounded-lg focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 text-white placeholder-gray-500"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-3">Select Platforms</label>
              <div className="space-y-2">
                {Object.entries(connectedPlatforms).map(([platform, connected]) => (
                  <button
                    key={platform}
                    onClick={() => connected && togglePlatform(platform)}
                    disabled={!connected}
                    className={`w-full p-4 rounded-lg border-2 transition-all flex items-center justify-between ${
                      !connected
                        ? 'border-zinc-700 bg-zinc-800/30 cursor-not-allowed opacity-50'
                        : selectedPlatforms.includes(platform)
                        ? 'border-orange-500/50 bg-orange-500/10'
                        : 'border-zinc-700 hover:border-orange-400/50'
                    }`}
                  >
                    <span className="capitalize text-white">{platform}</span>
                    {selectedPlatforms.includes(platform) && (
                      <Check className="w-5 h-5 text-orange-400" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Post Button */}
      <div className="bg-zinc-900/50 backdrop-blur-xl rounded-xl border border-zinc-800/50 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-white mb-1">Ready to post?</h3>
            <p className="text-gray-400">
              {selectedPlatforms.length > 0
                ? `Posting to ${selectedPlatforms.length} platform(s)`
                : 'Select at least one platform to post'}
            </p>
          </div>
          <button
            onClick={handlePost}
            disabled={!videoFile || selectedPlatforms.length === 0 || posting}
            className="px-8 py-3 bg-gradient-to-r from-orange-500/80 to-orange-600/80 text-white rounded-lg hover:shadow-lg hover:shadow-orange-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {posting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Posting...
              </>
            ) : posted ? (
              <>
                <Check className="w-5 h-5" />
                Posted Successfully!
              </>
            ) : (
              <>
                <Upload className="w-5 h-5" />
                Post Now
              </>
            )}
          </button>
        </div>
      </div>

      {/* Post History */}
      <div className="bg-zinc-900/50 backdrop-blur-xl rounded-xl border border-zinc-800/50 p-6">
        <h2 className="mb-4">Recent Posts</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-zinc-800/50 rounded-lg">
            <div className="w-16 h-16 bg-zinc-700 rounded-lg flex items-center justify-center">
              <Play className="w-8 h-8 text-gray-400" />
            </div>
            <div className="flex-1">
              <p className="text-white mb-1">Morning Routine Tips</p>
              <p className="text-gray-400">Posted 2 hours ago to TikTok, Instagram</p>
            </div>
            <div className="px-3 py-1 bg-green-500/20 text-green-400 border border-green-500/30 rounded-full">
              Success
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 bg-zinc-800/50 rounded-lg">
            <div className="w-16 h-16 bg-zinc-700 rounded-lg flex items-center justify-center">
              <Play className="w-8 h-8 text-gray-400" />
            </div>
            <div className="flex-1">
              <p className="text-white mb-1">Product Review - Tech Gadget</p>
              <p className="text-gray-400">Posted 1 day ago to YouTube, TikTok</p>
            </div>
            <div className="px-3 py-1 bg-green-500/20 text-green-400 border border-green-500/30 rounded-full">
              Success
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}