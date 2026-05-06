import { cn } from '@/lib/utils';

interface TagProps {
  children: React.ReactNode;
  variant?: 'default' | 'outline';
  className?: string;
}

export function Tag({ children, variant = 'default', className }: TagProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors',
        variant === 'default' &&
          'bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-300',
        variant === 'outline' &&
          'border border-gray-300 text-gray-600 dark:border-gray-600 dark:text-gray-400',
        className
      )}
    >
      {children}
    </span>
  );
}
