import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useContent } from '@/hooks/useContent';
import { PageLayout } from '@/components/layout/PageLayout';

export default function NotFoundPage() {
  const { content } = useContent();

  return (
    <PageLayout>
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <h1 className="text-6xl font-bold text-gray-300 dark:text-gray-700">404</h1>
        <h2 className="mt-4 text-xl font-bold text-gray-900 dark:text-gray-100">
          {content?.common.notFoundTitle ?? 'Page Not Found'}
        </h2>
        <p className="mt-2 text-gray-500 dark:text-gray-400">
          {content?.common.notFoundDescription ?? 'The page you are looking for does not exist.'}
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-sky-700"
        >
          <ArrowLeft className="h-4 w-4" />
          {content?.common.backToHome ?? 'Back to Home'}
        </Link>
      </div>
    </PageLayout>
  );
}
