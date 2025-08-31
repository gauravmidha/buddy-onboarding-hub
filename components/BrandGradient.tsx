import { BRAND } from '../lib/constants';
import { cn } from '../lib/utils';

interface BrandGradientProps {
  className?: string;
  children: React.ReactNode;
}

export const BrandGradient: React.FC<BrandGradientProps> = ({ className, children }) => {
  return (
    <div
      className={cn(
        `bg-gradient-to-br ${BRAND.primary} relative`,
        className
      )}
    >
      {/* Soft radial overlay */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-black/10 pointer-events-none" />
      {children}
    </div>
  );
};
