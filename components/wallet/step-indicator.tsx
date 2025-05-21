import React from 'react';
import { cn } from '@/lib/utils';

interface StepIndicatorProps {
  steps: number;
  currentStep: number;
  labels?: string[];
  className?: string;
}

export function StepIndicator({ 
  steps, 
  currentStep, 
  labels, 
  className 
}: StepIndicatorProps): React.ReactElement {
  return (
    <div className={cn("flex items-center w-full justify-between", className)}>
      {Array.from({ length: steps }).map((_, index) => {
        const stepNumber = index + 1;
        const isCompleted = stepNumber < currentStep;
        const isCurrent = stepNumber === currentStep;
        
        return (
          <React.Fragment key={index}>
            {/* Step circle */}
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-200",
                  isCompleted ? "bg-green-500 border-green-500 text-white" : 
                  isCurrent ? "border-blue-500 text-blue-500" : 
                  "border-gray-300 text-gray-400"
                )}
              >
                {isCompleted ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <span>{stepNumber}</span>
                )}
              </div>
              
              {/* Step label */}
              {labels && labels[index] && (
                <span 
                  className={cn(
                    "mt-2 text-sm font-medium",
                    isCompleted ? "text-green-500" : 
                    isCurrent ? "text-blue-500" : 
                    "text-gray-400"
                  )}
                >
                  {labels[index]}
                </span>
              )}
            </div>
            
            {/* Connector line between steps */}
            {index < steps - 1 && (
              <div 
                className={cn(
                  "flex-1 h-0.5 mx-2",
                  stepNumber < currentStep ? "bg-green-500" : "bg-gray-300"
                )}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
