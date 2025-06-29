import { NewsItem } from '../types/sentiment';

// Financial news API configuration
const NEWS_APIS = {
  // Alpha Vantage News API (free tier available)
  ALPHA_VANTAGE: {
    baseUrl: 'https://www.alphavantage.co/query',
    apiKey: import.meta.env.VITE_ALPHA_VANTAGE_API_KEY || 'demo'
  },
  // NewsAPI (free tier available)
  NEWS_API: {
    baseUrl: 'https://newsapi.org/v2/everything',
    apiKey: import.meta.env.VITE_NEWS_API_KEY || ''
  },
  // Finnhub (free tier available)
  FINNHUB: {
    baseUrl: 'https://finnhub.io/api/v1/news',
    apiKey: import.meta.env.VITE_FINNHUB_API_KEY || ''
  }
};

export interface NewsApiResponse {
  articles: Array<{
    title: string;
    description: string;
    url: string;
    urlToImage: string;
    publishedAt: string;
    source: {
      name: string;
    };
  }>;
  totalResults: number;
}

export interface AlphaVantageNewsResponse {
  feed: Array<{
    title: string;
    url: string;
    time_published: string;
    authors: string[];
    summary: string;
    source: string;
    category_within_source: string;
    topics: Array<{
      topic: string;
      relevance_score: string;
    }>;
  }>;
}

export interface FinnhubNewsResponse extends Array<{
  category: string;
  datetime: number;
  headline: string;
  id: number;
  image: string;
  related: string;
  source: string;
  summary: string;
  url: string;
}> {}

class NewsService {
  private async fetchWithTimeout(url: string, options: RequestInit = {}, timeout = 10000): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  async fetchFromNewsAPI(query: string = 'financial markets', pageSize: number = 20): Promise<NewsItem[]> {
    if (!NEWS_APIS.NEWS_API.apiKey) {
      throw new Error('NewsAPI key not configured');
    }

    const params = new URLSearchParams({
      q: `${query} AND (stocks OR market OR finance OR economy)`,
      language: 'en',
      sortBy: 'publishedAt',
      pageSize: pageSize.toString(),
      apiKey: NEWS_APIS.NEWS_API.apiKey
    });

    try {
      const response = await this.fetchWithTimeout(`${NEWS_APIS.NEWS_API.baseUrl}?${params}`);
      
      if (!response.ok) {
        throw new Error(`NewsAPI error: ${response.status} ${response.statusText}`);
      }

      const data: NewsApiResponse = await response.json();
      
      return data.articles.map((article, index) => ({
        id: `newsapi-${index}-${Date.now()}`,
        headline: article.title,
        source: article.source.name,
        timestamp: new Date(article.publishedAt),
        category: this.categorizeNews(article.title + ' ' + (article.description || '')),
        url: article.url,
        description: article.description,
        imageUrl: article.urlToImage
      }));
    } catch (error) {
      console.error('NewsAPI fetch error:', error);
      throw new Error('Failed to fetch news from NewsAPI');
    }
  }

  async fetchFromAlphaVantage(topics: string = 'financial_markets', limit: number = 20): Promise<NewsItem[]> {
    const params = new URLSearchParams({
      function: 'NEWS_SENTIMENT',
      topics: topics,
      limit: limit.toString(),
      apikey: NEWS_APIS.ALPHA_VANTAGE.apiKey
    });

    try {
      const response = await this.fetchWithTimeout(`${NEWS_APIS.ALPHA_VANTAGE.baseUrl}?${params}`);
      
      if (!response.ok) {
        throw new Error(`Alpha Vantage error: ${response.status} ${response.statusText}`);
      }

      const data: AlphaVantageNewsResponse = await response.json();
      
      if (!data.feed) {
        throw new Error('Invalid Alpha Vantage response format');
      }

      return data.feed.map((article, index) => ({
        id: `alphavantage-${index}-${Date.now()}`,
        headline: article.title,
        source: article.source,
        timestamp: new Date(article.time_published),
        category: article.category_within_source || this.categorizeNews(article.title),
        url: article.url,
        description: article.summary,
        topics: article.topics?.map(t => t.topic) || []
      }));
    } catch (error) {
      console.error('Alpha Vantage fetch error:', error);
      throw new Error('Failed to fetch news from Alpha Vantage');
    }
  }

