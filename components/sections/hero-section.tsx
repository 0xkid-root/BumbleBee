"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Wallet, Shield, Clock, TrendingUp, Activity, PieChart, ListPlus, Zap, Brain, CpuIcon } from "lucide-react"
import Image from "next/image"
import { H1, Lead } from "@/components/ui/typography"
import { TypeAnimation } from "react-type-animation"
import { cn } from "@/lib/utils"

export default function HeroSection() {
  const [activeFeature, setActiveFeature] = useState(0)
  const features = [
    { icon: <TrendingUp className="h-5 w-5" />, text: "AI Portfolio Insights" },
    { icon: <Activity className="h-5 w-5" />, text: "Smart Payment Automation" },
    { icon: <PieChart className="h-5 w-5" />, text: "Dynamic Asset Allocation" },
  ]

  // Simplified animation cycle
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section id="hero" className="section-padding relative overflow-hidden pt-8">
      {/* Absolute positioned background */}
      <div className="absolute inset-0 -z-10 opacity-5">
        <div className="absolute inset-0 honeycomb-bg" aria-hidden="true"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left"
          >
            <div className="inline-block mb-6">
              <div className="bg-primary-light text-primary-light-foreground px-4 py-2 rounded-full text-sm font-medium border border-primary/30">
                Introducing Bumblebee AI
              </div>
            </div>

            <H1 className="mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-400">
                <TypeAnimation
                  sequence={["Bumblebee:", 1000, "Bumblebee:", 1000]}
                  wrapper="span"
                  speed={50}
                  repeat={Number.POSITIVE_INFINITY}
                  className="font-bold"
                />
              </span>{" "}
              <span className="relative">
                <TypeAnimation
                  sequence={["Smarter DeFi", 1000, "Smarter DeFi with AI", 2000]}
                  wrapper="span"
                  speed={50}
                  repeat={Number.POSITIVE_INFINITY}
                />
                <span className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-primary via-primary-light to-transparent rounded-full"></span>
              </span>
            </H1>

            <Lead className="mb-8 max-w-2xl mx-auto lg:mx-0 text-foreground/80">
              Automate payments, split expenses, and optimize your portfolio with AI—all in one dApp.
            </Lead>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Button
  size="lg"
  className={cn(
    "bg-gradient-to-r from-primary to-primary text-white group px-6 focus-ring relative overflow-hidden",
    "before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2.5s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent",
  )}
>
  <span className="relative z-10 flex items-center">
    Connect Wallet
    <Wallet className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
  </span>
</Button>

              <Button
                size="lg"
                variant="outline"
                className={cn(
                  "group border-2 hover:bg-secondary/5 focus-ring relative overflow-hidden",
                  "before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2.5s_infinite] before:bg-gradient-to-r before:from-transparent before:via-primary/10 before:to-transparent",
                )}
              >
                <span className="relative z-10 flex items-center">
                  Join Waitlist
                  <ListPlus className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
            </div>

            <div className="flex flex-wrap justify-center lg:justify-start gap-4 mt-20">
              <div className="flex items-center text-sm bg-background/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-border/50">
                <CpuIcon className="h-5 w-5 mr-2 text-secondary" />
                <span className="font-medium">Powered By AI</span>
              </div>
              <div className="flex items-center text-sm bg-background/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-border/50">
                <Zap className="h-5 w-5 mr-2 text-secondary" />
                <span className="font-medium">One Click Automation</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
          >
            {/* Improved card stack effect with better shadows */}
            <div className="relative w-full">
              <div className="absolute top-8 left-8 right-8 h-[400px] bg-secondary-light rounded-xl transform rotate-6 shadow-xl"></div>
              <div className="absolute top-4 left-4 right-4 h-[400px] bg-primary-light rounded-xl transform rotate-3 shadow-lg"></div>

              <div className="relative w-full h-[400px] md:h-[500px] rounded-xl overflow-hidden shadow-2xl border border-border bg-gradient-to-br from-background to-background/80 backdrop-blur-sm">
                {/* App mockup header with improved contrast */}
                <div className="absolute top-0 left-0 right-0 h-12 bg-background/90 backdrop-blur-sm border-b border-border flex items-center px-4">
                  <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                  <div className="mx-auto text-xs font-medium">Bumblebee DeFAI</div>
                </div>

                {['/3.png', '/5.png', '/1.png'].map((src, index) => (
                  <motion.div
                    key={src}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: activeFeature === index ? 1 : 0 }}
                    transition={{ duration: 0.5 }}
                    style={{ position: 'absolute', inset: 0  }}
                  >
                    <Image
                      src={src}
                      alt="Bumblebee dApp Interface showing portfolio analytics and trading features"
                      fill
                      className="object-cover object-top mt-12"
                      priority
                    />
                  </motion.div>
                ))}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>

                {/* Improved feature cards with better contrast */}
                <div className="absolute bottom-4 left-4 right-4">
                  {/* Replace AnimatePresence with simple conditional rendering */}
                  <motion.div
                    key={activeFeature}
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -30, opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-background/90 backdrop-blur-md p-4 rounded-lg border border-primary/20 shadow-lg"
                  >
                    <div className="flex items-center">
                      <div className="bg-primary-light p-4 rounded-lg mr-3">{features[activeFeature].icon}</div>
                      <div>
                        <div className="text-sm font-medium">{features[activeFeature].text}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {activeFeature === 0 && "Your portfolio is up 12% this week. Tap for AI recommendations."}
                          {activeFeature === 1 && "Schedule recurring payments with smart gas optimization."}
                          {activeFeature === 2 && "AI-powered rebalancing for maximum yield potential."}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Improved feature indicators with better accessibility */}
                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-3">
                  {features.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveFeature(index)}
                      className={`w-8 h-2 rounded-full transition-all focus-ring ${activeFeature === index ? "bg-primary" : "bg-muted"}`}
                      aria-label={`View feature ${index + 1}: ${features[index].text}`}
                    />
                  ))}
                </div>
              </div>

              {/* Enhanced gold (honey) badge */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.5 }}
                className="absolute -top-6 -right-6 bg-gradient-to-br from-yellow-400 to-amber-500 text-white p-4 rounded-full shadow-lg shadow-yellow-400/40"
              >
                <div className="text-sm font-bold">AI</div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Statistics row for MVP stage product with relevant metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20 text-center"
        >
          {[
            { label: "Prototype Users", value: "250+" },
            { label: "Beta Signups", value: "1,500+" },
            { label: "Feature Requests", value: "120+" },
            { label: "Uptime", value: "99.9%" },
          ].map((stat, index) => (
            <div
              key={index}
              className="bg-background/80 backdrop-blur-sm p-5 rounded-lg border border-primary/10 shadow-md card-hover"
            >
              <div className="text-2xl font-bold text-primary mb-2">{stat.value}</div>
              <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
