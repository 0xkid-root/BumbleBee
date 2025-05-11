import { useState } from 'react'

export interface AIRecommendation {
  id: string
  title: string
  description: string
  confidence: number
  category: 'portfolio' | 'transaction' | 'savings' | 'security'
}

export interface SentimentAnalysis {
  score: number
  sentiment: 'positive' | 'negative' | 'neutral'
  keywords: string[]
}

export function useAI() {
  const [isLoading, setIsLoading] = useState(false)
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([])

  const getRecommendation = async (context: string): Promise<AIRecommendation> => {
    setIsLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const recommendation: AIRecommendation = {
      id: `rec-${Date.now()}`,
      title: 'Portfolio Diversification',
      description: 'Based on your current holdings, consider diversifying into more stable assets.',
      confidence: 0.85,
      category: 'portfolio'
    }
    
    setRecommendations(prev => [...prev, recommendation])
    setIsLoading(false)
    
    return recommendation
  }

  const analyzeSentiment = async (text: string): Promise<SentimentAnalysis> => {
    setIsLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800))
    
    const analysis: SentimentAnalysis = {
      score: 0.75,
      sentiment: 'positive',
      keywords: ['growth', 'opportunity', 'investment']
    }
    
    setIsLoading(false)
    
    return analysis
  }

  return {
    isLoading,
    recommendations,
    getRecommendation,
    analyzeSentiment
  }
}
