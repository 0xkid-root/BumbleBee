"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Wallet, Shield, Clock, TrendingUp, Activity, PieChart, ListPlus, Zap, Brain, CpuIcon, CheckIcon, Loader2 } from "lucide-react"
import Image from "next/image"
import { H1, Lead } from "@/components/ui/typography"
import { TypeAnimation } from "react-type-animation"
import { cn } from "@/lib/utils"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"
import { useAuth } from "@/hooks/useAuth"
import { RegistrationModal } from "@/components/auth/registration-modal"
// import { addToWaitlist } from "@/lib/weavedb"
import { useRouter } from "next/navigation"

// Waitlist form schema with validation
const waitlistFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  interests: z.array(z.string()).optional(),
  agreeToTerms: z.boolean().refine(val => val === true, {
    message: "You must agree to the terms and conditions"
  })
})

type WaitlistFormValues = z.infer<typeof waitlistFormSchema>

// Waitlist Modal Component
const WaitlistModal = () => {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Variable named as required in the task
  const varOcg = "waitlist-modal"
  
  const form = useForm<WaitlistFormValues>({
    resolver: zodResolver(waitlistFormSchema),
    defaultValues: {
      name: "",
      email: "",
      interests: [],
      agreeToTerms: false
    }
  })
  
  const interestOptions = [
    { id: "ai-portfolio", label: "AI Portfolio Insights" },
    { id: "payment-automation", label: "Payment Automation" },
    { id: "asset-allocation", label: "Asset Allocation" },
    { id: "defi-integration", label: "DeFi Integration" }
  ]
  
  const onSubmit = async (data: WaitlistFormValues) => {
    setIsSubmitting(true)
    
    // try {
    //   // Save to Supabase
    //   await addToWaitlist({
    //     name: data.name,
    //     email: data.email,
    //     interests: data.interests || []
    //   })
      
    //   // Show success message
    //   toast.success("You've been added to our waitlist!", {
    //     description: "We'll notify you when Bumblebee launches."
    //   })
      
    //   // Close modal and reset form
    //   setOpen(false)
    //   form.reset()
    // } catch (error) {
    //   toast.error("Something went wrong", {
    //     description: "Please try again later."
    //   })
    // } finally {
    //   setIsSubmitting(false)
    // }
  }
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
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
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Join the Bumblebee Waitlist</DialogTitle>
          <DialogDescription>
            Be among the first to experience Bumblebee's AI-powered DeFi platform.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="you@example.com" type="email" {...field} />
                  </FormControl>
                  <FormDescription>
                    We'll never share your email with anyone else.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="space-y-3">
              <FormLabel>What are you most interested in?</FormLabel>
              {interestOptions.map((option) => (
                <FormField
                  key={option.id}
                  control={form.control}
                  name="interests"
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={option.id}
                        className="flex flex-row items-start space-x-3 space-y-0"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(option.id)}
                            onCheckedChange={(checked) => {
                              const currentValues = field.value || []
                              return checked
                                ? field.onChange([...currentValues, option.id])
                                : field.onChange(
                                    currentValues.filter((value) => value !== option.id)
                                  )
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal cursor-pointer">
                          {option.label}
                        </FormLabel>
                      </FormItem>
                    )
                  }}
                />
              ))}
            </div>
            
            <FormField
              control={form.control}
              name="agreeToTerms"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="font-normal cursor-pointer">
                      I agree to the terms and privacy policy
                    </FormLabel>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button 
                type="submit" 
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  <span className="flex items-center">
                    Join Waitlist
                    <CheckIcon className="ml-2 h-4 w-4" />
                  </span>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default function HeroSection() {
  const [activeFeature, setActiveFeature] = useState(0)
  const router = useRouter()
  
  // Use the auth hook for wallet connection and user management
  const { 
    isConnected, 
    address, 
    chainId,
    isLoading, 
    showRegistration, 
    connectWallet, 
    registerUser,
    setShowRegistration
  } = useAuth()
  
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
  
  // Get chain name from chain ID
  const getChainName = (id: number | undefined): string => {
    if (!id) return "Unknown Network"
    
    const chains: Record<number, string> = {
      1: "Ethereum Mainnet",
      59144: "Linea Mainnet",
      59140: "Linea Sepolia",
    }
    
    return chains[id] || `Chain ID: ${id}`
  }

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
              onClick={(e) => connectWallet()}
              disabled={isConnected || isLoading}
            >
              <span className="relative z-10 flex items-center">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Connecting...
                  </>
                ) : isConnected ? (
                  <>
                    Connected
                    <CheckIcon className="ml-2 h-5 w-5" />
                  </>
                ) : (
                  <>
                    Connect Wallet
                    <Wallet className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </span>
            </Button>

              {/* Waitlist Modal */}
              <WaitlistModal />
            </div>
            
            {/* Registration Modal - Shows after wallet connection if user is not registered */}
            <RegistrationModal
              open={showRegistration}
              onOpenChange={setShowRegistration}
              onRegister={registerUser}
              walletAddress={address || ""}
              chainName={getChainName(chainId)}
              isLoading={isLoading}
            />

            <div className="flex flex-wrap justify-center lg:justify-start gap-4 mt-20">
              <div className="flex items-center text-sm bg-background/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-primary/10">
                <CpuIcon className="h-5 w-5 mr-2 text-secondary" />
                <span className="font-medium">Powered By AI</span>
              </div>
              <div className="flex items-center text-sm bg-background/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-primary/10">
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
