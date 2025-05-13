import { FC, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, TrendingUp, AlertTriangle, ChevronRight, BarChart } from 'lucide-react';

interface Insight {
  id: number;
  type: 'recommendation' | 'alert' | 'prediction';
  title: string;
  description: string;
  impact: 'positive' | 'neutral' | 'negative';
  details?: string;
}

const insights: Insight[] = [
  {
    id: 1,
    type: 'recommendation',
    title: 'Portfolio Diversification',
    description: 'Consider adding more stable assets to balance your portfolio risk.',
    impact: 'neutral',
    details: 'Analysis shows your portfolio is heavily weighted in high-volatility assets. Adding 15-20% allocation to index funds could help stabilize returns.'
  },
  {
    id: 2,
    type: 'prediction',
    title: 'Market Trend Analysis',
    description: 'Positive momentum detected in DeFi tokens over the next week.',
    impact: 'positive',
    details: 'Our algorithm detected a 76% confidence level in continued upward momentum based on on-chain metrics and social sentiment analysis.'
  },
  {
    id: 3,
    type: 'alert',
    title: 'Risk Assessment',
    description: 'High volatility expected in your current positions.',
    impact: 'negative',
    details: 'Three of your largest holdings show correlation with upcoming market events. Consider hedging strategies or setting stop-loss orders.'
  }
];

export const AIInsights: FC = () => {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  const getIcon = (type: Insight['type']) => {
    switch (type) {
      case 'recommendation':
        return <Sparkles className="h-5 w-5" />;
      case 'prediction':
        return <TrendingUp className="h-5 w-5" />;
      case 'alert':
        return <AlertTriangle className="h-5 w-5" />;
    }
  };

  const getImpactColor = (impact: Insight['impact']) => {
    switch (impact) {
      case 'positive':
        return {
          bg: 'bg-gradient-to-br from-green-500/20 to-emerald-500/20',
          border: 'border-green-400/30',
          text: 'text-green-500',
          icon: 'bg-green-500/10 text-green-500',
          glow: 'shadow-[0_0_15px_rgba(34,197,94,0.2)]'
        };
      case 'neutral':
        return {
          bg: 'bg-gradient-to-br from-blue-500/20 to-indigo-500/20',
          border: 'border-blue-400/30',
          text: 'text-blue-500',
          icon: 'bg-blue-500/10 text-blue-500',
          glow: 'shadow-[0_0_15px_rgba(59,130,246,0.2)]'
        };
      case 'negative':
        return {
          bg: 'bg-gradient-to-br from-red-500/20 to-orange-500/20',
          border: 'border-red-400/30',
          text: 'text-red-500',
          icon: 'bg-red-500/10 text-red-500',
          glow: 'shadow-[0_0_15px_rgba(239,68,68,0.2)]'
        };
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut"
      }
    }),
    hover: {
      scale: 1.02,
      transition: { duration: 0.2 }
    }
  };

  const detailsVariants = {
    hidden: { height: 0, opacity: 0 },
    visible: { height: "auto", opacity: 1, transition: { duration: 0.3 } }
  };

  const pulseAnimation = {
    pulse: {
      scale: [1, 1.05, 1],
      opacity: [0.7, 1, 0.7],
      transition: { repeat: Infinity, duration: 2 }
    }
  };

  return (
    <div className="space-y-6 p-4">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center mb-6"
      >
        <motion.div 
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
          className="mr-2"
        >
          <BarChart className="h-6 w-6 text-indigo-500" />
        </motion.div>
        <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">
          AI-Powered Insights
        </h2>
      </motion.div>

      <AnimatePresence>
        {insights.map((insight, index) => {
          const colors = getImpactColor(insight.impact);
          const isExpanded = expandedId === insight.id;
          const isHovered = hoveredId === insight.id;

          return (
            <motion.div
              layout
              key={insight.id}
              custom={index}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              className={`relative backdrop-blur-sm rounded-xl p-0.5 ${isHovered ? colors.glow : ''}`}
              onMouseEnter={() => setHoveredId(insight.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div className={`rounded-xl overflow-hidden border ${colors.border} ${colors.bg}`}>
                <motion.div
                  className="p-4 cursor-pointer"
                  onClick={() => setExpandedId(isExpanded ? null : insight.id)}
                >
                  <div className="flex items-start space-x-4">
                    <motion.div
                      whileHover={{ rotate: [0, -10, 10, 0], transition: { duration: 0.5 } }}
                      className={`p-2 rounded-lg ${colors.icon}`}
                    >
                      {getIcon(insight.type)}
                    </motion.div>

                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <h4 className={`font-medium ${colors.text}`}>{insight.title}</h4>
                        <motion.div
                          animate={{ rotate: isExpanded ? 90 : 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <ChevronRight className="h-4 w-4 text-gray-400" />
                        </motion.div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {insight.description}
                      </p>
                    </div>
                  </div>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        variants={detailsVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        className="mt-3 pt-3 border-t border-gray-100/20"
                      >
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {insight.details}
                        </p>
                        <div className="flex justify-end mt-2">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`text-xs px-3 py-1 rounded-full ${colors.bg} ${colors.text} font-medium`}
                          >
                            Take Action
                          </motion.button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Glowing accent line at the bottom */}
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  className={`h-0.5 ${colors.text} opacity-70`}
                  style={{ transformOrigin: 'left' }}
                />
              </div>

              {/* Animated indicator dot for new insights */}
              {index === 0 && (
                <motion.div
                  variants={pulseAnimation}
                  animate="pulse"
                  className={`absolute -top-1 -right-1 h-3 w-3 rounded-full ${
                    insight.impact === 'positive' 
                      ? 'bg-green-500' 
                      : insight.impact === 'negative' 
                        ? 'bg-red-500' 
                        : 'bg-blue-500'
                  }`}
                />
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};