import { FC, useState } from 'react';
import { ArrowUpRight, ArrowDownRight, Activity, PieChart, TrendingUp, DollarSign } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AnalyticMetric {
  label: string;
  value: string;
  change: number;
  trend: 'up' | 'down' | 'neutral';
  icon: React.ReactNode;
  color: string;
  bgGradient: string;
}

const metrics: AnalyticMetric[] = [
  {
    label: 'Total Returns',
    value: '+$3,245.67',
    change: 15.4,
    trend: 'up',
    icon: <DollarSign className="h-5 w-5" />,
    color: 'from-emerald-500 to-green-400',
    bgGradient: 'from-emerald-500/10 to-green-400/5'
  },
  {
    label: 'Average Position Size',
    value: '$1,543.21',
    change: -2.3,
    trend: 'down',
    icon: <TrendingUp className="h-5 w-5" />,
    color: 'from-red-500 to-orange-400',
    bgGradient: 'from-red-500/10 to-orange-400/5'
  },
  {
    label: 'Risk Score',
    value: '7.5/10',
    change: 0,
    trend: 'neutral',
    icon: <Activity className="h-5 w-5" />,
    color: 'from-blue-500 to-indigo-400',
    bgGradient: 'from-blue-500/10 to-indigo-400/5'
  }
];

const portfolioData = [
  { label: 'DeFi', percentage: 60, color: 'bg-purple-500' },
  { label: 'NFTs', percentage: 25, color: 'bg-pink-500' },
  { label: 'Stablecoins', percentage: 15, color: 'bg-blue-500' }
];

