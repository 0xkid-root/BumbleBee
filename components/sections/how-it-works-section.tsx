"use client"

import { useState, useRef, useEffect } from "react"
import { motion, useInView, useAnimation } from "framer-motion"
import { ArrowRight, Wallet, Brain, BarChart3, Zap } from "lucide-react"
import { cn } from "@/lib/utils"

// Updated steps array with avatar paths instead of images
const steps = [
  {
    id: 1,
    title: "Connect Your Wallet",
    description:
      "Securely connect your crypto wallet with a single click. We support MetaMask, WalletConnect, and other popular wallets.",
    icon: Wallet,
    avatar: "/2.png", 
    color: "bg-primary/10 text-primary",
    delay: 0.1,
  },
  {
    id: 2,
    title: "AI-Powered Analysis",
    description:
      "Our AI analyzes your portfolio, transaction history, and market conditions to provide personalized insights and recommendations.",
    icon: Brain,
    avatar: "/avatars/ai-analysis-avatar.svg", // Path to avatar illustration
    color: "bg-accent/10 text-accent",
    delay: 0.2,
  },
  {
    id: 3,
    title: "Optimize Your Portfolio",
    description:
      "Rebalance your portfolio based on AI recommendations, set up automated strategies, and track performance in real-time.",
    icon: BarChart3,
    avatar: "/avatars/portfolio-avatar.svg", // Path to avatar illustration
    color: "bg-secondary/10 text-secondary",
    delay: 0.3,
  },
  {
    id: 4,
    title: "Automate Your DeFi",
    description:
      "Set up recurring payments, split expenses with friends, and automate your DeFi activities with our smart contract infrastructure.",
    icon: Zap,
    avatar: "/avatars/defi-avatar.svg", // Path to avatar illustration
    color: "bg-primary/10 text-primary",
    delay: 0.4,
  },
]

export default function HowItWorksSection() {
  const [activeStep, setActiveStep] = useState(1)
  const controls = useAnimation()
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 })

  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    }
  }, [isInView, controls])

  useEffect(() => {
    // Auto-advance steps every 5 seconds
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev % steps.length) + 1)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  }

  const avatarVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
    exit: {
      scale: 0.8,
      opacity: 0,
      transition: { duration: 0.3, ease: "easeIn" },
    },
  }

  return (
    <section id="how-it-works" ref={sectionRef} className="relative py-20 md:py-32 overflow-hidden bg-background">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute top-[60%] -right-[5%] w-[30%] h-[40%] bg-accent/5 rounded-full blur-3xl" />
        <div className="honeycomb-bg absolute inset-0 opacity-[0.03]" />
      </div>

      <div className="container relative z-10">
        <motion.div
          className="text-center mb-16 md:mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={controls}
          variants={{
            visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
          }}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            How <span className="text-gradient-primary">Bumblebee</span> Works
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Our platform simplifies DeFi with AI-powered tools that make managing your crypto assets effortless and
            intelligent.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Steps navigation */}
          <motion.div
            className="flex flex-col space-y-6"
            variants={containerVariants}
            initial="hidden"
            animate={controls}
          >
            {steps.map((step) => (
              <motion.div
                key={step.id}
                variants={itemVariants}
                className={cn(
                  "relative flex items-start p-6 rounded-xl transition-all duration-300 cursor-pointer group",
                  activeStep === step.id
                    ? "bg-card shadow-lg shadow-primary/5 border border-border"
                    : "hover:bg-card/50",
                )}
                onClick={() => setActiveStep(step.id)}
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Step number indicator */}
                <motion.div
                  className={cn(
                    "flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center mr-4",
                    step.color,
                  )}
                  initial={{ scale: 1 }}
                  animate={activeStep === step.id ? { scale: [1, 1.1, 1] } : { scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <step.icon className="w-6 h-6" />
                </motion.div>

                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2 flex items-center">
                    {step.title}
                    {activeStep === step.id && (
                      <motion.div
                        className="ml-2 text-primary"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <ArrowRight className="w-4 h-4" />
                      </motion.div>
                    )}
                  </h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>

                {/* Active indicator */}
                {activeStep === step.id && (
                  <motion.div
                    className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-l-xl"
                    layoutId="activeStep"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </motion.div>
            ))}

            <motion.div className="mt-8" variants={itemVariants}>
            </motion.div>
          </motion.div>

          {/* Visual representation with avatars */}
          <motion.div
            className="relative h-[400px] md:h-[500px] bg-card rounded-2xl overflow-hidden border border-border shadow-xl flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={controls}
            variants={{
              visible: {
                opacity: 1,
                scale: 1,
                transition: { duration: 0.7, delay: 0.2 },
              },
            }}
          >
            {steps.map((step) => (
              <motion.div
                key={step.id}
                className="absolute inset-0 flex items-center justify-center p-6"
                initial="hidden"
                animate={activeStep === step.id ? "visible" : "hidden"}
                variants={avatarVariants}
                exit="exit"
              >
                <img
                  src={step.avatar || "/placeholder-avatar.svg"} // Fallback avatar
                  alt={`${step.title} avatar`}
                  className="w-3/4 h-3/4 object-contain" // Adjusted for avatar style
                />

                {/* Step indicator */}
                <div className="absolute bottom-4 right-4 bg-background/80 backdrop-blur-sm px-4 py-2 rounded-full border border-border">
                  <p className="text-sm font-medium">
                    Step {step.id} of {steps.length}
                  </p>
                </div>
              </motion.div>
            ))}

            {/* Progress dots */}
            <div className="absolute bottom-6 left-0 right-0 flex justify-center space-x-2">
              {steps.map((step) => (
                <button
                  key={step.id}
                  onClick={() => setActiveStep(step.id)}
                  className="group p-2"
                  aria-label={`Go to step ${step.id}`}
                >
                  <motion.div
                    className={cn("w-2 h-2 rounded-full", activeStep === step.id ? "bg-primary" : "bg-muted")}
                    initial={false}
                    animate={
                      activeStep === step.id
                        ? { scale: [1, 1.3, 1], backgroundColor: "var(--primary)" }
                        : { scale: 1, backgroundColor: "var(--muted)" }
                    }
                    transition={{ duration: 0.5 }}
                  />
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
