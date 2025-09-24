import { Button } from './button';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  emoji?: string;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({
  icon: Icon,
  emoji,
  title,
  description,
  action,
  className = '',
}: EmptyStateProps) {
  return (
    <div className={`text-center py-12 ${className}`}>
      {Icon && (
        <div className="w-16 h-16 mx-auto mb-4 text-neutral-400">
          <Icon className="w-full h-full" />
        </div>
      )}
      {emoji && <div className="text-6xl mb-4">{emoji}</div>}

      <h3 className="text-xl font-semibold text-neutral-900 mb-2">{title}</h3>

      {description && (
        <p className="text-neutral-600 mb-6 max-w-md mx-auto">{description}</p>
      )}

      {action && (
        <Button
          onClick={action.onClick}
          className="bg-amber-600 hover:bg-amber-700"
        >
          {action.label}
        </Button>
      )}
    </div>
  );
}
