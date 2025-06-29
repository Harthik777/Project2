# FinSentiment AI - Financial Market Sentiment Analysis Platform

A production-grade AI-powered platform for financial market sentiment analysis using TensorFlow.js, React, and **real-time financial news from free RSS feeds**.

## 🚀 Features

- **🆓 FREE Real-time News**: Fetches live financial news from RSS feeds (Yahoo Finance, MarketWatch, CNN Business)
- **🤖 Advanced Sentiment Analysis**: Analyze financial news using ML models
- **📊 Batch Processing**: Process multiple news items simultaneously
- **📈 Market Dashboard**: Interactive charts and trend visualization
- **⚖️ Portfolio Risk Assessment**: AI-powered risk analysis and recommendations
- **📱 Responsive Design**: Beautiful, modern UI that works on all devices
- **🚀 Production Ready**: Optimized for performance and scalability
- **🔑 No API Keys Required**: Uses free RSS feeds and public data sources

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **ML/AI**: TensorFlow.js
- **News Sources**: RSS Feeds (Yahoo Finance, MarketWatch, CNN Business, Reuters)
- **Charts**: Chart.js + React Chart.js 2
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Deployment**: Vercel

## 📦 Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd financial-sentiment-analysis-platform
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser.

**That's it! No API keys or configuration required.**

## 🆓 Free News Sources

The platform uses **completely free** RSS feeds from major financial news sources:

### Primary Sources (Always Free)
- **Yahoo Finance RSS** - Latest financial headlines and market news
- **MarketWatch RSS** - Real-time market updates and analysis
- **CNN Business RSS** - Business and financial news
- **Reuters Business RSS** - Global business and financial news

### Backup Sources
- **RSS2JSON API** - Free RSS aggregation service
- **CORS Proxy Services** - Multiple fallback proxies for RSS access
- **Fallback News Data** - High-quality sample data when sources are unavailable

### How It Works
1. **RSS Feed Parsing**: Fetches and parses XML RSS feeds from multiple sources
2. **CORS Proxy**: Uses free proxy services to bypass browser CORS restrictions
3. **Smart Fallbacks**: Automatically switches between sources if one fails
4. **Deduplication**: Removes duplicate articles across sources
5. **Real-time Updates**: Fresh news every time you click "Load Latest News"

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy:
```bash
vercel --prod
```

Or simply connect your GitHub repository to Vercel for automatic deployments.

### Other Deployment Options
- **Netlify**: Drag and drop the `dist` folder
- **GitHub Pages**: Enable Pages in repository settings
- **Any Static Host**: Upload the built `dist` folder

## 🎯 Usage

1. **Live News Analysis**: Click "Load Latest News (Free)" to fetch real financial news
2. **Sentiment Analysis**: Analyze individual news items or batch process multiple articles
3. **Market Dashboard**: View sentiment trends and market metrics
4. **Portfolio Risk**: Get AI-powered risk assessments and recommendations

## 🏗️ Project Structure

```
src/
├── components/          # React components
│   ├── SentimentAnalyzer.tsx
│   ├── MarketDashboard.tsx
│   ├── NewsAnalyzer.tsx
│   └── PortfolioRisk.tsx
├── hooks/              # Custom React hooks
│   └── useSentimentAnalysis.ts
├── services/           # News services
│   ├── freeNewsService.ts  # Free RSS news integration
│   └── newsService.ts      # Premium API integration (optional)
├── types/              # TypeScript type definitions
│   └── sentiment.ts
├── App.tsx             # Main application component
└── main.tsx           # Application entry point
```

## 📰 News Sources Details

### RSS Feeds Used
```javascript
// Yahoo Finance - Most reliable
https://feeds.finance.yahoo.com/rss/2.0/headline
https://feeds.finance.yahoo.com/rss/2.0/category-markets

// MarketWatch - High quality financial news
https://feeds.marketwatch.com/marketwatch/realtimeheadlines/
https://feeds.marketwatch.com/marketwatch/marketpulse/

// CNN Business - Broad business coverage
https://rss.cnn.com/rss/money_latest.rss
https://rss.cnn.com/rss/money_markets.rss

// Reuters - Global financial news
https://www.reuters.com/business/finance/rss
```

### CORS Proxy Services
- `api.allorigins.win` - Primary proxy service
- `corsproxy.io` - Backup proxy
- `api.codetabs.com` - Secondary backup

## 🤖 ML Model

The platform uses a custom sentiment analysis model built with TensorFlow.js that:
- Processes financial text and news headlines
- Classifies sentiment as positive, negative, or neutral
- Provides confidence scores and market impact assessments
- Identifies relevant financial sectors

## 📊 Features Overview

### Free Real-time News Integration
- Live financial news from multiple RSS sources
- Automatic deduplication and categorization
- Fallback mechanisms for reliability
- Source attribution and timestamps
- **Zero cost** - no API keys required

### Sentiment Analysis
- ML-powered sentiment classification
- Confidence scoring and market impact assessment
- Sector identification and analysis
- Batch processing capabilities

### Market Dashboard
- Sentiment trend visualization
- Market metrics and statistics
- Real-time charts and graphs
- Historical data analysis

### Portfolio Risk Assessment
- AI-powered risk scoring
- Investment recommendations
- Sector impact analysis
- Confidence-based insights

## 🔧 Configuration

The project works out of the box with no configuration required:
- Vite for fast development and building
- TypeScript for type safety
- ESLint for code quality
- Tailwind CSS for styling
- Free RSS news integration
- Vercel for deployment

## 📈 Performance

- Client-side ML inference (no server costs)
- Optimized bundle size with code splitting
- Fast loading times with multiple RSS sources
- Responsive design for all devices
- Production-ready architecture
- **Completely free to run**

## 🆓 Cost Breakdown

| Component | Cost |
|-----------|------|
| News Data | **FREE** (RSS feeds) |
| ML Processing | **FREE** (Client-side TensorFlow.js) |
| Hosting | **FREE** (Vercel/Netlify free tier) |
| Domain | Optional (~$10/year) |
| **Total** | **$0/month** |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🎯 Perfect for

- Financial analysis portfolios
- ML/AI demonstrations
- React + TypeScript showcases
- Production-grade web applications
- Real-time data processing examples
- Internship and job applications
- **Budget-conscious developers**
- **Students and learners**

## 🔍 Why This Approach?

### Advantages of RSS Feeds
✅ **Completely Free** - No API costs or rate limits  
✅ **Reliable** - RSS is a stable, widely-supported standard  
✅ **Real-time** - News updates as soon as sources publish  
✅ **No Authentication** - No API keys to manage  
✅ **Multiple Sources** - Diversified news coverage  
✅ **Production Ready** - Used by major news aggregators  

### Comparison with Paid APIs
| Feature | RSS Feeds | Paid APIs |
|---------|-----------|-----------|
| Cost | FREE | $50-500/month |
| Rate Limits | None | 100-1000/day |
| Setup | Instant | API key setup |
| Reliability | High | Depends on service |
| News Quality | Excellent | Excellent |

---

Built with ❤️ using React, TypeScript, TensorFlow.js, and **free RSS feeds** for sustainable, cost-effective financial news analysis.