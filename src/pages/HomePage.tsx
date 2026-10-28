import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { FileText } from 'lucide-react';
import { hasCv, selectHomepage } from '@/content/selectors';
import { useSite } from '@/site/context';
import { projectTarget, publicationTarget } from '@/site/links';
import { cvPath } from '@/routing/paths';
import { ResourceRow, resources } from '@/components/ResourceRow';
import { PublicationEntry } from '@/components/PublicationEntry';
import { ProjectEntry } from '@/components/ProjectEntry';
import { ExperienceEntry } from '@/components/ExperienceEntry';

function HomeSection({
  id,
  title,
  first,
  more,
  children,
}: {
  id: string;
  title: string;
  first: boolean;
  more?: { label: string; href: string };
  children: ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={first ? 'intro-gap' : 'section-gap'}>
      <h2 id={`${id}-title`} className="t-h2">
        {title}
      </h2>
      <div className="mt-5 space-y-7">{children}</div>
      {more && (
        <p className="t-meta mt-6">
          <Link to={more.href} className="plain-link">
            {more.label}
          </Link>
        </p>
      )}
    </section>
  );
}

function Intro() {
  const { bundle, locale, t } = useSite();
  const { person } = bundle;
  const ui = t.ui;
  const avatar = person.avatar;
  const cv = hasCv(bundle);

  const name = (
    <div className="min-w-0">
      <h1 id="about-title" className="t-name">
        {person.displayName}
      </h1>
      {(person.englishName || person.handle) && (
        <p className="t-subname text-muted">
          {person.englishName ?? (
            <>
              GitHub <span lang="en">@{person.handle}</span>
            </>
          )}
        </p>
      )}
    </div>
  );

  return (
    <section id="about" aria-labelledby="about-title" className="page-top">
      <div className="flex items-start gap-12">
        <div className="min-w-0 flex-1">
          {avatar ? (
            <div className="flex items-center gap-4 sm:block">
              <img
                src={avatar.src}
                width={72}
                height={72}
                alt=""
                className="figure-img size-[72px] shrink-0 object-cover sm:hidden"
                fetchPriority="high"
              />
              {name}
            </div>
          ) : (
            name
          )}
          {t.person.identity?.map((line) => (
            <p key={line} className="t-body mt-1 text-muted">
              {line}
            </p>
          ))}

          <div className="measure mt-5 space-y-3">
            {t.person.intro.map((p, i) => (
              <p key={i} className="t-body">
                {p}
              </p>
            ))}
            {bundle.focus.length > 0 && (
              <ul className="space-y-2">
                {bundle.focus.map((f) => {
                  const text = t.person.focus[f.id];
                  const target = f.projectId
                    ? projectTarget(bundle, locale, f.projectId)
                    : f.publicationId
                      ? publicationTarget(bundle, locale, f.publicationId)
                      : undefined;
                  const evidence = f.projectId
                    ? bundle.projects.find((p) => p.id === f.projectId)?.name
                    : bundle.publications.find((p) => p.id === f.publicationId)?.originalTitle;
                  return (
                    <li key={f.id} className="t-body relative pl-4 before:absolute before:left-0 before:text-muted before:content-['–']">
                      <span className="font-semibold">{text.label}</span>
                      {ui.colon}
                      {text.text}
                      {target && evidence && (
                        <>
                          {' '}
                          {target.internal ? (
                            <Link to={target.href} className="prose-link" lang="en">
                              {evidence}
                            </Link>
                          ) : (
                            <a href={target.href} className="prose-link" lang="en">
                              {evidence}
                            </a>
                          )}
                        </>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2">
            {cv && (
              <Link to={cvPath(locale)} className="btn-primary">
                <FileText size={16} strokeWidth={1.75} aria-hidden="true" />
                {ui.resources.cv}
              </Link>
            )}
            <ResourceRow
              items={resources([
                [person.email ?? '', person.email ? `mailto:${person.email}` : undefined],
                [ui.resources.github, person.links.github],
                [ui.resources.blog, person.links.blog],
                [ui.resources.scholar, person.links.scholar],
                [ui.resources.orcid, person.links.orcid],
              ])}
            />
          </div>
        </div>
        {avatar && (
          <img
            src={avatar.src}
            width={avatar.width}
            height={avatar.height}
            alt=""
            fetchPriority="high"
            className="figure-img hidden size-32 shrink-0 object-cover sm:block lg:size-44"
          />
        )}
      </div>
    </section>
  );
}

export default function HomePage() {
  const { bundle, locale, t } = useSite();
  const ui = t.ui;
  const home = selectHomepage(bundle);
  const cv = cvPath(locale);
  let index = 0;
  const isFirst = () => index++ === 0;

  return (
    <div className="shell">
      <Intro />
      {home.publications.length > 0 && (
        <HomeSection
          id="publications"
          title={ui.sections.publications}
          first={isFirst()}
          more={home.more.publications ? { label: ui.fullListInCv.publications, href: `${cv}#publications` } : undefined}
        >
          <ol className="space-y-7">
            {home.publications.map((p) => (
              <li key={p.id}>
                <PublicationEntry pub={p} />
              </li>
            ))}
          </ol>
        </HomeSection>
      )}
      {home.projects.length > 0 && (
        <HomeSection
          id="projects"
          title={ui.sections.projects}
          first={isFirst()}
          more={home.more.projects ? { label: ui.fullListInCv.projects, href: `${cv}#projects` } : undefined}
        >
          <ul className="space-y-7">
            {home.projects.map((p) => (
              <li key={p.id}>
                <ProjectEntry project={p} />
              </li>
            ))}
          </ul>
        </HomeSection>
      )}
      {home.experience.length > 0 && (
        <HomeSection
          id="experience"
          title={ui.sections.experience}
          first={isFirst()}
          more={
            home.more.experience
              ? {
                  label: ui.fullListInCv.experience,
                  // The CV splits education from research/employment; link to the section that exists.
                  href: `${cv}#${bundle.experience.some((e) => e.kind !== 'education') ? 'experience' : 'education'}`,
                }
              : undefined
          }
        >
          <ul className="space-y-7">
            {home.experience.map((e) => (
              <li key={e.id}>
                <ExperienceEntry item={e} />
              </li>
            ))}
          </ul>
        </HomeSection>
      )}
    </div>
  );
}
