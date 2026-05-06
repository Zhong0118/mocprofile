import { FileText, Code, ExternalLink, BookOpen, Quote } from 'lucide-react';
import { Tag } from '@/components/common/Tag';
import { ExpandableText } from '@/components/common/ExpandableText';
import { ExternalLinkButton } from '@/components/common/ExternalLinkButton';
import type { Publication, CommonText } from '@/types/content';

interface PublicationCardProps {
  publication: Publication;
  common: CommonText;
}

export function PublicationCard({ publication, common }: PublicationCardProps) {
  return (
    <div className="group rounded-2xl border border-gray-200/60 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md dark:border-gray-700/60 dark:bg-gray-900 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="shrink-0">
          <img
            src={publication.image}
            alt={publication.title}
            className="h-32 w-full rounded-xl object-cover sm:h-28 sm:w-44"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 176 112"><rect width="176" height="112" fill="%23e2e8f0"/><text x="88" y="62" font-size="14" text-anchor="middle" fill="%2394a3b8">Paper</text></svg>';
            }}
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start gap-2">
            <Tag variant="outline">{publication.type}</Tag>
            <Tag variant="outline">{publication.year}</Tag>
          </div>

          <h3 className="mt-2 text-base font-semibold leading-snug text-gray-900 dark:text-gray-100">
            {publication.title}
          </h3>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {publication.authors.join(', ')}
          </p>

          <p className="mt-1 text-sm font-medium text-sky-700 dark:text-sky-400">
            {publication.venue}
          </p>

          <div className="mt-2">
            <ExpandableText
              text={publication.abstract}
              expandLabel={common.expandAbstract}
              collapseLabel={common.collapseAbstract}
            />
          </div>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {publication.tags.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <ExternalLinkButton
              href={publication.links.paper}
              label={common.viewPaper}
              icon={ExternalLink}
            />
            <ExternalLinkButton
              href={publication.links.pdf}
              label={common.viewPDF}
              icon={FileText}
              variant="outline"
            />
            <ExternalLinkButton
              href={publication.links.code}
              label={common.viewCode}
              icon={Code}
              variant="outline"
            />
            <ExternalLinkButton
              href={publication.links.project}
              label={common.viewProject}
              icon={BookOpen}
              variant="outline"
            />
            {publication.links.bibtex && (
              <button
                onClick={() => {
                  navigator.clipboard.writeText(publication.links.bibtex);
                }}
                className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                <Quote className="h-3.5 w-3.5" />
                {common.viewBibtex}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
