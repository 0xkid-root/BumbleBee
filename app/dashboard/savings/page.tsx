"use client"

import { useState } from "react";
import { 
  PiggyBank, 
  Wallet, 
  TrendingUp, 
  Shield, 
  Clock, 
  AlertCircle, 
  ChevronRight, 
  Bell,
  BarChart3,
  Lock
} from "lucide-react";

export default function SavingsPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [notifyEmail, setNotifyEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setNotifyEmail("");
  };
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-rose-500 to-rose-600 opacity-90"></div>
        <div className="absolute inset-0 bg-[url('/api/placeholder/1200/400')] bg-cover bg-center mix-blend-overlay"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-white/10 p-3 rounded-full backdrop-blur-sm">
                <PiggyBank className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Savings
            </h1>
            <p className="mt-6 text-xl text-white/90 max-w-2xl mx-auto">
              Earn interest on your crypto assets with our secure and flexible savings options.
            </p>
            <div className="mt-8">
              <span className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-medium">
                <Clock className="mr-2 h-4 w-4" />
                Coming in Q3 2024
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tab Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8">
            <button 
              onClick={() => setActiveTab("overview")}
              className={`pb-4 px-1 font-medium text-sm ${activeTab === "overview" ? 
                "border-b-2 border-rose-500 text-rose-600 dark:text-rose-400" : 
                "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"}`}
            >
              Overview
            </button>
            <button 
              onClick={() => setActiveTab("features")}
              className={`pb-4 px-1 font-medium text-sm ${activeTab === "features" ? 
                "border-b-2 border-rose-500 text-rose-600 dark:text-rose-400" : 
                "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"}`}
            >
              Features
            </button>
            <button 
              onClick={() => setActiveTab("faq")}
              className={`pb-4 px-1 font-medium text-sm ${activeTab === "faq" ? 
                "border-b-2 border-rose-500 text-rose-600 dark:text-rose-400" : 
                "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"}`}
            >
              FAQ
            </button>
          </nav>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {activeTab === "overview" && (
          <div className="space-y-12">
            {/* Preview Cards */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Flexible Savings */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center">
                    <div className="bg-rose-100 dark:bg-rose-900/30 p-3 rounded-lg">
                      <Wallet className="h-6 w-6 text-rose-600 dark:text-rose-400" />
                    </div>
                    <h3 className="ml-4 text-lg font-medium text-gray-900 dark:text-gray-100">Flexible Savings</h3>
                  </div>
                  <div className="mt-6 flex justify-between items-baseline">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Estimated APY</p>
                      <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">4.5%</p>
                    </div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                      No lock-up
                    </span>
                  </div>
                  <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                    Deposit and withdraw anytime with no penalties. Interest calculated daily and paid weekly.
                  </p>
                  <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Supported assets</span>
                      <span className="text-gray-900 dark:text-gray-100">BTC, ETH, USDC, BNB</span>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-900/50 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Coming Soon</span>
                    <button disabled className="inline-flex items-center text-sm font-medium text-rose-600 dark:text-rose-400 opacity-50 cursor-not-allowed">
                      Learn more
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Fixed-Term Savings */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center">
                    <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg">
                      <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="ml-4 text-lg font-medium text-gray-900 dark:text-gray-100">Fixed-Term Savings</h3>
                  </div>
                  <div className="mt-6 flex justify-between items-baseline">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Estimated APY</p>
                      <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">7.2%</p>
                    </div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                      90-day lock
                    </span>
                  </div>
                  <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                    Higher rates with fixed terms. Choose from 30, 60, or 90 day periods with auto-renewal options.
                  </p>
                  <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Supported assets</span>
                      <span className="text-gray-900 dark:text-gray-100">BTC, ETH, USDC, BNB, DOT</span>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-900/50 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Coming Soon</span>
                    <button disabled className="inline-flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 opacity-50 cursor-not-allowed">
                      Learn more
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Interest Rate Calculator Preview */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Interest Calculator Preview</h3>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  See how your savings could grow over time with our competitive rates.
                </p>
                
                <div className="mt-6 bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 text-center">
                  <div className="flex items-center justify-center h-48">
                    <div className="flex flex-col items-center">
                      <BarChart3 className="h-12 w-12 text-gray-400" />
                      <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                        Interest calculator will be available when the Savings feature launches
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Get Notified */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
              <div className="p-6">
                <div className="sm:flex sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                      Be the first to know when Savings launches
                    </h3>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                      Get notified when our Savings feature is available for early access.
                    </p>
                  </div>
                  <div className="mt-4 sm:mt-0">
                    <Bell className="h-6 w-6 text-rose-500" />
                  </div>
                </div>
                
                {isSubmitted ? (
                  <div className="mt-6 bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <AlertCircle className="h-5 w-5 text-green-400" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-green-800 dark:text-green-400">
                          Thank you! We'll notify you when Savings launches.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="mt-6">
                    <div className="flex">
                      <input
                        type="email"
                        value={notifyEmail}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNotifyEmail(e.target.value)}
                        required
                        className="flex-1 min-w-0 block w-full px-3 py-2 rounded-l-md border border-gray-300 dark:border-gray-700 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-rose-500 focus:border-rose-500 sm:text-sm dark:bg-gray-800 dark:text-gray-100"
                        placeholder="Enter your email"
                      />
                      <button
                        type="submit"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md shadow-sm text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
                      >
                        Notify me
                      </button>
                    </div>
                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                      We'll never share your email with anyone else.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}
        
        {activeTab === "features" && (
          <div className="space-y-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Upcoming Features</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard 
                icon={<PiggyBank className="h-6 w-6 text-rose-600 dark:text-rose-400" />}
                title="Flexible & Fixed-Term Options"
                description="Choose between instant access or higher-yield lock-up periods based on your financial goals."
              />
              
              <FeatureCard 
                icon={<TrendingUp className="h-6 w-6 text-rose-600 dark:text-rose-400" />}
                title="Automatic Compounding"
                description="Watch your savings grow faster with automatically compounded interest for maximum returns."
              />
              
              <FeatureCard 
                icon={<Wallet className="h-6 w-6 text-rose-600 dark:text-rose-400" />}
                title="Instant Withdrawals"
                description="Access your funds instantly with no penalties for our flexible savings options."
              />
              
              <FeatureCard 
                icon={<BarChart3 className="h-6 w-6 text-rose-600 dark:text-rose-400" />}
                title="Analytics & Projections"
                description="Track your growth and visualize future earnings with detailed reporting tools."
              />
              
              <FeatureCard 
                icon={<Bell className="h-6 w-6 text-rose-600 dark:text-rose-400" />}
                title="Smart Notifications"
                description="Stay informed about rate changes, maturity dates, and new opportunities."
              />
              
              <FeatureCard 
                icon={<Shield className="h-6 w-6 text-rose-600 dark:text-rose-400" />}
                title="Institutional-Grade Security"
                description="Rest easy knowing your assets are protected by industry-leading security measures."
              />
              
              <FeatureCard 
                icon={<Lock className="h-6 w-6 text-rose-600 dark:text-rose-400" />}
                title="Multi-Currency Support"
                description="Earn interest on all major cryptocurrencies in your portfolio."
              />
              
              <FeatureCard 
                icon={<TrendingUp className="h-6 w-6 text-rose-600 dark:text-rose-400" />}
                title="Portfolio Integration"
                description="Seamlessly manage your savings alongside your other investments for holistic wealth management."
              />
            </div>
            
            <div className="bg-rose-50 dark:bg-rose-900/20 rounded-xl p-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-6 w-6 text-rose-600 dark:text-rose-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-rose-800 dark:text-rose-400">Want to learn more?</h3>
                  <div className="mt-2 text-sm text-rose-700 dark:text-rose-300">
                    <p>
                      Check out our detailed documentation to understand how our savings options will work.
                    </p>
                  </div>
                  <div className="mt-4">
                    <div className="-mx-2 -my-1.5 flex">
                      <a 
                        href="https://docs.bumblebee.finance/savings"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-rose-100 dark:bg-rose-800 px-3 py-1.5 rounded-md text-sm font-medium text-rose-800 dark:text-rose-100 hover:bg-rose-200 dark:hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-rose-50 focus:ring-rose-600"
                      >
                        View Documentation
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === "faq" && (
          <div className="space-y-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Frequently Asked Questions</h2>
            
            <div className="space-y-6">
              <FaqItem
                question="When will the Savings feature be available?"
                answer="The Savings feature is scheduled to launch in Q3 2024. You can sign up for notifications to be among the first to know when it's available."
              />
              
              <FaqItem
                question="How are interest rates determined?"
                answer="Interest rates are determined by market conditions, liquidity demands, and risk assessments. We aim to provide competitive rates while ensuring sustainable returns and security of funds."
              />
              
              <FaqItem
                question="Is there a minimum deposit amount?"
                answer="We plan to offer low minimum deposits to make our savings options accessible to everyone. Exact minimums will be announced closer to launch."
              />
              
              <FaqItem
                question="How secure will my deposits be?"
                answer="Security is our top priority. We'll implement institutional-grade security measures including cold storage, insurance coverage, regular audits, and multi-signature authorization protocols."
              />
              
              <FaqItem
                question="Can I withdraw my funds anytime?"
                answer="For flexible savings, yes - you can withdraw anytime with no penalties. Fixed-term savings will have predetermined lock-up periods with higher interest rates as a reward."
              />
              
              <FaqItem
                question="Which cryptocurrencies will be supported?"
                answer="At launch, we plan to support major cryptocurrencies including BTC, ETH, USDC, and BNB. Additional assets will be added over time based on user demand and security considerations."
              />
            </div>
          </div>
        )}
      </div>
      
      {/* Footer CTA */}
      <div className="bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100 sm:text-3xl">
            <span className="block">Ready to grow your crypto?</span>
            <span className="block text-rose-600 dark:text-rose-400">Get notified when Savings launches.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <a
                href="https://docs.bumblebee.finance/savings"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-rose-600 hover:bg-rose-700"
              >
                Learn more
              </a>
            </div>
            <div className="ml-3 inline-flex rounded-md shadow">
              <button
                onClick={() => {
                  setActiveTab("overview");
                  window.scrollTo({top: 0, behavior: 'smooth'});
                }}
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-rose-600 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:text-rose-400 dark:hover:bg-gray-700"
              >
                Back to top
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper Components
interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow duration-200">
      <div className="bg-rose-50 dark:bg-rose-900/20 rounded-lg p-3 inline-flex">
        {icon}
      </div>
      <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">{title}</h3>
      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{description}</p>
    </div>
  );
}

interface FaqItemProps {
  question: string;
  answer: string;
}

function FaqItem({ question, answer }: FaqItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center w-full text-left focus:outline-none"
      >
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">{question}</h3>
        <span className="ml-6 flex-shrink-0">
          <ChevronRight className={`h-5 w-5 text-gray-500 transition-transform duration-200 ${isOpen ? 'transform rotate-90' : ''}`} />
        </span>
      </button>
      {isOpen && (
        <div className="mt-4 pr-12">
          <p className="text-base text-gray-500 dark:text-gray-400">{answer}</p>
        </div>
      )}
    </div>
  );
}