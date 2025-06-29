import React, { useState, useEffect } from 'react';
import { Newspaper, Upload, FileText, Download, RefreshCw, AlertCircle, CheckCircle, Globe, Rss } from 'lucide-react';
import { useSentimentAnalysis } from '../hooks/useSentimentAnalysis';
import { freeNewsService } from '../services/freeNewsService';
import { NewsItem } from '../types/sentiment';

interface NewsAnalyzerProps {
  onBatchAnalysis: (results: NewsItem[]) => void;
}

export const NewsAnalyzer: React.FC<NewsAnalyzerProps> = ({ onBatchAnalysis }) => {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [results, setResults] = useState<NewsItem[]>([]);
  const [isLoadingNews, setIsLoadingNews] = useState(false);
  const [newsError, setNewsError] = useState<string | null>(null);
  const [lastFetchTime, setLastFetchTime] = useState<Date | null>(null);
  const { analyzeBatch, isLoading } = useSentimentAnalysis();

  const loadLatestNews = async () => {
    setIsLoadingNews(true);
    setNewsError(null);
    
    try {
      console.log('Fetching latest financial news from free sources...');
      const latestNews = await freeNewsService.fetchLatestFinancialNews(20);
      setNewsItems(latestNews);
      setLastFetchTime(new Date());
      console.log(`Loaded ${latestNews.length} real financial news articles`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch news';
      setNewsError(errorMessage);
      console.error('Failed to load news:', error);
      
      // Fallback to sample news if real news fails
      loadSampleNews();
    } finally {
      setIsLoadingNews(false);
    }
  };

  const loadSampleNews = () => {
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
      timestamp: item.timestamp.toISOString(),
      url: item.url
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

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-slate-100 rounded-lg">
          <Newspaper className="w-5 h-5 text-slate-700" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Live News Feed</h2>
          <p className="text-slate-500 text-sm">Real-time financial news from RSS feeds</p>
        </div>
      </div>

      {/* Service Status */}
      <div className="mb-4">
        <div className="flex items-center gap-2 text-emerald-600 text-sm">
          <CheckCircle className="w-4 h-4" />
          <span>Live RSS feeds: Yahoo Finance, MarketWatch, CNN Business</span>
        </div>
        {lastFetchTime && (
          <div className="flex items-center gap-2 text-slate-500 text-xs mt-1">
            <Rss className="w-3 h-3" />
            <span>Last updated: {lastFetchTime.toLocaleTimeString()}</span>
          </div>
        )}
      </div>

      {/* Error Display */}
      {newsError && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
          <div className="flex items-center gap-2 text-amber-700 text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>Some sources unavailable: {newsError}</span>
          </div>
          <p className="text-amber-600 text-xs mt-1">
            Using available sources and fallback data.
          </p>
        </div>
      )}

      <div className="space-y-4">
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={loadLatestNews}
            disabled={isLoadingNews}
            className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:cursor-not-allowed"
          >
            {isLoadingNews ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Loading...
              </>
            ) : (
              <>
                <Globe className="w-4 h-4" />
                Load Latest News
              </>
            )}
          </button>
          
          <button
            onClick={loadSampleNews}
            className="flex items-center gap-2 bg-slate-600 hover:bg-slate-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            <FileText className="w-4 h-4" />
            Sample Data
          </button>
          
          <button
            onClick={analyzeBatchNews}
            disabled={newsItems.length === 0 || isLoading}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:cursor-not-allowed"
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
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          )}
        </div>

        {newsItems.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-medium text-slate-900">
                Articles ({newsItems.length})
              </h3>
              {newsItems.some(item => item.url) && (
                <span className="text-emerald-600 text-sm flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Live Data
                </span>
              )}
            </div>
            <div className="max-h-60 overflow-y-auto space-y-2">
              {newsItems.map((item) => (
                <div key={item.id} className="border border-slate-200 rounded-lg p-3 hover:bg-slate-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-slate-900 text-sm font-medium leading-tight">
                        {item.url ? (
                          <a 
                            href={item.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="hover:text-blue-600 transition-colors"
                          >
                            {item.headline}
                          </a>
                        ) : (
                          item.headline
                        )}
                      </p>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-slate-500 text-xs">{item.source}</span>
                        <span className="text-slate-400 text-xs">{item.category}</span>
                        <span className="text-slate-400 text-xs">{formatTimeAgo(item.timestamp)}</span>
                      </div>
                      {item.description && (
                        <p className="text-slate-500 text-xs mt-1 line-clamp-2">
                          {item.description}
                        </p>
                      )}
                    </div>
                    {item.sentiment && (
                      <div className="ml-3 text-right flex-shrink-0">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          item.sentiment.sentiment === 'positive' ? 'bg-emerald-100 text-emerald-700' :
                          item.sentiment.sentiment === 'negative' ? 'bg-red-100 text-red-700' :
                          'bg-amber-100 text-amber-700'
                        }`}>
                          {item.sentiment.sentiment}
                        </span>
                        <div className="text-slate-900 font-mono text-xs mt-1">
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