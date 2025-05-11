"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Calendar, ChevronRight, CheckCircle, Zap, Star, ArrowRight, ChevronLeft, Clock, ChevronDown } from "lucide-react"

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, duration: 0.4 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
}

const cardVariants = {
  inactive: { scale: 1 },
  active: { 
    scale: 1.02, 
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
    transition: { duration: 0.4 } 
  },
}

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: { x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.3 } },
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 300 : -300,
    opacity: 0,
    transition: { x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } },
  }),
}

const featureItemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" },
  }),
}

// Roadmap data
type ColorType = 'amber' | 'blue' | 'purple' | 'green'
type Phase = {
  quarter: string
  title: string
  icon: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean }>
  color: ColorType
  timeframe: string
  description: string
  features: { text: string; highlight: boolean }[]
}

const roadmap: Phase[] = [
  {
    quarter: "Q2 2025",
    title: "MVP Launch",
    icon: Zap,
    color: "amber",
    timeframe: "April - June 2025",
    description: "Initial product launch with core subscription and AI features",
    features: [
      { text: "Subscription System: Seamless on-chain payments with ERC-7715.", highlight: true },
      { text: "Social Payment Tabs: Shared expense management for group subscriptions.", highlight: false },
      { text: "AI Smart Wallets: Proactive financial management with real-time monitoring.", highlight: true },
      { text: "Chatbot Assistant: Conversational AI for DeFi guidance.", highlight: false },
    ],
  },
  {
    quarter: "Q3 2025",
    title: "Social & Portfolio Enhancements",
    icon: Star,
    color: "blue",
    timeframe: "July - September 2025",
    description: "Expanding social features and improving portfolio analytics",
    features: [
      { text: "Dynamic Portfolio: AI-driven insights and risk scoring.", highlight: true },
      { text: "Enhanced Social Tabs: Multi-user coordination with auditability.", highlight: false },
      { text: "Social Analytics Dashboard: Track group spending and savings.", highlight: true },
      { text: "Automated DeFi Position Management: Smart yield optimization.", highlight: false },
    ],
  },
  {
    quarter: "Q4 2025",
    title: "Governance & Cross-Chain",
    icon: ArrowRight,
    color: "purple",
    timeframe: "October - December 2025",
    description: "Adding governance capabilities and expanding to new chains",
    features: [
      { text: "DAO Governance: Community-driven decision-making.", highlight: true },
      { text: "Cross-Chain Compatibility: Multi-network operations.", highlight: false },
      { text: "Governance Token: Incentivized participation model.", highlight: true },
      { text: "Layer 2 Integration: Enhanced scalability and reduced fees.", highlight: false },
    ],
  },
  {
    quarter: "Q1 2026",
    title: "Intelligent Financial Planning",
    icon: Calendar,
    color: "green",
    timeframe: "January - March 2026",
    description: "Advanced AI features for personalized financial planning",
    features: [
      { text: "AI Co-Pilot: Goal setting and financial forecasting.", highlight: true },
      { text: "Expanded AI: Enhanced NLP and transaction analysis.", highlight: false },
      { text: "Predictive Analytics: Market trend forecasting for users.", highlight: true },
      { text: "Institutional Integration: B2B solutions for financial partners.", highlight: false },
    ],
  },
]

// Color utilities
type ElementType = 'bg' | 'bgLight' | 'bgDark' | 'bgGradient' | 'text' | 'textDark' | 'border' | 'highlight' | 'shadow'

