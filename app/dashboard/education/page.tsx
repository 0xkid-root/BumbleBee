"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from "framer-motion"
import { Bot, Send, ChevronRight, PlusCircle, X, ThumbsUp, ThumbsDown, RefreshCw, Zap, 
  BookOpen, Award, Download, Paperclip, Sparkles, Moon, Sun, Settings, Brain, 
  Laptop, FileText, Bookmark, Code, Calendar, ChevronDown, Globe, MessageCircle, 
  MousePointer, Star, Lightbulb, BarChart2, Music, Play, Maximize, Minimize } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Progress } from "@/components/ui/progress"
import Particles from "react-particles"
import { loadSlim } from "tsparticles-slim"
import type { Engine } from "tsparticles-engine"

// Animation Variants
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.4, ease: "easeOut" }
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2, ease: "easeIn" }
  }
}

const slideUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
  }
}

const popIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { 
      type: "spring", 
      stiffness: 400, 
      damping: 20 
    }
  }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12
    }
  }
}

const pulseAnimation = {
  scale: [1, 1.02, 1],
  filter: ["brightness(1)", "brightness(1.1)", "brightness(1)"],
  transition: { 
    duration: 2, 
    repeat: Infinity,
    ease: "easeInOut" 
  }
}

const floatAnimation = {
  y: [0, -8, 0],
  transition: {
    duration: 4,
    repeat: Infinity,
    ease: "easeInOut"
  }
}

const glowAnimation = {
  boxShadow: [
    "0 0 5px rgba(74, 109, 255, 0.3)",
    "0 0 20px rgba(74, 109, 255, 0.5)",
    "0 0 5px rgba(74, 109, 255, 0.3)"
  ],
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: "easeInOut"
  }
}

// Sample conversation history
const sampleConversation = [
  {
    id: 1,
    role: "assistant",
    content: "Hello! I'm EduAI, your personal education assistant. I can help you learn about any subject, explain complex concepts, and answer your questions. What would you like to learn about today?",
    timestamp: "2 minutes ago",
    isHighlighted: false
  },
  {
    id: 2,
    role: "user",
    content: "Can you explain what machine learning is in simple terms?",
    timestamp: "1 minute ago",
    isHighlighted: false
  },
  {
    id: 3,
    role: "assistant",
    content: "Machine learning is a way for computers to learn from data without being explicitly programmed for every task. Think of it like teaching a child: instead of giving step-by-step instructions for every situation, you provide examples and let them learn patterns.\n\nFor instance, rather than writing code to identify cats in photos by defining exact rules about whiskers and fur, you'd show a machine learning system thousands of cat pictures and let it figure out the patterns that make a cat a cat.\n\nThe system builds a model based on this training data, and then can make predictions or decisions when it sees new data. The more quality data it learns from, the better its predictions become.\n\nCommon applications include recommendation systems (like on Netflix or Amazon), spam filters, voice assistants like Siri, and self-driving cars.",
    timestamp: "Just now",
    isHighlighted: true
  }
]

// Suggested questions
const suggestedQuestions = [
  { text: "What is artificial intelligence?", icon: <Brain size={14} />, category: "AI" },
  { text: "Explain quantum computing in simple terms", icon: <Laptop size={14} />, category: "Computing" },
  { text: "How does blockchain technology work?", icon: <FileText size={14} />, category: "Technology" },
  { text: "What are the ethical concerns with AI?", icon: <Bookmark size={14} />, category: "Ethics" },
  { text: "Explain the concept of neural networks", icon: <Brain size={14} />, category: "AI" },
  { text: "What is the difference between deep learning and machine learning?", icon: <Brain size={14} />, category: "AI" },
  { text: "How do I start learning to code?", icon: <Code size={14} />, category: "Coding" },
  { text: "Explain the theory of relativity", icon: <Globe size={14} />, category: "Physics" }
]

