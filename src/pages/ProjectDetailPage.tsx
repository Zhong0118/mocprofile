import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { GithubIcon } from '@/components/common/GithubIcon';
import { useContent } from '@/hooks/useContent';
import { PageLayout } from '@/components/layout/PageLayout';
import { Tag } from '@/components/common/Tag';
import { ExternalLinkButton } from '@/components/common/ExternalLinkButton';

export default function ProjectDetailPage() {
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

  const project = content.projects.find((p) => p.id === id);
  const { common } = content;

  if (!project) {
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
            <Tag variant="outline">{project.status}</Tag>
            <Tag variant="outline">{project.year}</Tag>
          </div>

          <h1 className="mt-4 text-2xl font-bold text-gray-900 dark:text-gray-100">
            {project.title}
          </h1>
          <p className="mt-1 text-gray-500 dark:text-gray-400">
            {project.subtitle}
          </p>

          {project.image && (
            <img
              src={project.image}
              alt={project.title}
              className="mt-6 w-full rounded-xl object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          )}

          <div className="mt-6">
            <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
              {project.description}
            </p>
          </div>

          <div className="mt-4 flex flex-wrap gap-1.5">
            {project.techStack.map((tech) => (
              <Tag key={tech}>{tech}</Tag>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            <ExternalLinkButton href={project.links.demo} label={common.viewDemo} icon={ExternalLink} />
            <ExternalLinkButton href={project.links.github} label={common.viewOnGithub} icon={GithubIcon} variant="outline" />
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
