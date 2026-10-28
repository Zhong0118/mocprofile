import { Link } from 'react-router-dom';
import { allAwards, allExperience, isModuleEnabled } from '@/content/selectors';
import { useSite } from '@/site/context';
import { projectTarget } from '@/site/links';
import { DirectionCards } from '@/components/DirectionCards';
import { SkillExplorer } from '@/components/SkillExplorer';
import { ExperienceEntry } from '@/components/ExperienceEntry';
import { AwardEntry } from '@/components/AwardEntry';
import { ContactBlock } from '@/components/ContactBlock';
import { EmptyState, ModuleSection } from '@/components/ui';
import { PageHeader } from './PageParts';

export default function AboutPage() {
  const { bundle, locale, t } = useSite();
  const ui = t.ui;
  const experience = allExperience(bundle);
  const education = experience.filter((e) => e.kind === 'education');
  const work = experience.filter((e) => e.kind !== 'education');
  const awards = allAwards(bundle);
  const on = (id: Parameters<typeof isModuleEnabled>[1]) => isModuleEnabled(bundle, id);

  return (
    <div className="page-wrap">
      <PageHeader title={ui.about.title}>
        {t.person.identity?.map((line) => (
          <p key={line} className="t-meta mt-2 font-medium text-fg-2">
            {line}
          </p>
        ))}
        <div className="measure mt-5 space-y-4">
          {t.person.about.map((p) => (
            <p key={p} className="t-body">
              {p}
            </p>
          ))}
        </div>
      </PageHeader>

      <ModuleSection id="research-model" title={ui.about.researchModel} className="mt-8">
        <ol className="grid-layout">
          {t.person.researchModel.map((step, i) => (
            <li key={step.title} className="card col-span-full md:col-span-4 lg:col-span-3">
              <span className="step-num" aria-hidden="true">
                {i + 1}
              </span>
              <h3 className="t-h4 mt-3">{step.title}</h3>
              <p className="t-small mt-2 text-fg-2">{step.text}</p>
              {step.projectIds && step.projectIds.length > 0 && (
                <p className="t-caption mt-auto flex flex-wrap gap-x-3 pt-3">
                  {step.projectIds.map((pid) => {
                    const target = projectTarget(bundle, locale, pid);
                    const name = bundle.projects.find((p) => p.id === pid)?.name;
                    return (
                      target && (
                        <Link key={pid} to={target.href} className="prose-link inline-flex min-h-9 items-center" lang="en">
                          {name}
                        </Link>
                      )
                    );
                  })}
                </p>
              )}
            </li>
          ))}
        </ol>
      </ModuleSection>

      {on('research') && (
        <ModuleSection id="research" title={ui.modules.research} lead={ui.moduleLead.research}>
          <DirectionCards />
        </ModuleSection>
      )}
      {on('skills') && (
        <ModuleSection id="skills" title={ui.modules.skills} lead={ui.moduleLead.skills}>
          <SkillExplorer idPrefix="about-skills" />
        </ModuleSection>
      )}
      {on('experience') && (
        <>
          <ModuleSection id="education" title={ui.about.education}>
            {education.length ? (
              <div className="space-y-6">
                {education.map((e) => (
                  <ExperienceEntry key={e.id} item={e} />
                ))}
              </div>
            ) : (
              <EmptyState />
            )}
          </ModuleSection>
          <ModuleSection id="experience" title={ui.cv.experience}>
            {work.length ? (
              <div className="space-y-6">
                {work.map((e) => (
                  <ExperienceEntry key={e.id} item={e} />
                ))}
              </div>
            ) : (
              <EmptyState />
            )}
          </ModuleSection>
        </>
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
      {on('contact') && (
        <ModuleSection id="contact" title={ui.modules.contact} lead={ui.moduleLead.contact}>
          <ContactBlock />
        </ModuleSection>
      )}
    </div>
  );
}
