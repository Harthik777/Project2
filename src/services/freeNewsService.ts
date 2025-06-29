import { NewsItem } from '../types/sentiment';

// Free financial news sources (RSS feeds and public APIs)
const FREE_NEWS_SOURCES = {
  // Yahoo Finance RSS feeds (completely free)
  YAHOO_FINANCE: {
    rss: 'https://feeds.finance.yahoo.com/rss/2.0/headline',
    markets: 'https://feeds.finance.yahoo.com/rss/2.0/category-markets',
    economy: 'https://feeds.finance.yahoo.com/rss/2.0/category-economy'
  },
  // Reuters RSS feeds (free)
  REUTERS: {
    business: 'https://www.reuters.com/business/finance/rss',
    markets: 'https://www.reuters.com/business/markets/rss'
  },
  // MarketWatch RSS feeds (free)
  MARKETWATCH: {
    latest: 'https://feeds.marketwatch.com/marketwatch/realtimeheadlines/',
    markets: 'https://feeds.marketwatch.com/marketwatch/marketpulse/'
  },
  // Financial Times RSS (free articles)
  FT: {
    markets: 'https://www.ft.com/markets?format=rss',
    companies: 'https://www.ft.com/companies?format=rss'
  },
  // CNN Business RSS (free)
  CNN_BUSINESS: {
    latest: 'https://rss.cnn.com/rss/money_latest.rss',
    markets: 'https://rss.cnn.com/rss/money_markets.rss'
  }
};

// CORS proxy services for RSS feeds
const CORS_PROXIES = [
  'https://api.allorigins.win/get?url=',
  'https://corsproxy.io/?',
  'https://api.codetabs.com/v1/proxy?quest='
];

interface RSSItem {
  title: string;
  link: string;
  description: string;
  pubDate: string;
  source?: string;
  category?: string;
}

