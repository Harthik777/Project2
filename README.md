# FinSentiment AI - Financial Market Sentiment Analysis Platform

A production-grade AI-powered platform for financial market sentiment analysis using TensorFlow.js, React, and advanced ML algorithms.

## 🚀 Features

- **Real-time Sentiment Analysis**: Analyze financial news and text using advanced ML models
- **Batch Processing**: Process multiple news items simultaneously
- **Market Dashboard**: Interactive charts and trend visualization
- **Portfolio Risk Assessment**: AI-powered risk analysis and recommendations
- **Responsive Design**: Beautiful, modern UI that works on all devices
- **Production Ready**: Optimized for performance and scalability

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **ML/AI**: TensorFlow.js
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

3. Deploy:
```bash
vercel --prod
```

Or simply connect your GitHub repository to Vercel for automatic deployments.

### Manual Deployment

1. Build the project:
```bash
npm run build
```

2. The `dist` folder contains the production build ready for deployment.

## 🎯 Usage

1. **Sentiment Analysis**: Enter financial news or text to analyze market sentiment
2. **Batch Analysis**: Load sample news or upload multiple items for batch processing
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
├── types/              # TypeScript type definitions
│   └── sentiment.ts
├── App.tsx             # Main application component
└── main.tsx           # Application entry point
```

## 🤖 ML Model

The platform uses a custom sentiment analysis model built with TensorFlow.js that:
- Processes financial text and news headlines
- Classifies sentiment as positive, negative, or neutral
- Provides confidence scores and market impact assessments
- Identifies relevant financial sectors

## 📊 Features Overview

### Sentiment Analysis
- Real-time text analysis
- Confidence scoring
- Market impact assessment
- Sector identification

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
- Vercel for deployment

## 📈 Performance

- Client-side ML inference (no server costs)
- Optimized bundle size
- Fast loading times
- Responsive design
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
- Internship and job applications

---

Built with ❤️ using React, TypeScript, TensorFlow.js, and modern web technologies.