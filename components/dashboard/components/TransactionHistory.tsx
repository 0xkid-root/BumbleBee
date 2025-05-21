import { FC, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, ArrowDownLeft, CheckCircle, Clock, AlertCircle, ChevronRight } from 'lucide-react';

interface Transaction {
  id: number;
  type: string;
  amount: string;
  date: string;
  status: string;
}

interface TransactionHistoryProps {
  transactions: Transaction[];
}

// Helper function to determine icon and colors based on transaction type and status
const getTransactionDetails = (transaction: Transaction) => {
  // Status styling
  let statusColor = "text-gray-500";
  let StatusIcon = Clock;
  
  switch (transaction.status.toLowerCase()) {
    case "completed":
      statusColor = "text-green-500";
      StatusIcon = CheckCircle;
      break;
    case "pending":
      statusColor = "text-yellow-500";
      StatusIcon = Clock;
      break;
    case "failed":
      statusColor = "text-red-500";
      StatusIcon = AlertCircle;
      break;
  }

  // Transaction type styling
  const isIncoming = transaction.amount.startsWith("+");
  const TypeIcon = isIncoming ? ArrowUpRight : ArrowDownLeft;
  const amountColor = isIncoming ? "text-green-500" : "text-red-500";
  
  // Gradient based on transaction type
  let gradientClasses = isIncoming 
    ? "from-green-500/10 to-emerald-500/5" 
    : "from-red-500/10 to-orange-500/5";

  return { StatusIcon, statusColor, TypeIcon, amountColor, gradientClasses };
};

export const TransactionHistory: FC<TransactionHistoryProps> = ({ transactions }) => {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4 p-4 rounded-xl"
    >
      <h2 className="text-xl font-bold mb-6 bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
        Transaction History
      </h2>
      
      <AnimatePresence>
        {transactions.map((transaction) => {
          const { 
            StatusIcon, 
            statusColor, 
            TypeIcon,
            amountColor, 
            gradientClasses 
          } = getTransactionDetails(transaction);
          
          const isExpanded = expandedId === transaction.id;
          
          return (
            <motion.div 
              layout
              key={transaction.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
              onClick={() => setExpandedId(isExpanded ? null : transaction.id)}
              className={`relative overflow-hidden backdrop-blur-sm bg-white/10 border border-white/20 rounded-xl p-4 cursor-pointer shadow-lg bg-gradient-to-br ${gradientClasses}`}
            >
              {/* Glass overlay */}
              <div className="absolute inset-0 bg-white/5 backdrop-blur-sm rounded-xl" />
              
              <div className="relative z-10">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full bg-white/20 backdrop-blur-sm ${amountColor}`}>
                      <TypeIcon size={16} />
                    </div>
                    <div>
                      <p className="font-medium text-white">{transaction.type}</p>
                      <p className="text-sm text-white/70">{transaction.date}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end">
                    <span className={`font-bold ${amountColor}`}>
                      {transaction.amount}
                    </span>
                    <div className="flex items-center text-xs mt-1">
                      <StatusIcon size={12} className={statusColor} />
                      <span className={`ml-1 ${statusColor}`}>{transaction.status}</span>
                    </div>
                  </div>
                </div>
                
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="mt-4 pt-4 border-t border-white/10"
                    >
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-white/50">Transaction ID</p>
                          <p className="text-sm text-white/80">#{transaction.id}</p>
                        </div>
                        <div>
                          <p className="text-xs text-white/50">Processed on</p>
                          <p className="text-sm text-white/80">{transaction.date}</p>
                        </div>
                        <div className="col-span-2">
                          <button className="mt-2 text-sm flex items-center text-blue-400 hover:text-blue-300 transition-colors">
                            View Details <ChevronRight size={16} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              {/* Pulsing animation for pending transactions */}
              {transaction.status.toLowerCase() === "pending" && (
                <motion.div 
                  className="absolute top-2 right-2 w-2 h-2 rounded-full bg-yellow-500"
                  animate={{ 
                    scale: [1, 1.5, 1],
                    opacity: [1, 0.7, 1]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </motion.div>
  );
};