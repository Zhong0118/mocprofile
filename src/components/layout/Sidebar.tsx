import {
  Mail,
  MapPin,
  FileText,
  GraduationCap,
  Globe,
  BookOpen,
} from 'lucide-react';
import { GithubIcon } from '@/components/common/GithubIcon';
import { IconLink } from '@/components/common/IconLink';
import { Tag } from '@/components/common/Tag';
import type { Profile, CommonText } from '@/types/content';

interface SidebarProps {
  profile: Profile;
  common: CommonText;
}

export function Sidebar({ profile, common }: SidebarProps) {
  return (
    <aside className="lg:sticky lg:top-20 lg:self-start">
      <div className="rounded-2xl border border-gray-200/60 bg-white p-6 shadow-sm dark:border-gray-700/60 dark:bg-gray-900">
        <div className="flex flex-col items-center text-center">
          <img
            src={profile.avatar}
            alt={profile.name}
            className="h-32 w-32 rounded-full border-4 border-white object-cover shadow-lg dark:border-gray-800"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128"><rect width="128" height="128" fill="%23e2e8f0"/><text x="64" y="72" font-size="48" text-anchor="middle" fill="%2394a3b8">?</text></svg>';
            }}
          />
          <h1 className="mt-4 text-xl font-bold text-gray-900 dark:text-gray-100">
            {profile.name}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {profile.title}
          </p>
          <p className="mt-2 text-sm italic text-gray-600 dark:text-gray-400">
            {profile.signature}
          </p>
        </div>

        <div className="mt-6 space-y-3">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <MapPin className="h-4 w-4 shrink-0" />
            <span>{profile.location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Mail className="h-4 w-4 shrink-0" />
            <a
              href={`mailto:${profile.email}`}
              className="truncate hover:text-sky-600 dark:hover:text-sky-400"
            >
              {profile.email}
            </a>
          </div>
          {profile.scholar && (
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <GraduationCap className="h-4 w-4 shrink-0" />
              <a
                href={profile.scholar}
                target="_blank"
                rel="noreferrer"
                className="truncate hover:text-sky-600 dark:hover:text-sky-400"
              >
                Google Scholar
              </a>
            </div>
          )}
        </div>

        <div className="mt-4 flex items-center justify-center gap-1">
          {profile.github && (
            <IconLink href={profile.github} icon={GithubIcon} label="GitHub" />
          )}
          {profile.blogUrl && (
            <IconLink href={profile.blogUrl} icon={Globe} label="Blog" />
          )}
          {profile.scholar && (
            <IconLink href={profile.scholar} icon={BookOpen} label="Scholar" />
          )}
          <a
            href={`mailto:${profile.email}`}
            className="inline-flex items-center justify-center rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100"
            aria-label="Email"
          >
            <Mail className="h-5 w-5" />
          </a>
        </div>

        <div className="mt-6">
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            {common.researchInterestsTitle}
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {profile.researchInterests.map((interest) => (
              <Tag key={interest}>{interest}</Tag>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <a
            href={profile.cvUrl}
            target="_blank"
            rel="noreferrer"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-600"
          >
            <FileText className="h-4 w-4" />
            {common.downloadCV}
          </a>
        </div>
      </div>
    </aside>
  );
}
