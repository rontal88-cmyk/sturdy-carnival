import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { HelpCircle } from 'lucide-react';

interface KPICardProps {
  label: string;
  value: string;
  subValue?: string;
  description?: string;
  trend?: 'positive' | 'negative' | 'neutral';
  size?: 'default' | 'large';
  className?: string;
}

export function KPICard({
  label,
  value,
  subValue,
  description,
  trend = 'neutral',
  size = 'default',
  className,
}: KPICardProps) {
  return (
    <div
      className={cn(
        'rounded-lg border bg-card p-4 flex flex-col gap-1',
        className
      )}
    >
      <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">
        {label}
        {description && (
          <Tooltip>
            <TooltipTrigger asChild>
              <HelpCircle className="h-3.5 w-3.5 cursor-help" />
            </TooltipTrigger>
            <TooltipContent className="max-w-[200px] text-xs">{description}</TooltipContent>
          </Tooltip>
        )}
      </div>
      <div
        className={cn(
          'font-bold tracking-tight',
          size === 'large' ? 'text-3xl' : 'text-2xl',
          trend === 'positive' && 'text-green-600',
          trend === 'negative' && 'text-red-600',
          trend === 'neutral' && 'text-foreground'
        )}
      >
        {value}
      </div>
      {subValue && (
        <div className="text-xs text-muted-foreground">{subValue}</div>
      )}
    </div>
  );
}