const getColorClasses = (color: ColorType, element: ElementType): string => {
  const colorMap: Record<ColorType, Record<ElementType, string>> = {
    amber: {
      bg: "bg-amber-500",
      bgLight: "bg-amber-100",
      bgDark: "bg-amber-900/30",
      bgGradient: "bg-gradient-to-br from-amber-400 to-amber-600",
      text: "text-amber-700",
      textDark: "dark:text-amber-300",
      border: "border-amber-200 dark:border-amber-900/30",
      highlight: "bg-amber-50 dark:bg-amber-900/20",
      shadow: "shadow-amber-200 dark:shadow-amber-900/30",
    },
    blue: {
      bg: "bg-blue-500",
      bgLight: "bg-blue-100",
      bgDark: "bg-blue-900/30",
      bgGradient: "bg-gradient-to-br from-blue-400 to-blue-600",
      text: "text-blue-700",
      textDark: "dark:text-blue-300",
      border: "border-blue-200 dark:border-blue-900/30",
      highlight: "bg-blue-50 dark:bg-blue-900/20",
      shadow: "shadow-blue-200 dark:shadow-blue-900/30",
    },
    purple: {
      bg: "bg-purple-500",
      bgLight: "bg-purple-100",
      bgDark: "bg-purple-900/30",
      bgGradient: "bg-gradient-to-br from-purple-400 to-purple-600",
      text: "text-purple-700",
      textDark: "dark:text-purple-300",
      border: "border-purple-200 dark:border-purple-900/30",
      highlight: "bg-purple-50 dark:bg-purple-900/20",
      shadow: "shadow-purple-200 dark:shadow-purple-900/30",
    },
    green: {
      bg: "bg-green-500",
      bgLight: "bg-green-100",
      bgDark: "bg-green-900/30",
      bgGradient: "bg-gradient-to-br from-green-400 to-green-600",
      text: "text-green-700",
      textDark: "dark:text-green-300",
      border: "border-green-200 dark:border-green-900/30",
      highlight: "bg-green-50 dark:bg-green-900/20",
      shadow: "shadow-green-200 dark:shadow-green-900/30",
    },
  }
  return colorMap[color][element]
}

