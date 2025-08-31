import { LucideIcon } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';

interface Action {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
}

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  actions?: Action[];
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  subtitle,
  actions = [],
}) => {
  return (
    <Card className="p-8 text-center">
      <Icon className="w-16 h-16 mx-auto mb-4 text-gray-400" />
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md mx-auto">
        {subtitle}
      </p>
      {actions.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant={action.variant === 'outline' || action.variant === 'secondary' ? action.variant : 'default'}
              onClick={action.onClick}
            >
              {action.label}
            </Button>
          ))}
        </div>
      )}
    </Card>
  );
};
