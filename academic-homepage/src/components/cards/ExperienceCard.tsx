import { MapPin, Calendar } from 'lucide-react';
import { Tag } from '@/components/common/Tag';
import type { Experience } from '@/types/content';

interface ExperienceCardProps {
  experience: Experience;
}

export function ExperienceCard({ experience }: ExperienceCardProps) {
  return (
    <div className="relative border-l-2 border-sky-200 pl-6 dark:border-sky-800">
      <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full border-2 border-sky-500 bg-white dark:bg-gray-950" />

      <div className="rounded-2xl border border-gray-200/60 bg-white p-5 shadow-sm dark:border-gray-700/60 dark:bg-gray-900">
        <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
          {experience.title}
        </h3>
        <p className="text-sm font-medium text-sky-700 dark:text-sky-400">
          {experience.organization}
        </p>

        <div className="mt-2 flex flex-wrap gap-3 text-xs text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            {experience.location}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            {experience.start} - {experience.end}
          </span>
        </div>

        <ul className="mt-3 space-y-1">
          {experience.description.map((desc, i) => (
            <li
              key={i}
              className="text-sm leading-relaxed text-gray-600 dark:text-gray-400"
            >
              {desc}
            </li>
          ))}
        </ul>

        {experience.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {experience.tags.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
