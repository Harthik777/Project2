import React, { useState, useEffect } from 'react';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend,
  BarElement
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { TrendingUp, TrendingDown, BarChart3, PieChart, DollarSign } from 'lucide-react';
import { SentimentResult, MarketTrend } from '../types/sentiment';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface MarketDashboardProps {
  sentimentHistory: SentimentResult[];
}

export const MarketDashboard: React.FC<MarketDashboardProps> = ({ sentimentHistory }) => {
  const [trends, setTrends] = useState<MarketTrend[]>([]);
  const [marketMetrics, setMarketMetrics] = useState({
    avgSentiment: 0,
    volatility: 0,
    bullishCount: 0,
    bearishCount: 0,
    neutralCount: 0
  });

  useEffect(() => {
    if (sentimentHistory.length === 0) return;

    // Generate market trends from sentiment history
    const newTrends: MarketTrend[] = sentimentHistory.map((sentiment, index) => ({
      timestamp: sentiment.timestamp,
      sentimentScore: sentiment.score,
      volume: Math.random() * 1000000 + 500000, // Simulated volume
      volatility: Math.abs(sentiment.score) * Math.random() * 0.5
    }));

    setTrends(newTrends);

    // Calculate market metrics
    const avgSentiment = sentimentHistory.reduce((sum, s) => sum + s.score, 0) / sentimentHistory.length;
    const volatility = Math.sqrt(
      sentimentHistory.reduce((sum, s) => sum + Math.pow(s.score - avgSentiment, 2), 0) / sentimentHistory.length
    );

    const counts = sentimentHistory.reduce(
      (acc, s) => {
        acc[s.sentiment + 'Count']++;
        return acc;
      },
      { bullishCount: 0, bearishCount: 0, neutralCount: 0 }
    );

    setMarketMetrics({
      avgSentiment,
      volatility,
      bullishCount: counts.bullishCount,
      bearishCount: counts.bearishCount,
      neutralCount: counts.neutralCount
    });
  }, [sentimentHistory]);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#ffffff'
        }
      },
      title: {
        display: false
      }
    },
    scales: {
      x: {
        ticks: {
          color: '#9ca3af'
        },
        grid: {
          color: '#374151'
        }
      },
      y: {
        ticks: {
          color: '#9ca3af'
        },
        grid: {
          color: '#374151'
        }
      }
    }
  };

  const sentimentChartData = {
    labels: trends.map((_, index) => `T${index + 1}`),
    datasets: [
      {
        label: 'Sentiment Score',
        data: trends.map(t => t.sentimentScore),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4
      }
    ]
  };

  const volumeChartData = {
    labels: ['Bullish', 'Bearish', 'Neutral'],
    datasets: [
      {
        label: 'Count',
        data: [marketMetrics.bullishCount, marketMetrics.bearishCount, marketMetrics.neutralCount],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(245, 158, 11, 0.8)'
        ],
        borderColor: [
          'rgba(34, 197, 94, 1)',
          'rgba(239, 68, 68, 1)',
          'rgba(245, 158, 11, 1)'
        ],
        borderWidth: 1
      }
    ]
  };

  const getMarketStatus = () => {
    if (marketMetrics.avgSentiment > 0.2) return { status: 'Bullish', color: 'text-green-400', icon: TrendingUp };
    if (marketMetrics.avgSentiment < -0.2) return { status: 'Bearish', color: 'text-red-400', icon: TrendingDown };
    return { status: 'Neutral', color: 'text-yellow-400', icon: BarChart3 };
  };

  const marketStatus = getMarketStatus();
  const StatusIcon = marketStatus.icon;

  return (
    <div className="space-y-6">
      {/* Market Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl border border-gray-700/50 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Market Sentiment</p>
              <p className={`text-xl font-bold ${marketStatus.color}`}>
                {marketStatus.status}
              </p>
            </div>
            <StatusIcon className={`w-8 h-8 ${marketStatus.color}`} />
          </div>
          <div className="mt-2">
            <p className="text-gray-500 text-xs">
              Score: {marketMetrics.avgSentiment.toFixed(3)}
            </p>
          </div>
        </div>

        <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl border border-gray-700/50 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Volatility</p>
              <p className="text-xl font-bold text-orange-400">
                {(marketMetrics.volatility * 100).toFixed(1)}%
              </p>
            </div>
            <BarChart3 className="w-8 h-8 text-orange-400" />
          </div>
          <div className="mt-2">
            <p className="text-gray-500 text-xs">
              Risk Level: {marketMetrics.volatility > 0.5 ? 'High' : marketMetrics.volatility > 0.2 ? 'Medium' : 'Low'}
            </p>
          </div>
        </div>

        <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl border border-gray-700/50 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Analyzed</p>
              <p className="text-xl font-bold text-blue-400">
                {sentimentHistory.length}
              </p>
            </div>
            <PieChart className="w-8 h-8 text-blue-400" />
          </div>
          <div className="mt-2">
            <p className="text-gray-500 text-xs">
              News items processed
            </p>
          </div>
        </div>

        <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl border border-gray-700/50 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Confidence</p>
              <p className="text-xl font-bold text-purple-400">
                {sentimentHistory.length > 0 
                  ? (sentimentHistory.reduce((sum, s) => sum + s.confidence, 0) / sentimentHistory.length * 100).toFixed(1)
                  : 0}%
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-purple-400" />
          </div>
          <div className="mt-2">
            <p className="text-gray-500 text-xs">
              Avg analysis confidence
            </p>
          </div>
        </div>
      </div>

      {/* Charts */}
      {trends.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl border border-gray-700/50 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Sentiment Trend</h3>
            <Line data={sentimentChartData} options={chartOptions} />
          </div>

          <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl border border-gray-700/50 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Sentiment Distribution</h3>
            <Bar data={volumeChartData} options={chartOptions} />
          </div>
        </div>
      )}

      {/* Recent Analysis */}
      {sentimentHistory.length > 0 && (
        <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl border border-gray-700/50 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Recent Analysis</h3>
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {sentimentHistory.slice(-5).reverse().map((result, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                <div className="flex-1">
                  <p className="text-white text-sm truncate">{result.text}</p>
                  <p className="text-gray-400 text-xs">
                    {result.timestamp.toLocaleTimeString()}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    result.sentiment === 'positive' ? 'bg-green-500/20 text-green-400' :
                    result.sentiment === 'negative' ? 'bg-red-500/20 text-red-400' :
                    'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {result.sentiment}
                  </span>
                  <span className="text-white font-mono text-sm">
                    {result.score > 0 ? '+' : ''}{result.score.toFixed(3)}
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