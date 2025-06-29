import React, { useState } from 'react';
import { Newspaper, Upload, FileText, Download } from 'lucide-react';
import { useSentimentAnalysis } from '../hooks/useSentimentAnalysis';
import { NewsItem } from '../types/sentiment';

interface NewsAnalyzerProps {
  onBatchAnalysis: (results: NewsItem[]) => void;
}

export const NewsAnalyzer: React.FC<NewsAnalyzerProps> = ({ onBatchAnalysis }) => {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [results, setResults] = useState<NewsItem[]>([]);
  const { analyzeBatch, isLoading } = useSentimentAnalysis();

  const sampleNews: NewsItem[] = [
    {
      id: '1',
      headline: 'Tech stocks surge as AI companies report strong earnings growth',
      source: 'Financial Times',
      timestamp: new Date(),
      category: 'Technology'
    },
    {
      id: '2',
      headline: 'Federal Reserve signals potential interest rate cuts amid economic concerns',
      source: 'Bloomberg',
      timestamp: new Date(),
      category: 'Economics'
    },
    {
      id: '3',
      headline: 'Oil prices plunge on weak demand forecasts and oversupply fears',
      source: 'Reuters',
      timestamp: new Date(),
      category: 'Energy'
    },
    {
      id: '4',
      headline: 'Banking sector shows resilience with record quarterly profits',
      source: 'Wall Street Journal',
      timestamp: new Date(),
      category: 'Finance'
    },
    {
      id: '5',
      headline: 'Healthcare stocks decline following drug approval setbacks',
      source: 'MarketWatch',
      timestamp: new Date(),
      category: 'Healthcare'
    }
  ];

  const loadSampleNews = () => {
    setNewsItems(sampleNews);
  };

  const analyzeBatchNews = async () => {
    if (newsItems.length === 0) return;
    
    try {
      const analysisResults = await analyzeBatch(newsItems);
      setResults(analysisResults);
      onBatchAnalysis(analysisResults);
    } catch (error) {
      console.error('Batch analysis failed:', error);
    }
  };

  const exportResults = () => {
    if (results.length === 0) return;
    
    const exportData = results.map(item => ({
      headline: item.headline,
      source: item.source,
      category: item.category,
      sentiment: item.sentiment?.sentiment,
      score: item.sentiment?.score,
      confidence: item.sentiment?.confidence,
      marketImpact: item.sentiment?.marketImpact,
      timestamp: item.timestamp.toISOString()
    }));

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `sentiment-analysis-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-lg">
          <Newspaper className="w-6 h-6 text-emerald-400" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-white">News Batch Analyzer</h2>
          <p className="text-gray-400 text-sm">Analyze multiple financial news items at once</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex gap-3">
          <button
            onClick={loadSampleNews}
            className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200"
          >
            <FileText className="w-4 h-4" />
            Load Sample News
          </button>
          
          <button
            onClick={analyzeBatchNews}
            disabled={newsItems.length === 0 || isLoading}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                Analyze Batch
              </>
            )}
          </button>

          {results.length > 0 && (
            <button
              onClick={exportResults}
              className="flex items-center gap-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200"
            >
              <Download className="w-4 h-4" />
              Export Results
            </button>
          )}
        </div>

        {newsItems.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-lg font-medium text-white">News Items ({newsItems.length})</h3>
            <div className="max-h-60 overflow-y-auto space-y-2">
              {newsItems.map((item) => (
                <div key={item.id} className="bg-gray-800/30 rounded-lg p-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-white text-sm font-medium">{item.headline}</p>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-gray-400 text-xs">{item.source}</span>
                        <span className="text-gray-500 text-xs">{item.category}</span>
                      </div>
                    </div>
                    {item.sentiment && (
                      <div className="ml-3 text-right">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          item.sentiment.sentiment === 'positive' ? 'bg-green-500/20 text-green-400' :
                          item.sentiment.sentiment === 'negative' ? 'bg-red-500/20 text-red-400' :
                          'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {item.sentiment.sentiment}
                        </span>
                        <div className="text-white font-mono text-xs mt-1">
                          {item.sentiment.score > 0 ? '+' : ''}{item.sentiment.score.toFixed(3)}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};