export const PortfolioAnalytics: FC = () => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [expandedChart, setExpandedChart] = useState(false);

  const getTrendColor = (trend: AnalyticMetric['trend']) => {
    switch (trend) {
      case 'up':
        return 'text-emerald-500';
      case 'down':
        return 'text-red-500';
      default:
        return 'text-blue-500';
    }
  };

  const getTrendIcon = (trend: AnalyticMetric['trend']) => {
    switch (trend) {
      case 'up':
        return <ArrowUpRight className="h-4 w-4" />;
      case 'down':
        return <ArrowDownRight className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-8 p-6 max-w-6xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {metrics.map((metric, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            onHoverStart={() => setHoveredCard(index)}
            onHoverEnd={() => setHoveredCard(null)}
            className={`relative p-6 rounded-xl backdrop-blur-md bg-white/10 border border-white/20 shadow-lg overflow-hidden`}
          >
            {/* Gradient Background */}
            <div className={`absolute inset-0 bg-gradient-to-br ${metric.bgGradient} opacity-70 -z-10`}></div>
            
            {/* Glowing orb effect on hover */}
            <AnimatePresence>
              {hoveredCard === index && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                  className={`absolute -right-6 -top-6 w-24 h-24 rounded-full bg-gradient-to-br ${metric.color} blur-xl opacity-30 -z-5`}
                ></motion.div>
              )}
            </AnimatePresence>
            
            <div className="flex items-center space-x-3 mb-3">
              <motion.div 
                whileHover={{ rotate: 15 }}
                className={`p-2 rounded-lg bg-gradient-to-br ${metric.color} text-white`}
              >
                {metric.icon}
              </motion.div>
              <p className="text-sm font-medium text-gray-200">{metric.label}</p>
            </div>
            
            <div className="mt-2 flex items-baseline justify-between">
              <motion.h4 
                initial={{ opacity: 0.8 }}
                animate={{ opacity: 1 }}
                className="text-2xl font-bold text-white"
              >
                {metric.value}
              </motion.h4>
              <motion.div 
                whileHover={{ scale: 1.1 }}
                className={`flex items-center px-2 py-1 rounded-full ${getTrendColor(metric.trend)} bg-white/10 backdrop-blur-sm`}
              >
                {getTrendIcon(metric.trend)}
                <span className="ml-1 text-sm font-medium">
                  {metric.change > 0 ? '+' : ''}{metric.change}%
                </span>
              </motion.div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        onClick={() => setExpandedChart(!expandedChart)}
        className="p-6 rounded-xl backdrop-blur-md bg-white/10 border border-white/20 shadow-lg relative overflow-hidden cursor-pointer"
      >
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-400/5 -z-10"></div>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <motion.div 
              whileHover={{ rotate: 15 }}
              className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-400 text-white"
            >
              <PieChart className="h-5 w-5" />
            </motion.div>
            <h4 className="font-semibold text-white text-lg">Portfolio Composition</h4>
          </div>
          
          <motion.div 
            animate={{ rotate: expandedChart ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className="text-white/70"
          >
            <ArrowUpRight className="h-5 w-5" />
          </motion.div>
        </div>
        
        <motion.div 
          animate={{ height: expandedChart ? 'auto' : 'auto' }}
          className="space-y-4"
        >
          {portfolioData.map((item, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/80">{item.label}</span>
                <span className="text-sm font-medium text-white">{item.percentage}%</span>
              </div>
              <div className="flex items-center">
                <motion.div 
                  className="flex-1 bg-white/10 rounded-full h-2 overflow-hidden"
                  initial={{ opacity: 0.6 }}
                  whileHover={{ opacity: 1 }}
                >
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.percentage}%` }}
                    transition={{ duration: 1, delay: idx * 0.2 + 0.3, ease: "easeOut" }}
                    className={`${item.color} rounded-full h-2`}
                  />
                </motion.div>
              </div>
            </div>
          ))}
          
          <AnimatePresence>
            {expandedChart && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-6 pt-4 border-t border-white/10"
              >
                <div className="grid grid-cols-3 gap-4">
                  {portfolioData.map((item, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex flex-col items-center p-3 rounded-lg bg-white/5 border border-white/10"
                    >
                      <div className={`w-8 h-8 rounded-full ${item.color} mb-2 flex items-center justify-center`}>
                        <span className="text-xs font-bold text-white">{item.percentage}</span>
                      </div>
                      <span className="text-sm text-white/80">{item.label}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
      
      {/* Hidden asset performance/summary cards that appear on larger screens */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="hidden md:grid grid-cols-2 gap-6"
      >
        <div className="p-6 rounded-xl backdrop-blur-md bg-white/10 border border-white/20 shadow-lg relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-400/5 -z-10"></div>
          <h4 className="font-semibold text-white text-lg mb-4">Top Performers</h4>
          
          <div className="space-y-3">
            {[
              { name: 'Ethereum', gain: '+23.5%', value: '$2,458.32' },
              { name: 'Uniswap', gain: '+18.7%', value: '$423.91' }
            ].map((asset, idx) => (
              <motion.div 
                key={idx}
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: idx * 0.1 + 0.2 }}
                className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/10"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-400"></div>
                  <span className="font-medium text-white">{asset.name}</span>
                </div>
                <div className="text-right">
                  <div className="text-emerald-400 text-sm font-medium">{asset.gain}</div>
                  <div className="text-white/80 text-xs">{asset.value}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        
        <div className="p-6 rounded-xl backdrop-blur-md bg-white/10 border border-white/20 shadow-lg relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-orange-400/5 -z-10"></div>
          <h4 className="font-semibold text-white text-lg mb-4">Portfolio Summary</h4>
          
          <div className="space-y-2">
            {[
              { label: 'Total Value', value: '$14,532.67' },
              { label: 'Monthly Change', value: '+$1,245.32 (8.6%)' },
              { label: 'Assets Count', value: '12' }
            ].map((item, idx) => (
              <motion.div 
                key={idx}
                initial={{ x: 10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: idx * 0.1 + 0.2 }}
                className="flex justify-between items-center"
              >
                <span className="text-white/70">{item.label}</span>
                <span className="text-white font-medium">{item.value}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};