export default function RoadmapSection() {
  const [activePhase, setActivePhase] = useState(0)
  const [direction, setDirection] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [autoPlayInterval, setAutoPlayInterval] = useState<NodeJS.Timeout | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)

  const handlePhaseChange = (newPhase: number) => {
    setDirection(newPhase > activePhase ? 1 : -1)
    setActivePhase(newPhase)
    if (isAutoPlaying) resetAutoPlay()
  }

  const navigatePhase = (direction: number) => {
    setDirection(direction)
    const newPhase = (activePhase + direction + roadmap.length) % roadmap.length
    setActivePhase(newPhase)
    if (isAutoPlaying) resetAutoPlay()
  }

  const setupAutoPlay = () => {
    const interval = setInterval(() => {
      setDirection(1)
      setActivePhase((prev) => (prev + 1) % roadmap.length)
    }, 6000)
    setAutoPlayInterval(interval)
  }

  const resetAutoPlay = () => {
    if (autoPlayInterval) {
      clearInterval(autoPlayInterval)
      setAutoPlayInterval(null)
    }
    if (isAutoPlaying) setupAutoPlay()
  }

  const toggleAutoPlay = () => {
    setIsAutoPlaying((prev) => {
      if (prev && autoPlayInterval) {
        clearInterval(autoPlayInterval)
        setAutoPlayInterval(null)
      } else if (!prev) {
        setupAutoPlay()
      }
      return !prev
    })
  }

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded)
  }

  useEffect(() => {
    if (isAutoPlaying) setupAutoPlay()
    return () => {
      if (autoPlayInterval) clearInterval(autoPlayInterval)
    }
  }, [isAutoPlaying])

  return (
    <section className="py-16 bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center max-w-3xl mx-auto mb-12"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div
            className="w-16 h-16 rounded-full flex items-center justify-center bg-gradient-to-br from-amber-400 to-amber-600 text-white mx-auto mb-5 shadow-lg shadow-amber-200/50 dark:shadow-amber-900/30"
            variants={itemVariants}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path
                d="M12 3L4 9V21H20V9L12 3Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M9 14C9 15.6569 10.3431 17 12 17C13.6569 17 15 15.6569 15 14C15 12.3431 13.6569 11 12 11C10.3431 11 9 12.3431 9 14Z"
                fill="currentColor"
              />
              <path d="M12 3V7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.div>
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-3 text-slate-800 dark:text-slate-100"
            variants={itemVariants}
          >
            Bumblebee <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-500 to-amber-600">Roadmap</span>
          </motion.h2>
          <motion.p
            className="text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto"
            variants={itemVariants}
          >
            Explore our strategic plan to revolutionize DeFi with AI-powered features, 
            social finance capabilities, and cross-chain compatibility.
          </motion.p>
        </motion.div>

        {/* Timeline visualization */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="relative max-w-4xl mx-auto mb-8 hidden md:block"
        >
          <div className="h-1 bg-slate-200 dark:bg-slate-700 rounded-full w-full absolute top-6 left-0"></div>
          <div className="flex justify-between relative">
            {roadmap.map((phase, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="relative flex flex-col items-center"
                onClick={() => handlePhaseChange(index)}
              >
                <motion.div 
                  className={`w-12 h-12 rounded-full z-10 cursor-pointer flex items-center justify-center shadow-md ${
                    activePhase === index ? getColorClasses(phase.color, "bgGradient") : "bg-white dark:bg-slate-800"
                  } ${activePhase === index ? "border-2 border-white dark:border-slate-900" : "border border-slate-200 dark:border-slate-700"}`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  role="button"
                  tabIndex={0}
                  aria-label={`Select ${phase.quarter}`}
                  onKeyDown={(e) => e.key === "Enter" && handlePhaseChange(index)}
                >
                  {React.createElement(phase.icon, {
                    className: `h-5 w-5 ${
                      activePhase === index ? "text-white" : `${getColorClasses(phase.color, "text")} ${getColorClasses(phase.color, "textDark")}`
                    }`,
                    "aria-hidden": true,
                  })}
                </motion.div>
                <div className={`mt-3 text-xs font-semibold ${activePhase === index ? `${getColorClasses(phase.color, "text")} ${getColorClasses(phase.color, "textDark")}` : "text-slate-600 dark:text-slate-400"}`}>{phase.quarter}</div>
                <div className="text-xs text-slate-500 dark:text-slate-500">{phase.title}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Mobile Phase Selector */}
        <motion.nav
          className="mb-6 max-w-3xl mx-auto md:hidden"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          role="tablist"
          aria-label="Roadmap phases"
        >
          <div className="grid grid-cols-2 gap-2">
            {roadmap.map((phase, index) => (
              <motion.button
                key={index}
                onClick={() => handlePhaseChange(index)}
                className={`p-3 rounded-lg text-xs font-medium transition-all border ${
                  activePhase === index
                    ? `${getColorClasses(phase.color, "bgGradient")} border-transparent shadow-lg ${getColorClasses(phase.color, "shadow")}`
                    : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm"
                } focus:outline-none focus:ring-2 focus:ring-amber-500`}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                role="tab"
                aria-selected={activePhase === index}
                aria-controls={`panel-${index}`}
                id={`tab-${index}`}
                tabIndex={0}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`block ${activePhase === index ? "text-white" : `${getColorClasses(phase.color, "text")} ${getColorClasses(phase.color, "textDark")}`}`}
                  >
                    {phase.quarter}
                  </span>
                  {React.createElement(phase.icon, {
                    className: `h-4 w-4 ${activePhase === index ? "text-white" : `${getColorClasses(phase.color, "text")} ${getColorClasses(phase.color, "textDark")}`}`,
                    "aria-hidden": true,
                  })}
                </div>
                <span
                  className={`text-xs ${activePhase === index ? "text-white/90" : "text-slate-600 dark:text-slate-400"}`}
                >
                  {phase.title}
                </span>
              </motion.button>
            ))}
          </div>
        </motion.nav>

        <div className="flex justify-between items-center max-w-3xl mx-auto mb-6">
          <motion.button
            onClick={() => navigatePhase(-1)}
            className="p-3 rounded-full bg-white dark:bg-slate-800 shadow-md hover:shadow-lg transition-shadow focus:outline-none focus:ring-2 focus:ring-amber-500"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Previous phase"
            tabIndex={0}
          >
            <ChevronLeft className="h-5 w-5 text-slate-600 dark:text-slate-300" />
          </motion.button>
          <motion.button
            onClick={toggleAutoPlay}
            className={`px-4 py-2 rounded-full text-xs font-medium transition-all flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-amber-500 ${
              isAutoPlaying
                ? "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                : `${getColorClasses(roadmap[activePhase].color, "bgGradient")} text-white shadow-md ${getColorClasses(roadmap[activePhase].color, "shadow")}`
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label={isAutoPlaying ? "Pause autoplay" : "Resume autoplay"}
            tabIndex={0}
          >
            <Clock className="h-3 w-3" />
            {isAutoPlaying ? "Auto-Advancing" : "Auto-Advance"}
          </motion.button>
          <motion.button
            onClick={() => navigatePhase(1)}
            className="p-3 rounded-full bg-white dark:bg-slate-800 shadow-md hover:shadow-lg transition-shadow focus:outline-none focus:ring-2 focus:ring-amber-500"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Next phase"
            tabIndex={0}
          >
            <ChevronRight className="h-5 w-5 text-slate-600 dark:text-slate-300" />
          </motion.button>
        </div>

        <div className="max-w-3xl mx-auto">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={activePhase}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full"
              role="tabpanel"
              id={`panel-${activePhase}`}
              aria-labelledby={`tab-${activePhase}`}
            >
              <motion.div
                variants={cardVariants}
                initial="inactive"
                animate="active"
                className={`bg-white dark:bg-slate-800 rounded-xl p-5 md:p-6 shadow-xl border ${getColorClasses(roadmap[activePhase].color, "border")}`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-5 gap-4">
                  <div className="flex items-center">
                    <div
                      className={`p-3 rounded-lg mr-4 ${getColorClasses(roadmap[activePhase].color, "bgGradient")} shadow-lg ${getColorClasses(roadmap[activePhase].color, "shadow")}`}
                    >
                      {React.createElement(roadmap[activePhase].icon, {
                        className: "h-6 w-6 text-white",
                        "aria-hidden": true,
                      })}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3
                          className={`text-lg font-bold ${getColorClasses(roadmap[activePhase].color, "text")} ${getColorClasses(roadmap[activePhase].color, "textDark")}`}
                        >
                          {roadmap[activePhase].quarter}
                        </h3>
                        <span
                          className={`inline-block text-xs px-2 py-1 rounded-full ${getColorClasses(roadmap[activePhase].color, "bgGradient")} text-white font-medium shadow-sm ${getColorClasses(roadmap[activePhase].color, "shadow")}`}
                        >
                          Phase {activePhase + 1}
                        </span>
                      </div>
                      <h4 className="text-sm font-medium text-slate-800 dark:text-slate-200 mt-1">
                        {roadmap[activePhase].title}
                      </h4>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                    <Clock className="h-3 w-3" />
                    <span>{roadmap[activePhase].timeframe}</span>
                  </div>
                </div>

                <p className="text-slate-600 dark:text-slate-300 text-sm mb-5 bg-slate-50 dark:bg-slate-700/30 p-3 rounded-lg border border-slate-100 dark:border-slate-700">
                  {roadmap[activePhase].description}
                </p>

                <div className="grid md:grid-cols-2 gap-3">
                  {roadmap[activePhase].features.map((feature, i) => (
                    <motion.div
                      key={i}
                      custom={i}
                      variants={featureItemVariants}
                      initial="hidden"
                      animate="visible"
                      className={`p-4 rounded-lg ${
                        feature.highlight 
                          ? `${getColorClasses(roadmap[activePhase].color, "highlight")} border ${getColorClasses(roadmap[activePhase].color, "border")} shadow-sm` 
                          : "bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700"
                      } flex items-start`}
                    >
                      <CheckCircle
                        className={`h-5 w-5 mt-0.5 mr-3 flex-shrink-0 ${
                          feature.highlight 
                            ? `${getColorClasses(roadmap[activePhase].color, "text")} ${getColorClasses(roadmap[activePhase].color, "textDark")}` 
                            : "text-slate-500 dark:text-slate-400"
                        }`}
                        aria-hidden="true"
                      />
                      <div>
                        <span className={`text-sm ${feature.highlight ? "font-medium" : ""} text-slate-700 dark:text-slate-300`}>
                          {feature.text}
                        </span>
                        {feature.highlight && (
                          <span
                            className={`inline-block mt-2 text-xs font-medium px-2 py-0.5 rounded-full ${getColorClasses(roadmap[activePhase].color, "bgGradient")} text-white shadow-sm`}
                          >
                            Key Feature
                          </span>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex justify-center mt-4 mb-8">
          <div className="flex space-x-2" role="tablist" aria-label="Roadmap progress">
            {roadmap.map((phase, index) => (
              <motion.button
                key={index}
                onClick={() => handlePhaseChange(index)}
                className={`h-2 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                  activePhase === index
                    ? `w-8 ${getColorClasses(phase.color, "bgGradient")}`
                    : "w-2 bg-slate-200 dark:bg-slate-700"
                }`}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                aria-label={`Go to ${phase.quarter}`}
                aria-current={activePhase === index ? "true" : "false"}
                tabIndex={0}
              />
            ))}
          </div>
        </div>

        <motion.div
          className="text-center mt-8"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <div className="flex flex-col items-center gap-6">
            <motion.button
              onClick={toggleExpanded}
              className="flex items-center text-sm text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              tabIndex={0}
            >
              {isExpanded ? "Hide Details" : "View Full Roadmap Details"}
              <ChevronDown className={`h-4 w-4 ml-1 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
            </motion.button>
            
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="w-full max-w-3xl mx-auto bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-700"
                >
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Complete Bumblebee Roadmap</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      Our product development is divided into strategic phases, each building on the previous to create a seamless DeFi experience.
                    </p>
                    <div className="space-y-6 mt-4">
                      {roadmap.map((phase, i) => (
                        <div key={i} className="space-y-2">
                          <div className="flex items-center gap-2">
                            <div className={`p-2 rounded-md ${getColorClasses(phase.color, "bgGradient")}`}>
                              {React.createElement(phase.icon, { className: "h-4 w-4 text-white", "aria-hidden": true })}
                            </div>
                            <h4 className={`font-medium ${getColorClasses(phase.color, "text")} ${getColorClasses(phase.color, "textDark")}`}>
                              {phase.quarter}: {phase.title}
                            </h4>
                          </div>
                          <p className="text-sm text-slate-600 dark:text-slate-400 pl-8">{phase.description}</p>
                          <ul className="list-disc pl-12 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                            {phase.features.map((feature, j) => (
                              <li key={j} className={feature.highlight ? "font-medium" : ""}>
                                {feature.text} {feature.highlight && <span className="text-xs font-medium px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">Priority</span>}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            <motion.a
              href="#join"
              className={`inline-flex items-center ${getColorClasses(roadmap[activePhase].color, "bgGradient")} hover:opacity-90 text-white font-semibold py-3 px-6 rounded-lg transition-all shadow-lg ${getColorClasses(roadmap[activePhase].color, "shadow")}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              tabIndex={0}
            >
              Join Our Journey
              <ChevronRight className="h-4 w-4 ml-2" aria-hidden="true" />
            </motion.a>
            <motion.p
              className="text-xs text-slate-600 dark:text-slate-400"
              variants={itemVariants}
            >
              Stay updated on our latest developments and be first to access new features
            </motion.p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}