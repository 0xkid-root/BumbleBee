"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, Users, Wallet, LineChart, Repeat, MessageSquare } from "lucide-react"

const features = [
  {
    icon: <Clock className="h-10 w-10" />,
    title: "Subscription System",
    description: "Use ERC-7715 for seamless, on-chain recurring payments to access premium tools or content.",
    color: "from-violet-500 to-purple-600",
  },
  {
    icon: <Users className="h-10 w-10" />,
    title: "Social Payment Tabs",
    description:
      "Split expenses with friends, track shared costs, and settle debts automatically with smart contracts.",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: <Wallet className="h-10 w-10" />,
    description: "Secure wallets enhanced with AI for fraud detection, spending analysis, and automated payments.",
    title: "AI-Enhanced Smart Wallets",
    color: "from-green-500 to-emerald-600",
  },
  {
    icon: <LineChart className="h-10 w-10" />,
    title: "Personalized Portfolio Management",
    description:
      "AI-driven insights for optimizing your crypto portfolio based on your risk profile and market conditions.",
    color: "from-yellow-500 to-amber-600",
  },
  {
    icon: <Repeat className="h-10 w-10" />,
    title: "Simplified Token Swapping",
    description: "Swap tokens with ease using AI to find the best rates and lowest fees across multiple DEXs.",
    color: "from-red-500 to-rose-600",
  },
  {
    icon: <MessageSquare className="h-10 w-10" />,
    title: "Conversational AI & Education",
    description: "Learn about blockchain and DeFi through natural conversations with our AI assistant.",
    color: "from-indigo-500 to-blue-600",
  },
]

export default function FeaturesSection() {
  const [hoveredIndex, setHoveredIndex] = useState(null)

  // Simplified animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 40, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  }

  const titleVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: "easeOut",
      },
    },
  }

  return (
    <section
      id="features"
      className="section-padding bg-gradient-to-b from-background to-muted/30 relative overflow-hidden"
    >
      {/* Simplified background decoration - just one element */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={titleVariants}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 heading-gradient">Why Bumblebee Stands Out</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our innovative features combine AI and DeFi to create a seamless financial experience.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="h-full"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <Card className="h-full relative group border border-muted-foreground/10 backdrop-blur-sm bg-background/80 overflow-hidden card-hover">
                {/* Improved hover effect */}
                <div
                  className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-700 bg-gradient-to-r ${feature.color}`}
                />

                <CardHeader className="relative z-10">
                  <div
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 bg-gradient-to-br ${feature.color} shadow-lg text-white`}
                    aria-hidden="true"
                  >
                    {feature.icon}
                  </div>
                  <CardTitle className="text-2xl font-bold">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="relative z-10">
                  <CardDescription className="text-base text-foreground/70">{feature.description}</CardDescription>
                </CardContent>

                {/* Visual enhancement for currently hovered card */}
                {hoveredIndex === index && (
                  <motion.div
                    className="absolute bottom-0 left-0 h-1 bg-gradient-to-r w-0"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 0.5 }}
                    style={{
                      backgroundImage: `linear-gradient(to right, ${feature.color.replace("from-", "").replace("to-", "")})`,
                    }}
                  />
                )}
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
