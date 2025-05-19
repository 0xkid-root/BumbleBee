"use client"

import { useState } from "react"
import { 
  Coins, 
  BarChart3, 
  Zap, 
  ShieldCheck, 
  ArrowRight, 
  ChevronRight, 
  Clock,
  Bell
} from "lucide-react"

export default function DefiYieldsPage() {
  const [selectedTab, setSelectedTab] = useState('overview')
  const [notifyEmail, setNotifyEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  
  const features = [
    {
      icon: <Coins className="h-6 w-6 text-amber-500" />,
      title: "Curated Yield Protocols",
      description: "Access high-yield DeFi protocols with comprehensive risk assessments"
    },
    {
      icon: <Zap className="h-6 w-6 text-amber-500" />,
      title: "Automated Strategies",
      description: "Deploy capital with gas-optimized yield farming strategies"
    },
    {
      icon: <BarChart3 className="h-6 w-6 text-amber-500" />,
      title: "Performance Tracking",
      description: "Monitor real-time APY and historical yield performance"
    },
    {
      icon: <ShieldCheck className="h-6 w-6 text-amber-500" />,
      title: "Risk Protection",
      description: "Benefit from impermanent loss protection for liquidity providers"
    }
  ]
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitted(true)
    // Would normally send this to an API
    console.log("Notify email:", notifyEmail)
  }
  
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-amber-500 to-amber-600 py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-amber-800 bg-opacity-30 text-white text-sm mb-4">
                <Clock className="h-4 w-4 mr-2" />
                <span>Coming Q4 2024</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">DeFi Yields</h1>
              <p className="text-xl md:text-2xl mb-6 text-white text-opacity-90">
                Access the best yield opportunities across decentralized finance with automated strategies and risk management.
              </p>
              <div className="flex space-x-4">
                <button className="bg-white text-amber-600 px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition flex items-center">
                  Learn More
                  <ChevronRight className="ml-2 h-5 w-5" />
                </button>
                <button onClick={() => {
                    const formElement = document.getElementById('notify-form');
                    if (formElement) {
                      formElement.scrollIntoView({ behavior: 'smooth' });
                    }
                  }} 
                  className="bg-transparent border-2 border-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:bg-opacity-10 transition">
                  Get Notified
                </button>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="relative">
                <div className="absolute -inset-0.5 bg-amber-400 rounded-lg blur opacity-30"></div>
                <div className="relative bg-slate-800 p-6 rounded-lg border border-amber-500/30">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Top Yield Opportunities</h3>
                    <span className="text-amber-400 text-sm font-medium">PREVIEW</span>
                  </div>
                  <div className="space-y-4">
                    {[
                      { protocol: "Aave V3", asset: "ETH", apy: "5.2%", risk: "Low" },
                      { protocol: "Compound", asset: "USDC", apy: "8.7%", risk: "Medium" },
                      { protocol: "Curve", asset: "BTC/ETH", apy: "12.4%", risk: "Medium" },
                      { protocol: "Lido", asset: "ETH", apy: "4.8%", risk: "Low" }
                    ].map((item, i) => (
                      <div key={i} className="flex justify-between items-center p-3 bg-slate-700 bg-opacity-40 rounded-md">
                        <div>
                          <div className="font-medium">{item.protocol}</div>
                          <div className="text-sm text-slate-300">{item.asset}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-amber-400">{item.apy}</div>
                          <div className="text-xs text-slate-300">Risk: {item.risk}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 text-center">
                    <span className="text-sm text-slate-400">* Estimates based on current market conditions</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Content Tabs */}
      <div className="container mx-auto px-4 py-12">
        <div className="border-b border-slate-700 mb-8">
          <div className="flex space-x-8">
            {['overview', 'features', 'strategy'].map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                className={`pb-4 font-medium text-lg capitalize ${
                  selectedTab === tab 
                    ? 'border-b-2 border-amber-500 text-amber-500' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
        
        <div className="mb-16">
          {selectedTab === 'overview' && (
            <div>
              <h2 className="text-3xl font-bold mb-6">The Future of DeFi Yield Optimization</h2>
              <p className="text-lg text-slate-300 mb-8">
                BumbleBee Finance is building the next generation of yield aggregation tools, 
                designed to help both beginners and advanced DeFi users maximize returns while 
                minimizing risks across the decentralized finance ecosystem.
              </p>
              
              <div className="grid md:grid-cols-2 gap-6 mb-12">
                {features.map((feature, i) => (
                  <div key={i} className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                    <div className="mb-4 bg-slate-700 inline-flex p-3 rounded-lg">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-slate-300">{feature.description}</p>
                  </div>
                ))}
              </div>
              
              <div className="bg-gradient-to-r from-amber-500/10 to-amber-600/5 rounded-lg p-8 border border-amber-500/20">
                <h3 className="text-2xl font-semibold mb-4">Why Choose BumbleBee DeFi Yields?</h3>
                <ul className="space-y-3">
                  {[
                    "One-click deposit and withdrawal across multiple protocols",
                    "Customizable risk profiles from conservative to aggressive",
                    "Yield aggregation across lending, staking, and liquidity pools",
                    "Smart rebalancing to maximize returns based on market conditions"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start">
                      <div className="bg-amber-500 rounded-full p-1 mr-3 mt-1">
                        <ChevronRight className="h-3 w-3 text-slate-900" />
                      </div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          
          {selectedTab === 'features' && (
            <div>
              <h2 className="text-3xl font-bold mb-6">Powerful Features</h2>
              <p className="text-lg text-slate-300 mb-8">
                Our DeFi Yields platform comes packed with innovative features to help you navigate the complex world of decentralized finance.
              </p>
              
              <div className="space-y-8">
                {[
                  {
                    title: "Curated selection of high-yield DeFi protocols with risk assessments",
                    description: "Our team of DeFi analysts thoroughly researches and vets protocols before adding them to our platform, providing you with comprehensive risk metrics and security ratings."
                  },
                  {
                    title: "Automated yield farming strategies with gas optimization",
                    description: "Set your investment goals and risk tolerance, then let our smart contracts do the rest. Our algorithms continuously monitor gas prices to ensure transactions are executed at optimal times."
                  },
                  {
                    title: "Real-time APY tracking and historical performance data",
                    description: "Monitor your investments with our intuitive dashboard showing real-time yields, historical performance, and projected returns based on current market conditions."
                  },
                  {
                    title: "Impermanent loss protection for liquidity providers",
                    description: "Our unique insurance mechanism helps protect liquidity providers from impermanent loss, making LP positions more attractive and stable for long-term investors."
                  }
                ].map((feature, i) => (
                  <div key={i} className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                    <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                    <p className="text-slate-300">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {selectedTab === 'strategy' && (
            <div>
              <h2 className="text-3xl font-bold mb-6">Yield Strategy</h2>
              <p className="text-lg text-slate-300 mb-8">
                Our innovative approaches to yield generation are designed to work across market conditions while maintaining strong risk management.
              </p>
              
              <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 mb-8">
                <h3 className="text-xl font-semibold mb-4">Smart Yield Allocation</h3>
                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-slate-700 p-4 rounded-lg text-center">
                    <div className="font-bold text-2xl text-amber-400 mb-2">40%</div>
                    <div className="text-slate-300">Lending Protocols</div>
                  </div>
                  <div className="bg-slate-700 p-4 rounded-lg text-center">
                    <div className="font-bold text-2xl text-amber-400 mb-2">30%</div>
                    <div className="text-slate-300">Liquidity Pools</div>
                  </div>
                  <div className="bg-slate-700 p-4 rounded-lg text-center">
                    <div className="font-bold text-2xl text-amber-400 mb-2">30%</div>
                    <div className="text-slate-300">Staking & Governance</div>
                  </div>
                </div>
                <p className="text-slate-300">
                  Our default allocation strategy balances stable returns from lending protocols with higher yields from liquidity provision and staking rewards.
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                  <h3 className="text-xl font-semibold mb-3">Risk Management</h3>
                  <ul className="space-y-3 text-slate-300">
                    <li className="flex items-start">
                      <div className="bg-amber-500 rounded-full p-1 mr-3 mt-1">
                        <ChevronRight className="h-3 w-3 text-slate-900" />
                      </div>
                      <span>Continuous smart contract auditing</span>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-amber-500 rounded-full p-1 mr-3 mt-1">
                        <ChevronRight className="h-3 w-3 text-slate-900" />
                      </div>
                      <span>Protocol diversification to minimize single points of failure</span>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-amber-500 rounded-full p-1 mr-3 mt-1">
                        <ChevronRight className="h-3 w-3 text-slate-900" />
                      </div>
                      <span>Real-time risk monitoring with automated rebalancing</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                  <h3 className="text-xl font-semibold mb-3">Optimization Methods</h3>
                  <ul className="space-y-3 text-slate-300">
                    <li className="flex items-start">
                      <div className="bg-amber-500 rounded-full p-1 mr-3 mt-1">
                        <ChevronRight className="h-3 w-3 text-slate-900" />
                      </div>
                      <span>Auto-compounding for maximum growth</span>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-amber-500 rounded-full p-1 mr-3 mt-1">
                        <ChevronRight className="h-3 w-3 text-slate-900" />
                      </div>
                      <span>Reward token harvesting and optimal swap timing</span>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-amber-500 rounded-full p-1 mr-3 mt-1">
                        <ChevronRight className="h-3 w-3 text-slate-900" />
                      </div>
                      <span>Multi-chain deployment for best available yields</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Notification Form */}
        <div id="notify-form" className="bg-slate-800 rounded-lg p-8 border border-slate-700 max-w-2xl mx-auto">
          <div className="flex items-center mb-6">
            <Bell className="h-6 w-6 text-amber-500 mr-3" />
            <h3 className="text-2xl font-semibold">Get Notified on Launch</h3>
          </div>
          
          {isSubmitted ? (
            <div className="bg-amber-500/20 p-4 rounded-lg text-center">
              <p className="text-amber-400 font-medium">Thank you! We'll notify you when DeFi Yields launches.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">Email Address</label>
                <input
                  type="email"
                  id="email"
                  value={notifyEmail}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNotifyEmail(e.target.value)}
                  required
                  placeholder="your@email.com"
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 py-3 rounded-lg font-semibold hover:opacity-90 transition flex items-center justify-center"
              >
                Notify Me on Launch
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
              <p className="text-xs text-slate-400 text-center">
                We respect your privacy and will only use your email to send product updates.
              </p>
            </form>
          )}
        </div>
      </div>
      
      {/* Footer */}
      <div className="bg-slate-800 mt-16 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center">
                <Coins className="h-6 w-6 text-amber-500 mr-2" />
                <span className="text-xl font-bold">BumbleBee Finance</span>
              </div>
            </div>
            <div className="flex space-x-6">
              <a href="https://docs.bumblebee.finance/defi-yields" className="text-slate-300 hover:text-amber-500">Documentation</a>
              <a href="#" className="text-slate-300 hover:text-amber-500">Twitter</a>
              <a href="#" className="text-slate-300 hover:text-amber-500">Discord</a>
              <a href="#" className="text-slate-300 hover:text-amber-500">GitHub</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}