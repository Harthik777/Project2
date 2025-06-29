import React, { useState, useEffect } from 'react';
import { Brain, BarChart3, TrendingUp, Github, Linkedin } from 'lucide-react';
import { SentimentAnalyzer } from './components/SentimentAnalyzer';
import { MarketDashboard } from './components/MarketDashboard';
import { NewsAnalyzer } from './components/NewsAnalyzer';
import { PortfolioRisk } from './components/PortfolioRisk';
import { SentimentResult, NewsItem } from './types/sentiment';

function App() {
  const [sentimentHistory, setSentimentHistory] = useState<SentimentResult[]>([]);
  const [activeTab, setActiveTab] = useState<'analyzer' | 'batch' | 'dashboard' | 'risk'>('analyzer');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate app initialization
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleAnalysis = (result: SentimentResult) => {
    setSentimentHistory(prev => [...prev, result]);
  };

  const handleBatchAnalysis = (results: NewsItem[]) => {
    const sentiments = results
      .filter(item => item.sentiment)
      .map(item => item.sentiment!);
    setSentimentHistory(prev => [...prev, ...sentiments]);
  };

  const tabs = [
    { id: 'analyzer', label: 'Sentiment Analysis', icon: Brain },
    { id: 'batch', label: 'Batch Analysis', icon: BarChart3 },
    { id: 'dashboard', label: 'Market Dashboard', icon: TrendingUp },
    { id: 'risk', label: 'Portfolio Risk', icon: BarChart3 },
  ] as const;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Initializing FinSentiment AI...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Header */}
      <header className="bg-gray-900/80 backdrop-blur-xl border-b border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">FinSentiment AI</h1>
                <p className="text-gray-400 text-sm">Financial Market Sentiment Analysis Platform</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-400 hover:text-white transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-400 hover:text-white transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="flex space-x-1 bg-gray-900/50 backdrop-blur-xl rounded-xl p-1 border border-gray-700/50">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                activeTab === id
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'analyzer' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <SentimentAnalyzer onAnalysis={handleAnalysis} />
            <div className="space-y-6">
              <MarketDashboard sentimentHistory={sentimentHistory} />
            </div>
          </div>
        )}

        {activeTab === 'batch' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <NewsAnalyzer onBatchAnalysis={handleBatchAnalysis} />
            <PortfolioRisk sentimentHistory={sentimentHistory} />
          </div>
        )}

        {activeTab === 'dashboard' && (
          <MarketDashboard sentimentHistory={sentimentHistory} />
        )}

        {activeTab === 'risk' && (
          <PortfolioRisk sentimentHistory={sentimentHistory} />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900/80 backdrop-blur-xl border-t border-gray-700/50 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-gray-400 text-sm">
              Built with TensorFlow.js, React, and advanced ML algorithms for financial market analysis
            </p>
            <p className="text-gray-500 text-xs mt-2">
              © 2024 FinSentiment AI - Production-grade financial sentiment analysis platform
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;