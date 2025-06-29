import React, { useState, useEffect } from 'react';
import { Activity, TrendingUp, TrendingDown, AlertTriangle, Target, BarChart } from 'lucide-react';
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
      case 'positive': return <TrendingUp className="w-5 h-5 text-emerald-600" />;
      case 'negative': return <TrendingDown className="w-5 h-5 text-red-600" />;
      default: return <Target className="w-5 h-5 text-amber-600" />;
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'border-emerald-200 bg-emerald-50';
      case 'negative': return 'border-red-200 bg-red-50';
      default: return 'border-amber-200 bg-amber-50';
    }
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-slate-100 rounded-lg">
          <Activity className="w-5 h-5 text-slate-700" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Sentiment Analysis</h2>
          <p className="text-slate-500 text-sm">Analyze market sentiment from financial text</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Financial News or Text
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter financial news headline or text to analyze market sentiment..."
            className="w-full h-32 border border-slate-300 rounded-lg px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent resize-none"
          />
        </div>

        <button
          onClick={handleAnalysis}
          disabled={!text.trim() || isLoading}
          className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white font-medium py-3 px-6 rounded-lg transition-colors disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              {modelInitialized ? 'Analyzing...' : 'Loading Model...'}
            </>
          ) : (
            <>
              <BarChart className="w-4 h-4" />
              Analyze Sentiment
            </>
          )}
        </button>

        {!modelInitialized && !isLoading && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-blue-700 text-sm">
              The analysis model will load automatically when you first analyze text.
            </p>
          </div>
        )}

        {result && (
          <div className={`${getSentimentColor(result.sentiment)} rounded-lg border p-4 mt-4`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                {getSentimentIcon(result.sentiment)}
                <span className="font-medium text-slate-900 capitalize">
                  {result.sentiment} Sentiment
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600">
                  Impact: {result.marketImpact.toUpperCase()}
                </span>
                {result.marketImpact === 'high' && (
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-3">
              <div>
                <span className="text-sm text-slate-500">Confidence</span>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-slate-200 rounded-full h-2">
                    <div 
                      className="bg-slate-700 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${result.confidence * 100}%` }}
                    />
                  </div>
                  <span className="text-sm text-slate-900 font-medium">
                    {(result.confidence * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
              <div>
                <span className="text-sm text-slate-500">Score</span>
                <div className="text-lg font-semibold text-slate-900">
                  {result.score > 0 ? '+' : ''}{result.score.toFixed(3)}
                </div>
              </div>
            </div>

            {result.sectors && result.sectors.length > 0 && (
              <div>
                <span className="text-sm text-slate-500">Detected Sectors</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {result.sectors.map((sector, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-slate-200 text-slate-700 text-xs rounded-full"
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