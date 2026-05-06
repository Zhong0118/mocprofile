import { Link } from 'react-router-dom';
import { ArrowLeft, FileText, MapPin, Calendar } from 'lucide-react';
import { useContent } from '@/hooks/useContent';
import { PageLayout } from '@/components/layout/PageLayout';
import { Tag } from '@/components/common/Tag';

export default function CVPage() {
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

  const { cv, common, profile } = content;

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

        <div className="space-y-6 print:space-y-4">
          {/* Header */}
          <div className="rounded-2xl border border-gray-200/60 bg-white p-6 shadow-sm dark:border-gray-700/60 dark:bg-gray-900 sm:p-8 print:border-0 print:shadow-none">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {profile.name}
            </h1>
            <p className="mt-1 text-gray-500 dark:text-gray-400">{profile.title}</p>
            <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
              {cv.summary}
            </p>
            <div className="mt-4">
              <a
                href={cv.downloadUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-sky-700 print:hidden"
              >
                <FileText className="h-4 w-4" />
                {common.downloadCV}
              </a>
            </div>
          </div>

          {/* Education */}
          <div className="rounded-2xl border border-gray-200/60 bg-white p-6 shadow-sm dark:border-gray-700/60 dark:bg-gray-900 print:border-0 print:shadow-none">
            <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-gray-100">
              Education
            </h2>
            <div className="space-y-4">
              {cv.education.map((edu, i) => (
                <div key={i}>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                    {edu.title}
                  </h3>
                  <p className="text-sm text-sky-700 dark:text-sky-400">
                    {edu.organization}
                  </p>
                  <div className="mt-1 flex gap-3 text-xs text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {edu.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {edu.start} - {edu.end}
                    </span>
                  </div>
                  {edu.description.map((d, j) => (
                    <p key={j} className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                      {d}
                    </p>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Research */}
          {cv.research.length > 0 && (
            <div className="rounded-2xl border border-gray-200/60 bg-white p-6 shadow-sm dark:border-gray-700/60 dark:bg-gray-900 print:border-0 print:shadow-none">
              <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-gray-100">
                Research
              </h2>
              <div className="space-y-4">
                {cv.research.map((res, i) => (
                  <div key={i}>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                      {res.title}
                    </h3>
                    <p className="text-sm text-sky-700 dark:text-sky-400">
                      {res.organization}
                    </p>
                    <div className="mt-1 flex gap-3 text-xs text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {res.start} - {res.end}
                      </span>
                    </div>
                    {res.description.map((d, j) => (
                      <p key={j} className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        {d}
                      </p>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills */}
          <div className="rounded-2xl border border-gray-200/60 bg-white p-6 shadow-sm dark:border-gray-700/60 dark:bg-gray-900 print:border-0 print:shadow-none">
            <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-gray-100">
              Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {cv.skills.map((skill) => (
                <Tag key={skill}>{skill}</Tag>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