// Learning paths
const learningPaths = [
  {
    title: "AI Fundamentals",
    description: "Learn the basics of artificial intelligence",
    progress: 30,
    topics: ["Machine Learning Basics", "Neural Networks", "AI Applications"],
    icon: <Brain size={18} />,
    color: "from-blue-500 to-purple-600",
    badgeColor: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    lastActivity: "2 days ago",
    estimatedTime: "4 weeks"
  },
  {
    title: "Data Science Essentials",
    description: "Master the core concepts of data science",
    progress: 65,
    topics: ["Statistics", "Data Visualization", "Predictive Modeling"],
    icon: <FileText size={18} />,
    color: "from-emerald-500 to-teal-600",
    badgeColor: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
    lastActivity: "Yesterday",
    estimatedTime: "6 weeks"
  },
  {
    title: "Blockchain Technology",
    description: "Understand blockchain and its applications",
    progress: 10,
    topics: ["Cryptocurrencies", "Smart Contracts", "Decentralized Apps"],
    icon: <Laptop size={18} />,
    color: "from-amber-500 to-orange-600",
    badgeColor: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
    lastActivity: "5 days ago",
    estimatedTime: "3 weeks"
  },
  {
    title: "Web Development",
    description: "Learn modern web development techniques",
    progress: 42,
    topics: ["HTML/CSS", "JavaScript", "React", "Node.js"],
    icon: <Code size={18} />,
    color: "from-pink-500 to-rose-600",
    badgeColor: "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300",
    lastActivity: "Today",
    estimatedTime: "8 weeks"
  }
]

// Topic categories
const topicCategories = [
  { name: "AI & Machine Learning", icon: <Brain size={18} />, color: "bg-gradient-to-r from-blue-500 to-indigo-600" },
  { name: "Programming", icon: <Code size={18} />, color: "bg-gradient-to-r from-emerald-500 to-teal-600" },
  { name: "Data Science", icon: <BarChart2 size={18} />, color: "bg-gradient-to-r from-violet-500 to-purple-600" },
  { name: "Physics", icon: <Globe size={18} />, color: "bg-gradient-to-r from-amber-500 to-orange-600" },
  { name: "Mathematics", icon: <FileText size={18} />, color: "bg-gradient-to-r from-pink-500 to-rose-600" },
  { name: "Music Theory", icon: <Music size={18} />, color: "bg-gradient-to-r from-cyan-500 to-blue-600" }
]

// Particle background configurations
const particlesOptions = {
  background: {
    color: {
      value: "transparent",
    },
  },
  fpsLimit: 60,
  particles: {
    color: {
      value: "#4f46e5",
    },
    links: {
      color: "#4f46e5",
      distance: 150,
      enable: true,
      opacity: 0.2,
      width: 1,
    },
    move: {
      direction: "none" as "none",
      enable: true,
      outModes: "bounce",
      random: false,
      speed: 0.5,
      straight: false,
    },
    number: {
      density: {
        enable: true,
        area: 800,
      },
      value: 40,
    },
    opacity: {
      value: 0.3,
    },
    shape: {
      type: "circle",
    },
    size: {
      value: { min: 1, max: 3 },
    },
  },
  detectRetina: true,
}

