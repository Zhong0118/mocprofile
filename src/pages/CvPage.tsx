import type { ReactNode } from 'react';
import { Download, Printer } from 'lucide-react';
import { allExperience, allProjects, allPublications, formatDate, hasCv } from '@/content/selectors';
import type { Locale } from '@/content/types';
import { useSite } from '@/site/context';
import { ResourceRow, resources } from '@/components/ResourceRow';
import { PublicationEntry } from '@/components/PublicationEntry';
import { ProjectEntry } from '@/components/ProjectEntry';
import { ExperienceEntry } from '@/components/ExperienceEntry';
import NotFoundPage from './NotFoundPage';

function CvSection({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="cv-section mt-10">
      <h2 id={`${id}-title`} className="t-h2 border-b border-sep pb-1.5">
        {title}
      </h2>
      <div className="mt-5 space-y-6">{children}</div>
    </section>
  );
}

/** Online CV built from the same shared records as the homepage: full collections, no copies. */
export default function CvPage() {
  const { bundle, locale, t } = useSite();
  if (!hasCv(bundle)) return <NotFoundPage />;

  const ui = t.ui;
  const { person, cv } = bundle;
  const experience = allExperience(bundle);
  const education = experience.filter((e) => e.kind === 'education');
  const work = experience.filter((e) => e.kind !== 'education');
  const publications = allPublications(bundle);
  const projects = allProjects(bundle);
  const otherLocale: Locale = locale === 'zh' ? 'en' : 'zh';
  const pdf = cv.pdf?.[locale];
  const otherPdf = !pdf ? cv.pdf?.[otherLocale] : undefined;

  return (
    <article className="shell">
      <div className="page-top cv-measure">
        <header>
          <p className="t-meta text-muted">{ui.cv.title}</p>
          <h1 className="t-name mt-1">{person.displayName}</h1>
          {person.handle && (
            <p className="t-subname text-muted">
              GitHub <span lang="en">@{person.handle}</span>
            </p>
          )}
          {t.person.identity?.map((line) => (
            <p key={line} className="t-body text-muted">
              {line}
            </p>
          ))}
          <ResourceRow
            className="mt-2"
            items={resources([
              [person.email ?? '', person.email ? `mailto:${person.email}` : undefined],
              [ui.resources.github, person.links.github],
              [ui.resources.blog, person.links.blog],
              [ui.resources.scholar, person.links.scholar],
              [ui.resources.orcid, person.links.orcid],
            ])}
          />
          <div className="no-print mt-4 flex flex-wrap items-center gap-3">
            <button type="button" className="btn-quiet js-only inline-flex" onClick={() => window.print()}>
              <Printer size={16} strokeWidth={1.75} aria-hidden="true" />
              {ui.cv.print}
            </button>
            {pdf && (
              <a href={pdf.href} className="btn-quiet" type="application/pdf">
                <Download size={16} strokeWidth={1.75} aria-hidden="true" />
                {ui.cv.downloadPdf}
              </a>
            )}
            {otherPdf && (
              <a href={otherPdf.href} className="btn-quiet" type="application/pdf" hrefLang={otherLocale === 'zh' ? 'zh-CN' : 'en'}>
                <Download size={16} strokeWidth={1.75} aria-hidden="true" />
                {ui.cv.downloadOtherLanguagePdf}
              </a>
            )}
          </div>
          <p className="t-caption mt-3 text-muted">{ui.cv.updatedAt(formatDate(cv.updatedAt, locale))}</p>
        </header>

        {education.length > 0 && (
          <CvSection id="education" title={ui.cv.education}>
            {education.map((e) => (
              <ExperienceEntry key={e.id} item={e} />
            ))}
          </CvSection>
        )}
        {work.length > 0 && (
          <CvSection id="experience" title={ui.cv.experience}>
            {work.map((e) => (
              <ExperienceEntry key={e.id} item={e} />
            ))}
          </CvSection>
        )}
        {publications.length > 0 && (
          <CvSection id="publications" title={ui.cv.publications}>
            {publications.map((p) => (
              <PublicationEntry key={p.id} pub={p} showFigure={false} />
            ))}
          </CvSection>
        )}
        {projects.length > 0 && (
          <CvSection id="projects" title={ui.cv.projects}>
            {projects.map((p) => (
              <ProjectEntry key={p.id} project={p} showImage={false} />
            ))}
          </CvSection>
        )}
        {bundle.awards.length > 0 && (
          <CvSection id="awards" title={ui.cv.awards}>
            <ul className="space-y-2">
              {bundle.awards.map((a) => {
                const text = t.awards[a.id];
                return (
                  <li key={a.id} className="cv-entry grid gap-1 sm:grid-cols-[128px_1fr] sm:gap-6">
                    <span className="t-meta tabular text-muted">
                      <time dateTime={a.date}>{formatDate(a.date, locale)}</time>
                    </span>
                    <span className="t-body">
                      {text.title}
                      {text.issuer && <span className="text-muted"> · {text.issuer}</span>}
                    </span>
                  </li>
                );
              })}
            </ul>
          </CvSection>
        )}
        {bundle.skills.length > 0 && (
          <CvSection id="skills" title={ui.cv.skills}>
            <dl className="space-y-1.5">
              {bundle.skills.map((g) => (
                <div key={g.id} className="t-body grid gap-1 sm:grid-cols-[128px_1fr] sm:gap-6">
                  <dt className="text-muted">{t.skillGroups[g.id]}</dt>
                  <dd>{g.items.join(' · ')}</dd>
                </div>
              ))}
            </dl>
          </CvSection>
        )}
      </div>
    </article>
  );
}
