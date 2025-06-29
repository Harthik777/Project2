import React, { useState, useEffect } from 'react';
import { Activity, BarChart3, TrendingUp, Github, Menu, X } from 'lucide-react';
import { SentimentAnalyzer } from './components/SentimentAnalyzer';
import { MarketDashboard } from './components/MarketDashboard';
import { NewsAnalyzer } from './components/NewsAnalyzer';
import { PortfolioRisk } from './components/PortfolioRisk';
import { SentimentResult, NewsItem } from './types/sentiment';

function App() {
  const [sentimentHistory, setSentimentHistory] = useState<SentimentResult[]>([]);
  const [activeTab, setActiveTab] = useState<'analyzer' | 'batch' | 'dashboard' | 'risk'>('analyzer');
  const [isLoading, setIsLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    { id: 'analyzer', label: 'Analysis', icon: Activity },
    { id: 'batch', label: 'News Feed', icon: BarChart3 },
    { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
    { id: 'risk', label: 'Risk Assessment', icon: BarChart3 },
  ] as const;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 text-sm font-medium">Loading platform...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-slate-900">MarketSense</h1>
                <p className="text-slate-500 text-xs hidden sm:block">Financial Sentiment Analysis</p>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {tabs.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === id
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              <a
                href="https://github.com/Harthik777/Project2"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
                title="View Source Code"
              >
                <Github className="w-4 h-4" />
              </a>
              
              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-slate-600"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white">
            <div className="px-4 py-2 space-y-1">
              {tabs.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => {
                    setActiveTab(id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-2 w-full px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === id
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

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
      <footer className="bg-white border-t border-slate-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <p className="text-slate-500 text-sm">
              Made with ❤️ by Harthik
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;