import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, FileText, Code, ExternalLink, BookOpen, Quote } from 'lucide-react';
import { useContent } from '@/hooks/useContent';
import { PageLayout } from '@/components/layout/PageLayout';
import { Tag } from '@/components/common/Tag';
import { ExternalLinkButton } from '@/components/common/ExternalLinkButton';

export default function PaperDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { content } = useContent();

  if (!content) {
    return (
      <PageLayout>
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-sky-500 border-t-transparent" />
        </div>
      </PageLayout>
    );
  }

  const paper = content.publications.find((p) => p.id === id);
  const { common } = content;

  if (!paper) {
    return (
      <PageLayout>
        <div className="mx-auto max-w-3xl py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {common.notFoundTitle}
          </h1>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            {common.notFoundDescription}
          </p>
          <Link
            to="/"
            className="mt-4 inline-flex items-center gap-2 text-sky-600 hover:text-sky-700 dark:text-sky-400"
          >
            <ArrowLeft className="h-4 w-4" />
            {common.backToHome}
          </Link>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="mx-auto max-w-3xl">
        <Link
          to="/"
          className="mb-6 inline-flex items-center gap-2 text-sm text-gray-500 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
        >
          <ArrowLeft className="h-4 w-4" />
          {common.backToHome}
        </Link>

        <div className="rounded-2xl border border-gray-200/60 bg-white p-6 shadow-sm dark:border-gray-700/60 dark:bg-gray-900 sm:p-8">
          <div className="flex items-start gap-2">
            <Tag variant="outline">{paper.type}</Tag>
            <Tag variant="outline">{paper.year}</Tag>
          </div>

          <h1 className="mt-4 text-2xl font-bold leading-tight text-gray-900 dark:text-gray-100">
            {paper.title}
          </h1>

          <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
            {paper.authors.join(', ')}
          </p>

          <p className="mt-1 text-sm font-medium text-sky-700 dark:text-sky-400">
            {paper.venue}
          </p>

          {paper.image && (
            <img
              src={paper.image}
              alt={paper.title}
              className="mt-6 w-full rounded-xl object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          )}

          <div className="mt-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Abstract
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
              {paper.abstract}
            </p>
          </div>

          <div className="mt-4 flex flex-wrap gap-1.5">
            {paper.tags.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            <ExternalLinkButton href={paper.links.paper} label={common.viewPaper} icon={ExternalLink} />
            <ExternalLinkButton href={paper.links.pdf} label={common.viewPDF} icon={FileText} variant="outline" />
            <ExternalLinkButton href={paper.links.code} label={common.viewCode} icon={Code} variant="outline" />
            <ExternalLinkButton href={paper.links.project} label={common.viewProject} icon={BookOpen} variant="outline" />
          </div>

          {paper.links.bibtex && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                BibTeX
              </h2>
              <div className="mt-2 rounded-lg bg-gray-100 p-4 dark:bg-gray-800">
                <pre className="overflow-x-auto text-xs text-gray-700 dark:text-gray-300">
                  {paper.links.bibtex}
                </pre>
                <button
                  onClick={() => navigator.clipboard.writeText(paper.links.bibtex)}
                  className="mt-2 inline-flex items-center gap-1 text-xs text-sky-600 hover:text-sky-700 dark:text-sky-400"
                >
                  <Quote className="h-3 w-3" />
                  Copy
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
}
