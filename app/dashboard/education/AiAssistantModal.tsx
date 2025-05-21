"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence, useAnimation } from "framer-motion"
import { X, Send, Bot, Sparkles, MessageSquare, Info, ThumbsUp, User, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Message {
  role: "user" | "assistant"
  content: string
  timestamp?: string
}

interface Suggestion {
  text: string
  icon: any
}

interface AiAssistantModalProps {
  assistant: {
    name: string
    description: string
    icon: any
    color: string
    avatar: string
    details: {
      specialty: string
      experience: string
      capabilities: string[]
      sampleDialogue: Message[]
    }
  }
  isOpen: boolean
  onClose: () => void
}

export function AiAssistantModal({ assistant, isOpen, onClose }: AiAssistantModalProps) {
  const Icon = assistant.icon
  const [messages, setMessages] = useState<Message[]>(assistant.details.sampleDialogue)
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messageControls = useAnimation()
  
  // Suggested prompts
  const suggestions: Suggestion[] = [
    { text: "Explain what is yield farming?", icon: Sparkles },
    { text: "How do liquidity pools work?", icon: Bot },
    { text: "What are the risks of DeFi?", icon: Info },
  ]

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const formatTimestamp = () => {
    const now = new Date()
    return `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`
  }

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    // Add user message with timestamp
    const newMessages: Message[] = [...messages, { 
      role: "user" as const, 
      content: inputValue, 
      timestamp: formatTimestamp() 
    }]
    setMessages(newMessages)
    setInputValue("")
    setIsTyping(true)

    // Simulate assistant response after a short delay
    setTimeout(() => {
      setIsTyping(false)
      setMessages([
        ...newMessages,
        {
          role: "assistant" as const,
          content: getResponse(inputValue),
          timestamp: formatTimestamp()
        },
      ])
    }, 1500)
  }

  const getResponse = (userMessage: string) => {
    // Simple response logic based on user input
    const lowercaseMessage = userMessage.toLowerCase()
    
    if (lowercaseMessage.includes("yield farming")) {
      return "Yield farming is a practice where users provide liquidity to DeFi protocols and earn rewards in return. These rewards often come in the form of additional tokens, which can then be reinvested to generate more yields. It's essentially putting your crypto assets to work to generate more crypto."
    } 
    else if (lowercaseMessage.includes("liquidity pool")) {
      return "Liquidity pools are smart contracts that contain funds. Users called liquidity providers (LPs) add an equal value of two tokens to create a market. In return, they receive LP tokens that represent their share of the pool. These pools are used by decentralized exchanges like Uniswap to facilitate trading."
    }
    else if (lowercaseMessage.includes("risk")) {
      return "DeFi carries several risks including smart contract vulnerabilities, impermanent loss when providing liquidity, market volatility, governance risks, and regulatory uncertainty. It's important to do thorough research and never invest more than you can afford to lose."
    }
    else if (lowercaseMessage.includes("defi")) {
      return "DeFi (Decentralized Finance) refers to financial services that operate on blockchain networks without centralized intermediaries like banks. It includes lending, borrowing, trading, and earning interest on crypto assets through protocols that are transparent and accessible to anyone with an internet connection."
    }
    
    return `As ${assistant.name}, I'd be happy to explain that topic! DeFi (Decentralized Finance) is revolutionizing financial systems by removing intermediaries and creating open, permissionless networks. Could you share what specific aspect of ${lowercaseMessage} you'd like to learn more about?`
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion)
  }

  // Shared animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1 
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-4xl w-full h-[85vh] flex flex-col overflow-hidden border border-gray-200 dark:border-gray-800"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div 
                className={`p-4 sm:p-5 bg-gradient-to-r ${assistant.color} text-white flex justify-between items-center`}
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center">
                  <motion.div 
                    className="bg-white/20 p-2 rounded-full mr-3 relative overflow-hidden"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon size={20} />
                    <motion.div 
                      className="absolute inset-0 bg-white/20" 
                      animate={{ 
                        scale: [1, 1.2, 1],
                        opacity: [0, 0.3, 0]
                      }}
                      transition={{ 
                        repeat: Infinity, 
                        duration: 2,
                        repeatType: "loop" 
                      }}
                    />
                  </motion.div>
                  <div>
                    <h2 className="text-xl font-bold flex items-center">
                      {assistant.name}
                      <motion.span 
                        className="ml-2 inline-block"
                        animate={{ rotate: [0, 15, -15, 0] }}
                        transition={{ repeat: Infinity, duration: 2, repeatDelay: 5 }}
                      >
                        <Sparkles size={16} />
                      </motion.span>
                    </h2>
                    <p className="text-sm text-white/90">{assistant.description}</p>
                  </div>
                </div>
                <motion.button 
                  onClick={onClose} 
                  className="text-white hover:bg-white/20 rounded-full p-1.5 transition-colors"
                  whileHover={{ rotate: 90 }}
                  transition={{ type: "spring", stiffness: 200, damping: 10 }}
                >
                  <X size={24} />
                </motion.button>
              </motion.div>

              <Tabs defaultValue="chat" className="flex-1 flex flex-col">
                <TabsList className="grid grid-cols-2 mx-4 mt-2">
                  <TabsTrigger value="chat" className="flex items-center justify-center gap-2">
                    <MessageSquare size={16} />
                    <span>Chat</span>
                  </TabsTrigger>
                  <TabsTrigger value="about" className="flex items-center justify-center gap-2">
                    <Info size={16} />
                    <span>About</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="chat" className="flex-1 flex flex-col p-4 overflow-hidden">
                  <motion.div 
                    className="flex-1 overflow-y-auto mb-4 space-y-4 pr-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {messages.map((message, index) => (
                      <motion.div 
                        key={index} 
                        className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                        variants={itemVariants}
                      >
                        <div 
                          className={`max-w-[80%] flex gap-3 ${
                            message.role === "user" 
                              ? "flex-row-reverse" 
                              : "flex-row"
                          }`}
                        >
                          <div className="flex-shrink-0 mt-1">
                            {message.role === "user" ? (
                              <div className="bg-gray-200 dark:bg-gray-700 h-8 w-8 rounded-full flex items-center justify-center">
                                <User size={16} />
                              </div>
                            ) : (
                              <Avatar className="h-8 w-8 border border-gray-200 dark:border-gray-700">
                                <AvatarImage src={assistant.avatar} alt={assistant.name} />
                                <AvatarFallback>
                                  <Icon size={16} />
                                </AvatarFallback>
                              </Avatar>
                            )}
                          </div>
                          
                          <div>
                            <div 
                              className={`relative p-3 rounded-2xl ${
                                message.role === "user" 
                                  ? "bg-blue-600 text-white" 
                                  : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                              }`}
                            >
                              <p>{message.content}</p>
                              {message.timestamp && (
                                <div 
                                  className={`text-xs mt-1 ${
                                    message.role === "user" 
                                      ? "text-blue-200" 
                                      : "text-gray-500 dark:text-gray-400"
                                  }`}
                                >
                                  {message.timestamp}
                                </div>
                              )}
                            </div>
                            
                            {message.role === "assistant" && (
                              <div className="flex mt-1 gap-2">
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-6 text-xs px-2 text-gray-500 hover:text-blue-600"
                                >
                                  <ThumbsUp size={14} className="mr-1" />
                                  Helpful
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                    
                    {isTyping && (
                      <motion.div 
                        className="flex justify-start"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <div className="flex gap-3">
                          <Avatar className="h-8 w-8 border border-gray-200 dark:border-gray-700">
                            <AvatarImage src={assistant.avatar} alt={assistant.name} />
                            <AvatarFallback>
                              <Icon size={16} />
                            </AvatarFallback>
                          </Avatar>
                          
                          <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-2xl">
                            <div className="flex space-x-1">
                              <motion.div 
                                className="w-2 h-2 bg-gray-400 dark:bg-gray-600 rounded-full"
                                animate={{ y: [0, -5, 0] }}
                                transition={{ repeat: Infinity, duration: 0.6, delay: 0 }}
                              />
                              <motion.div 
                                className="w-2 h-2 bg-gray-400 dark:bg-gray-600 rounded-full"
                                animate={{ y: [0, -5, 0] }}
                                transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }}
                              />
                              <motion.div 
                                className="w-2 h-2 bg-gray-400 dark:bg-gray-600 rounded-full"
                                animate={{ y: [0, -5, 0] }}
                                transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }}
                              />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                    
                    <div ref={messagesEndRef} />
                  </motion.div>
                  
                  {/* Suggestion chips */}
                  {messages.length <= 3 && (
                    <motion.div 
                      className="mb-4 flex flex-wrap gap-2"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      {suggestions.map((suggestion, index) => {
                        const SuggestionIcon = suggestion.icon
                        return (
                          <motion.button
                            key={index}
                            onClick={() => handleSuggestionClick(suggestion.text)}
                            className="group flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-full text-sm transition-colors"
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                          >
                            <SuggestionIcon size={14} className="text-gray-500 dark:text-gray-400" />
                            <span>{suggestion.text}</span>
                            <ChevronRight size={14} className="text-gray-400 dark:text-gray-500 group-hover:translate-x-1 transition-transform" />
                          </motion.button>
                        )
                      })}
                    </motion.div>
                  )}
                  
                  <motion.div 
                    className="relative"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Input
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                      placeholder="Ask about DeFi, blockchain, crypto..."
                      className="py-6 pl-4 pr-12 rounded-full border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500"
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!inputValue.trim()}
                      className={`absolute right-1.5 top-1/2 transform -translate-y-1/2 h-9 w-9 p-0 rounded-full ${
                        inputValue.trim() ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-300 dark:bg-gray-700"
                      }`}
                    >
                      <Send size={18} className={inputValue.trim() ? "text-white" : "text-gray-500"} />
                    </Button>
                    <motion.div 
                      className="absolute inset-0 rounded-full pointer-events-none"
                      animate={{ 
                        boxShadow: inputValue.trim() ? ["0 0 0 0 rgba(59, 130, 246, 0)", "0 0 0 4px rgba(59, 130, 246, 0.25)", "0 0 0 0 rgba(59, 130, 246, 0)"] : "none" 
                      }}
                      transition={{ repeat: Infinity, duration: 2 }}
                    />
                  </motion.div>
                </TabsContent>

                <TabsContent value="about" className="flex-1 p-4 overflow-y-auto">
                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-6"
                  >
                    <motion.div variants={itemVariants} className="flex items-center gap-4">
                      <Avatar className="h-16 w-16 border border-gray-200 dark:border-gray-700">
                        <AvatarImage src={assistant.avatar} alt={assistant.name} />
                        <AvatarFallback className={`${assistant.color} text-white`}>
                          <Icon size={32} />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-xl font-bold mb-1">{assistant.name}</h3>
                        <p className="text-gray-600 dark:text-gray-400">{assistant.description}</p>
                      </div>
                    </motion.div>
                    
                    <motion.div variants={itemVariants}>
                      <h4 className="text-md font-medium mb-2 flex items-center">
                        <Sparkles size={16} className="mr-2 text-blue-500" />
                        Specialty
                      </h4>
                      <p className="text-gray-700 dark:text-gray-300">
                        {assistant.details.specialty}
                      </p>
                    </motion.div>
                    
                    <motion.div variants={itemVariants}>
                      <h4 className="text-md font-medium mb-2 flex items-center">
                        <Info size={16} className="mr-2 text-blue-500" />
                        Experience
                      </h4>
                      <p className="text-gray-700 dark:text-gray-300">
                        {assistant.details.experience}
                      </p>
                    </motion.div>
                    
                    <motion.div variants={itemVariants}>
                      <h4 className="text-md font-medium mb-2 flex items-center">
                        <Bot size={16} className="mr-2 text-blue-500" />
                        Capabilities
                      </h4>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {assistant.details.capabilities.map((capability, index) => (
                          <Badge key={index} variant="secondary" className="px-2 py-1">
                            {capability}
                          </Badge>
                        ))}
                      </div>
                    </motion.div>
                    
                    <motion.div 
                      variants={itemVariants}
                      className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800/30"
                    >
                      <p className="text-sm text-blue-800 dark:text-blue-300">
                        This assistant uses AI to provide information about DeFi and blockchain concepts. 
                        While it strives for accuracy, please verify important information through official sources.
                      </p>
                    </motion.div>
                  </motion.div>
                </TabsContent>
              </Tabs>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}