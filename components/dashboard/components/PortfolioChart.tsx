"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { 
  ArrowUpRight, 
  BarChart3, 
  BarChart4, 
  ChevronDown,
  Coins, 
  Download,
  Info,
  PieChart, 
  RefreshCw,
  TrendingUp, 
  TrendingDown,
  X,
  BookDashed
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Types
type TimeframeType = '1D' | '1W' | '1M' | '1Y';
type CurrencyType = 'USD' | 'CRYPTO';

interface PortfolioItem {
  name: string;
  value: number;
  price?: number;
  change?: number;
  amount?: number;
  icon?: React.ReactNode;
  marketCap?: number;
  volume?: number;
  socialTabUsage?: string;
}

interface ChartColor {
  gradient: string;
  color: string;
  textColor: string;
  shadow: string;
}

// Enhanced PortfolioChart component with innovative UI
export const PortfolioChart = () => {
  const [timeframe, setTimeframe] = useState<TimeframeType>('1D');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currency, setCurrency] = useState<CurrencyType>('USD');
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<PortfolioItem | null>(null);
  const { toast } = useToast();

  // Enhanced color palette with glassmorphism-inspired design
  const chartColors: ChartColor[] = [
    { 
      gradient: 'from-blue-500/40 to-indigo-600/40 via-blue-400/30', 
      color: 'bg-blue-500/30', 
      textColor: 'text-blue-500', 
      shadow: 'shadow-blue-500/10 backdrop-blur-xl' 
    },
    { 
      gradient: 'from-purple-500/40 to-pink-500/40 via-purple-400/30', 
      color: 'bg-purple-500/30', 
      textColor: 'text-purple-500', 
      shadow: 'shadow-purple-500/10 backdrop-blur-xl' 
    },
    { 
      gradient: 'from-emerald-500/40 to-teal-600/40 via-emerald-400/30', 
      color: 'bg-emerald-500/30', 
      textColor: 'text-emerald-500', 
      shadow: 'shadow-emerald-500/10 backdrop-blur-xl' 
    },
    { 
      gradient: 'from-amber-400/40 to-orange-500/40 via-amber-300/30', 
      color: 'bg-amber-400/30', 
      textColor: 'text-amber-400', 
      shadow: 'shadow-amber-400/10 backdrop-blur-xl' 
    }
  ];
  
  // Enhanced portfolio data with additional metrics
  const portfolioDataByTimeframe: Record<TimeframeType, PortfolioItem[]> = {
    '1D': [
      { 
        name: 'XDC', 
        value: 45, 
        price: 0.12, 
        change: 5.2, 
        amount: 375.0,
        icon: <Coins className="w-6 h-6 text-blue-500" />,
        marketCap: 1800000000,
        volume: 25000000,
        socialTabUsage: 'Used in 2 active social tabs'
      },
      { 
        name: 'ETH', 
        value: 30, 
        price: 3200.50, 
        change: -2.1, 
        amount: 0.09375,
        icon: <BarChart3 className="w-6 h-6 text-purple-500" />,
        marketCap: 380000000000,
        volume: 15000000000,
        socialTabUsage: 'Used in 1 group subscription'
      },
      { 
        name: 'BTC', 
        value: 15, 
        price: 43000.00, 
        change: 1.8, 
        amount: 0.00348,
        icon: <PieChart className="w-6 h-6 text-emerald-500" />,
        marketCap: 820000000000,
        volume: 30000000000,
        socialTabUsage: 'Not used in social tabs'
      },
      { 
        name: 'Other', 
        value: 10, 
        price: 1.00, 
        change: 0.0, 
        amount: 100.0,
        icon: <TrendingUp className="w-6 h-6 text-amber-400" />,
        marketCap: 100000000,
        volume: 5000000,
        socialTabUsage: 'Stablecoin reserve'
      }
    ],
    '1W': [
      { 
        name: 'XDC', 
        value: 42, 
        price: 0.11, 
        change: 4.8, 
        amount: 381.8,
        icon: <Coins className="w-6 h-6 text-blue-500" />,
        marketCap: 1700000000,
        volume: 23000000,
        socialTabUsage: 'Used in 2 active social tabs'
      },
      { 
        name: 'ETH', 
        value: 33, 
        price: 3150.75, 
        change: -1.5, 
        amount: 0.10473,
        icon: <BarChart3 className="w-6 h-6 text-purple-500" />,
        marketCap: 375000000000,
        volume: 14000000000,
        socialTabUsage: 'Used in 1 group subscription'
      },
      { 
        name: 'BTC', 
        value: 14, 
        price: 42500.00, 
        change: 1.2, 
        amount: 0.00329,
        icon: <PieChart className="w-6 h-6 text-emerald-500" />,
        marketCap: 810000000000,
        volume: 29000000000,
        socialTabUsage: 'Not used in social tabs'
      },
      { 
        name: 'Other', 
        value: 11, 
        price: 1.00, 
        change: 0.0, 
        amount: 110.0,
        icon: <TrendingUp className="w-6 h-6 text-amber-400" />,
        marketCap: 110000000,
        volume: 5500000,
        socialTabUsage: 'Stablecoin reserve'
      }
    ],
    '1M': [
      { 
        name: 'XDC', 
        value: 38, 
        price: 0.10, 
        change: 3.5, 
        amount: 380.0,
        icon: <Coins className="w-6 h-6 text-blue-500" />,
        marketCap: 1600000000,
        volume: 22000000,
        socialTabUsage: 'Used in 2 active social tabs'
      },
      { 
        name: 'ETH', 
        value: 35, 
        price: 3000.00, 
        change: 2.5, 
        amount: 0.11667,
        icon: <BarChart3 className="w-6 h-6 text-purple-500" />,
        marketCap: 360000000000,
        volume: 13000000000,
        socialTabUsage: 'Used in 1 group subscription'
      },
      { 
        name: 'BTC', 
        value: 18, 
        price: 41000.00, 
        change: 3.2, 
        amount: 0.00439,
        icon: <PieChart className="w-6 h-6 text-emerald-500" />,
        marketCap: 790000000000,
        volume: 28000000000,
        socialTabUsage: 'Not used in social tabs'
      },
      { 
        name: 'Other', 
        value: 9, 
        price: 1.00, 
        change: 0.0, 
        amount: 90.0,
        icon: <TrendingUp className="w-6 h-6 text-amber-400" />,
        marketCap: 90000000,
        volume: 4500000,
        socialTabUsage: 'Stablecoin reserve'
      }
    ],
    '1Y': [
      { 
        name: 'XDC', 
        value: 30, 
        price: 0.08, 
        change: 15.0, 
        amount: 375.0,
        icon: <Coins className="w-6 h-6 text-blue-500" />,
        marketCap: 1400000000,
        volume: 20000000,
        socialTabUsage: 'Used in 2 active social tabs'
      },
      { 
        name: 'ETH', 
        value: 40, 
        price: 2800.00, 
        change: 25.5, 
        amount: 0.14286,
        icon: <BarChart3 className="w-6 h-6 text-purple-500" />,
        marketCap: 340000000000,
        volume: 12000000000,
        socialTabUsage: 'Used in 1 group subscription'
      },
      { 
        name: 'BTC', 
        value: 20, 
        price: 38000.00, 
        change: 18.2, 
        amount: 0.00526,
        icon: <PieChart className="w-6 h-6 text-emerald-500" />,
        marketCap: 760000000000,
        volume: 27000000000,
        socialTabUsage: 'Not used in social tabs'
      },
      { 
        name: 'Other', 
        value: 10, 
        price: 1.00, 
        change: 0.0, 
        amount: 100.0,
        icon: <TrendingUp className="w-6 h-6 text-amber-400" />,
        marketCap: 100000000,
        volume: 5000000,
        socialTabUsage: 'Stablecoin reserve'
      }
    ]
  };
  
  // Portfolio data processing
  const portfolioData = portfolioDataByTimeframe[timeframe] || portfolioDataByTimeframe['1D'];
  const total = portfolioData.reduce((sum: number, item: PortfolioItem) => sum + item.value, 0);
  
  // Calculate portfolio metrics
  const totalValue = portfolioData.reduce((sum, item) => sum + ((item.price || 0) * (item.amount || 0)), 0);
  const totalChange = portfolioData.reduce((sum, item) => sum + ((item.change || 0) * (item.value / total)), 0);
  
  const handleAssetClick = (asset: PortfolioItem) => {
    setSelectedAsset(asset);
    setIsDetailsModalOpen(true);
    toast({
      title: `${asset.name} Details`,
      description: `Price: $${(asset.price || 0).toLocaleString()} | Amount: ${asset.amount?.toFixed(4)}`,
    });
  };

  const handleLearnMore = () => {
    toast({
      title: "Learn with Bumblebee AI",
      description: "Opening AI chatbot for portfolio diversification module...",
    });
    // Simulate triggering AI chatbot (implementation depends on chatbot component)
    console.log("Triggering AI chatbot for learning module: Portfolio Diversification");
  };

  const handleSwapNow = (assetName: string) => {
    toast({
      title: "AI-Guided Token Swap",
      description: `Initiating swap for ${assetName}...`,
    });
    // Simulate AI-guided token swap (implementation depends on swap component)
    console.log(`Initiating AI-guided swap for ${assetName}`);
  };

  // Variants for Framer Motion animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 200
      }
    }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } }
  };

  // Reference for bar chart canvas
  const barChartRef = useRef<HTMLDivElement>(null);
  
  // Function to draw the bar chart
  useEffect(() => {
    if (!barChartRef.current) return;
    
    // Clear previous chart if any
    barChartRef.current.innerHTML = '';
    
    const data = portfolioDataByTimeframe[timeframe];
    const maxValue = Math.max(...data.map(item => item.value));
    const chartHeight = 250;
    const barSpacing = 20;
    const barWidth = (barChartRef.current.clientWidth - (barSpacing * (data.length + 1))) / data.length;
    
    // Create chart container
    const chartContainer = document.createElement('div');
    chartContainer.className = 'relative h-full w-full';
    
    // Add Y-axis labels
    const yAxisLabels = document.createElement('div');
    yAxisLabels.className = 'absolute left-0 top-0 bottom-0 w-10 flex flex-col justify-between text-xs text-muted-foreground';
    
    // Add 5 evenly spaced labels
    for (let i = 5; i >= 0; i--) {
      const label = document.createElement('div');
      label.textContent = `${Math.round((maxValue * i) / 5)}%`;
      label.className = 'text-right pr-2';
      label.style.position = 'absolute';
      label.style.top = `${100 - ((i / 5) * 100)}%`;
      label.style.transform = 'translateY(-50%)';
      yAxisLabels.appendChild(label);
    }
    
    chartContainer.appendChild(yAxisLabels);
    
    // Create bars container
    const barsContainer = document.createElement('div');
    barsContainer.className = 'absolute left-12 right-0 top-0 bottom-0 flex items-end justify-around';
    
    // Add bars
    data.forEach((item, index) => {
      const barContainer = document.createElement('div');
      barContainer.className = 'flex flex-col items-center';
      
      // Create the bar
      const bar = document.createElement('div');
      const heightPercentage = (item.value / maxValue) * 100;
      bar.className = `rounded-t-md cursor-pointer transition-all duration-500 ease-out hover:opacity-80`;
      bar.style.height = `${heightPercentage}%`;
      bar.style.width = `${barWidth}px`;
      bar.style.background = `linear-gradient(to top, var(--${getColorClass(index)}), var(--${getColorClass(index)}-light))`;
      
      // Add data attribute for value
      bar.setAttribute('data-value', `${item.value}%`);
      bar.setAttribute('data-name', item.name);
      
      // Add tooltip on hover
      bar.addEventListener('mouseenter', (e) => {
        const tooltip = document.createElement('div');
        tooltip.className = 'absolute bottom-full mb-2 bg-background/90 backdrop-blur-sm p-2 rounded-md shadow-lg text-xs border border-border z-50';
        tooltip.innerHTML = `
          <div class="font-semibold">${item.name}</div>
          <div class="text-primary">${item.value}% of portfolio</div>
          <div>${currency === 'USD' ? `$${(item.price || 0).toLocaleString()}` : `${item.amount} ${item.name}`}</div>
          <div class="${item.change && item.change >= 0 ? 'text-green-500' : 'text-red-500'}">
            ${item.change ? (item.change >= 0 ? '+' : '') + item.change.toFixed(2) + '%' : 'N/A'}
          </div>
        `;
        bar.appendChild(tooltip);
      });
      
      bar.addEventListener('mouseleave', () => {
        const tooltip = bar.querySelector('div');
        if (tooltip) bar.removeChild(tooltip);
      });
      
      // Add click event
      bar.addEventListener('click', () => handleAssetClick(item));
      
      // Create label
      const label = document.createElement('div');
      label.className = 'text-xs mt-2 text-muted-foreground font-medium';
      label.textContent = item.name;
      
      // Assemble
      barContainer.appendChild(bar);
      barContainer.appendChild(label);
      barsContainer.appendChild(barContainer);
    });
    
    chartContainer.appendChild(barsContainer);
    barChartRef.current.appendChild(chartContainer);
  }, [timeframe, portfolioDataByTimeframe, currency]);
  
  // Helper function to get color class based on index
  const getColorClass = (index: number) => {
    const colors = ['primary', 'purple', 'emerald', 'amber'];
    return colors[index % colors.length];
  };

  return (
    <motion.div 
      className="bg-background rounded-2xl border border-border p-6 shadow-md" 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      aria-label="Portfolio allocation chart"
    >
      {/* Header Section with Tabs */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:justify-between sm:items-center sm:space-y-0 mb-6">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">AI-Powered Portfolio Allocation</h3>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Tabs defaultValue="timeframe" className="w-full sm:w-auto">
            <TabsList className="bg-muted/50">
              <TabsTrigger value="timeframe" className="text-xs">Timeframe</TabsTrigger>
              <TabsTrigger value="view" className="text-xs">View</TabsTrigger>
              <TabsTrigger value="currency" className="text-xs">Currency</TabsTrigger>
            </TabsList>
            
            <TabsContent value="timeframe" className="mt-2">
              <div className="flex bg-muted/50 rounded-lg p-1 w-fit">
                {(['1D', '1W', '1M', '1Y'] as TimeframeType[]).map((tf) => (
                  <motion.button
                    key={tf}
                    className={cn(
                      'px-3 py-1 text-xs rounded-md transition-colors',
                      timeframe === tf
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    )}
                    onClick={() => setTimeframe(tf)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {tf}
                  </motion.button>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="view" className="mt-2">
              <div className="flex bg-muted/50 rounded-lg p-1 w-fit">
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    'text-xs',
                    viewMode === 'grid' ? 'bg-primary/20 text-primary' : ''
                  )}
                  onClick={() => setViewMode('grid')}
                >
                  Grid
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    'text-xs',
                    viewMode === 'list' ? 'bg-primary/20 text-primary' : ''
                  )}
                  onClick={() => setViewMode('list')}
                >
                  List
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="currency" className="mt-2">
              <div className="flex bg-muted/50 rounded-lg p-1 w-fit">
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    'text-xs',
                    currency === 'USD' ? 'bg-primary/20 text-primary' : ''
                  )}
                  onClick={() => setCurrency('USD')}
                >
                  USD
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    'text-xs',
                    currency === 'CRYPTO' ? 'bg-primary/20 text-primary' : ''
                  )}
                  onClick={() => setCurrency('CRYPTO')}
                >
                  Crypto
                </Button>
              </div>
            </TabsContent>
          </Tabs>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" className="h-8 w-8">
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Refresh data</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" className="h-8 w-8">
                  <Download className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Export data</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Portfolio Metrics */}
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6"
        variants={containerVariants}
      >
        <motion.div 
          className="bg-muted/30 rounded-xl p-4 text-center"
          variants={itemVariants}
        >
          <div className="text-sm text-muted-foreground mb-1">Total Value</div>
          <div className="text-2xl font-bold">
            {currency === 'USD' ? `$${totalValue.toLocaleString()}` : `${(totalValue / (portfolioData[0].price || 1)).toFixed(4)} XDC`}
          </div>
        </motion.div>
        <motion.div 
          className="bg-muted/30 rounded-xl p-4 text-center"
          variants={itemVariants}
        >
          <div className="text-sm text-muted-foreground mb-1">24h Change</div>
          <div className={cn(
            'text-2xl font-bold',
            totalChange >= 0 ? 'text-emerald-500' : 'text-red-500'
          )}>
            {totalChange >= 0 ? '+' : ''}{totalChange.toFixed(2)}%
          </div>
        </motion.div>
        <motion.div 
          className="bg-muted/30 rounded-xl p-4 text-center"
          variants={itemVariants}
        >
          <div className="text-sm text-muted-foreground mb-1">AI Prediction</div>
          <div className="text-2xl font-bold text-blue-500">
            <span className="flex items-center justify-center gap-1">
              <TrendingUp className="h-5 w-5" />
              Bullish
            </span>
          </div>
        </motion.div>
      </motion.div>

      {/* Bar Chart */}
      <motion.div
        className="bg-muted/20 rounded-xl p-6 mb-6 h-[350px]"
        variants={itemVariants}
      >
        <div className="text-sm font-medium mb-4 flex justify-between items-center">
          <span>Portfolio Allocation</span>
          <Badge variant="outline" className="text-xs font-normal">
            {timeframe} View
          </Badge>
        </div>
        <div ref={barChartRef} className="w-full h-[250px]" />
      </motion.div>
      
      {/* Asset List */}
      <motion.div 
        className="space-y-4"
        variants={containerVariants}
      >
        {portfolioData.map((item, index) => (
          <motion.div
            key={item.name}
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            layout
            className={cn(
              'p-4 rounded-xl border cursor-pointer transition-all duration-300',
              'bg-background hover:bg-muted/30',
              viewMode === 'list' ? 'flex items-center space-x-4' : ''
            )}
            whileHover={{ 
              scale: 1.01,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            }}
            onClick={() => handleAssetClick(item)}
          >
            {viewMode === 'grid' ? (
              <>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-${getColorClass(index)}/20`}>
                      {item.icon}
                    </div>
                    <span className="font-semibold">{item.name}</span>
                  </div>
                  <Badge variant="outline" className={`bg-${getColorClass(index)}/10 text-${getColorClass(index)} border-${getColorClass(index)}/30`}>
                    {item.value}%
                  </Badge>
                </div>
                <div className="mt-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">
                      {currency === 'USD' ? `$${(item.price || 0).toLocaleString()}` : `${item.amount} ${item.name}`}
                    </span>
                    <span className={item.change && item.change >= 0 ? 'text-emerald-500' : 'text-red-500'}>
                      {item.change ? (item.change >= 0 ? '+' : '') + item.change.toFixed(2) + '%' : 'N/A'}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                    <Info className="h-3 w-3" />
                    {item.socialTabUsage}
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-${getColorClass(index)}/20`}>
                  {item.icon}
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between">
                    <span className="font-semibold">{item.name}</span>
                    <Badge variant="outline" className={`bg-${getColorClass(index)}/10 text-${getColorClass(index)} border-${getColorClass(index)}/30`}>
                      {item.value}%
                    </Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {currency === 'USD' ? `$${(item.price || 0).toLocaleString()}` : `${item.amount} ${item.name}`}
                    </span>
                    <span className={item.change && item.change >= 0 ? 'text-emerald-500' : 'text-red-500'}>
                      {item.change ? (item.change >= 0 ? '+' : '') + item.change.toFixed(2) + '%' : 'N/A'}
                    </span>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        ))}
      </motion.div>

      {/* Asset Details Modal */}
      <AnimatePresence>
        {isDetailsModalOpen && selectedAsset && (
          <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
            <DialogContent className="bg-background rounded-2xl border border-border p-6 shadow-md">
              <motion.div
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <DialogHeader className="flex justify-between items-center">
                  <DialogTitle className="text-xl font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                    {selectedAsset.icon}
                    {selectedAsset.name} Details
                  </DialogTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsDetailsModalOpen(false)}
                    className="text-gray-600 dark:text-gray-400"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </DialogHeader>
                <DialogDescription className="space-y-4 text-gray-600 dark:text-gray-400">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm font-medium">Price</div>
                      <div className="text-lg">
                        {currency === 'USD' 
                          ? `$${selectedAsset.price?.toLocaleString()}`
                          : `${(selectedAsset.price! / portfolioData[0].price!).toFixed(4)} XDC`}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium">Amount</div>
                      <div className="text-lg">{selectedAsset.amount?.toFixed(4)} {selectedAsset.name}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium">Value</div>
                      <div className="text-lg">
                        {currency === 'USD' 
                          ? `$${((selectedAsset.price || 0) * (selectedAsset.amount || 0)).toLocaleString()}`
                          : `${((selectedAsset.price! * selectedAsset.amount!) / portfolioData[0].price!).toFixed(4)} XDC`}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium">Change ({timeframe})</div>
                      <div className={cn(
                        'text-lg',
                        selectedAsset.change && selectedAsset.change >= 0 ? 'text-emerald-500' : 'text-red-500'
                      )}>
                        {selectedAsset.change?.toFixed(2)}%
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium">Market Cap</div>
                      <div className="text-lg">${(selectedAsset.marketCap || 0).toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium">24h Volume</div>
                      <div className="text-lg">${(selectedAsset.volume || 0).toLocaleString()}</div>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Social Tab Usage</div>
                    <div className="text-sm">{selectedAsset.socialTabUsage}</div>
                  </div>
                  <div className="bg-white/10 p-3 rounded-lg">
                    <div className="text-sm font-medium flex items-center gap-2">
                      AI Insight
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="w-4 h-4 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            Powered by Bumblebee's AI engine for personalized portfolio management
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <div className="text-sm">
                      {selectedAsset.name === 'XDC' 
                        ? 'Consider increasing allocation due to high social tab activity.'
                        : selectedAsset.name === 'ETH' 
                        ? 'Stable performance; maintain current allocation.'
                        : selectedAsset.name === 'BTC' 
                        ? 'High volatility detected; consider risk management.'
                        : 'Stablecoin suitable for social tab reserves.'}
                    </div>
                  </div>
                </DialogDescription>
                <DialogFooter className="flex justify-between mt-4">
                  <Button
                    variant="outline"
                    onClick={handleLearnMore}
                    className="flex items-center gap-2"
                  >
                    Learn More <Info className="w-4 h-4" />
                  </Button>
                  <div className="flex gap-2">
                    <Button
                      variant="default"
                      onClick={() => handleSwapNow(selectedAsset.name)}
                      className="flex items-center gap-2"
                    >
                      Swap Now <BookDashed className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="default"
                      onClick={() => {
                        toast({
                          title: "View More Details",
                          description: `Navigating to detailed ${selectedAsset.name} analysis...`,
                        });
                        console.log(`Navigating to detailed ${selectedAsset.name} page`);
                      }}
                      className="flex items-center gap-2"
                    >
                      View More <ArrowUpRight className="w-4 h-4" />
                    </Button>
                  </div>
                </DialogFooter>
              </motion.div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </motion.div>
  );
}