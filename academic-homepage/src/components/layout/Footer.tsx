import { useContent } from '@/hooks/useContent';

export function Footer() {
  const { content } = useContent();
  if (!content) return null;

  return (
    <footer className="border-t border-gray-200/60 bg-white/50 dark:border-gray-700/60 dark:bg-gray-900/50">
      <div className="mx-auto max-w-7xl px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400 sm:px-6">
        {content.common.footerText}
      </div>
    </footer>
  );
}
