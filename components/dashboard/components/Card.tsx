import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
  children: ReactNode;
  title: string;
  icon?: ReactNode;
  variant?: 'default' | 'glass';
}

export function Card({ children, title, icon, variant = 'default' }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border bg-card text-card-foreground shadow',
        variant === 'glass' && 'bg-white/10 backdrop-blur-lg'
      )}
    >
      <div className="flex items-center gap-2 border-b border-border/50 p-6">
        {icon && <div className="text-muted-foreground">{icon}</div>}
        <h2 className="font-semibold">{title}</h2>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}