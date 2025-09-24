import { Card, CardContent, CardHeader, CardTitle } from './card';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  change?: {
    value: string;
    type: 'increase' | 'decrease' | 'neutral';
    label?: string;
  };
  color?: 'amber' | 'blue' | 'green' | 'purple' | 'red' | 'neutral';
  className?: string;
}

export function StatCard({
  title,
  value,
  icon: Icon,
  change,
  color = 'amber',
  className,
}: StatCardProps) {
  const colorClasses = {
    amber: 'bg-amber-100 text-amber-600',
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    red: 'bg-red-100 text-red-600',
    neutral: 'bg-neutral-100 text-neutral-600',
  };

  const changeColorClasses = {
    increase: 'text-green-600',
    decrease: 'text-red-600',
    neutral: 'text-neutral-600',
  };

  return (
    <Card
      className={cn('transition-all duration-200 hover:shadow-md', className)}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-neutral-600">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-neutral-900 mb-1">
              {value}
            </div>
            {change && (
              <div className={cn('text-sm', changeColorClasses[change.type])}>
                {change.value} {change.label}
              </div>
            )}
          </div>
          <div
            className={cn(
              'w-12 h-12 rounded-full flex items-center justify-center',
              colorClasses[color]
            )}
          >
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
