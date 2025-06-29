# FinSentiment AI - Financial Market Sentiment Analysis Platform

A production-grade AI-powered platform for financial market sentiment analysis using TensorFlow.js, React, and **real-time financial news APIs**.

## 🚀 Features

- **Real-time News Integration**: Fetches live financial news from multiple APIs (NewsAPI, Finnhub, Alpha Vantage)
- **Advanced Sentiment Analysis**: Analyze financial news using ML models
- **Batch Processing**: Process multiple news items simultaneously
- **Market Dashboard**: Interactive charts and trend visualization
- **Portfolio Risk Assessment**: AI-powered risk analysis and recommendations
- **Responsive Design**: Beautiful, modern UI that works on all devices
- **Production Ready**: Optimized for performance and scalability

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **ML/AI**: TensorFlow.js
- **News APIs**: NewsAPI, Finnhub, Alpha Vantage
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

3. Configure API keys (see API Setup section below)

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:5173](http://localhost:5173) in your browser.

## 🔑 API Setup

To fetch real financial news, you need to configure API keys from these free services:

### 1. NewsAPI (newsapi.org)
- Sign up at [https://newsapi.org/register](https://newsapi.org/register)
- Get your free API key (100 requests/day)
- Add to `.env`: `VITE_NEWS_API_KEY=your_key_here`

### 2. Finnhub (finnhub.io)
- Sign up at [https://finnhub.io/register](https://finnhub.io/register)
- Get your free API key (60 calls/minute)
- Add to `.env`: `VITE_FINNHUB_API_KEY=your_key_here`

### 3. Alpha Vantage (alphavantage.co)
- Sign up at [https://www.alphavantage.co/support/#api-key](https://www.alphavantage.co/support/#api-key)
- Get your free API key (5 calls/minute, 500 calls/day)
- Add to `.env`: `VITE_ALPHA_VANTAGE_API_KEY=your_key_here`

### Environment Setup
1. Copy `.env.example` to `.env`
2. Add your API keys to the `.env` file
3. Restart the development server

**Note**: The app will work with sample data if no API keys are configured, but real-time news requires at least one API key.

## 🚀 Deployment

### Deploy to Vercel

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Add environment variables in Vercel dashboard or via CLI:
```bash
vercel env add VITE_NEWS_API_KEY
vercel env add VITE_FINNHUB_API_KEY
vercel env add VITE_ALPHA_VANTAGE_API_KEY
```

4. Deploy:
```bash
vercel --prod
```

Or simply connect your GitHub repository to Vercel for automatic deployments.

## 🎯 Usage

1. **Live News Analysis**: Click "Load Latest News" to fetch real financial news
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
├── services/           # API services
│   └── newsService.ts  # Real news API integration
├── types/              # TypeScript type definitions
│   └── sentiment.ts
├── App.tsx             # Main application component
└── main.tsx           # Application entry point
```

## 🤖 News Sources

The platform integrates with multiple financial news APIs:

- **NewsAPI**: General financial news from major publications
- **Finnhub**: Stock market and financial news
- **Alpha Vantage**: Market news with sentiment scores

The system automatically:
- Fetches from multiple sources for better coverage
- Removes duplicate articles
- Categorizes news by sector
- Provides fallback to sample data if APIs fail

## 📊 Features Overview

### Real-time News Integration
- Live financial news from multiple APIs
- Automatic deduplication and categorization
- Fallback mechanisms for reliability
- Source attribution and timestamps

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

The project is configured for optimal performance:
- Vite for fast development and building
- TypeScript for type safety
- ESLint for code quality
- Tailwind CSS for styling
- Multiple news API integration
- Vercel for deployment

## 📈 Performance

- Client-side ML inference (no server costs)
- Optimized bundle size with code splitting
- Fast loading times with multiple API sources
- Responsive design for all devices
- Production-ready architecture

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

---

Built with ❤️ using React, TypeScript, TensorFlow.js, and real financial news APIs.