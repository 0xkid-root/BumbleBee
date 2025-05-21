import { FC, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, MoreVertical, ChevronRight, CheckCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GroupTab {
  id: number;
  name: string;
  participants: number;
  outstandingAmount: string;
  status: string;
}

interface GroupTabListProps {
  groupTabs: GroupTab[];
}

export const GroupTabList: FC<GroupTabListProps> = ({ groupTabs }) => {
  const [expandedTab, setExpandedTab] = useState<number | null>(null);
  const [hoveredTab, setHoveredTab] = useState<number | null>(null);

  const toggleExpand = (id: number) => {
    setExpandedTab(expandedTab === id ? null : id);
  };

  // Define gradient colors based on status
  const getGradient = (status: string) => {
    return status === 'Active' 
      ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/10'
      : 'bg-gradient-to-r from-amber-500/20 to-yellow-500/10';
  };

  // Subtle animation for cards
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
      boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
      transition: { duration: 0.2 }
    }
  };

  // Animation for expanded content
  const expandVariants = {
    hidden: { height: 0, opacity: 0 },
    visible: { height: "auto", opacity: 1, transition: { duration: 0.3 } }
  };

  // Chevron animation
  const chevronVariants = {
    closed: { rotate: 0 },
    open: { rotate: 90 }
  };

  // Status badge animation
  const statusBadgeVariants = {
    pulse: {
      scale: [1, 1.05, 1],
      opacity: [0.8, 1, 0.8],
      transition: { repeat: Infinity, duration: 2 }
    }
  };

  return (
    <div className="space-y-6">
      {groupTabs.map((tab, i) => (
        <motion.div 
          key={tab.id}
          custom={i}
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          whileHover={hoveredTab === tab.id ? "hover" : ""}
          onHoverStart={() => setHoveredTab(tab.id)}
          onHoverEnd={() => setHoveredTab(null)}
          onClick={() => toggleExpand(tab.id)}
          className={`backdrop-blur-sm rounded-xl border border-white/10 ${getGradient(tab.status)} 
            shadow-lg overflow-hidden cursor-pointer transition-all duration-300`}
        >
          <div className="relative">
            {/* Gradient overlay to enhance glassmorphism effect */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
            
            <div className="flex items-center justify-between p-5">
              <div className="flex items-center space-x-4">
                <motion.div 
                  className={`p-3 rounded-full bg-white/10 backdrop-blur-md ${tab.status === 'Active' ? 'text-green-400' : 'text-amber-400'}`}
                  animate={{ 
                    boxShadow: hoveredTab === tab.id 
                      ? [`0 0 0 rgba(${tab.status === 'Active' ? '34,197,94' : '245,158,11'}, 0)`, 
                         `0 0 20px rgba(${tab.status === 'Active' ? '34,197,94' : '245,158,11'}, 0.7)`] 
                      : `0 0 0 rgba(${tab.status === 'Active' ? '34,197,94' : '245,158,11'}, 0)`
                  }}
                  transition={{ duration: 1, repeat: hoveredTab === tab.id ? Infinity : 0, repeatType: "reverse" }}
                >
                  <Users className="h-6 w-6" />
                </motion.div>
                <div>
                  <h4 className="font-medium text-lg">{tab.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {tab.participants} participants
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-6">
                <div className="text-right">
                  <p className="text-sm font-semibold">{tab.outstandingAmount}</p>
                  <motion.span 
                    variants={statusBadgeVariants}
                    animate="pulse"
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium
                      ${tab.status === 'Active' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                      }`}
                  >
                    {tab.status === 'Active' ? 
                      <CheckCircle className="w-3 h-3 mr-1" /> : 
                      <Clock className="w-3 h-3 mr-1" />
                    }
                    {tab.status}
                  </motion.span>
                </div>
                
                <motion.div
                  variants={chevronVariants}
                  animate={expandedTab === tab.id ? "open" : "closed"}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </motion.div>
              </div>
            </div>
            
            <AnimatePresence>
              {expandedTab === tab.id && (
                <motion.div
                  variants={expandVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className="px-5 pb-5 pt-2 border-t border-white/10"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="rounded-lg bg-white/5 p-4">
                      <h5 className="text-sm font-medium mb-2">Quick Actions</h5>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-white/10 hover:bg-white/20 border-white/10"
                          onClick={(e) => e.stopPropagation()}
                        >
                          View Details
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-white/10 hover:bg-white/20 border-white/10"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Send Reminder
                        </Button>
                      </div>
                    </div>
                    <div className="rounded-lg bg-white/5 p-4">
                      <h5 className="text-sm font-medium mb-2">Summary</h5>
                      <div className="space-y-1 text-sm">
                        <p className="flex justify-between">
                          <span className="text-muted-foreground">Created</span>
                          <span>May 10, 2025</span>
                        </p>
                        <p className="flex justify-between">
                          <span className="text-muted-foreground">Last activity</span>
                          <span>4 hours ago</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      ))}
    </div>
  );
};