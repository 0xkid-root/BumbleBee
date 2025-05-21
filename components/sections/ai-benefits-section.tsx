"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LineChart, Shield, Lightbulb, TrendingUp, ArrowRight } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"

const benefits = [
  {
    id: "insights",
    icon: <LineChart className="h-6 w-6" />,
    title: "Real-time Portfolio Insights",
    description:
      "Get AI-powered analysis of your portfolio performance, risk assessment, and diversification recommendations.",
    image: "/6.png",
    features: [
      "Track performance across multiple blockchains and protocols",
      "Identify high-risk assets and optimize allocation",
      "Compare your portfolio against market benchmarks",
    ],
  },
  {
    id: "security",
    icon: <Shield className="h-6 w-6" />,
    title: "Enhanced Security",
    description: "AI monitors your transactions for suspicious activity and alerts you to potential security threats.",
    image: "/7.png",
    features: [
      "Real-time smart contract vulnerability scanning",
      "Fraud detection with instant notifications",
      "Automatic blocking of suspicious transactions",
    ],
  },
  {
    id: "recommendations",
    icon: <Lightbulb className="h-6 w-6" />,
    title: "Smart Recommendations",
    description:
      "Receive personalized investment suggestions based on your goals, risk tolerance, and market conditions.",
    image: "/3.png",
    features: [
      "Tailored investment opportunities matching your risk profile",
      "Market trend analysis with actionable insights",
      "Tax-optimized trading recommendations",
    ],
  },
  {
    id: "automation",
    icon: <TrendingUp className="h-6 w-6" />,
    title: "Automated Strategies",
    description:
      "Set up AI-powered rules to automatically rebalance your portfolio or execute trades based on market triggers.",
    image: "/8.png",
    features: [
      "One-click strategy deployment with no coding required",
      "Custom triggers based on market indicators",
      "Automatic profit taking and loss prevention",
    ],
  },
]

export default function AiBenefitsSection() {
  const [hoveredFeature, setHoveredFeature] = useState(null)

  return (
    <section id="benefits" className="section-padding bg-gradient-to-b from-muted/30 to-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <span className="px-4 py-2 rounded-full bg-primary/10 text-primary inline-block mb-4 font-medium text-sm border border-primary/20">
            Powered by AI
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight heading-gradient">AI That Works for You</h2>
          <p className="text-xl text-muted-foreground">
            Our AI delivers personalized insights and automation to simplify your DeFi experience, helping you make
            smarter decisions with confidence.
          </p>
        </motion.div>

        <Tabs defaultValue="insights" className="w-full">
          <div className="flex justify-center mb-12">
            <TabsList className="grid grid-cols-2 md:grid-cols-4 p-1 gap-1 bg-muted/50 rounded-xl">
              {benefits.map((benefit) => (
                <TabsTrigger
                  key={benefit.id}
                  value={benefit.id}
                  className="flex items-center gap-2 rounded-lg py-3 px-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300 focus-ring"
                  aria-label={benefit.title}
                >
                  <div aria-hidden="true">{benefit.icon}</div>
                  <span className="hidden md:inline font-medium">{benefit.title}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <AnimatePresence mode="wait">
            {benefits.map((benefit) => (
              <TabsContent key={benefit.id} value={benefit.id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
                >
                  {/* Improved image card with better contrast */}
                  <Card className="overflow-hidden border-2 border-primary/20 shadow-lg shadow-primary/5 rounded-xl">
                    <CardContent className="p-0">
                      <div className="relative h-[350px] w-full">
                        <Image
                          src={benefit.image || "/placeholder.svg"}
                          alt={`${benefit.title} dashboard interface showing ${benefit.description}`}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end">
                          <div className="p-6 text-white">
                            <h4 className="text-xl font-semibold mb-2">{benefit.title}</h4>
                            <p className="text-white/90 text-sm">{benefit.description}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="space-y-8">
                    <div>
                      <div className="flex items-center gap-4 mb-5">
                        <div className="p-4 bg-primary/10 text-primary rounded-xl border border-primary/20">
                          {benefit.icon}
                        </div>
                        <h3 className="text-3xl font-bold">{benefit.title}</h3>
                      </div>
                      <p className="text-xl text-muted-foreground mb-8">{benefit.description}</p>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold">Key Features</h4>
                      <ul className="space-y-4">
                        {benefit.features.map((feature, index) => (
                          <motion.li
                            key={index}
                            className="flex items-start bg-card p-4 rounded-lg border border-border hover:border-primary/50 cursor-pointer"
                            onMouseEnter={() => setHoveredFeature(`${benefit.id}-${index}` as any)}
                            onMouseLeave={() => setHoveredFeature(null)}
                            whileHover={{ y: -4 }}
                          >
                            <div className="mr-3 mt-1 bg-primary/20 text-primary p-1 rounded-full">
                              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                            <span className="text-lg">{feature}</span>
                            {hoveredFeature === `${benefit.id}-${index}` && (
                              <motion.div
                                className="ml-auto"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                              >
                                <ArrowRight className="h-4 w-4 text-primary" aria-hidden="true" />
                              </motion.div>
                            )}
                          </motion.li>
                        ))}
                      </ul>
                    </div>

                    <Button className="mt-6 w-full md:w-auto focus-ring">
                      Try {benefit.title.split(" ")[0]} Features
                    </Button>
                  </div>
                </motion.div>
              </TabsContent>
            ))}
          </AnimatePresence>
        </Tabs>
      </div>
    </section>
  )
}
