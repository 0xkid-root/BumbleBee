"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MessageSquare, Send, Brain, Sparkles, Lightbulb } from "lucide-react"
import Image from "next/image"

export default function EducationSection() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi there! I'm Bumblebee's AI assistant. How can I help you learn about DeFi today?",
      animate: true,
    },
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [activeBubble, setActiveBubble] = useState(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto-switch testimonials - simplified
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveBubble((prev) => (prev + 1) % 3)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = () => {
    if (!input.trim()) return

    // Add user message
    setMessages([...messages, { role: "user", content: input, animate: true }])
    setInput("")
    setIsTyping(true)

    // Focus back on input after sending
    setTimeout(() => {
      inputRef.current?.focus()
    }, 0)

    // Simulate AI response - simplified
    setTimeout(() => {
      let response = ""
      if (input.toLowerCase().includes("defi")) {
        response =
          "DeFi (Decentralized Finance) refers to financial applications built on blockchain technology that don't rely on central financial intermediaries. With Bumblebee, you can access various DeFi tools like lending, borrowing, and yield farming with AI-powered insights to optimize your strategy."
      } else if (input.toLowerCase().includes("wallet")) {
        response =
          "Crypto wallets are digital tools that allow you to store and manage your cryptocurrencies. Bumblebee's AI-enhanced smart wallets provide extra security through fraud detection and offer automated payment features to simplify your DeFi experience."
      } else {
        response =
          "That's a great question! Bumblebee's AI can help you understand various aspects of blockchain and DeFi. Would you like to learn about smart contracts, yield farming, or how to optimize your portfolio?"
      }

      setIsTyping(false)
      setMessages((prev) => [...prev, { role: "assistant", content: response, animate: true }])
    }, 1500)
  }

  const features = [
    {
      icon: <Brain className="h-6 w-6 text-amber-500" />,
      title: "Personalized learning paths",
      description: "Content tailored to your knowledge level and interests",
    },
    {
      icon: <Sparkles className="h-6 w-6 text-amber-500" />,
      title: "Real-time explanations",
      description: "Get clear answers about market trends and DeFi concepts",
    },
    {
      icon: <Lightbulb className="h-6 w-6 text-amber-500" />,
      title: "Strategy recommendations",
      description: "Actionable advice based on your financial goals",
    },
  ]

  const testimonials = [
    '"The AI explained yield farming better than any YouTube video I watched. Incredibly helpful!"',
    '"As a DeFi beginner, this assistant made complex concepts easy to understand. Game-changer!"',
    '"I learned more about smart contracts in 10 minutes than I did in weeks of research."',
  ]

  // Simplified animation variants
  const messageVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3 },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.2 },
    },
  }

  return (
    <section id="education" className="section-padding relative overflow-hidden">
      {/* Improved background with better contrast */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-50/50 via-white to-amber-50/30 z-0"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <div className="inline-block mb-4 px-4 py-1 rounded-full bg-gradient-to-r from-amber-100 to-amber-200 border border-amber-200 shadow-sm">
            <span className="inline-block mr-2" aria-hidden="true">
              💡
            </span>
            <span className="text-amber-800 font-medium">Interactive Learning</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold mb-6 heading-gradient">Learn DeFi, Step by Step</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our AI assistant makes learning about blockchain and DeFi simple and personalized, guiding you through
            concepts at your own pace.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-16 gap-y-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-5"
          >
            <div className="relative">
              <motion.h3
                className="text-3xl font-bold mb-6 relative"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                Your Personal DeFi Guide
                <motion.div
                  className="absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-amber-400 to-amber-200 rounded-full"
                  initial={{ width: 0 }}
                  whileInView={{ width: "40%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                />
              </motion.h3>

              <p className="text-lg text-muted-foreground mb-8">
                Whether you're new to crypto or an experienced user, our AI chatbot provides:
              </p>

              {/* Improved features list with better contrast */}
              <div className="space-y-6 mb-10">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-start p-4 bg-white/90 backdrop-blur-sm rounded-xl border border-amber-200 shadow-sm hover:shadow-md transition-shadow duration-300"
                  >
                    <div className="mr-4 p-3 bg-gradient-to-br from-amber-100 to-amber-50 rounded-lg shadow-inner border border-amber-200/50">
                      {feature.icon}
                    </div>
                    <div>
                      <span className="font-semibold text-lg text-amber-900">{feature.title}</span>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Improved testimonial card with better contrast */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-50 to-white border border-amber-200 shadow-md relative overflow-hidden">
                <div className="flex items-center gap-4">
            
                  <div className="flex-1">
                    <AnimatePresence mode="wait">
                      <motion.p
                        key={activeBubble}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="text-sm text-amber-800/80 italic font-medium"
                      >
                        {testimonials[activeBubble]}
                      </motion.p>
                    </AnimatePresence>

                    <div className="flex gap-1 mt-2" role="tablist" aria-label="Testimonial navigation">
                      {[0, 1, 2].map((i) => (
                        <button
                          key={i}
                          className={`w-2 h-2 rounded-full transition-colors duration-300 ${activeBubble === i ? "bg-amber-500" : "bg-amber-200"}`}
                          onClick={() => setActiveBubble(i)}
                          aria-selected={activeBubble === i}
                          aria-label={`View testimonial ${i + 1}`}
                          role="tab"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-7"
          >
            {/* Improved chat interface with better usability */}
            <Card className="border-2 border-amber-200 bg-white/90 backdrop-blur-sm rounded-xl overflow-hidden shadow-xl relative z-10">
              <CardContent className="p-0">
                <div className="bg-gradient-to-r from-amber-100 to-amber-50 p-4 border-b border-amber-200 flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-amber-400 animate-pulse" aria-hidden="true" />
                  <MessageSquare className="h-5 w-5 text-amber-500" aria-hidden="true" />
                  <h4 className="font-medium text-amber-900">Bumblebee AI Assistant</h4>
                </div>

                <div className="h-[440px] flex flex-col">
                  <div
                    className="flex-1 p-6 overflow-y-auto space-y-4 bg-gradient-to-br from-white to-amber-50/40"
                    aria-live="polite"
                    aria-label="Chat conversation"
                  >
                    {messages.map((message, index) => (
                      <motion.div
                        key={index}
                        className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                        initial={message.animate ? "hidden" : false}
                        animate={message.animate ? "visible" : false}
                        variants={messageVariants}
                      >
                        <div
                          className={`max-w-[80%] rounded-2xl p-4 shadow-sm ${
                            message.role === "user"
                              ? "bg-gradient-to-r from-amber-500 to-amber-400 text-white"
                              : "bg-white border border-amber-100"
                          }`}
                        >
                          {message.content}
                        </div>
                      </motion.div>
                    ))}

                    {isTyping && (
                      <motion.div
                        className="flex justify-start"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="max-w-[80%] rounded-2xl p-4 bg-white border border-amber-100 shadow-sm">
                          <div className="flex space-x-2" aria-label="Assistant is typing">
                            <motion.div
                              className="w-2 h-2 rounded-full bg-amber-300"
                              animate={{ y: [0, -5, 0] }}
                              transition={{ duration: 0.6, repeat: Number.POSITIVE_INFINITY }}
                            />
                            <motion.div
                              className="w-2 h-2 rounded-full bg-amber-400"
                              animate={{ y: [0, -5, 0] }}
                              transition={{ duration: 0.6, repeat: Number.POSITIVE_INFINITY, delay: 0.2 }}
                            />
                            <motion.div
                              className="w-2 h-2 rounded-full bg-amber-500"
                              animate={{ y: [0, -5, 0] }}
                              transition={{ duration: 0.6, repeat: Number.POSITIVE_INFINITY, delay: 0.4 }}
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}

                    <div ref={messagesEndRef} />
                  </div>

                  <div className="p-4 border-t border-amber-100 bg-white">
                    <form
                      onSubmit={(e) => {
                        e.preventDefault()
                        handleSendMessage()
                      }}
                      className="flex gap-2"
                    >
                      <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        ref={inputRef}
                        placeholder="Ask about DeFi, wallets, or crypto basics..."
                        className="flex-1 px-4 py-3 rounded-lg border border-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-400 shadow-inner bg-amber-50/50"
                        aria-label="Type your message"
                      />
                      <Button
                        type="submit"
                        disabled={!input.trim()}
                        className="bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-600 hover:to-yellow-500 text-white px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 focus-ring"
                        aria-label="Send message"
                      >
                        <Send className="h-5 w-5" aria-hidden="true" />
                        <span className="sr-only">Send</span>
                      </Button>
                    </form>
                    <div className="text-xs text-muted-foreground mt-3">
                      Try asking: "What is DeFi?" or "How do crypto wallets work?"
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
