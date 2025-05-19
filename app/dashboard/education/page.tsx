"use client"

import { useState } from "react"
import { BookOpen, Brain, Lightbulb, GraduationCap, ChevronRight, CheckCircle, Award, Users, Clock, BarChart3, Globe } from "lucide-react"

export default function AIEducationPage() {
  const [selectedTab, setSelectedTab] = useState("overview")

  const features = [
    {
      icon: <Brain className="h-5 w-5 text-cyan-500" />,
      title: "Personalized Learning",
      description: "Tailored learning paths based on your knowledge level and goals"
    },
    {
      icon: <Lightbulb className="h-5 w-5 text-cyan-500" />,
      title: "Interactive Tutorials",
      description: "Hands-on learning with real-time feedback and guidance"
    },
    {
      icon: <BookOpen className="h-5 w-5 text-cyan-500" />,
      title: "AI-Powered Q&A",
      description: "Get instant answers to your crypto and blockchain questions"
    },
    {
      icon: <BarChart3 className="h-5 w-5 text-cyan-500" />,
      title: "Practice Environment",
      description: "Simulated trading environment to apply concepts without risk"
    },
    {
      icon: <GraduationCap className="h-5 w-5 text-cyan-500" />,
      title: "Expert Content",
      description: "Curated material from leading blockchain experts and researchers"
    },
    {
      icon: <CheckCircle className="h-5 w-5 text-cyan-500" />,
      title: "Progress Tracking",
      description: "Monitor your learning journey with detailed assessments"
    },
    {
      icon: <Award className="h-5 w-5 text-cyan-500" />,
      title: "Earn Certificates",
      description: "Receive credentials as you complete modules and courses"
    },
    {
      icon: <Users className="h-5 w-5 text-cyan-500" />,
      title: "Community Forums",
      description: "Connect with peers to discuss concepts and share insights"
    }
  ]

  const modules = [
    {
      title: "Blockchain Fundamentals",
      level: "Beginner",
      duration: "4 weeks",
      topics: ["Distributed Ledger Technology", "Consensus Mechanisms", "Cryptography Basics", "Blockchain Architecture"]
    },
    {
      title: "Smart Contracts & DApps",
      level: "Intermediate",
      duration: "6 weeks",
      topics: ["Smart Contract Development", "Solidity Programming", "Testing & Security", "DApp Architecture"]
    },
    {
      title: "DeFi Ecosystem",
      level: "Advanced",
      duration: "8 weeks",
      topics: ["Lending & Borrowing", "Automated Market Makers", "Yield Farming", "Risk Management"]
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-cyan-600 to-cyan-400 py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-white p-3 rounded-full">
              <BookOpen className="h-10 w-10 text-cyan-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">AI-Powered Crypto Education</h1>
          <p className="text-xl text-cyan-50 max-w-2xl mx-auto mb-8">
            Learn blockchain, DeFi, and crypto concepts with our personalized educational platform
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="bg-white text-cyan-600 px-6 py-3 rounded-lg font-medium hover:bg-cyan-50 transition flex items-center justify-center">
              Join Waitlist <ChevronRight className="ml-2 h-4 w-4" />
            </button>
            <button className="bg-cyan-700 text-white px-6 py-3 rounded-lg font-medium hover:bg-cyan-800 transition flex items-center justify-center">
              Learn More
            </button>
          </div>
          <div className="mt-8 inline-flex items-center px-3 py-1 bg-cyan-800 bg-opacity-30 rounded-full text-cyan-50">
            <Clock className="h-4 w-4 mr-2" /> Coming in Q3 2024
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-6xl mx-auto px-4 mt-8">
        <div className="flex overflow-x-auto space-x-4 border-b border-gray-200 pb-2">
          <button
            onClick={() => setSelectedTab("overview")}
            className={`pb-2 px-1 font-medium whitespace-nowrap ${selectedTab === "overview" ? "text-cyan-600 border-b-2 border-cyan-600" : "text-gray-500 hover:text-gray-700"}`}
          >
            Overview
          </button>
          <button
            onClick={() => setSelectedTab("modules")}
            className={`pb-2 px-1 font-medium whitespace-nowrap ${selectedTab === "modules" ? "text-cyan-600 border-b-2 border-cyan-600" : "text-gray-500 hover:text-gray-700"}`}
          >
            Modules
          </button>
          <button
            onClick={() => setSelectedTab("features")}
            className={`pb-2 px-1 font-medium whitespace-nowrap ${selectedTab === "features" ? "text-cyan-600 border-b-2 border-cyan-600" : "text-gray-500 hover:text-gray-700"}`}
          >
            Features
          </button>
          <button
            onClick={() => setSelectedTab("faq")}
            className={`pb-2 px-1 font-medium whitespace-nowrap ${selectedTab === "faq" ? "text-cyan-600 border-b-2 border-cyan-600" : "text-gray-500 hover:text-gray-700"}`}
          >
            FAQ
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto py-12 px-4">
        {/* Overview Tab */}
        {selectedTab === "overview" && (
          <div className="space-y-12">
            {/* About Section */}
            <div className="flex flex-col md:flex-row gap-12 items-center">
              <div className="md:w-1/2">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Learn Crypto at Your Own Pace</h2>
                <p className="text-gray-600 mb-6">
                  Bumblebee's AI Education platform adapts to your knowledge level, 
                  learning style, and goals to create a personalized educational 
                  experience that maximizes your understanding of blockchain technology.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-cyan-500 mt-1 mr-3" />
                    <p className="text-gray-700">Beginner-friendly explanations with interactive visualizations</p>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-cyan-500 mt-1 mr-3" />
                    <p className="text-gray-700">Deep technical content for experienced developers and traders</p>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-cyan-500 mt-1 mr-3" />
                    <p className="text-gray-700">Learn by doing with hands-on projects and simulations</p>
                  </div>
                </div>
              </div>
              <div className="md:w-1/2 bg-gray-100 rounded-lg p-6">
                <div className="aspect-video bg-white rounded-lg shadow-lg p-4 flex items-center justify-center">
                  <div className="text-center">
                    <BookOpen className="h-16 w-16 text-cyan-500 mx-auto mb-4" />
                    <p className="text-gray-500">Interactive Preview Coming Soon</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-cyan-50 rounded-xl p-8">
              <div className="text-center">
                <p className="text-4xl font-bold text-cyan-600 mb-2">20+</p>
                <p className="text-gray-600">Learning Modules</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-cyan-600 mb-2">100+</p>
                <p className="text-gray-600">Interactive Lessons</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-cyan-600 mb-2">24/7</p>
                <p className="text-gray-600">AI Tutor Support</p>
              </div>
            </div>

            {/* Feature Highlights */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">Key Features</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {features.slice(0, 4).map((feature, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition">
                    <div className="bg-cyan-50 p-2 rounded-full inline-block mb-4">
                      {feature.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Modules Tab */}
        {selectedTab === "modules" && (
          <div>
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Education Modules</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Our comprehensive curriculum covers everything from blockchain basics to advanced DeFi concepts,
                all delivered through our adaptive AI learning system.
              </p>
            </div>
            
            <div className="space-y-6">
              {modules.map((module, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">{module.title}</h3>
                      <div className="flex items-center gap-4 mb-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-cyan-100 text-cyan-800">
                          {module.level}
                        </span>
                        <span className="inline-flex items-center text-sm text-gray-500">
                          <Clock className="h-4 w-4 mr-1" /> {module.duration}
                        </span>
                      </div>
                    </div>
                    <button className="bg-cyan-50 text-cyan-600 px-4 py-2 rounded-lg font-medium hover:bg-cyan-100 transition mt-4 md:mt-0">
                      Preview Module
                    </button>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-gray-500 mb-2">Topics covered:</p>
                    <div className="flex flex-wrap gap-2">
                      {module.topics.map((topic, i) => (
                        <span key={i} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 text-center">
              <p className="text-gray-600 mb-4">More modules will be announced before launch</p>
              <button className="bg-cyan-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-cyan-700 transition">
                Join Waitlist for Early Access
              </button>
            </div>
          </div>
        )}

        {/* Features Tab */}
        {selectedTab === "features" && (
          <div>
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Platform Features</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Our AI-powered platform offers a comprehensive suite of features designed to make learning 
                blockchain and crypto concepts engaging, interactive, and effective.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition">
                  <div className="flex items-start">
                    <div className="bg-cyan-50 p-2 rounded-full mr-4">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">{feature.title}</h3>
                      <p className="text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FAQ Tab */}
        {selectedTab === "faq" && (
          <div>
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Frequently Asked Questions</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Find answers to common questions about our AI Education platform
              </p>
            </div>
            
            <div className="space-y-6 max-w-3xl mx-auto">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">When will the AI Education platform launch?</h3>
                <p className="text-gray-600">The platform is scheduled to launch in Q3 2024. Join our waitlist to get early access and updates.</p>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Is the platform suitable for complete beginners?</h3>
                <p className="text-gray-600">Absolutely! Our AI adapts to your knowledge level, starting with fundamentals for beginners and progressing at your pace.</p>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Will I need technical skills to use the platform?</h3>
                <p className="text-gray-600">No technical skills are required to start. For modules on development, we provide all the necessary foundational knowledge.</p>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">How does the AI personalization work?</h3>
                <p className="text-gray-600">Our AI analyzes your learning style, knowledge gaps, and goals to create a tailored learning path, adjusting difficulty and content based on your progress.</p>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Are there any certifications available?</h3>
                <p className="text-gray-600">Yes, you can earn certificates upon completing modules and full courses, which can be shared on your professional profiles.</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="bg-cyan-600 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Transform Your Crypto Knowledge?</h2>
          <p className="text-xl text-cyan-100 mb-8">
            Join our waitlist to get early access and be the first to experience our AI-powered education platform.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="bg-white text-cyan-600 px-6 py-3 rounded-lg font-medium hover:bg-cyan-50 transition">
              Join Waitlist
            </button>
            <button className="bg-cyan-700 text-white px-6 py-3 rounded-lg font-medium hover:bg-cyan-800 transition">
              Learn More
            </button>
          </div>
          <div className="mt-8 flex justify-center space-x-4">
            <a href="#" className="text-cyan-100 hover:text-white">
              <Globe className="h-6 w-6" />
            </a>
            <a href="#" className="text-cyan-100 hover:text-white">
              <Users className="h-6 w-6" />
            </a>
            <a href="#" className="text-cyan-100 hover:text-white">
              <BookOpen className="h-6 w-6" />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}