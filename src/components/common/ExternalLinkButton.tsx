import { cn } from '@/lib/utils';
import type { ComponentType, SVGProps } from 'react';

type IconComponent = ComponentType<SVGProps<SVGSVGElement> & { className?: string }>;

interface ExternalLinkButtonProps {
  href: string;
  label: string;
  icon?: IconComponent;
  variant?: 'default' | 'outline';
  className?: string;
}

export function ExternalLinkButton({
  href,
  label,
  icon: Icon,
  variant = 'default',
  className,
}: ExternalLinkButtonProps) {
  if (!href) return null;

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={cn(
        'inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors',
        variant === 'default' &&
          'bg-sky-600 text-white hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-600',
        variant === 'outline' &&
          'border border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800',
        className
      )}
    >
      {Icon && <Icon className="h-3.5 w-3.5" />}
      {label}
    </a>
  );
}
