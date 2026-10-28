import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, FileText } from 'lucide-react';
import {
  allAwards,
  featuredProjects,
  formatDate,
  homepageExperience,
  homepagePublications,
  homepageRepositories,
  isModuleEnabled,
} from '@/content/selectors';
import type { ModuleId } from '@/content/types';
import { useSite } from '@/site/context';
import { aboutPath, cvPath, projectsPath, publicationsPath, repositoriesPath } from '@/routing/paths';
import { ResearchMap } from '@/components/ResearchMap';
import { DirectionCards } from '@/components/DirectionCards';
import { ProjectCard } from '@/components/ProjectCard';
import { PublicationEntry } from '@/components/PublicationEntry';
import { SkillExplorer } from '@/components/SkillExplorer';
import { RepositoryCard } from '@/components/RepositoryCard';
import { ExperienceEntry } from '@/components/ExperienceEntry';
import { AwardEntry } from '@/components/AwardEntry';
import { ContactBlock } from '@/components/ContactBlock';
import { EmptyState, ModuleSection } from '@/components/ui';

function Hero() {
  const { bundle, locale, t } = useSite();
  const { person } = bundle;
  const ui = t.ui;

  return (
    <section id="about" data-section aria-labelledby="about-title" className="hero">
      <div className="grid-layout items-center gap-y-8">
        <div className="col-span-full lg:col-span-7">
          {t.person.identity?.map((line) => (
            <p key={line} className="t-meta font-medium text-fg-2">
              {line}
            </p>
          ))}
          <h1 id="about-title" className="t-display mt-3">
            {person.displayName}
          </h1>
          {person.handle && (
            <p className="t-meta mt-2 text-muted">
              GitHub <span lang="en">@{person.handle}</span>
            </p>
          )}
          <p className="t-tagline mt-5">
            {t.person.tagline.map((line, i) => (
              <span key={line} className="block">
                {line}
                {i < t.person.tagline.length - 1 && <span className="sr-only">，</span>}
              </span>
            ))}
          </p>
          <p className="t-body measure mt-4 text-fg-2">{t.person.intro}</p>

          <ul className="mt-5 flex flex-wrap gap-2" aria-label={ui.hero.directionsLabel}>
            {bundle.directions.map((d) => (
              <li key={d.id}>
                <Link to={`#direction-${d.id}`} className="tag tag-accent h-9 px-3 text-[0.875rem] hover:text-accent-hover">
                  {t.directions[d.id].label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            {isModuleEnabled(bundle, 'projects') && (
              <Link to={projectsPath(locale)} className="btn btn-primary">
                {ui.hero.primary}
                <ArrowRight size={18} strokeWidth={1.85} aria-hidden="true" />
              </Link>
            )}
            {isModuleEnabled(bundle, 'cv') && (
              <Link to={cvPath(locale)} className="btn btn-secondary btn-hero">
                <FileText size={18} strokeWidth={1.75} aria-hidden="true" />
                {ui.hero.secondary}
              </Link>
            )}
            <span className="flex items-center gap-1 sm:ml-2">
              {person.links.github && (
                <a href={person.links.github} className="text-action px-2 text-fg-2 hover:text-accent">
                  {ui.resources.github}
                  <ArrowUpRight size={15} strokeWidth={1.85} aria-hidden="true" />
                </a>
              )}
              {person.links.blog && (
                <a href={person.links.blog} className="text-action px-2 text-fg-2 hover:text-accent">
                  {ui.nav.blog}
                  <ArrowUpRight size={15} strokeWidth={1.85} aria-hidden="true" />
                </a>
              )}
            </span>
          </div>
        </div>
        <div className="col-span-full lg:col-span-5">
          <ResearchMap />
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  const { bundle, locale, t } = useSite();
  const ui = t.ui;
  const on = (id: ModuleId) => isModuleEnabled(bundle, id);
  const featured = featuredProjects(bundle);
  const [main, ...side] = featured;
  const repos = homepageRepositories(bundle);
  const pubs = homepagePublications(bundle);
  const experience = homepageExperience(bundle);
  const awards = allAwards(bundle);

  return (
    <div className="page-wrap">
      <Hero />

      {on('research') && (
        <ModuleSection id="research" title={ui.modules.research} lead={ui.moduleLead.research} action={{ label: ui.more.about, to: aboutPath(locale) }}>
          <DirectionCards />
        </ModuleSection>
      )}

      {on('projects') && (
        <ModuleSection
          id="projects"
          title={ui.modules.projects}
          lead={ui.moduleLead.projects}
          action={{ label: ui.more.projects(bundle.projects.length), to: projectsPath(locale) }}
        >
          {main ? (
            <div className="grid-layout">
              <ProjectCard project={main} variant="feature" className="col-span-full lg:col-span-8" anchor={false} />
              <div className="col-span-full grid gap-[var(--gap)] md:grid-cols-2 lg:col-span-4 lg:grid-cols-1">
                {side.map((p) => (
                  <ProjectCard key={p.id} project={p} variant="side" anchor={false} />
                ))}
              </div>
            </div>
          ) : (
            <EmptyState />
          )}
        </ModuleSection>
      )}

      {on('publications') && (
        <ModuleSection
          id="publications"
          title={ui.modules.publications}
          action={pubs.length ? { label: ui.more.publications, to: publicationsPath(locale) } : undefined}
        >
          {pubs.length ? (
            <ol className="space-y-7">
              {pubs.map((p) => (
                <li key={p.id}>
                  <PublicationEntry pub={p} />
                </li>
              ))}
            </ol>
          ) : (
            <EmptyState />
          )}
        </ModuleSection>
      )}

      {on('skills') && (
        <ModuleSection id="skills" title={ui.modules.skills} lead={ui.moduleLead.skills}>
          <SkillExplorer idPrefix="home-skills" />
        </ModuleSection>
      )}

      {on('repositories') && (
        <ModuleSection
          id="github"
          title={ui.modules.repositories}
          lead={ui.moduleLead.repositories}
          action={{ label: ui.more.repositories(bundle.repositories.length), to: repositoriesPath(locale) }}
        >
          {repos.length ? (
            <ul className="grid-layout">
              {repos.map((r) => (
                <li key={r.id} className="col-span-full md:col-span-4 lg:col-span-3">
                  <RepositoryCard repo={r} />
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState />
          )}
        </ModuleSection>
      )}

      {on('experience') && (
        <ModuleSection id="experience" title={ui.modules.experience}>
          {experience.length ? (
            <div className="space-y-6">
              {experience.map((e) => (
                <ExperienceEntry key={e.id} item={e} />
              ))}
            </div>
          ) : (
            <EmptyState />
          )}
        </ModuleSection>
      )}

      {on('awards') && (
        <ModuleSection id="awards" title={ui.modules.awards}>
          {awards.length ? (
            <div className="space-y-5">
              {awards.map((a) => (
                <AwardEntry key={a.id} award={a} />
              ))}
            </div>
          ) : (
            <EmptyState />
          )}
        </ModuleSection>
      )}

      {on('cv') && (
        <ModuleSection id="cv" title={ui.modules.cv}>
          <div className="card card-surface flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="t-small">{ui.cv.summary}</p>
              <p className="t-caption mt-1 text-muted">{ui.cv.updatedAt(formatDate(bundle.cv.updatedAt, locale))}</p>
            </div>
            <Link to={cvPath(locale)} className="btn btn-primary shrink-0 self-start md:self-auto">
              <FileText size={18} strokeWidth={1.75} aria-hidden="true" />
              {ui.more.cv}
            </Link>
          </div>
        </ModuleSection>
      )}

      {on('contact') && (
        <ModuleSection id="contact" title={ui.modules.contact} lead={ui.moduleLead.contact}>
          <ContactBlock />
        </ModuleSection>
      )}
    </div>
  );
}
