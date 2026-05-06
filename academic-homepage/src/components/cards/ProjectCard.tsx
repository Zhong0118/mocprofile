import { ExternalLink, ArrowRight } from 'lucide-react';
import { GithubIcon } from '@/components/common/GithubIcon';
import { Link } from 'react-router-dom';
import { Tag } from '@/components/common/Tag';
import { ExternalLinkButton } from '@/components/common/ExternalLinkButton';
import type { Project, CommonText } from '@/types/content';

interface ProjectCardProps {
  project: Project;
  common: CommonText;
}

export function ProjectCard({ project, common }: ProjectCardProps) {
  return (
    <div className="group rounded-2xl border border-gray-200/60 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md dark:border-gray-700/60 dark:bg-gray-900 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="shrink-0">
          <img
            src={project.image}
            alt={project.title}
            className="h-32 w-full rounded-xl object-cover sm:h-28 sm:w-44"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 176 112"><rect width="176" height="112" fill="%23e2e8f0"/><text x="88" y="62" font-size="14" text-anchor="middle" fill="%2394a3b8">Project</text></svg>';
            }}
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start gap-2">
            <Tag variant="outline">{project.status}</Tag>
            <Tag variant="outline">{project.year}</Tag>
          </div>

          <h3 className="mt-2 text-base font-semibold text-gray-900 dark:text-gray-100">
            {project.title}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {project.subtitle}
          </p>

          <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
            {project.description}
          </p>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {project.techStack.map((tech) => (
              <Tag key={tech}>{tech}</Tag>
            ))}
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <ExternalLinkButton
              href={project.links.demo}
              label={common.viewDemo}
              icon={ExternalLink}
            />
            <ExternalLinkButton
              href={project.links.github}
              label={common.viewOnGithub}
              icon={GithubIcon}
              variant="outline"
            />
            {project.links.detail && (
              <Link
                to={project.links.detail}
                className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                <ArrowRight className="h-3.5 w-3.5" />
                {common.viewDetail}
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
