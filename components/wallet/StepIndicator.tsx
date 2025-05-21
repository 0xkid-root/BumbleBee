import React from 'react';
import { motion } from 'framer-motion';

interface StepIndicatorProps {
  currentStep: number;
  steps: Array<{
    label: string;
    completed: boolean;
  }>;
}

export function StepIndicator({ currentStep, steps }: StepIndicatorProps) {
  return (
    <div className="flex justify-between items-center w-full">
      {steps.map((step, index) => (
        <React.Fragment key={index}>
          <motion.div
            className={`flex flex-col items-center ${
              index + 1 === currentStep ? 'text-amber-500' : 
              step.completed ? 'text-green-500' : 'text-gray-400'
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="relative">
              <div className={`h-8 w-8 rounded-full flex items-center justify-center border-2 
                ${index + 1 === currentStep ? 'border-amber-500 bg-amber-500/10' : 
                step.completed ? 'border-green-500 bg-green-500/10' : 'border-gray-400 bg-gray-400/10'}`}
              >
                {index + 1}
              </div>
            </div>
            <span className="mt-2 text-sm font-medium">{step.label}</span>
          </motion.div>
          {index < steps.length - 1 && (
            <div className={`flex-1 h-0.5 mx-4 ${
              step.completed ? 'bg-green-500' : 'bg-gray-400/20'
            }`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}