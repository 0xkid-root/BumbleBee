import { FC, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
  CreditCard, 
  MoreVertical, 
  Calendar, 
  ChevronRight, 
  Edit, 
  Trash, 
  X 
} from 'lucide-react';

interface Subscription {
  id: number;
  name: string;
  amount: string;
  frequency: string;
  nextPayment: string;
  color?: string;
}

interface SubscriptionListProps {
  subscriptions: Subscription[];
}

// Pre-defined gradients for subscription cards
const gradients = [
  'from-blue-500 to-purple-500',
  'from-green-400 to-cyan-500',
  'from-pink-500 to-orange-500',
  'from-indigo-500 to-pink-500',
  'from-yellow-400 to-orange-500',
];

export const SubscriptionList: FC<SubscriptionListProps> = ({ subscriptions }) => {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  const handleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getGradient = (index: number) => {
    return gradients[index % gradients.length];
  };

  return (
    <motion.div 
      className="space-y-6 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-bold mb-6">Your Subscriptions</h2>
      
      {subscriptions.map((subscription, index) => (
        <motion.div 
          key={subscription.id}
          layout
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.4, 
            delay: index * 0.1,
            type: "spring",
            stiffness: 100
          }}
          className="relative"
        >
          <motion.div
            className={`
              relative overflow-hidden rounded-xl border backdrop-blur-md
              shadow-lg bg-gradient-to-r ${getGradient(index)}
              bg-opacity-10
              hover:shadow-xl transition-all
            `}
            whileHover={{ 
              scale: 1.02,
              transition: { duration: 0.2 }
            }}
            onHoverStart={() => setHoveredId(subscription.id)}
            onHoverEnd={() => setHoveredId(null)}
          >
            {/* Glass overlay */}
            <div className="absolute inset-0 bg-white dark:bg-gray-900 bg-opacity-80 dark:bg-opacity-80 backdrop-blur-sm"></div>
            
            {/* Main card content */}
            <div className="relative p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <motion.div 
                    className={`p-3 rounded-lg bg-gradient-to-r ${getGradient(index)}`}
                    whileHover={{ rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <CreditCard className="h-6 w-6 text-white" />
                  </motion.div>
                  
                  <div>
                    <h4 className="font-semibold text-lg">{subscription.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium">{subscription.amount}</span> • {subscription.frequency}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-6">
                  <div className="text-right">
                    <p className="text-xs uppercase tracking-wider text-muted-foreground">Next Payment</p>
                    <p className="text-sm font-semibold flex items-center">
                      <Calendar className="h-3 w-3 mr-1 inline-block text-muted-foreground" />
                      {subscription.nextPayment}
                    </p>
                  </div>
                  
                  <motion.div
                    initial={{ rotate: 0 }}
                    animate={{ rotate: expandedId === subscription.id ? 90 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleExpand(subscription.id)}
                      className="rounded-full h-8 w-8"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </motion.div>
                </div>
              </div>
              
              {/* Action buttons that appear on hover */}
              <AnimatePresence>
                {hoveredId === subscription.id && (
                  <motion.div 
                    className="absolute top-2 right-2"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.15 }}
                  >
                    <div className="flex space-x-1">
                      <Button variant="ghost" size="icon" className="h-6 w-6 bg-background/50 backdrop-blur-sm rounded-full">
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-6 w-6 bg-background/50 backdrop-blur-sm rounded-full">
                        <Trash className="h-3 w-3" />
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Expanded section */}
            <AnimatePresence>
              {expandedId === subscription.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="relative overflow-hidden"
                >
                  <div className="p-5 pt-0 border-t border-border/50 mt-2">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Subscription Details</p>
                        <ul className="space-y-2 text-sm">
                          <li className="flex justify-between">
                            <span className="text-muted-foreground">Billing cycle</span>
                            <span>{subscription.frequency}</span>
                          </li>
                          <li className="flex justify-between">
                            <span className="text-muted-foreground">Amount</span>
                            <span>{subscription.amount}</span>
                          </li>
                          <li className="flex justify-between">
                            <span className="text-muted-foreground">Payment method</span>
                            <span>•••• 4242</span>
                          </li>
                        </ul>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Payment History</p>
                        <ul className="space-y-2 text-sm">
                          <li className="flex justify-between">
                            <span className="text-muted-foreground">Last payment</span>
                            <span>Apr 15, 2025</span>
                          </li>
                          <li className="flex justify-between">
                            <span className="text-muted-foreground">Next payment</span>
                            <span>{subscription.nextPayment}</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex justify-end">
                      <Button variant="outline" size="sm" className="mr-2">
                        Manage
                      </Button>
                      <Button size="sm">
                        Pay now
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      ))}
    </motion.div>
  );
};