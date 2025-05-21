import { create } from "zustand"

type AiInsightsStore = {
  insights: {
    featured: {
      title: string
      description: string
      points: string[]
      image: string
    }
    marketTrends: {
      date: string
      bitcoin: number
      ethereum: number
      total: number
    }[]
    sectorPerformance: {
      name: string
      value: number
    }[]
    volatilityIndex: {
      date: string
      value: number
    }[]
    correlationMatrix: {
      name: string
      value: number
    }[]
  }
  recommendations: {
    rebalancing: {
      asset: string
      action: "Buy" | "Sell"
      reason: string
    }[]
    riskScore: number
    riskFactors: {
      name: string
      description: string
      severity: "low" | "medium" | "high"
    }[]
    opportunities: {
      title: string
      description: string
      category: string
      confidence: "Low" | "Medium" | "High"
    }[]
  }
  trendingAssets: {
    top3: {
      name: string
      symbol: string
      price: number
      change: number
      icon: string
      priceHistory: {
        time: string
        price: number
      }[]
    }[]
    all: {
      name: string
      symbol: string
      price: number
      change: number
      icon: string
    }[]
  }
  news: {
    featured: {
      title: string
      summary: string
      image: string
      category: string
      source: {
        name: string
        logo: string
      }
      date: string
    }
    recent: {
      title: string
      image: string
      category: string
      source: {
        name: string
        logo: string
      }
      date: string
    }[]
  }
}

