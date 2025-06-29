import React, { useState, useEffect } from 'react';
import { Brain, TrendingUp, TrendingDown, AlertTriangle, Target } from 'lucide-react';
import { useSentimentAnalysis } from '../hooks/useSentimentAnalysis';
import { SentimentResult } from '../types/sentiment';

interface SentimentAnalyzerProps {
  onAnalysis: (result: SentimentResult) => void;
}

export const SentimentAnalyzer: React.FC<SentimentAnalyzerProps> = ({ onAnalysis }) => {
  const [text, setText] = useState('');
  const [result, setResult] = useState<SentimentResult | null>(null);
  const [modelInitialized, setModelInitialized] = useState(false);
  const { analyzeText, isLoading, isModelReady, initializeModel } = useSentimentAnalysis();

  const handleInitializeModel = async () => {
    if (modelInitialized) return;
    try {
      await initializeModel();
      setModelInitialized(true);
    } catch (error) {
      console.error('Failed to initialize model:', error);
    }
  };

  const handleAnalysis = async () => {
    if (!text.trim()) return;
    
    if (!modelInitialized) {
      await handleInitializeModel();
    }
    
    try {
      const analysisResult = await analyzeText(text);
      setResult(analysisResult);
      onAnalysis(analysisResult);
    } catch (error) {
      console.error('Analysis failed:', error);
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return <TrendingUp className="w-5 h-5 text-green-400" />;
      case 'negative': return <TrendingDown className="w-5 h-5 text-red-400" />;
      default: return <Target className="w-5 h-5 text-yellow-400" />;
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'from-green-500/20 to-emerald-500/20 border-green-500/30';
      case 'negative': return 'from-red-500/20 to-rose-500/20 border-red-500/30';
      default: return 'from-yellow-500/20 to-amber-500/20 border-yellow-500/30';
    }
  };

  return (
    <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg">
          <Brain className="w-6 h-6 text-blue-400" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-white">Sentiment Analysis</h2>
          <p className="text-gray-400 text-sm">Analyze market sentiment from financial news</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Financial News or Text
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter financial news headline or text to analyze market sentiment..."
            className="w-full h-32 bg-gray-800/50 border border-gray-600/50 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent resize-none"
          />
        </div>

        <button
          onClick={handleAnalysis}
          disabled={!text.trim() || isLoading}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              {modelInitialized ? 'Analyzing...' : 'Loading AI Model...'}
            </>
          ) : (
            <>
              <Brain className="w-4 h-4" />
              Analyze Sentiment
            </>
          )}
        </button>

        {!modelInitialized && !isLoading && (
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
            <p className="text-blue-400 text-sm">
              💡 The AI model will load automatically when you first analyze text. This may take a moment.
            </p>
          </div>
        )}

        {result && (
          <div className={`bg-gradient-to-r ${getSentimentColor(result.sentiment)} rounded-lg border p-4 mt-4`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                {getSentimentIcon(result.sentiment)}
                <span className="font-medium text-white capitalize">
                  {result.sentiment} Sentiment
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-300">
                  Impact: {result.marketImpact.toUpperCase()}
                </span>
                {result.marketImpact === 'high' && (
                  <AlertTriangle className="w-4 h-4 text-orange-400" />
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-3">
              <div>
                <span className="text-sm text-gray-400">Confidence</span>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${result.confidence * 100}%` }}
                    />
                  </div>
                  <span className="text-sm text-white font-medium">
                    {(result.confidence * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
              <div>
                <span className="text-sm text-gray-400">Score</span>
                <div className="text-lg font-semibold text-white">
                  {result.score > 0 ? '+' : ''}{result.score.toFixed(3)}
                </div>
              </div>
            </div>

            {result.sectors && result.sectors.length > 0 && (
              <div>
                <span className="text-sm text-gray-400">Detected Sectors</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {result.sectors.map((sector, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-700/50 text-gray-300 text-xs rounded-full"
                    >
                      {sector}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};