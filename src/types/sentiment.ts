export interface SentimentResult {
  text: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  confidence: number;
  score: number; // -1 to 1, negative is bearish, positive is bullish
  timestamp: Date;
  marketImpact: 'low' | 'medium' | 'high';
  sectors?: string[];
}

export interface PortfolioImpact {
  overallSentiment: number;
  riskScore: number;
  recommendedAction: 'buy' | 'sell' | 'hold';
  confidence: number;
  impactedSectors: Array<{
    sector: string;
    impact: number;
    sentiment: string;
  }>;
}

export interface MarketTrend {
  timestamp: Date;
  sentimentScore: number;
  volume: number;
  volatility: number;
}

export interface NewsItem {
  id: string;
  headline: string;
  source: string;
  timestamp: Date;
  category: string;
  sentiment?: SentimentResult;
  url?: string;
  description?: string;
  imageUrl?: string;
  topics?: string[];
}