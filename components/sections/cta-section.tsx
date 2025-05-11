"use client"

import dynamic from 'next/dynamic'
import * as React from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { ArrowRight, Sparkles, Shield, Zap, ArrowUpRight, Mail } from "lucide-react"

// Lazy load components
const AnimatedCard = dynamic(() => import("@/components/ui/animated-card").then(mod => mod.AnimatedCard), {
  ssr: false,
  loading: () => <div className="animate-pulse bg-slate-200 dark:bg-slate-700 rounded-lg h-32" />
})

const AnimatedList = dynamic(() => import("@/components/ui/animated-list").then(mod => mod.AnimatedList), {
  ssr: false,
  loading: () => <div className="space-y-4">{[1,2,3].map(i => (
    <div key={i} className="animate-pulse bg-slate-200 dark:bg-slate-700 rounded-lg h-32" />
  ))}</div>
})

const features = [
  {
    icon: <Sparkles className="h-6 w-6 text-amber-500" />,
    title: "AI-Powered Insights",
    description: "Get personalized financial recommendations and portfolio analysis powered by advanced AI.",
  },
  {
    icon: <Shield className="h-6 w-6 text-blue-500" />,
    title: "Secure Transactions",
    description: "Enterprise-grade security with multi-signature support and real-time monitoring.",
  },
  {
    icon: <Zap className="h-6 w-6 text-purple-500" />,
    title: "Lightning Fast",
    description: "Experience near-instant transactions with our optimized Layer 2 infrastructure.",
  },
]

// Lazy load background component
const HoneycombBackground = dynamic(() => Promise.resolve(() => (
  <div className="absolute inset-0 overflow-hidden opacity-10 pointer-events-none">
    <div className="absolute -right-24 -top-24 w-96 h-96 bg-amber-400 rounded-full blur-3xl" />
    <div className="absolute -left-24 top-1/2 w-80 h-80 bg-blue-400 rounded-full blur-3xl" />
    <div className="absolute right-1/4 bottom-0 w-64 h-64 bg-purple-400 rounded-full blur-3xl" />
  </div>
)), { ssr: false })

// Lazy load stat counter with optimized animation
const StatCounter = dynamic(() => Promise.resolve(({ value, label, prefix = "", suffix = "" }: { value: number; label: string; prefix?: string; suffix?: string }) => {
  const [count, setCount] = React.useState(0)
  const [isInView, setIsInView] = React.useState(false)
  const counterRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
        }
      },
      { threshold: 0.1 }
    )

    if (counterRef.current) {
      observer.observe(counterRef.current)
    }

    return () => observer.disconnect()
  }, [])

  React.useEffect(() => {
    if (!isInView) return

    const duration = 2000
    const frameDuration = 1000/30 // Reduced to 30fps for better performance
    const totalFrames = Math.round(duration / frameDuration)
    let frame = 0
    let rafId: number

    const animate = () => {
      frame++
      const progress = frame / totalFrames
      const currentCount = Math.floor(value * progress)
      
      setCount(currentCount)
      
      if (frame < totalFrames) {
        rafId = requestAnimationFrame(animate)
      }
    }

    rafId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafId)
  }, [value, isInView])
  
  return (
    <div ref={counterRef} className="text-center">
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold text-slate-800 dark:text-white flex items-center justify-center"
      >
        {prefix}<span>{count}</span>{suffix}
      </motion.p>
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-sm text-slate-500 dark:text-slate-400 mt-1"
      >
        {label}
      </motion.p>
    </div>
  )
}), { ssr: false })


// Lazy load newsletter form
const NewsletterForm = dynamic(() => Promise.resolve(() => {
  const [email, setEmail] = React.useState("")
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [isSuccess, setIsSuccess] = React.useState(false)
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!email) return
    
    setIsSubmitting(true)
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSuccess(true)
      setEmail("")
      
      // Reset success message after 3 seconds
      setTimeout(() => setIsSuccess(false), 3000)
    }, 1000)
  }
  
  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <div className="relative flex flex-col sm:flex-row gap-2">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Mail className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            className="w-full pl-10 pr-3 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
            required
          />
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          disabled={isSubmitting}
          type="submit"
          className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-medium rounded-lg shadow-md shadow-amber-500/20 transition-all disabled:opacity-70"
        >
          {isSubmitting ? "Subscribing..." : "Subscribe"}
        </motion.button>
      </div>
      
      {isSuccess && (
        <motion.p
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-sm text-green-600 dark:text-green-400"
        >
          Thank you for subscribing to our newsletter!
        </motion.p>
      )}
      
      <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
        Get weekly updates on new features, DeFi insights, and exclusive promotions. No spam.
      </p>
    </form>
  )
}), { ssr: false })

export default function CTASection() {
  const containerRef = React.useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })
  
  const y = useTransform(scrollYProgress, [0, 1], [100, 0])
  const opacity = useTransform(scrollYProgress, [0, 0.3], [0, 1])
  
  return (
    <section 
      ref={containerRef}
      className="py-24 relative bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 overflow-hidden"
    >
      <HoneycombBackground />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Main CTA Section */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            {/* Badge */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 text-sm font-medium"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              New Features Available
            </motion.div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 dark:text-slate-100 leading-tight">
              Transform Your DeFi Experience with{" "}
              <span className="relative">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-500 to-amber-600">
                  BumbleBee
                </span>
                <motion.span 
                  className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                />
              </span>
            </h2>
            
            <p className="text-xl text-slate-600 dark:text-slate-300">
              Join thousands of users who trust BumbleBee for their DeFi journey. Experience the future of
              decentralized finance today.
            </p>
            
            
            
            {/* Newsletter Subscription replacing social proof */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="pt-4"
            >
              <div className="bg-white/30 dark:bg-slate-800/30 backdrop-blur-sm p-5 rounded-xl border border-slate-200 dark:border-slate-700">
                <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">Stay Updated</h4>
                <NewsletterForm />
              </div>
            </motion.div>
          </motion.div>

          <div className="lg:pl-6">
            <motion.div
              style={{ y, opacity }}
              className="relative"
            >
              <div className="absolute -inset-4 bg-gradient-to-r from-amber-500/10 to-purple-500/10 rounded-2xl blur-xl" />
              <AnimatedList
                items={features.map((feature, index) => (
                  <AnimatedCard
                    key={index}
                    className="p-6 backdrop-blur-sm bg-white/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 hover:border-amber-500/50 shadow-lg hover:shadow-xl transition-all duration-300"
                    delay={index}
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-slate-100 dark:bg-slate-700 rounded-lg">
                        {feature.icon}
                      </div>
                      <div className="space-y-2">
                        <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200">
                          {feature.title}
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </AnimatedCard>
                ))}
                staggerDelay={0.15}
                animationType="fadeSlide"
                className="space-y-5"
              />
            </motion.div>
          </div>
        </div>
        
      </div>
    </section>
  )
}