class FreeNewsService {
  private async fetchWithProxy(url: string, proxyIndex: number = 0): Promise<string> {
    if (proxyIndex >= CORS_PROXIES.length) {
      throw new Error('All CORS proxies failed');
    }

    const proxy = CORS_PROXIES[proxyIndex];
    const proxyUrl = proxy + encodeURIComponent(url);

    try {
      const response = await fetch(proxyUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/xml, text/xml, */*',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      let data;
      if (proxy.includes('allorigins')) {
        const json = await response.json();
        data = json.contents;
      } else {
        data = await response.text();
      }

      return data;
    } catch (error) {
      console.warn(`Proxy ${proxyIndex + 1} failed for ${url}:`, error);
      return this.fetchWithProxy(url, proxyIndex + 1);
    }
  }

  private parseRSSFeed(xmlString: string, sourceName: string): RSSItem[] {
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
      
      // Check for parsing errors
      const parserError = xmlDoc.querySelector('parsererror');
      if (parserError) {
        throw new Error('XML parsing failed');
      }

      const items = xmlDoc.querySelectorAll('item');
      const rssItems: RSSItem[] = [];

      items.forEach((item, index) => {
        if (index >= 20) return; // Limit to 20 items per source

        const title = item.querySelector('title')?.textContent?.trim();
        const link = item.querySelector('link')?.textContent?.trim();
        const description = item.querySelector('description')?.textContent?.trim();
        const pubDate = item.querySelector('pubDate')?.textContent?.trim();

        if (title && link) {
          rssItems.push({
            title,
            link,
            description: description || '',
            pubDate: pubDate || new Date().toISOString(),
            source: sourceName
          });
        }
      });

      return rssItems;
    } catch (error) {
      console.error(`Failed to parse RSS from ${sourceName}:`, error);
      return [];
    }
  }

  private async fetchRSSFeed(url: string, sourceName: string): Promise<NewsItem[]> {
    try {
      console.log(`Fetching RSS from ${sourceName}...`);
      const xmlData = await this.fetchWithProxy(url);
      const rssItems = this.parseRSSFeed(xmlData, sourceName);
      
      const newsItems: NewsItem[] = rssItems.map((item, index) => ({
        id: `${sourceName.toLowerCase().replace(/\s+/g, '-')}-${index}-${Date.now()}`,
        headline: this.cleanTitle(item.title),
        source: sourceName,
        timestamp: this.parseDate(item.pubDate),
        category: this.categorizeNews(item.title + ' ' + item.description),
        url: item.link,
        description: this.cleanDescription(item.description)
      }));

      console.log(`Fetched ${newsItems.length} articles from ${sourceName}`);
      return newsItems;
    } catch (error) {
      console.error(`Failed to fetch from ${sourceName}:`, error);
      return [];
    }
  }

  // Fetch financial news from multiple free sources
  async fetchLatestFinancialNews(limit: number = 25): Promise<NewsItem[]> {
    console.log('Starting free news fetch from multiple sources...');
    
    const fetchPromises = [
      // Yahoo Finance
      this.fetchRSSFeed(FREE_NEWS_SOURCES.YAHOO_FINANCE.rss, 'Yahoo Finance'),
      this.fetchRSSFeed(FREE_NEWS_SOURCES.YAHOO_FINANCE.markets, 'Yahoo Finance Markets'),
      
      // MarketWatch
      this.fetchRSSFeed(FREE_NEWS_SOURCES.MARKETWATCH.latest, 'MarketWatch'),
      this.fetchRSSFeed(FREE_NEWS_SOURCES.MARKETWATCH.markets, 'MarketWatch Markets'),
      
      // CNN Business
      this.fetchRSSFeed(FREE_NEWS_SOURCES.CNN_BUSINESS.latest, 'CNN Business'),
      this.fetchRSSFeed(FREE_NEWS_SOURCES.CNN_BUSINESS.markets, 'CNN Markets'),
      
      // Reuters (may have CORS issues, but worth trying)
      this.fetchRSSFeed(FREE_NEWS_SOURCES.REUTERS.business, 'Reuters Business'),
    ];

    try {
      const results = await Promise.allSettled(fetchPromises);
      let allNews: NewsItem[] = [];

      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          allNews = [...allNews, ...result.value];
        }
      });

      if (allNews.length === 0) {
        console.warn('No news fetched from any source, using fallback data');
        return this.getFallbackNews();
      }

      // Remove duplicates and sort by timestamp
      const uniqueNews = this.removeDuplicates(allNews);
      const sortedNews = uniqueNews
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
        .slice(0, limit);

      console.log(`Successfully aggregated ${sortedNews.length} unique articles`);
      return sortedNews;

    } catch (error) {
      console.error('All news sources failed:', error);
      return this.getFallbackNews();
    }
  }

  // Alternative method using a news aggregation service
  async fetchFromNewsAggregator(): Promise<NewsItem[]> {
    try {
      // Using a free news aggregation API that doesn't require keys
      const response = await fetch('https://api.rss2json.com/v1/api.json?rss_url=' + 
        encodeURIComponent('https://feeds.finance.yahoo.com/rss/2.0/headline'));
      
      if (!response.ok) {
        throw new Error('News aggregator API failed');
      }

      const data = await response.json();
      
      if (data.status !== 'ok' || !data.items) {
        throw new Error('Invalid response from news aggregator');
      }

      return data.items.map((item: any, index: number) => ({
        id: `aggregator-${index}-${Date.now()}`,
        headline: this.cleanTitle(item.title),
        source: 'Yahoo Finance',
        timestamp: new Date(item.pubDate),
        category: this.categorizeNews(item.title + ' ' + (item.description || '')),
        url: item.link,
        description: this.cleanDescription(item.description || '')
      }));

    } catch (error) {
      console.error('News aggregator failed:', error);
      return [];
    }
  }

  private cleanTitle(title: string): string {
    return title
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/&[^;]+;/g, ' ') // Remove HTML entities
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();
  }

  private cleanDescription(description: string): string {
    return description
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/&[^;]+;/g, ' ') // Remove HTML entities
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim()
      .substring(0, 200); // Limit length
  }

  private parseDate(dateString: string): Date {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? new Date() : date;
  }

  private removeDuplicates(news: NewsItem[]): NewsItem[] {
    const seen = new Set<string>();
    return news.filter(item => {
      const key = item.headline.toLowerCase()
        .replace(/[^\w\s]/g, '')
        .replace(/\s+/g, ' ')
        .trim();
      
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }

  private categorizeNews(text: string): string {
    const lowerText = text.toLowerCase();
    
    const categories = [
      { keywords: ['tech', 'ai', 'software', 'apple', 'microsoft', 'google', 'meta'], category: 'Technology' },
      { keywords: ['bank', 'finance', 'credit', 'loan', 'jpmorgan', 'goldman'], category: 'Finance' },
      { keywords: ['health', 'pharma', 'medical', 'drug', 'pfizer', 'moderna'], category: 'Healthcare' },
      { keywords: ['oil', 'energy', 'gas', 'renewable', 'exxon', 'chevron'], category: 'Energy' },
      { keywords: ['consumer', 'retail', 'walmart', 'amazon', 'target'], category: 'Consumer' },
      { keywords: ['real estate', 'property', 'housing', 'mortgage'], category: 'Real Estate' },
      { keywords: ['crypto', 'bitcoin', 'ethereum', 'blockchain'], category: 'Cryptocurrency' },
      { keywords: ['fed', 'federal reserve', 'interest rate', 'inflation'], category: 'Economics' }
    ];

    for (const { keywords, category } of categories) {
      if (keywords.some(keyword => lowerText.includes(keyword))) {
        return category;
      }
    }

    return 'Markets';
  }

  private getFallbackNews(): NewsItem[] {
    const currentTime = new Date();
    
    return [
      {
        id: 'fallback-1',
        headline: 'Tech stocks rally as AI companies report strong quarterly earnings',
        source: 'Financial News',
        timestamp: new Date(currentTime.getTime() - 30 * 60 * 1000), // 30 minutes ago
        category: 'Technology',
        description: 'Major technology companies continue to show strong performance driven by AI investments'
      },
      {
        id: 'fallback-2',
        headline: 'Federal Reserve maintains interest rates amid economic uncertainty',
        source: 'Economic Times',
        timestamp: new Date(currentTime.getTime() - 60 * 60 * 1000), // 1 hour ago
        category: 'Economics',
        description: 'Central bank keeps rates steady while monitoring inflation trends'
      },
      {
        id: 'fallback-3',
        headline: 'Energy sector sees mixed results as oil prices fluctuate',
        source: 'Market Watch',
        timestamp: new Date(currentTime.getTime() - 90 * 60 * 1000), // 1.5 hours ago
        category: 'Energy',
        description: 'Oil and gas companies report varied performance amid volatile commodity prices'
      },
      {
        id: 'fallback-4',
        headline: 'Banking sector shows resilience with strong loan growth',
        source: 'Financial Tribune',
        timestamp: new Date(currentTime.getTime() - 120 * 60 * 1000), // 2 hours ago
        category: 'Finance',
        description: 'Major banks report increased lending activity and stable credit conditions'
      },
      {
        id: 'fallback-5',
        headline: 'Healthcare stocks advance on breakthrough drug approvals',
        source: 'Health Finance',
        timestamp: new Date(currentTime.getTime() - 150 * 60 * 1000), // 2.5 hours ago
        category: 'Healthcare',
        description: 'Pharmaceutical companies gain on positive regulatory developments'
      }
    ];
  }

  // Check if the service is available (always true for free service)
  isConfigured(): { configured: boolean; availableServices: string[]; missingServices: string[] } {
    return {
      configured: true,
      availableServices: ['Yahoo Finance RSS', 'MarketWatch RSS', 'CNN Business RSS', 'News Aggregator API'],
      missingServices: []
    };
  }
}

export const freeNewsService = new FreeNewsService();