import { TaskStatus } from '../lib/constants';
import { Badge } from './ui/badge';

interface StatusPillProps {
  status: TaskStatus;
}

export const StatusPill: React.FC<StatusPillProps> = ({ status }) => {
  const getStatusConfig = (status: TaskStatus) => {
    switch (status) {
      case 'todo':
        return { label: 'To Do', variant: 'secondary' };
      case 'doing':
        return { label: 'In Progress', variant: 'default' };
      case 'done':
        return { label: 'Done', variant: 'secondary' };
      case 'blocked':
        return { label: 'Blocked', variant: 'destructive' };
      default:
        return { label: 'Unknown', variant: 'secondary' };
    }
  };

  const { label, variant } = getStatusConfig(status);

  return (
    <Badge
      variant={variant as any}
      aria-live="polite"
      aria-label={`Task status: ${label}`}
    >
      {label}
    </Badge>
  );
};
