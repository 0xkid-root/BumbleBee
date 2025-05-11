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
    
    // Mock implementation - in a real app, this would call an AI service
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const recommendation: AIRecommendation = {
      id: `rec-${Date.now()}`,
      title: 'Optimize your subscription payments',
      description: 'Based on your payment patterns, you could save 15% by switching to annual billing.',
      confidence: 0.85,
      category: 'savings'
    }
    
    setIsLoading(false)
    return recommendation
  }

  const analyzeSentiment = async (text: string): Promise<SentimentAnalysis> => {
    setIsLoading(true)
    
    // Mock implementation - in a real app, this would call an AI service
    await new Promise(resolve => setTimeout(resolve, 800))
    
    // Simple sentiment detection based on keywords
    const positiveWords = ['great', 'happy', 'excellent', 'good', 'love', 'best']
    const negativeWords = ['bad', 'poor', 'terrible', 'worst', 'hate', 'awful']
    
    const words = text.toLowerCase().split(/\W+/)
    const positiveCount = words.filter(word => positiveWords.includes(word)).length
    const negativeCount = words.filter(word => negativeWords.includes(word)).length
    
    let sentiment: 'positive' | 'negative' | 'neutral' = 'neutral'
    let score = 0
    
    if (positiveCount > negativeCount) {
      sentiment = 'positive'
      score = Math.min(positiveCount / words.length * 10, 1)
    } else if (negativeCount > positiveCount) {
      sentiment = 'negative'
      score = -Math.min(negativeCount / words.length * 10, 1)
    }
    
    setIsLoading(false)
    return {
      score,
      sentiment,
      keywords: [...words.filter(word => positiveWords.includes(word)), ...words.filter(word => negativeWords.includes(word))]
    }
  }

  return {
    isLoading,
    recommendations,
    getRecommendation,
    analyzeSentiment
  }
}

export default useAI