  async fetchFromFinnhub(category: string = 'general'): Promise<NewsItem[]> {
    if (!NEWS_APIS.FINNHUB.apiKey) {
      throw new Error('Finnhub API key not configured');
    }

    const params = new URLSearchParams({
      category: category,
      token: NEWS_APIS.FINNHUB.apiKey
    });

    try {
      const response = await this.fetchWithTimeout(`${NEWS_APIS.FINNHUB.baseUrl}?${params}`);
      
      if (!response.ok) {
        throw new Error(`Finnhub error: ${response.status} ${response.statusText}`);
      }

      const data: FinnhubNewsResponse = await response.json();
      
      return data.map((article, index) => ({
        id: `finnhub-${article.id || index}`,
        headline: article.headline,
        source: article.source,
        timestamp: new Date(article.datetime * 1000),
        category: article.category || this.categorizeNews(article.headline),
        url: article.url,
        description: article.summary,
        imageUrl: article.image
      }));
    } catch (error) {
      console.error('Finnhub fetch error:', error);
      throw new Error('Failed to fetch news from Finnhub');
    }
  }

  async fetchLatestFinancialNews(limit: number = 20): Promise<NewsItem[]> {
    const errors: string[] = [];
    let allNews: NewsItem[] = [];

    // Try multiple sources for better coverage
    const fetchPromises = [
      this.tryFetchFromSource('Alpha Vantage', () => this.fetchFromAlphaVantage('financial_markets', Math.ceil(limit / 2))),
      this.tryFetchFromSource('NewsAPI', () => this.fetchFromNewsAPI('financial markets', Math.ceil(limit / 2))),
      this.tryFetchFromSource('Finnhub', () => this.fetchFromFinnhub('general'))
    ];

    const results = await Promise.allSettled(fetchPromises);
    
    results.forEach((result, index) => {
      if (result.status === 'fulfilled' && result.value.success) {
        allNews = [...allNews, ...result.value.data];
      } else if (result.status === 'rejected' || !result.value.success) {
        const error = result.status === 'rejected' ? result.reason : result.value.error;
        errors.push(error);
      }
    });

    if (allNews.length === 0) {
      throw new Error(`All news sources failed: ${errors.join(', ')}`);
    }

    // Remove duplicates and sort by timestamp
    const uniqueNews = this.removeDuplicates(allNews);
    const sortedNews = uniqueNews
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);

    return sortedNews;
  }

  private async tryFetchFromSource(
    sourceName: string, 
    fetchFn: () => Promise<NewsItem[]>
  ): Promise<{ success: boolean; data: NewsItem[]; error?: string }> {
    try {
      const data = await fetchFn();
      console.log(`✅ Successfully fetched ${data.length} articles from ${sourceName}`);
      return { success: true, data };
    } catch (error) {
      const errorMessage = `${sourceName}: ${error instanceof Error ? error.message : 'Unknown error'}`;
      console.warn(`⚠️ ${errorMessage}`);
      return { success: false, data: [], error: errorMessage };
    }
  }

  private removeDuplicates(news: NewsItem[]): NewsItem[] {
    const seen = new Set<string>();
    return news.filter(item => {
      const key = item.headline.toLowerCase().replace(/[^\w\s]/g, '').trim();
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }

  private categorizeNews(text: string): string {
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('tech') || lowerText.includes('ai') || lowerText.includes('software')) {
      return 'Technology';
    } else if (lowerText.includes('bank') || lowerText.includes('finance') || lowerText.includes('credit')) {
      return 'Finance';
    } else if (lowerText.includes('health') || lowerText.includes('pharma') || lowerText.includes('medical')) {
      return 'Healthcare';
    } else if (lowerText.includes('oil') || lowerText.includes('energy') || lowerText.includes('gas')) {
      return 'Energy';
    } else if (lowerText.includes('consumer') || lowerText.includes('retail')) {
      return 'Consumer';
    } else if (lowerText.includes('real estate') || lowerText.includes('property')) {
      return 'Real Estate';
    } else {
      return 'General';
    }
  }

  // Check if any API keys are configured
  isConfigured(): { configured: boolean; availableServices: string[]; missingServices: string[] } {
    const services = [
      { name: 'Alpha Vantage', key: NEWS_APIS.ALPHA_VANTAGE.apiKey, required: false },
      { name: 'NewsAPI', key: NEWS_APIS.NEWS_API.apiKey, required: true },
      { name: 'Finnhub', key: NEWS_APIS.FINNHUB.apiKey, required: true }
    ];

    const availableServices = services.filter(s => s.key && s.key !== 'demo').map(s => s.name);
    const missingServices = services.filter(s => s.required && (!s.key || s.key === 'demo')).map(s => s.name);

    return {
      configured: availableServices.length > 0,
      availableServices,
      missingServices
    };
  }
}

export const newsService = new NewsService();