export default function EnhancedEduAIAssistant() {
  const [messages, setMessages] = useState(sampleConversation)
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [activePath, setActivePath] = useState<number | null>(null)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [feedback, setFeedback] = useState<Record<number, 'positive' | 'negative'>>({})
  const [aiSpeed, setAiSpeed] = useState(50)
  const [fullscreen, setFullscreen] = useState(false)
  const [currentTab, setCurrentTab] = useState("paths")
  const [neuralNetworkVisible, setNeuralNetworkVisible] = useState(false)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const mousePosRef = useRef({ x: 0, y: 0 })
  const assistantNameRef = useRef(null)
  
  // Mouse parallax effect
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  
  const followX = useSpring(mouseX, { stiffness: 100, damping: 25 })
  const followY = useSpring(mouseY, { stiffness: 100, damping: 25 })

  const parallaxX = useTransform(followX, [0, 1], [-15, 15])
  const parallaxY = useTransform(followY, [0, 1], [-15, 15])
  
  // Handle mouse movement for parallax effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX / window.innerWidth)
      mouseY.set(e.clientY / window.innerHeight)
      mousePosRef.current = { x: e.clientX, y: e.clientY }
    }
    
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [mouseX, mouseY])
  
  // Handle particles initialization
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine)
  }, [])
  
  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }
  
  useEffect(() => {
    scrollToBottom()
  }, [messages])
  
  // Handle sending a new message
  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!inputValue.trim()) {
      setError("Please enter a message")
      return
    }
    
    setError(null)
    const newUserMessage = {
      id: messages.length + 1,
      role: "user",
      content: inputValue,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isHighlighted: false
    }
    
    setMessages(prev => [...prev, newUserMessage])
    setInputValue("")
    setIsTyping(true)
    
    try {
      // Simulate AI response (replace with actual API call in production)
      setTimeout(() => {
        const updatedMessages = messages.map(msg => ({...msg, isHighlighted: false}))
        const newAssistantMessage = {
          id: updatedMessages.length + 2,
          role: "assistant",
          content: `I'm responding to your question about "${inputValue}". This is a simulated response that would contain educational information related to your query. In a real implementation, this would be powered by an AI model that provides accurate, helpful information on the topic you've asked about.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isHighlighted: true
        }
        
        setMessages([...updatedMessages, newUserMessage, newAssistantMessage])
        setIsTyping(false)
        setNeuralNetworkVisible(true)
        
        setTimeout(() => {
          setNeuralNetworkVisible(false)
        }, 5000)
      }, 3000 - (aiSpeed / 100) * 2000)
    } catch (err) {
      setError("Failed to get response. Please try again.")
      setIsTyping(false)
    }
  }
  
  // Handle clicking a suggested question
  const handleSuggestedQuestion = (question: string) => {
    setInputValue(question)
  }
  
  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle('dark')
  }
  
  // Toggle sidebar
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }
  
  // Toggle fullscreen
  const toggleFullscreen = () => {
    setFullscreen(!fullscreen)
    
    if (!fullscreen) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error("Could not enter fullscreen mode:", err)
      })
    } else if (document.exitFullscreen) {
      document.exitFullscreen().catch(err => {
        console.error("Could not exit fullscreen mode:", err)
      })
    }
  }
  
  // Handle feedback
  const handleFeedback = (messageId: number, isPositive: boolean) => {
    setFeedback(prev => ({
      ...prev,
      [messageId]: isPositive ? 'positive' : 'negative'
    }))
  }
  
  // Download conversation
  const downloadConversation = () => {
    const conversationText = messages.map(msg => 
      `${msg.role === 'assistant' ? 'EduAI' : 'User'} (${msg.timestamp}): ${msg.content}`
    ).join('\n\n')
    
    const blob = new Blob([conversationText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'EduAI_Conversation.txt'
    link.click()
    URL.revokeObjectURL(url)
  }
  
  // Refresh conversation
  const refreshConversation = () => {
    setMessages([sampleConversation[0]])
    setFeedback({})
    setInputValue("")
    setError(null)
    setNeuralNetworkVisible(false)
  }

  return (
    <div className={`flex h-screen ${isDarkMode ? 'dark' : ''} bg-gray-50 dark:bg-gray-900 overflow-hidden ${fullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Particles Background */}
      <div className="absolute inset-0 pointer-events-none opacity-40 dark:opacity-20 transition-opacity duration-700">
        <Particles id="tsparticles" init={particlesInit} options={particlesOptions} />
      </div>
      
      {/* Neural Network Visualization */}
      <AnimatePresence>
        {neuralNetworkVisible && (
          <motion.div 
            className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative w-full max-w-lg h-64">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-xl backdrop-blur-lg" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="grid grid-cols-4 gap-4">
                  {Array.from({ length: 16 }).map((_, i) => (
                    <motion.div 
                      key={i}
                      className="w-8 h-8 rounded-full bg-blue-500/30 dark:bg-blue-400/30 flex items-center justify-center"
                      animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.3, 0.8, 0.3],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.1 % 1,
                        ease: "easeInOut"
                      }}
                    >
                      <motion.div 
                        className="w-2 h-2 rounded-full bg-blue-500 dark:bg-blue-400"
                        animate={{
                          scale: [1, 1.5, 1],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          delay: i * 0.1 % 1,
                          ease: "easeInOut"
                        }}
                      />
                    </motion.div>
                  ))}
                </div>
                <motion.div
                  className="absolute inset-0 flex items-center justify-center text-blue-500 dark:text-blue-400 font-bold text-sm opacity-80"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  Neural Network Processing...
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Sidebar */}
      <AnimatePresence mode="wait">
        {sidebarOpen && (
          <motion.div 
            className="w-80 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 flex flex-col relative overflow-hidden"
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, x: -80, transition: { duration: 0.3 } }}
            variants={fadeIn}
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-500/10 to-purple-600/10 rounded-full filter blur-3xl pointer-events-none dark:opacity-30" />
            <div className="absolute bottom-0 left-0 w-60 h-60 bg-gradient-to-tr from-teal-500/10 to-emerald-600/10 rounded-full filter blur-3xl pointer-events-none dark:opacity-20" />
            
            <div className="p-4 border-b border-gray-200 dark:border-gray-800 z-10">
              <div className="flex items-center gap-3">
                <motion.div 
                  className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center overflow-hidden relative"
                  animate={pulseAnimation}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 to-purple-600/40 animate-spin-slow" />
                  <Sparkles size={20} className="text-white relative z-10" />
                </motion.div>
                <div>
                  <motion.h1 
                    ref={assistantNameRef}
                    className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600"
                    animate={{ 
                      backgroundPosition: ["0% center", "100% center"],
                    }}
                    transition={{ 
                      duration: 8, 
                      repeat: Infinity, 
                      ease: "linear"
                    }}
                    style={{
                      backgroundSize: "200% auto"
                    }}
                  >
                    EduAI Assistant
                  </motion.h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Your personal learning companion</p>
                </div>
              </div>
            </div>
            
            <div className="p-4 z-10">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button 
                  variant="outline" 
                  className="w-full justify-start gap-2 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-800 hover:from-blue-100 hover:to-purple-100 dark:hover:from-blue-900/30 dark:hover:to-purple-900/30 overflow-hidden group relative"
                >
                  <motion.span 
                    className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 1, ease: "easeInOut" }}
                  />
                  <PlusCircle size={16} className="relative z-10" />
                  <span className="relative z-10">New Conversation</span>
                </Button>
              </motion.div>
            </div>
            
            <Tabs 
              defaultValue="paths" 
              className="flex-1 flex flex-col"
              value={currentTab}
              onValueChange={setCurrentTab}
            >
              <TabsList className="grid grid-cols-3 mx-4 rounded-lg bg-gray-100 dark:bg-gray-800 p-1">
                <TabsTrigger value="paths" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 rounded-md data-[state=active]:shadow-sm text-xs">
                  <div className="flex flex-col items-center gap-1">
                    <BookOpen size={14} />
                    <span>Paths</span>
                  </div>
                </TabsTrigger>
                <TabsTrigger value="topics" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 rounded-md data-[state=active]:shadow-sm text-xs">
                  <div className="flex flex-col items-center gap-1">
                    <Globe size={14} />
                    <span>Topics</span>
                  </div>
                </TabsTrigger>
                <TabsTrigger value="history" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 rounded-md data-[state=active]:shadow-sm text-xs">
                  <div className="flex flex-col items-center gap-1">
                    <Calendar size={14} />
                    <span>History</span>
                  </div>
                </TabsTrigger>
              </TabsList>
              
              <ScrollArea className="flex-1 p-4">
                <TabsContent value="paths" className="mt-0 space-y-4">
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-2">
                    <BookOpen size={14} />
                    Continue Learning
                  </div>
                  <motion.div 
                    className="space-y-4"
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                  >
                    {learningPaths.map((path, index) => (
                      <motion.div
                        key={index}
                        variants={popIn}
                        whileHover={{ y: -4, transition: { duration: 0.2 } }}
                        onHoverStart={() => setHoveredCard(index)}
                        onHoverEnd={() => setHoveredCard(null)}
                      >
                        <Card 
                          className={`cursor-pointer transition-all duration-300 ${
                            activePath === index 
                              ? 'ring-2 ring-blue-500 shadow-lg shadow-blue-500/10 dark:shadow-blue-500/5 dark:ring-blue-500/70' 
                              : 'hover:shadow-md'
                          } ${hoveredCard === index ? 'scale-[1.02]' : 'scale-100'} overflow-hidden`}
                          onClick={() => setActivePath(index)}
                        >
                          <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-blue-500/5 dark:from-gray-950/0 dark:to-blue-500/10 pointer-events-none" />
                          <CardHeader className="p-4 pb-2">
                            <div className="flex items-center justify-between">
                              <div className={`p-2 rounded-lg bg-gradient-to-r ${path.color} relative overflow-hidden`}>
                                <div className="absolute inset-0 bg-white/20 dark:bg-white/10 rounded-lg animate-pulse-slow" />
                                <motion.div
                                  animate={hoveredCard === index ? { rotate: [0, 15, 0] } : {}}
                                  transition={{ duration: 0.5 }}
                                  className="text-white relative z-10"
                                >
                                  {path.icon}
                                </motion.div>
                              </div>
                              <Badge variant="outline" className={path.badgeColor}>
                                {path.progress}% Complete
                              </Badge>
                            </div>
                            <CardTitle className="text-base mt-2 flex items-center gap-2">
                              {path.title}
                              {path.progress > 50 && (
                                <motion.div 
                                  animate={{ rotate: [0, 15, 0] }}
                                  transition={{ duration: 1, repeat: Infinity, repeatDelay: 1 }}
                                >
                                  <Star size={12} className="text-amber-500 fill-amber-500" />
                                </motion.div>
                              )}
                            </CardTitle>
                            <CardDescription className="text-xs">{path.description}</CardDescription>
                          </CardHeader>
                          <CardContent className="p-4 pt-0">
                            <div className="relative w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2 mb-3 overflow-hidden">
                              <motion.div 
                                className={`bg-gradient-to-r ${path.color} h-2 rounded-full`}
                                initial={{ width: 0 }}
                                animate={{ width: `${path.progress}%` }}
                                transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                              />
                              {hoveredCard === index && (
                                <motion.div 
                                  className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-blue-500/10 to-purple-500/10"
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 0.3 }}
                                  transition={{ duration: 0.5 }}
                                />
                              )}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              Last Activity: {path.lastActivity} • Estimated: {path.estimatedTime}
                            </div>
                          </CardContent>
                          <CardFooter className="p-4 pt-0 flex justify-between">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-xs hover:bg-blue-50 dark:hover:bg-blue-900/20"
                              onClick={(e) => {
                                e.stopPropagation()
                                // Add topic view logic here
                              }}
                            >
                              View Topics
                              <ChevronRight size={12} className="ml-1" />
                            </Button>
                            {path.progress > 75 && (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <motion.div animate={pulseAnimation}>
                                      <Award size={16} className="text-amber-500" />
                                    </motion.div>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Great Progress! You're almost done!</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            )}
                          </CardFooter>
                        </Card>
                      </motion.div>
                    ))}
                  </motion.div>
                </TabsContent>
                <TabsContent value="topics" className="mt-0 space-y-4">
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-2">
                    <Globe size={14} />
                    Explore Topics
                  </div>
                  <motion.div 
                    className="space-y-3"
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                  >
                    {topicCategories.map((category, index) => (
                      <motion.div
                        key={index}
                        variants={popIn}
                        whileHover={{ scale: 1.02 }}
                      >
                        <Button
                          variant="outline"
                          className={`w-full justify-start gap-3 py-3 ${category.color} text-white hover:text-white hover:opacity-90`}
                          onClick={() => {
                            setInputValue(`Tell me about ${category.name}`)
                          }}
                        >
                          {category.icon}
                          <span>{category.name}</span>
                        </Button>
                      </motion.div>
                    ))}
                  </motion.div>
                </TabsContent>
                <TabsContent value="history" className="mt-0 space-y-4">
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-2">
                    <Calendar size={14} />
                    Conversation History
                  </div>
                  <motion.div 
                    className="space-y-3"
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                  >
                    {messages.filter(msg => msg.role === 'user').map((msg, index) => (
                      <motion.div
                        key={index}
                        variants={popIn}
                        whileHover={{ scale: 1.02 }}
                      >
                        <Button
                          variant="ghost"
                          className="w-full justify-start gap-2 text-left text-xs py-3 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                          onClick={() => setInputValue(msg.content)}
                        >
                          <MessageCircle size={14} />
                          <span className="truncate">{msg.content}</span>
                        </Button>
                      </motion.div>
                    ))}
                  </motion.div>
                </TabsContent>
              </ScrollArea>
            </Tabs>
            <div className="p-4 border-t border-gray-200 dark:border-gray-800 z-10">
              <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
                <DialogTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start gap-2 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                  >
                    <Settings size={16} />
                    Settings
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md bg-white dark:bg-gray-950">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Settings size={18} />
                      Assistant Settings
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Moon size={16} />
                        <Label>Dark Mode</Label>
                      </div>
                      <Switch
                        checked={isDarkMode}
                        onCheckedChange={toggleDarkMode}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Zap size={16} />
                        AI Response Speed
                      </Label>
                      <Slider
                        value={[aiSpeed]}
                        onValueChange={(value) => setAiSpeed(value[0])}
                        max={100}
                        step={1}
                        className="w-full"
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {aiSpeed < 33 ? 'Slow' : aiSpeed < 66 ? 'Medium' : 'Fast'}
                      </p>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col relative">
        <div className="p-4 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm z-10">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="hover:bg-blue-50 dark:hover:bg-blue-900/20"
            >
              <ChevronRight
                size={20}
                className={`transition-transform ${sidebarOpen ? 'rotate-180' : ''}`}
              />
            </Button>
            <div className="flex items-center gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={refreshConversation}
                      className="hover:bg-blue-50 dark:hover:bg-blue-900/20"
                    >
                      <RefreshCw size={18} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Start New Conversation</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={downloadConversation}
                      className="hover:bg-blue-50 dark:hover:bg-blue-900/20"
                    >
                      <Download size={18} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Download Conversation</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={toggleFullscreen}
                      className="hover:bg-blue-50 dark:hover:bg-blue-900/20"
                    >
                      {fullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{fullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>

        <ScrollArea className="flex-1 p-4">
          <motion.div
            className="space-y-4 max-w-3xl mx-auto"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {messages.map((message) => (
              <motion.div
                key={message.id}
                variants={slideUp}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <Card
                  className={`max-w-[80%] relative ${
                    message.isHighlighted
                      ? 'ring-1 ring-blue-500/50 shadow-lg shadow-blue-500/10 dark:shadow-blue-500/5'
                      : ''
                  } ${
                    message.role === 'user'
                      ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800/50'
                      : 'bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800'
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      {message.role === 'assistant' && (
                        <Avatar className="mt-1">
                          <AvatarImage src="/eduai-logo.png" />
                          <AvatarFallback>AI</AvatarFallback>
                        </Avatar>
                      )}
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">
                            {message.role === 'user' ? 'You' : 'EduAI'}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {message.timestamp}
                          </span>
                        </div>
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        {message.role === 'assistant' && (
                          <div className="flex gap-2 mt-3">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleFeedback(message.id, true)}
                                    className={`${
                                      feedback[message.id] === 'positive'
                                        ? 'text-green-500'
                                        : 'text-gray-500 hover:text-green-500'
                                    }`}
                                  >
                                    <ThumbsUp size={16} />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Helpful Response</p>
                                </TooltipContent>
                              </Tooltip>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleFeedback(message.id, false)}
                                    className={`${
                                      feedback[message.id] === 'negative'
                                        ? 'text-red-500'
                                        : 'text-gray-500 hover:text-red-500'
                                    }`}
                                  >
                                    <ThumbsDown size={16} />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Not Helpful</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
            {isTyping && (
              <motion.div
                variants={fadeIn}
                initial="hidden"
                animate="visible"
                className="flex justify-start"
              >
                <Card className="max-w-[80%] bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800">
                  <CardContent className="p-4 flex items-center gap-3">
                    <Avatar className="mt-1">
                      <AvatarImage src="/eduai-logo.png" />
                      <AvatarFallback>AI</AvatarFallback>
                    </Avatar>
                    <div className="flex gap-1">
                      <motion.div
                        animate={{ y: [0, -3, 0] }}
                        transition={{ duration: 0.5, repeat: Infinity }}
                        className="w-2 h-2 bg-gray-500 rounded-full"
                      />
                      <motion.div
                        animate={{ y: [0, -3, 0] }}
                        transition={{ duration: 0.5, repeat: Infinity, delay: 0.2 }}
                        className="w-2 h-2 bg-gray-500 rounded-full"
                      />
                      <motion.div
                        animate={{ y: [0, -3, 0] }}
                        transition={{ duration: 0.5, repeat: Infinity, delay: 0.4 }}
                        className="w-2 h-2 bg-gray-500 rounded-full"
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </motion.div>
        </ScrollArea>

        <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm">
          <motion.div 
            className="max-w-3xl mx-auto"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
          >
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-sm mb-2"
              >
                {error}
              </motion.p>
            )}
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask anything about your learning journey..."
                className="flex-1 bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800"
              />
              <Button
                type="submit"
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                disabled={isTyping}
              >
                <Send size={18} />
              </Button>
            </form>
            <motion.div 
              className="mt-3 flex flex-wrap gap-2"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              {suggestedQuestions.map((question, index) => (
                <motion.div key={index} variants={popIn}>
                  <Button
                    variant="outline"
                    className="text-xs h-8 gap-2 border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-950/50 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                    onClick={() => handleSuggestedQuestion(question.text)}
                  >
                    {question.icon}
                    {question.text}
                  </Button>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}