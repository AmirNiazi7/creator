import React, { useState } from 'react';
import { FileText, Sparkles, Clock, Target, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react';

const MOCK_ANALYSIS = {
  hookType: 'Question Hook',
  hookScore: 8.5,
  pacing: 'Fast-paced',
  pacingScore: 9.0,
  tone: 'Energetic & Casual',
  toneScore: 8.0,
  ctaPresence: true,
  ctaStrength: 'Strong',
  retentionIssues: [
    'Consider adding a pattern interrupt at 0:15',
    'Hook could be more specific to target audience',
    'Add a visual element description in the middle'
  ],
  strengths: [
    'Excellent pacing keeps viewer engaged',
    'Clear value proposition in first 5 seconds',
    'Strong emotional appeal',
    'Natural conversational flow'
  ],
  suggestions: [
    'Add more specific numbers or statistics',
    'Include a personal story or anecdote',
    'Make the CTA more urgent',
    'Consider a callback to the hook at the end'
  ]
};

export default function ScriptAnalyzer() {
  const [script, setScript] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);
  const [savedScripts, setSavedScripts] = useState<string[]>([]);

  const handleAnalyze = () => {
    if (!script.trim()) return;
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setAnalyzed(true);
    }, 2000);
  };

  const handleSave = () => {
    const scripts = JSON.parse(localStorage.getItem('savedScripts') || '[]');
    scripts.push({
      content: script,
      analysis: MOCK_ANALYSIS,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem('savedScripts', JSON.stringify(scripts));
    setSavedScripts(scripts);
    alert('Script saved to library!');
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-400';
    if (score >= 6) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreBg = (score: number) => {
    if (score >= 8) return 'bg-green-500/20';
    if (score >= 6) return 'bg-yellow-500/20';
    return 'bg-red-500/20';
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 relative z-10">
      {/* Header */}
      <div className="fade-in">
        <h1 className="mb-2 flex items-center gap-2">
          <Sparkles className="w-8 h-8 text-blue-400" />
          Script Analyzer
        </h1>
        <p className="text-gray-400">Get AI-powered insights on your script's effectiveness</p>
      </div>

      {/* Input Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-zinc-900/50 backdrop-blur-xl rounded-xl border border-zinc-800/50 p-6 slide-in-up">
          <div className="flex items-center justify-between mb-4">
            <h2>Your Script</h2>
            <span className="text-gray-400">{script.length} characters</span>
          </div>
          <textarea
            value={script}
            onChange={(e) => setScript(e.target.value)}
            placeholder="Paste your script here...&#10;&#10;Example:&#10;Are you making these mistakes with your morning routine? I used to wake up tired every single day until I discovered this simple 5-minute hack. In today's video, I'm sharing the exact routine that changed my life..."
            className="w-full h-96 p-4 bg-black/40 border border-zinc-700 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 resize-none text-white placeholder-gray-500"
          />
          <div className="flex gap-3 mt-4">
            <button
              onClick={handleAnalyze}
              disabled={!script.trim() || analyzing}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500/80 to-blue-600/80 text-white rounded-lg hover:shadow-lg hover:shadow-blue-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {analyzing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Analyze Script
                </>
              )}
            </button>
            {analyzed && (
              <button
                onClick={handleSave}
                className="px-6 py-3 bg-green-500/80 text-white rounded-lg hover:bg-green-600/80 transition-all flex items-center gap-2"
              >
                <FileText className="w-5 h-5" />
                Save
              </button>
            )}
          </div>
        </div>

        {/* Quick Tips */}
        <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-xl rounded-xl border border-blue-500/30 p-6">
          <h2 className="text-white mb-4">💡 Script Writing Tips</h2>
          <ul className="space-y-3 text-gray-400">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              <span>Start with a compelling hook in the first 3 seconds</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              <span>Keep your script concise and fast-paced</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              <span>Include a clear call-to-action at the end</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              <span>Use pattern interrupts to maintain attention</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              <span>Address your target audience directly</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              <span>Add emotional triggers and storytelling elements</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Analysis Results */}
      {analyzed && (
        <>
          {/* Score Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 stagger-children">
            <div className="bg-zinc-900/50 backdrop-blur-xl rounded-xl border border-zinc-800/50 p-6 card-hover">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-gray-300">Hook Quality</h3>
                <Target className="w-5 h-5 text-blue-400" />
              </div>
              <div className="flex items-end gap-2 mb-2">
                <span className={`text-3xl ${getScoreColor(MOCK_ANALYSIS.hookScore)}`}>
                  {MOCK_ANALYSIS.hookScore}
                </span>
                <span className="text-gray-500 mb-1">/10</span>
              </div>
              <p className="text-gray-400">{MOCK_ANALYSIS.hookType}</p>
            </div>

            <div className="bg-zinc-900/50 backdrop-blur-xl rounded-xl border border-zinc-800/50 p-6 card-hover">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-gray-300">Pacing</h3>
                <Clock className="w-5 h-5 text-blue-400" />
              </div>
              <div className="flex items-end gap-2 mb-2">
                <span className={`text-3xl ${getScoreColor(MOCK_ANALYSIS.pacingScore)}`}>
                  {MOCK_ANALYSIS.pacingScore}
                </span>
                <span className="text-gray-500 mb-1">/10</span>
              </div>
              <p className="text-gray-400">{MOCK_ANALYSIS.pacing}</p>
            </div>

            <div className="bg-zinc-900/50 backdrop-blur-xl rounded-xl border border-zinc-800/50 p-6 card-hover">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-gray-300">Tone</h3>
                <TrendingUp className="w-5 h-5 text-blue-400" />
              </div>
              <div className="flex items-end gap-2 mb-2">
                <span className={`text-3xl ${getScoreColor(MOCK_ANALYSIS.toneScore)}`}>
                  {MOCK_ANALYSIS.toneScore}
                </span>
                <span className="text-gray-500 mb-1">/10</span>
              </div>
              <p className="text-gray-400">{MOCK_ANALYSIS.tone}</p>
            </div>

            <div className="bg-zinc-900/50 backdrop-blur-xl rounded-xl border border-zinc-800/50 p-6 card-hover">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-gray-300">Call-to-Action</h3>
                <Sparkles className="w-5 h-5 text-blue-400" />
              </div>
              <div className="flex items-center gap-2 mb-2">
                {MOCK_ANALYSIS.ctaPresence ? (
                  <CheckCircle2 className="w-8 h-8 text-green-400" />
                ) : (
                  <AlertCircle className="w-8 h-8 text-red-400" />
                )}
              </div>
              <p className="text-gray-400">{MOCK_ANALYSIS.ctaStrength}</p>
            </div>
          </div>

          {/* Detailed Analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Strengths */}
            <div className="bg-zinc-900/50 backdrop-blur-xl rounded-xl border border-zinc-800/50 p-6">
              <h2 className="mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6 text-green-400" />
                Strengths
              </h2>
              <ul className="space-y-3">
                {MOCK_ANALYSIS.strengths.map((strength, index) => (
                  <li key={index} className="flex items-start gap-3 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                    <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-300">{strength}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Retention Issues */}
            <div className="bg-zinc-900/50 backdrop-blur-xl rounded-xl border border-zinc-800/50 p-6">
              <h2 className="mb-4 flex items-center gap-2">
                <AlertCircle className="w-6 h-6 text-yellow-400" />
                Retention Issues
              </h2>
              <ul className="space-y-3">
                {MOCK_ANALYSIS.retentionIssues.map((issue, index) => (
                  <li key={index} className="flex items-start gap-3 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-300">{issue}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Suggestions */}
          <div className="bg-zinc-900/50 backdrop-blur-xl rounded-xl border border-zinc-800/50 p-6">
            <h2 className="mb-4 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-blue-400" />
              Improvement Suggestions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {MOCK_ANALYSIS.suggestions.map((suggestion, index) => (
                <div key={index} className="flex items-start gap-3 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                  <div className="w-6 h-6 bg-blue-500/80 text-white rounded-full flex items-center justify-center flex-shrink-0">
                    {index + 1}
                  </div>
                  <span className="text-gray-300">{suggestion}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}