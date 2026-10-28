import type { ReactNode } from 'react';
import { Download, Printer } from 'lucide-react';
import { allAwards, allExperience, allProjects, allPublications, allRepositories, formatDate, isModuleEnabled } from '@/content/selectors';
import type { Locale } from '@/content/types';
import { cn } from '@/lib/utils';
import { useSite } from '@/site/context';
import { ResourceRow, resources } from '@/components/ResourceRow';
import { PublicationEntry } from '@/components/PublicationEntry';
import { ProjectEntry } from '@/components/ProjectEntry';
import { ExperienceEntry } from '@/components/ExperienceEntry';
import { AwardEntry } from '@/components/AwardEntry';
import { EmptyState } from '@/components/ui';
import NotFoundPage from './NotFoundPage';

/** CV section. Empty sections keep a compact empty state on screen and are left out of print. */
function CvSection({ id, title, empty, children }: { id: string; title: string; empty?: boolean; children?: ReactNode }) {
  return (
    <section id={id} data-section aria-labelledby={`${id}-title`} className={cn('cv-section mt-10', empty && 'print-hide')}>
      <h2 id={`${id}-title`} className="t-h3 border-b border-border pb-2">
        {title}
      </h2>
      <div className="mt-5 space-y-6">{empty ? <EmptyState /> : children}</div>
    </section>
  );
}

/** Online CV built from the same shared records as the rest of the site: full collections, no copies. */
export default function CvPage() {
  const { bundle, locale, t } = useSite();
  if (!isModuleEnabled(bundle, 'cv')) return <NotFoundPage />;

  const ui = t.ui;
  const { person, cv } = bundle;
  const experience = allExperience(bundle);
  const education = experience.filter((e) => e.kind === 'education');
  const work = experience.filter((e) => e.kind !== 'education');
  const publications = allPublications(bundle);
  const projects = allProjects(bundle);
  const repos = allRepositories(bundle);
  const awards = allAwards(bundle);
  const otherLocale: Locale = locale === 'zh' ? 'en' : 'zh';
  const pdf = cv.pdf?.[locale];
  const otherPdf = !pdf ? cv.pdf?.[otherLocale] : undefined;

  return (
    <article className="page-wrap">
      <div className="page-top mx-auto mb-20 max-w-[52rem]">
        <header>
          <p className="t-eyebrow">{ui.cv.title}</p>
          <h1 className="t-h1 mt-1">{person.displayName}</h1>
          {person.handle && (
            <p className="t-meta text-muted">
              GitHub <span lang="en">@{person.handle}</span>
            </p>
          )}
          {t.person.identity?.map((line) => (
            <p key={line} className="t-small text-fg-2">
              {line}
            </p>
          ))}
          <p className="t-small measure mt-3">{t.person.intro}</p>
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
            <button type="button" className="btn btn-secondary js-only inline-flex" onClick={() => window.print()}>
              <Printer size={18} strokeWidth={1.75} aria-hidden="true" />
              {ui.cv.print}
            </button>
            {pdf && (
              <a href={pdf.href} className="btn btn-secondary" type="application/pdf">
                <Download size={18} strokeWidth={1.75} aria-hidden="true" />
                {ui.cv.downloadPdf}
              </a>
            )}
            {otherPdf && (
              <a href={otherPdf.href} className="btn btn-secondary" type="application/pdf" hrefLang={otherLocale === 'zh' ? 'zh-CN' : 'en'}>
                <Download size={18} strokeWidth={1.75} aria-hidden="true" />
                {ui.cv.downloadOtherLanguagePdf}
              </a>
            )}
          </div>
          <p className="t-caption mt-3 text-muted">{ui.cv.updatedAt(formatDate(cv.updatedAt, locale))}</p>
        </header>

        <CvSection id="education" title={ui.cv.education} empty={education.length === 0}>
          {education.map((e) => (
            <ExperienceEntry key={e.id} item={e} />
          ))}
        </CvSection>
        <CvSection id="experience" title={ui.cv.experience} empty={work.length === 0}>
          {work.map((e) => (
            <ExperienceEntry key={e.id} item={e} />
          ))}
        </CvSection>
        <CvSection id="publications" title={ui.cv.publications} empty={publications.length === 0}>
          {publications.map((p) => (
            <PublicationEntry key={p.id} pub={p} showFigure={false} />
          ))}
        </CvSection>
        <CvSection id="projects" title={ui.cv.projects} empty={projects.length === 0}>
          {projects.map((p) => (
            <ProjectEntry key={p.id} project={p} />
          ))}
        </CvSection>
        <CvSection id="skills" title={ui.cv.skills} empty={bundle.skills.length === 0}>
          <dl className="space-y-1.5">
            {bundle.skills.map((g) => (
              <div key={g.id} className="t-small timeline-item cv-entry">
                <dt className="text-muted">{t.skillGroups[g.id]}</dt>
                <dd lang="en">{g.skills.map((s) => s.name).join(' · ')}</dd>
              </div>
            ))}
          </dl>
        </CvSection>
        <CvSection id="repositories" title={ui.cv.repositories} empty={repos.length === 0}>
          <ul className="space-y-1.5">
            {repos.map((r) => (
              <li key={r.id} className="t-small cv-entry">
                <a href={r.url} className="plain-link print-url break-all font-medium text-fg" data-print-url={r.url} lang="en">
                  {r.owner}/{r.name}
                </a>
                <span className="text-fg-2"> — {t.repositories[r.id]?.summary}</span>
              </li>
            ))}
          </ul>
        </CvSection>
        <CvSection id="awards" title={ui.cv.awards} empty={awards.length === 0}>
          {awards.map((a) => (
            <AwardEntry key={a.id} award={a} />
          ))}
        </CvSection>
      </div>
    </article>
  );
}
