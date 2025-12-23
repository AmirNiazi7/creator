import React, { useState } from 'react';
import { Wand2, FileText, Copy, Check, RefreshCw } from 'lucide-react';

const MOCK_REWRITTEN_SCRIPT = `Hey what's up guys! So you know how everyone's always talking about morning routines? Well, I was literally the WORST at waking up - like I'm talking hitting snooze 10 times, waking up groggy, the whole deal.

But then I stumbled across this game-changing hack that takes literally 5 minutes, and now? I wake up feeling AMAZING. No joke.

So in this video I'm gonna break down my exact morning routine that completely transformed how I start my day. And the best part? You can start doing this tomorrow.

First things first - and this is gonna sound crazy but trust me - I set my alarm 20 minutes earlier. I know, I know, you're thinking "that's the opposite of what I want!" But here's the thing...

[Rest of script continues in the same energetic, conversational style with lots of emphasis and personal touches]

So yeah, that's my morning routine! If you try this out, let me know in the comments how it goes. And if you want more productivity tips like this, smash that subscribe button. See you in the next one!`;

export default function ScriptRewriter() {
  const [originalScript, setOriginalScript] = useState('');
  const [referenceChannel, setReferenceChannel] = useState('');
  const [rewriting, setRewriting] = useState(false);
  const [rewritten, setRewritten] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleRewrite = () => {
    if (!originalScript.trim() || !referenceChannel.trim()) return;
    setRewriting(true);
    setTimeout(() => {
      setRewriting(false);
      setRewritten(true);
    }, 3000);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(MOCK_REWRITTEN_SCRIPT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    const scripts = JSON.parse(localStorage.getItem('savedScripts') || '[]');
    scripts.push({
      original: originalScript,
      rewritten: MOCK_REWRITTEN_SCRIPT,
      referenceChannel: referenceChannel,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem('savedScripts', JSON.stringify(scripts));
    alert('Script saved to library!');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 relative z-10">
      {/* Header */}
      <div className="fade-in">
        <h1 className="mb-2 flex items-center gap-2">
          <Wand2 className="w-8 h-8 text-orange-400" />
          Script Rewriter (Style Transfer)
        </h1>
        <p className="text-gray-400">Rewrite your script to match the style of successful creators</p>
      </div>

      {/* Input Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Original Script */}
        <div className="bg-zinc-900/50 backdrop-blur-xl rounded-xl border border-zinc-800/50 p-6 slide-in-up">
          <h2 className="mb-4">Original Script</h2>
          <textarea
            value={originalScript}
            onChange={(e) => setOriginalScript(e.target.value)}
            placeholder="Paste your original script here...&#10;&#10;Example:&#10;This video will show you the best morning routine tips. First, wake up early. Then, drink water. Exercise is important too..."
            className="w-full h-64 p-4 bg-black/40 border border-zinc-700 rounded-lg focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 resize-none mb-4 text-white placeholder-gray-500"
          />
          <span className="text-gray-400">{originalScript.length} characters</span>
        </div>

        {/* Reference Channel */}
        <div className="bg-zinc-900/50 backdrop-blur-xl rounded-xl border border-zinc-800/50 p-6 slide-in-up">
          <h2 className="mb-4">Reference Channel</h2>
          <div className="mb-4">
            <label className="block text-gray-300 mb-2">Channel URL or Name</label>
            <input
              type="text"
              value={referenceChannel}
              onChange={(e) => setReferenceChannel(e.target.value)}
              placeholder="e.g., @MrBeast or https://youtube.com/@mrbeast"
              className="w-full px-4 py-3 bg-black/40 border border-zinc-700 rounded-lg focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 text-white placeholder-gray-500"
            />
          </div>

          <div className="p-4 bg-orange-500/10 border border-orange-500/30 rounded-lg mb-4 backdrop-blur-xl">
            <h3 className="text-white mb-2">How it works:</h3>
            <ul className="space-y-2 text-gray-400">
              <li className="flex items-start gap-2">
                <span className="text-orange-400">1.</span>
                Enter a reference channel URL
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-400">2.</span>
                AI analyzes their top videos' transcripts
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-400">3.</span>
                Extracts tone, pacing, and style patterns
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-400">4.</span>
                Rewrites your script in that exact style
              </li>
            </ul>
          </div>

          <button
            onClick={handleRewrite}
            disabled={!originalScript.trim() || !referenceChannel.trim() || rewriting}
            className="w-full px-6 py-3 bg-gradient-to-r from-orange-500/80 to-orange-600/80 text-white rounded-lg hover:shadow-lg hover:shadow-orange-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {rewriting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Rewriting Script...
              </>
            ) : (
              <>
                <Wand2 className="w-5 h-5" />
                Rewrite in This Style
              </>
            )}
          </button>
        </div>
      </div>

      {/* Rewritten Output */}
      {rewritten && (
        <div className="bg-zinc-900/50 backdrop-blur-xl rounded-xl border border-zinc-800/50 p-6 card-hover">
          <div className="flex items-center justify-between mb-4">
            <h2>Rewritten Script</h2>
            <div className="flex gap-2">
              <button
                onClick={handleCopy}
                className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
                  copied
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                    : 'bg-zinc-800/50 text-gray-300 hover:bg-zinc-700/50'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy
                  </>
                )}
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-green-500/80 text-white rounded-lg hover:bg-green-600/80 transition-all flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                Save
              </button>
              <button
                onClick={handleRewrite}
                className="px-4 py-2 bg-gradient-to-r from-orange-500/80 to-orange-600/80 text-white rounded-lg hover:shadow-lg hover:shadow-orange-500/30 transition-all flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Regenerate
              </button>
            </div>
          </div>

          <div className="p-4 bg-zinc-800/50 rounded-lg border border-zinc-700 mb-4">
            <pre className="whitespace-pre-wrap text-gray-300">{MOCK_REWRITTEN_SCRIPT}</pre>
          </div>

          <span className="text-gray-400">{MOCK_REWRITTEN_SCRIPT.length} characters</span>

          {/* Style Analysis */}
          <div className="mt-6 p-4 bg-orange-500/10 border border-orange-500/30 rounded-lg backdrop-blur-xl">
            <h3 className="text-white mb-3">🎯 Style Changes Applied</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-gray-300 mb-2">Tone Adjustments:</h4>
                <ul className="space-y-1 text-gray-400">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                    More casual and conversational
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                    Added personal anecdotes
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                    Energetic and enthusiastic delivery
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-gray-300 mb-2">Structure Changes:</h4>
                <ul className="space-y-1 text-gray-400">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                    Pattern interrupts added
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                    Stronger hook opening
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                    Clear CTA at the end
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tips */}
      {!rewritten && (
        <div className="bg-gradient-to-br from-orange-500/10 to-amber-500/10 backdrop-blur-xl rounded-xl border border-orange-500/30 p-6">
          <h2 className="text-white mb-4">💡 Pro Tips</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-400">
            <div className="flex items-start gap-3">
              <span className="text-orange-400 text-xl">1</span>
              <div>
                <h3 className="text-white mb-1">Choose the Right Reference</h3>
                <p>Pick creators in your niche with proven success for best results</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-orange-400 text-xl">2</span>
              <div>
                <h3 className="text-white mb-1">Keep Your Core Message</h3>
                <p>The rewriter maintains your key points while adapting the style</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-orange-400 text-xl">3</span>
              <div>
                <h3 className="text-white mb-1">Review and Adjust</h3>
                <p>Always review the output and make it feel authentic to you</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-orange-400 text-xl">4</span>
              <div>
                <h3 className="text-white mb-1">Test Different Styles</h3>
                <p>Try multiple reference channels to find what works best</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
