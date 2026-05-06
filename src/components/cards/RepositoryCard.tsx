import { Star, GitFork } from 'lucide-react';
import { GithubIcon } from '@/components/common/GithubIcon';
import { Tag } from '@/components/common/Tag';
import type { Repository, CommonText } from '@/types/content';

const languageColors: Record<string, string> = {
  Python: 'bg-blue-500',
  TypeScript: 'bg-blue-600',
  JavaScript: 'bg-yellow-400',
  Rust: 'bg-orange-600',
  Go: 'bg-cyan-500',
  Java: 'bg-red-500',
  Markdown: 'bg-gray-500',
};

interface RepositoryCardProps {
  repository: Repository;
  common: CommonText;
}

export function RepositoryCard({ repository, common }: RepositoryCardProps) {
  return (
    <a
      href={repository.url}
      target="_blank"
      rel="noreferrer"
      className="group block rounded-2xl border border-gray-200/60 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md dark:border-gray-700/60 dark:bg-gray-900"
    >
      <div className="flex items-start justify-between">
        <h3 className="text-base font-semibold text-gray-900 group-hover:text-sky-600 dark:text-gray-100 dark:group-hover:text-sky-400">
          {repository.name}
        </h3>
        <GithubIcon className="h-5 w-5 shrink-0 text-gray-400 dark:text-gray-500" />
      </div>

      <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
        {repository.description}
      </p>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {repository.tags.map((tag) => (
          <Tag key={tag} variant="outline">
            {tag}
          </Tag>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
        <span className="flex items-center gap-1">
          <span
            className={`h-3 w-3 rounded-full ${languageColors[repository.language] ?? 'bg-gray-400'}`}
          />
          {repository.language}
        </span>
        <span className="flex items-center gap-1">
          <Star className="h-3.5 w-3.5" />
          {repository.stars} {common.stars}
        </span>
        <span className="flex items-center gap-1">
          <GitFork className="h-3.5 w-3.5" />
          {repository.forks} {common.forks}
        </span>
      </div>
    </a>
  );
}