export const useAiInsightsStore = create<AiInsightsStore>(() => ({
  insights: {
    featured: {
      title: "Market Sentiment Shifting Bullish",
      description:
        "AI analysis indicates a positive shift in market sentiment with key indicators pointing to a potential bull run in the next quarter.",
      points: [
        "Institutional investment increasing by 24% in the last month",
        "On-chain metrics showing accumulation patterns similar to previous bull markets",
        "Reduced correlation with traditional markets suggesting crypto-specific momentum",
      ],
      image: "/ai-investment-recommendations.png",
    },
    marketTrends: [
      { date: "Jan", bitcoin: 40000, ethereum: 2800, total: 1.8 },
      { date: "Feb", bitcoin: 38000, ethereum: 2600, total: 1.7 },
      { date: "Mar", bitcoin: 42000, ethereum: 2900, total: 1.9 },
      { date: "Apr", bitcoin: 45000, ethereum: 3100, total: 2.1 },
      { date: "May", bitcoin: 43000, ethereum: 3000, total: 2.0 },
      { date: "Jun", bitcoin: 47000, ethereum: 3300, total: 2.2 },
    ],
    sectorPerformance: [
      { name: "DeFi", value: 15 },
      { name: "NFTs", value: -5 },
      { name: "Layer 1", value: 12 },
      { name: "Layer 2", value: 20 },
      { name: "Gaming", value: 8 },
      { name: "Privacy", value: -2 },
    ],
    volatilityIndex: [
      { date: "Jan", value: 65 },
      { date: "Feb", value: 72 },
      { date: "Mar", value: 58 },
      { date: "Apr", value: 45 },
      { date: "May", value: 50 },
      { date: "Jun", value: 42 },
    ],
    correlationMatrix: [
      { name: "BTC-ETH", value: 45 },
      { name: "BTC-SOL", value: 25 },
      { name: "ETH-SOL", value: 30 },
    ],
  },
  recommendations: {
    rebalancing: [
      {
        asset: "Ethereum (ETH)",
        action: "Buy",
        reason: "Underweight relative to model portfolio",
      },
      {
        asset: "Solana (SOL)",
        action: "Buy",
        reason: "Strong technical indicators",
      },
      {
        asset: "Dogecoin (DOGE)",
        action: "Sell",
        reason: "Overexposed to meme coins",
      },
    ],
    riskScore: 68,
    riskFactors: [
      {
        name: "High Volatility Exposure",
        description: "Your portfolio has 35% allocation to high volatility assets",
        severity: "high",
      },
      {
        name: "Concentration Risk",
        description: "Bitcoin represents 62% of your portfolio",
        severity: "medium",
      },
      {
        name: "Stablecoin Allocation",
        description: "Healthy 15% allocation to stablecoins provides liquidity",
        severity: "low",
      },
    ],
    opportunities: [
      {
        title: "Ethereum Layer 2 Growth",
        description: "Layer 2 solutions on Ethereum showing strong adoption metrics",
        category: "Growth",
        confidence: "High",
      },
      {
        title: "DeFi Yield Opportunities",
        description: "Several DeFi protocols offering sustainable 8-12% APY",
        category: "Yield",
        confidence: "Medium",
      },
      {
        title: "NFT Market Recovery",
        description: "Early signs of recovery in blue-chip NFT collections",
        category: "Speculative",
        confidence: "Low",
      },
    ],
  },
  trendingAssets: {
    top3: [
      {
        name: "Bitcoin",
        symbol: "BTC",
        price: 48235.67,
        change: 3.2,
        icon: "/ethereum-logo.png",
        priceHistory: Array.from({ length: 20 }, (_, i) => ({
          time: `${i}h`,
          price: 47000 + Math.random() * 2000,
        })),
      },
      {
        name: "Ethereum",
        symbol: "ETH",
        price: 3245.89,
        change: 5.7,
        icon: "/ethereum-logo.png",
        priceHistory: Array.from({ length: 20 }, (_, i) => ({
          time: `${i}h`,
          price: 3100 + Math.random() * 300,
        })),
      },
      {
        name: "Solana",
        symbol: "SOL",
        price: 102.45,
        change: -2.3,
        icon: "/abstract-crypto-logo.png",
        priceHistory: Array.from({ length: 20 }, (_, i) => ({
          time: `${i}h`,
          price: 105 - Math.random() * 10,
        })),
      },
    ],
    all: [
      {
        name: "Bitcoin",
        symbol: "BTC",
        price: 48235.67,
        change: 3.2,
        icon: "/ethereum-logo.png",
      },
      {
        name: "Ethereum",
        symbol: "ETH",
        price: 3245.89,
        change: 5.7,
        icon: "/ethereum-logo.png",
      },
      {
        name: "Solana",
        symbol: "SOL",
        price: 102.45,
        change: -2.3,
        icon: "/abstract-crypto-logo.png",
      },
      {
        name: "Cardano",
        symbol: "ADA",
        price: 0.58,
        change: 1.2,
        icon: "/abstract-crypto-logo.png",
      },
      {
        name: "Binance Coin",
        symbol: "BNB",
        price: 312.78,
        change: -0.8,
        icon: "/abstract-crypto-logo.png",
      },
      {
        name: "XRP",
        symbol: "XRP",
        price: 0.52,
        change: 7.3,
        icon: "/abstract-crypto-logo.png",
      },
      {
        name: "Polkadot",
        symbol: "DOT",
        price: 6.89,
        change: 2.1,
        icon: "/abstract-crypto-logo.png",
      },
      {
        name: "Dogecoin",
        symbol: "DOGE",
        price: 0.078,
        change: -4.5,
        icon: "/abstract-crypto-logo.png",
      },
    ],
  },
  news: {
    featured: {
      title: "Central Banks Exploring CBDC Integration with Existing Crypto Infrastructure",
      summary:
        "Multiple central banks are now looking at ways to integrate their CBDC projects with existing cryptocurrency networks, potentially creating hybrid systems.",
      image: "/portfolio-insights.png",
      category: "Regulation",
      source: {
        name: "CryptoNews",
        logo: "/abstract-crypto-logo.png",
      },
      date: "2025-05-09T14:30:00Z",
    },
    recent: [
      {
        title: "Major Retailer Announces Bitcoin Payment Integration",
        image: "/news-collage.png",
        category: "Adoption",
        source: {
          name: "BlockchainTimes",
          logo: "/abstract-crypto-logo.png",
        },
        date: "2025-05-09T10:15:00Z",
      },
      {
        title: "New Ethereum Upgrade Promises 50% Gas Fee Reduction",
        image: "/ethereum-abstract.png",
        category: "Technology",
        source: {
          name: "ETH Daily",
          logo: "/ethereum-logo.png",
        },
        date: "2025-05-08T16:45:00Z",
      },
      {
        title: "DeFi Protocol Suffers $20M Exploit, Funds Partially Recovered",
        image: "/digital-security-abstract.png",
        category: "Security",
        source: {
          name: "DeFi Pulse",
          logo: "/abstract-crypto-logo.png",
        },
        date: "2025-05-08T08:30:00Z",
      },
      {
        title: "Institutional Investors Allocate Record $1.2B to Crypto Funds This Week",
        image: "/investment-growth.png",
        category: "Market",
        source: {
          name: "InvestCrypto",
          logo: "/abstract-crypto-logo.png",
        },
        date: "2025-05-07T14:20:00Z",
      },
    ],
  },
}))
