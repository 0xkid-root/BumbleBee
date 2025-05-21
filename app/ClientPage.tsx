"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ThemeProvider } from "@/components/theme-provider"
import HeroSection from "@/components/sections/hero-section"
import FeaturesSection from "@/components/sections/features-section"
import HowItWorksSection from "@/components/sections/how-it-works-section"
import AiBenefitsSection from "@/components/sections/ai-benefits-section"
import RoadmapSection from "@/components/sections/roadmap-section"
import EducationSection from "@/components/sections/education-section"
import CtaSection from "@/components/sections/cta-section"
import FooterSection from "@/components/sections/FooterSection" // Import the new enhanced footer

export default function ClientPage() {
  const [isLoaded, setIsLoaded] = useState(false)
  
  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="min-h-screen flex flex-col">
        {/* Removed navbar to make the landing page headless */}
        <main className="flex-1">
          {isLoaded && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              transition={{ duration: 0.5 }}
            >
              <HeroSection />
              <FeaturesSection />
              <HowItWorksSection />
              <AiBenefitsSection />
              <RoadmapSection />
              <EducationSection />
              <CtaSection />
            </motion.div>
          )}
        </main>
        
        {/* Replace the old footer with the enhanced FooterSection component */}
        <FooterSection />
      </div>
    </ThemeProvider>
  )
}