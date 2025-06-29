import React, { useState, useEffect } from 'react';
import { Shield, AlertTriangle, TrendingUp, TrendingDown, Target } from 'lucide-react';
import { SentimentResult, PortfolioImpact } from '../types/sentiment';

interface PortfolioRiskProps {
  sentimentHistory: SentimentResult[];
}

export const PortfolioRisk: React.FC<PortfolioRiskProps> = ({ sentimentHistory }) => {
  const [portfolioImpact, setPortfolioImpact] = useState<PortfolioImpact | null>(null);

  useEffect(() => {
    if (sentimentHistory.length === 0) return;

    // Calculate portfolio impact based on sentiment analysis
    const recentSentiments = sentimentHistory.slice(-10); // Last 10 analyses
    const avgSentiment = recentSentiments.reduce((sum, s) => sum + s.score, 0) / recentSentiments.length;
    const avgConfidence = recentSentiments.reduce((sum, s) => sum + s.confidence, 0) / recentSentiments.length;
    
    // Calculate risk score based on sentiment volatility
    const sentimentVariance = recentSentiments.reduce((sum, s) => sum + Math.pow(s.score - avgSentiment, 2), 0) / recentSentiments.length;
    const riskScore = Math.sqrt(sentimentVariance) * 100;

    // Determine recommended action
    let recommendedAction: 'buy' | 'sell' | 'hold';
    if (avgSentiment > 0.3 && avgConfidence > 0.7) {
      recommendedAction = 'buy';
    } else if (avgSentiment < -0.3 && avgConfidence > 0.7) {
      recommendedAction = 'sell';
    } else {
      recommendedAction = 'hold';
    }

    // Calculate sector impacts
    const sectorCounts: { [key: string]: { count: number; totalSentiment: number } } = {};
    recentSentiments.forEach(sentiment => {
      if (sentiment.sectors) {
        sentiment.sectors.forEach(sector => {
          if (!sectorCounts[sector]) {
            sectorCounts[sector] = { count: 0, totalSentiment: 0 };
          }
          sectorCounts[sector].count++;
          sectorCounts[sector].totalSentiment += sentiment.score;
        });
      }
    });

    const impactedSectors = Object.entries(sectorCounts).map(([sector, data]) => ({
      sector: sector.charAt(0).toUpperCase() + sector.slice(1),
      impact: data.totalSentiment / data.count,
      sentiment: data.totalSentiment / data.count > 0.1 ? 'positive' : 
                data.totalSentiment / data.count < -0.1 ? 'negative' : 'neutral'
    })).sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact));

    setPortfolioImpact({
      overallSentiment: avgSentiment,
      riskScore,
      recommendedAction,
      confidence: avgConfidence,
      impactedSectors
    });
  }, [sentimentHistory]);

  if (!portfolioImpact) {
    return (
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-slate-100 rounded-lg">
            <Shield className="w-5 h-5 text-slate-700" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Portfolio Risk Assessment</h2>
            <p className="text-slate-500 text-sm">Analyze sentiment data to assess portfolio risk</p>
          </div>
        </div>
        <div className="text-center py-8">
          <p className="text-slate-500">Analyze some news items to see portfolio risk assessment</p>
        </div>
      </div>
    );
  }

  const getRiskColor = (score: number) => {
    if (score > 70) return 'text-red-600 bg-red-50';
    if (score > 40) return 'text-orange-600 bg-orange-50';
    return 'text-emerald-600 bg-emerald-50';
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'buy': return 'text-emerald-600 bg-emerald-50';
      case 'sell': return 'text-red-600 bg-red-50';
      default: return 'text-amber-600 bg-amber-50';
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'buy': return <TrendingUp className="w-5 h-5" />;
      case 'sell': return <TrendingDown className="w-5 h-5" />;
      default: return <Target className="w-5 h-5" />;
    }
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-slate-100 rounded-lg">
          <Shield className="w-5 h-5 text-slate-700" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Portfolio Risk Assessment</h2>
          <p className="text-slate-500 text-sm">AI-powered risk analysis based on market sentiment</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-slate-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-500 text-sm">Overall Sentiment</span>
            <span className={`text-lg font-bold ${
              portfolioImpact.overallSentiment > 0 ? 'text-emerald-600' : 
              portfolioImpact.overallSentiment < 0 ? 'text-red-600' : 'text-amber-600'
            }`}>
              {portfolioImpact.overallSentiment > 0 ? '+' : ''}
              {portfolioImpact.overallSentiment.toFixed(3)}
            </span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${
                portfolioImpact.overallSentiment > 0 ? 'bg-emerald-500' : 'bg-red-500'
              }`}
              style={{ 
                width: `${Math.abs(portfolioImpact.overallSentiment) * 100}%`,
                maxWidth: '100%'
              }}
            />
          </div>
        </div>

        <div className="bg-slate-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-500 text-sm">Risk Score</span>
            <div className="flex items-center gap-2">
              {portfolioImpact.riskScore > 50 && <AlertTriangle className="w-4 h-4 text-orange-500" />}
              <span className={`text-lg font-bold ${getRiskColor(portfolioImpact.riskScore).split(' ')[0]}`}>
                {portfolioImpact.riskScore.toFixed(1)}
              </span>
            </div>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${
                portfolioImpact.riskScore > 70 ? 'bg-red-500' :
                portfolioImpact.riskScore > 40 ? 'bg-orange-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${Math.min(portfolioImpact.riskScore, 100)}%` }}
            />
          </div>
        </div>

        <div className="bg-slate-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-500 text-sm">Confidence</span>
            <span className="text-lg font-bold text-blue-600">
              {(portfolioImpact.confidence * 100).toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${portfolioImpact.confidence * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${getActionColor(portfolioImpact.recommendedAction)}`}>
          {getActionIcon(portfolioImpact.recommendedAction)}
          <span className="font-medium">
            Recommended Action: {portfolioImpact.recommendedAction.toUpperCase()}
          </span>
        </div>
      </div>

      {portfolioImpact.impactedSectors.length > 0 && (
        <div>
          <h3 className="text-base font-semibold text-slate-900 mb-4">Sector Impact Analysis</h3>
          <div className="space-y-3">
            {portfolioImpact.impactedSectors.map((sector, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-slate-900 font-medium">{sector.sector}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    sector.sentiment === 'positive' ? 'bg-emerald-100 text-emerald-700' :
                    sector.sentiment === 'negative' ? 'bg-red-100 text-red-700' :
                    'bg-amber-100 text-amber-700'
                  }`}>
                    {sector.sentiment}
                  </span>
                </div>
                <div className="text-right">
                  <span className={`font-mono text-sm ${
                    sector.impact > 0 ? 'text-emerald-600' : 
                    sector.impact < 0 ? 'text-red-600' : 'text-slate-500'
                  }`}>
                    {sector.impact > 0 ? '+' : ''}{sector.impact.toFixed(3)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};