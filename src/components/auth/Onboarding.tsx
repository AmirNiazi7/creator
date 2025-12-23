import React, { useState } from 'react';
import { Check, Sparkles } from 'lucide-react';

interface OnboardingProps {
  onComplete: () => void;
}

const NICHES = [
  'Gaming', 'Beauty & Fashion', 'Fitness & Health', 'Food & Cooking',
  'Tech & Gadgets', 'Travel', 'Comedy', 'Education',
  'Music', 'Art & Design', 'Business', 'Lifestyle'
];

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(1);
  const [selectedNiches, setSelectedNiches] = useState<string[]>([]);
  const [connectedPlatforms, setConnectedPlatforms] = useState({
    tiktok: false,
    instagram: false,
    youtube: false
  });

  const toggleNiche = (niche: string) => {
    setSelectedNiches(prev =>
      prev.includes(niche)
        ? prev.filter(n => n !== niche)
        : [...prev, niche]
    );
  };

  const handleConnect = (platform: keyof typeof connectedPlatforms) => {
    setConnectedPlatforms(prev => ({ ...prev, [platform]: true }));
  };

  const handleFinish = () => {
    localStorage.setItem('userNiches', JSON.stringify(selectedNiches));
    localStorage.setItem('connectedPlatforms', JSON.stringify(connectedPlatforms));
    onComplete();
  };

  return (
    <div className="min-h-screen mesh-gradient flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Gradient Orbs */}
      <div className="absolute top-0 left-1/2 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s' }}></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }}></div>
      
      <div className="bg-zinc-900/80 backdrop-blur-xl border border-zinc-800/50 rounded-2xl shadow-2xl w-full max-w-2xl p-8 relative z-10 slide-in-up">
        {/* Decorative gradient border */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl blur opacity-20"></div>
        
        <div className="relative">
          {/* Logo */}
          <div className="flex items-center justify-center mb-8">
            <img src="/vids-logo.svg" alt="vids.so" className="h-10 w-auto" />
          </div>

          {/* Progress */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                step >= 1 ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30' : 'bg-zinc-800 text-gray-500'
              }`}>
                1
              </div>
              <div className={`w-16 h-1 transition-all ${step >= 2 ? 'bg-gradient-to-r from-blue-500 to-blue-600' : 'bg-zinc-800'}`}></div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                step >= 2 ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30' : 'bg-zinc-800 text-gray-500'
              }`}>
                2
              </div>
            </div>
          </div>

          {step === 1 && (
            <div className="fade-in">
              <h2 className="text-center mb-2 gradient-text">Choose Your Content Niches</h2>
              <p className="text-center text-gray-400 mb-8">Select the topics you create content about</p>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8 stagger-children">
                {NICHES.map(niche => (
                  <button
                    key={niche}
                    onClick={() => toggleNiche(niche)}
                    className={`p-4 rounded-lg border-2 transition-all transform hover:scale-105 ${
                      selectedNiches.includes(niche)
                        ? 'border-blue-500 bg-blue-500/10 text-blue-400 shadow-lg shadow-blue-500/20'
                        : 'border-zinc-700 hover:border-blue-500/50 text-gray-300'
                    }`}
                  >
                    {niche}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setStep(2)}
                disabled={selectedNiches.length === 0}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
              >
                Continue
                <Sparkles className="w-4 h-4" />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="fade-in">
              <h2 className="text-center mb-2 gradient-text">Connect Your Platforms</h2>
              <p className="text-center text-gray-400 mb-8">Optional: Connect your social media accounts</p>

              <div className="space-y-4 mb-8 stagger-children">
                <div className="border border-zinc-800 bg-zinc-900/50 rounded-lg p-6 flex items-center justify-between card-hover">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center border border-zinc-700">
                      <span className="text-white">TT</span>
                    </div>
                    <div>
                      <h3 className="text-white">TikTok</h3>
                      <p className="text-gray-400">Connect your TikTok account</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleConnect('tiktok')}
                    className={`px-6 py-2 rounded-lg transition-all ${
                      connectedPlatforms.tiktok
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                        : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:shadow-lg hover:shadow-blue-500/30'
                    }`}
                  >
                    {connectedPlatforms.tiktok ? (
                      <span className="flex items-center gap-2">
                        <Check className="w-4 h-4" /> Connected
                      </span>
                    ) : (
                      'Connect'
                    )}
                  </button>
                </div>

                <div className="border border-zinc-800 bg-zinc-900/50 rounded-lg p-6 flex items-center justify-between card-hover">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-600 via-pink-500 to-blue-500 rounded-lg"></div>
                    <div>
                      <h3 className="text-white">Instagram</h3>
                      <p className="text-gray-400">Connect your Instagram account</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleConnect('instagram')}
                    className={`px-6 py-2 rounded-lg transition-all ${
                      connectedPlatforms.instagram
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                        : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:shadow-lg hover:shadow-blue-500/30'
                    }`}
                  >
                    {connectedPlatforms.instagram ? (
                      <span className="flex items-center gap-2">
                        <Check className="w-4 h-4" /> Connected
                      </span>
                    ) : (
                      'Connect'
                    )}
                  </button>
                </div>

                <div className="border border-zinc-800 bg-zinc-900/50 rounded-lg p-6 flex items-center justify-between card-hover">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center">
                      <span className="text-white">▶</span>
                    </div>
                    <div>
                      <h3 className="text-white">YouTube</h3>
                      <p className="text-gray-400">Connect your YouTube account</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleConnect('youtube')}
                    className={`px-6 py-2 rounded-lg transition-all ${
                      connectedPlatforms.youtube
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                        : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:shadow-lg hover:shadow-blue-500/30'
                    }`}
                  >
                    {connectedPlatforms.youtube ? (
                      <span className="flex items-center gap-2">
                        <Check className="w-4 h-4" /> Connected
                      </span>
                    ) : (
                      'Connect'
                    )}
                  </button>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 border border-zinc-700 text-gray-300 py-3 rounded-lg hover:bg-zinc-800/50 hover:border-blue-500/50 transition-all"
                >
                  Back
                </button>
                <button
                  onClick={handleFinish}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  Get Started
                  <Sparkles className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
