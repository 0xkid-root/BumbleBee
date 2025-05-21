"use client"

import { useState, useEffect, ReactNode } from "react"
import { LineChart, PieChart, TrendingUp, BarChart3, Activity, Wallet, DollarSign, AlertCircle } from "lucide-react"
import { LucideIcon } from "lucide-react"

// Types
interface AnimatedIconProps {
  icon: LucideIcon
  color: string
  delay?: number
}

interface FeatureCardProps {
  title: string
  icon: ReactNode
  description: string
  color: string
  delay: number
}

interface ComingSoonPageProps {
  title: string
  description: string
  icon: ReactNode
  gradientColors: string
  estimatedRelease: string
  features: string[]
  learnMoreUrl: string
}

// Animated Icon component
const AnimatedIcon = ({ icon: Icon, color, delay = 0 }: AnimatedIconProps) => {
  const [animate, setAnimate] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimate(true)
    }, delay)

    return () => clearTimeout(timer)
  }, [delay])

  return (
    <div className={`transition-all duration-1000 transform ${animate ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
      <div className={`p-2 rounded-full ${color} shadow-lg`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
    </div>
  )
}

// Feature Card component with animation
const FeatureCard = ({ title, icon, description, color, delay }: FeatureCardProps) => {
  const [animate, setAnimate] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimate(true)
    }, delay)

    return () => clearTimeout(timer)
  }, [delay])

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 transition-all duration-700 ${animate ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
      <div className="flex items-center mb-3">
        <div className={`mr-3 ${color} p-2 rounded-full`}>
          {icon}
        </div>
        <h3 className="font-semibold text-lg">{title}</h3>
      </div>
      <p className="text-gray-600 dark:text-gray-300 text-sm">{description}</p>
    </div>
  )
}

// Coming Soon component with enhanced accessibility and animations
export const ComingSoonPage = ({
  title,
  description,
  icon,
  gradientColors,
  estimatedRelease,
  features,
  learnMoreUrl
}: ComingSoonPageProps) => {
  const [showNotification, setShowNotification] = useState(false)

  // Notify users when they subscribe
  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    setShowNotification(true)
    setTimeout(() => setShowNotification(false), 3000)
  }

  // Feature icons and colors for the cards
  const featureIcons = [
    { icon: <Activity className="h-5 w-5 text-white" />, color: "bg-blue-500" },
    { icon: <PieChart className="h-5 w-5 text-white" />, color: "bg-purple-500" },
    { icon: <TrendingUp className="h-5 w-5 text-white" />, color: "bg-green-500" },
    { icon: <BarChart3 className="h-5 w-5 text-white" />, color: "bg-yellow-500" },
    { icon: <Wallet className="h-5 w-5 text-white" />, color: "bg-indigo-500" },
    { icon: <DollarSign className="h-5 w-5 text-white" />, color: "bg-red-500" },
    { icon: <AlertCircle className="h-5 w-5 text-white" />, color: "bg-pink-500" },
    { icon: <LineChart className="h-5 w-5 text-white" />, color: "bg-teal-500" }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 md:p-8">
      {/* Notification */}
      {showNotification && (
        <div className="fixed top-4 right-4 bg-green-500 text-white p-4 rounded-md shadow-lg z-50 animate-bounce">
          Thanks for subscribing! We'll notify you when the Portfolio feature launches.
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        {/* Header section */}
        <div className={`${gradientColors} rounded-xl p-6 md:p-10 mb-10 shadow-lg text-white relative overflow-hidden`}>
          <div className="absolute -top-10 -right-10 opacity-10">
            <LineChart className="w-40 h-40" />
          </div>
          
          <div className="flex items-center mb-4">
            <div className="bg-white bg-opacity-20 p-3 rounded-full mr-4">
              {icon}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold">{title}</h1>
          </div>
          
          <p className="text-xl mb-4 max-w-xl">{description}</p>
          
          <div className="flex flex-wrap items-center">
            <div className="bg-white bg-opacity-20 py-1 px-3 rounded-full mr-3 mb-2">
              <p className="text-sm">Estimated Release: {estimatedRelease}</p>
            </div>
            
            <a 
              href={learnMoreUrl}
              className="bg-white text-green-600 py-1 px-4 rounded-full hover:bg-opacity-90 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 mb-2"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Learn more about Portfolio feature"
            >
              Learn More
            </a>
          </div>
          
          {/* Animated icons */}
          <div className="absolute bottom-6 right-6 flex space-x-3">
            <AnimatedIcon icon={LineChart} color="bg-green-400" delay={0} />
            <AnimatedIcon icon={PieChart} color="bg-blue-400" delay={200} />
            <AnimatedIcon icon={BarChart3} color="bg-purple-400" delay={400} />
            <AnimatedIcon icon={TrendingUp} color="bg-yellow-400" delay={600} />
          </div>
        </div>

        {/* Features section */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">Upcoming Features</h2>
          <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature: string, index: number) => (
              <FeatureCard
                key={index}
                title={feature.split(':')[0] || feature}
                description={feature.split(':')[1] || ""}
                icon={featureIcons[index % featureIcons.length].icon}
                color={featureIcons[index % featureIcons.length].color}
                delay={index * 100}
              />
            ))}
          </div>
        </div>

        {/* Newsletter subscription */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Get notified when Portfolio launches</h2>
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
            <label htmlFor="email" className="sr-only">Email address</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              className="flex-grow p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              required
              aria-label="Email address"
            />
            <button
              type="submit"
              className={`${gradientColors} text-white px-6 py-3 rounded-md hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50`}
              aria-label="Subscribe for updates"
            >
              Notify Me
            </button>
          </form>
          <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
            We'll send you updates about the Portfolio feature. No spam, we promise!
          </p>
        </div>
      </div>
    </div>
  )
}

export default function PortfolioPage() {
  return (
    <ComingSoonPage
      title="Portfolio"
      description="Track, analyze, and optimize your crypto portfolio with advanced analytics and insights."
      icon={<LineChart className="h-8 w-8" />}
      gradientColors="bg-gradient-to-r from-green-500 to-green-600"
      estimatedRelease="Q3 2024"
      features={[
        "Real-time tracking: Monitor your assets across multiple chains and exchanges",
        "Advanced analytics: Customize metrics to match your investment strategy",
        "Asset allocation: Visualize your portfolio distribution with interactive charts",
        "Performance history: Generate detailed reports of your investment journey",
        "Tax reporting: Simplify tax season with transaction history exports",
        "Risk assessment: Get personalized diversification recommendations",
        "Benchmark comparisons: See how your portfolio performs against market indices",
        "Smart alerts: Receive notifications for significant price movements"
      ]}
      learnMoreUrl="https://docs.bumblebee.finance/portfolio"
    />
  )
}