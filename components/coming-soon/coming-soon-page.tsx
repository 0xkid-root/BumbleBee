"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Bell, Calendar, ExternalLink } from "lucide-react"
import { toast } from "sonner"

interface ComingSoonPageProps {
  title: string
  description: string
  icon: React.ReactNode
  features: string[]
  estimatedRelease?: string
  gradientColors: string
  learnMoreUrl?: string
}

export function ComingSoonPage({
  title,
  description,
  icon,
  features,
  estimatedRelease = "Q3 2024",
  gradientColors,
  learnMoreUrl
}: ComingSoonPageProps) {
  const [email, setEmail] = useState("")
  const [isNotified, setIsNotified] = useState(false)
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  // Set a random future date for the countdown (3-4 months in the future)
  useEffect(() => {
    const futureDate = new Date()
    futureDate.setMonth(futureDate.getMonth() + 3 + Math.floor(Math.random() * 2))
    
    const interval = setInterval(() => {
      const now = new Date()
      const difference = futureDate.getTime() - now.getTime()
      
      if (difference <= 0) {
        clearInterval(interval)
        return
      }
      
      const days = Math.floor(difference / (1000 * 60 * 60 * 24))
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((difference % (1000 * 60)) / 1000)
      
      setCountdown({ days, hours, minutes, seconds })
    }, 1000)
    
    return () => clearInterval(interval)
  }, [])

  const handleNotify = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    
    // Simulate API call
    setTimeout(() => {
      setIsNotified(true)
      toast.success("Notification set!", {
        description: `We'll notify you at ${email} when ${title} launches.`
      })
    }, 1000)
  }

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
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  }

  const featureVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  }

  return (
    <DashboardLayout>
      <div className="flex-1 p-8 pt-6 overflow-y-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-5xl mx-auto"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="mb-8 text-center">
            <div className={`inline-flex p-4 rounded-full ${gradientColors} mb-4`}>
              <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="text-white"
              >
                {icon}
              </motion.div>
            </div>
            <h1 className="text-4xl font-bold mb-2">{title}</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">{description}</p>
          </motion.div>

          {/* Countdown */}
          <motion.div variants={itemVariants} className="mb-12">
            <Card className="border-2 border-primary/10 bg-primary/5">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-center mb-6 flex items-center justify-center gap-2">
                  <Calendar className="h-5 w-5" />
                  <span>Estimated Launch: {estimatedRelease}</span>
                </h2>
                <div className="grid grid-cols-4 gap-4 text-center">
                  {Object.entries(countdown).map(([key, value]: [string, number]) => (
                    <div key={key} className="flex flex-col">
                      <motion.div
                        initial={{ scale: 1 }}
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
                        className="text-3xl md:text-4xl font-bold text-primary"
                      >
                        {value}
                      </motion.div>
                      <span className="text-xs md:text-sm text-muted-foreground capitalize">{key}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Features */}
          <motion.div variants={itemVariants} className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-center">Upcoming Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {features.map((feature: string, index: number) => (
                <motion.div
                  key={index}
                  variants={featureVariants}
                  className="bg-card p-4 rounded-lg border flex items-start gap-3"
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  <div className={`p-2 rounded-full ${gradientColors} text-white`}>
                    <motion.div
                      initial={{ rotate: 0 }}
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    >
                      {icon}
                    </motion.div>
                  </div>
                  <p className="font-medium">{feature}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Notification Form */}
          <motion.div variants={itemVariants} className="mb-8">
            <Card>
              <CardContent className="p-6">
                {!isNotified ? (
                  <form onSubmit={handleNotify} className="space-y-4">
                    <h3 className="text-xl font-semibold flex items-center gap-2">
                      <Bell className="h-5 w-5" />
                      Get Notified When We Launch
                    </h3>
                    <div className="flex gap-2">
                      <input
                        type="email"
                        value={email}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="flex-1 px-4 py-2 rounded-md border border-input bg-background"
                        required
                      />
                      <Button type="submit">Notify Me</Button>
                    </div>
                  </form>
                ) : (
                  <div className="text-center py-2">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, damping: 10 }}
                      className="mb-2 inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 text-green-600"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </motion.div>
                    <h3 className="text-xl font-semibold mb-1">You're on the list!</h3>
                    <p className="text-muted-foreground">We'll notify you when {title} launches.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Learn More Button */}
          {learnMoreUrl && (
            <motion.div variants={itemVariants} className="text-center">
              <Button variant="outline" size="lg" asChild>
                <a href={learnMoreUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                  Learn More <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </DashboardLayout>
  )
}