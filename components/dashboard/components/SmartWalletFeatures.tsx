import { FC, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle, X, Info, ArrowRight } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface WalletAlert {
  id: number;
  message: string;
  type: string;
}

interface SmartWalletFeaturesProps {
  alerts: WalletAlert[];
}

export const SmartWalletFeatures: FC<SmartWalletFeaturesProps> = ({ alerts }) => {
  const [visibleAlerts, setVisibleAlerts] = useState<number[]>(alerts.map(alert => alert.id));
  const [hoveredAlert, setHoveredAlert] = useState<number | null>(null);

  const dismissAlert = (id: number) => {
    setVisibleAlerts(visibleAlerts.filter(alertId => alertId !== id));
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'from-green-500/20 to-emerald-500/30';
      case 'error':
        return 'from-red-500/20 to-rose-500/30';
      case 'warning':
        return 'from-amber-500/20 to-yellow-500/30';
      default:
        return 'from-blue-500/20 to-indigo-500/30';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      case 'warning':
        return <Info className="h-5 w-5 text-amber-600" />;
      default:
        return <Info className="h-5 w-5 text-blue-600" />;
    }
  };

  const getAlertTitle = (type: string) => {
    switch (type) {
      case 'success':
        return 'Success';
      case 'error':
        return 'Error';
      case 'warning':
        return 'Warning';
      default:
        return 'Information';
    }
  };

  return (
    <motion.div 
      className="space-y-4 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <AnimatePresence>
        {alerts
          .filter(alert => visibleAlerts.includes(alert.id))
          .map((alert) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ 
                opacity: 1, 
                y: 0, 
                scale: 1,
                boxShadow: hoveredAlert === alert.id ? "0 10px 25px -5px rgba(0, 0, 0, 0.1)" : "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
              }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ 
                type: "spring", 
                stiffness: 500, 
                damping: 30 
              }}
              onMouseEnter={() => setHoveredAlert(alert.id)}
              onMouseLeave={() => setHoveredAlert(null)}
              className={`relative rounded-lg overflow-hidden bg-gradient-to-r ${getAlertColor(alert.type)} backdrop-blur-md border border-white/10`}
              style={{ 
                backdropFilter: "blur(12px)",
              }}
            >
              <div className="absolute inset-0 bg-white/5 rounded-lg" />
              
              <div className="relative p-4 flex items-start">
                <div className="flex-shrink-0 mr-3 mt-0.5">
                  {getAlertIcon(alert.type)}
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <motion.h3 
                      className="font-medium text-lg"
                      initial={{ opacity: 0.8 }}
                      animate={{ opacity: 1 }}
                    >
                      {getAlertTitle(alert.type)}
                    </motion.h3>
                    
                    <motion.button
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => dismissAlert(alert.id)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </motion.button>
                  </div>
                  
                  <motion.p 
                    className="text-gray-700 mt-1"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    {alert.message}
                  </motion.p>
                  
                  {alert.type === 'success' && (
                    <motion.div 
                      className="mt-2 flex items-center text-sm text-green-600 font-medium"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <span>View transaction</span>
                      <motion.span
                        animate={{ x: [0, 3, 0] }}
                        transition={{ repeat: Infinity, repeatDelay: 2, duration: 0.8 }}
                      >
                        <ArrowRight className="ml-1 h-3 w-3" />
                      </motion.span>
                    </motion.div>
                  )}
                </div>
              </div>
              
              <motion.div 
                className="h-1 bg-gradient-to-r" 
                style={{
                  backgroundImage: alert.type === 'success' 
                    ? 'linear-gradient(to right, #10b981, #34d399)' 
                    : alert.type === 'error'
                    ? 'linear-gradient(to right, #ef4444, #f87171)'
                    : alert.type === 'warning'
                    ? 'linear-gradient(to right, #f59e0b, #fbbf24)'
                    : 'linear-gradient(to right, #3b82f6, #60a5fa)'
                }}
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
            </motion.div>
          ))
        }
      </AnimatePresence>
    </motion.div>
  );
};