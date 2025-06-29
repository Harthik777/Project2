import { useState, useCallback, useRef } from 'react';
import * as tf from '@tensorflow/tfjs';
import { SentimentResult, NewsItem } from '../types/sentiment';

export const useSentimentAnalysis = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [model, setModel] = useState<tf.LayersModel | null>(null);
  const [isModelReady, setIsModelReady] = useState(false);
  const modelRef = useRef<tf.LayersModel | null>(null);

  const initializeModel = useCallback(async () => {
    if (modelRef.current) return modelRef.current;
    
    setIsLoading(true);
    try {
      // Initialize TensorFlow.js
      await tf.ready();
      
      // Create a simple sentiment analysis model
      const model = tf.sequential({
        layers: [
          tf.layers.dense({ inputShape: [100], units: 64, activation: 'relu' }),
          tf.layers.dropout({ rate: 0.3 }),
          tf.layers.dense({ units: 32, activation: 'relu' }),
          tf.layers.dropout({ rate: 0.2 }),
          tf.layers.dense({ units: 3, activation: 'softmax' }) // positive, negative, neutral
        ]
      });

      model.compile({
        optimizer: tf.train.adam(0.001),
        loss: 'categoricalCrossentropy',
        metrics: ['accuracy']
      });

      modelRef.current = model;
      setModel(model);
      setIsModelReady(true);
      return model;
    } catch (error) {
      console.error('Error initializing model:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const analyzeText = useCallback(async (text: string): Promise<SentimentResult> => {
    try {
      if (!modelRef.current) {
        await initializeModel();
      }

      // Simple rule-based sentiment analysis for demo purposes
      // In production, you'd use a pre-trained model or train your own
      const bullishWords = ['growth', 'profit', 'gain', 'bull', 'rise', 'increase', 'positive', 'strong', 'good', 'buy', 'upgrade', 'surge', 'rally'];
      const bearishWords = ['loss', 'decline', 'fall', 'bear', 'drop', 'decrease', 'negative', 'weak', 'bad', 'sell', 'downgrade', 'crash', 'plunge'];
      
      const lowerText = text.toLowerCase();
      let score = 0;
      let wordCount = 0;

      bullishWords.forEach(word => {
        const matches = (lowerText.match(new RegExp(word, 'g')) || []).length;
        score += matches * 0.5;
        wordCount += matches;
      });

      bearishWords.forEach(word => {
        const matches = (lowerText.match(new RegExp(word, 'g')) || []).length;
        score -= matches * 0.5;
        wordCount += matches;
      });

      // Normalize score between -1 and 1
      const normalizedScore = wordCount > 0 ? Math.max(-1, Math.min(1, score / Math.sqrt(wordCount))) : 0;
      
      let sentiment: 'positive' | 'negative' | 'neutral';
      let marketImpact: 'low' | 'medium' | 'high';
      
      if (normalizedScore > 0.3) {
        sentiment = 'positive';
        marketImpact = normalizedScore > 0.7 ? 'high' : 'medium';
      } else if (normalizedScore < -0.3) {
        sentiment = 'negative';
        marketImpact = normalizedScore < -0.7 ? 'high' : 'medium';
      } else {
        sentiment = 'neutral';
        marketImpact = 'low';
      }

      const confidence = Math.abs(normalizedScore) + 0.2; // Add base confidence

      return {
        text,
        sentiment,
        confidence: Math.min(1, confidence),
        score: normalizedScore,
        timestamp: new Date(),
        marketImpact,
        sectors: extractSectors(text)
      };
    } catch (error) {
      console.error('Error analyzing sentiment:', error);
      throw error;
    }
  }, [initializeModel]);

  const analyzeBatch = useCallback(async (newsItems: NewsItem[]): Promise<NewsItem[]> => {
    setIsLoading(true);
    try {
      const results = await Promise.all(
        newsItems.map(async (item) => ({
          ...item,
          sentiment: await analyzeText(item.headline)
        }))
      );
      return results;
    } finally {
      setIsLoading(false);
    }
  }, [analyzeText]);

  return {
    analyzeText,
    analyzeBatch,
    isLoading,
    isModelReady,
    initializeModel
  };
};

function extractSectors(text: string): string[] {
  const sectors = [
    'technology', 'healthcare', 'finance', 'energy', 'consumer', 
    'industrial', 'materials', 'utilities', 'real estate', 'telecom'
  ];
  
  const lowerText = text.toLowerCase();
  return sectors.filter(sector => lowerText.includes(sector));
}