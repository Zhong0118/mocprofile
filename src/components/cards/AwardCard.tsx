import { Trophy } from 'lucide-react';
import { Tag } from '@/components/common/Tag';
import type { Award } from '@/types/content';

interface AwardCardProps {
  award: Award;
}

export function AwardCard({ award }: AwardCardProps) {
  return (
    <div className="rounded-2xl border border-gray-200/60 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md dark:border-gray-700/60 dark:bg-gray-900">
      <div className="flex items-start gap-3">
        <div className="shrink-0 rounded-xl bg-amber-100 p-2.5 dark:bg-amber-900/30">
          <Trophy className="h-5 w-5 text-amber-600 dark:text-amber-400" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start gap-2">
            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
              {award.title}
            </h3>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {award.organization}
          </p>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            {award.description}
          </p>
          <div className="mt-2 flex gap-1.5">
            <Tag variant="outline">{award.year}</Tag>
            <Tag variant="outline">{award.level}</Tag>
          </div>
        </div>
      </div>
    </div>
  );
}
