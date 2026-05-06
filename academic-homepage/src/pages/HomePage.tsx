import { useContent } from '@/hooks/useContent';
import { PageLayout } from '@/components/layout/PageLayout';
import { Sidebar } from '@/components/layout/Sidebar';
import { Section } from '@/components/layout/Section';
import { SectionTitle } from '@/components/common/SectionTitle';
import { Tag } from '@/components/common/Tag';
import { PublicationCard } from '@/components/cards/PublicationCard';
import { ProjectCard } from '@/components/cards/ProjectCard';
import { RepositoryCard } from '@/components/cards/RepositoryCard';
import { ExperienceCard } from '@/components/cards/ExperienceCard';
import { AwardCard } from '@/components/cards/AwardCard';
import { Mail, FileText } from 'lucide-react';
import { GithubIcon } from '@/components/common/GithubIcon';

export default function HomePage() {
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

  const { profile, publications, projects, repositories, experience, awards, cv, common } = content;

  return (
    <PageLayout>
      <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
        <Sidebar profile={profile} common={common} />

        <main className="space-y-16">
          {/* Hero */}
          <Section id="hero">
            <div className="rounded-2xl border border-gray-200/60 bg-white p-8 shadow-sm dark:border-gray-700/60 dark:bg-gray-900">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                {common.heroGreeting}{' '}
                <span className="bg-gradient-to-r from-sky-600 to-cyan-500 bg-clip-text text-transparent">
                  {profile.name}
                </span>
              </h2>
              <p className="mt-3 text-lg text-gray-600 dark:text-gray-400">
                {common.heroDescription}
              </p>
            </div>
          </Section>

          {/* About */}
          <Section id="about">
            <SectionTitle title={common.aboutTitle} />
            <div className="space-y-3">
              {common.aboutContent.map((text, i) => (
                <p
                  key={i}
                  className="text-sm leading-relaxed text-gray-600 dark:text-gray-400"
                >
                  {text}
                </p>
              ))}
            </div>
          </Section>

          {/* Research Interests */}
          <Section id="research">
            <SectionTitle title={common.researchInterestsTitle} />
            <div className="flex flex-wrap gap-2">
              {profile.researchInterests.map((interest) => (
                <Tag key={interest}>{interest}</Tag>
              ))}
            </div>
          </Section>

          {/* Publications */}
          <Section id="publications">
            <SectionTitle
              title={common.publicationsTitle}
              subtitle={common.publicationsSubtitle}
            />
            <div className="space-y-4">
              {publications.map((pub) => (
                <PublicationCard key={pub.id} publication={pub} common={common} />
              ))}
            </div>
          </Section>

          {/* Projects */}
          <Section id="projects">
            <SectionTitle
              title={common.projectsTitle}
              subtitle={common.projectsSubtitle}
            />
            <div className="space-y-4">
              {projects.map((proj) => (
                <ProjectCard key={proj.id} project={proj} common={common} />
              ))}
            </div>
          </Section>

          {/* GitHub */}
          <Section id="github">
            <SectionTitle
              title={common.githubTitle}
              subtitle={common.githubSubtitle}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              {repositories.slice(0, 6).map((repo) => (
                <RepositoryCard key={repo.name} repository={repo} common={common} />
              ))}
            </div>
          </Section>

          {/* Experience */}
          <Section id="experience">
            <SectionTitle
              title={common.experienceTitle}
              subtitle={common.experienceSubtitle}
            />
            <div className="space-y-6">
              {experience.map((exp, i) => (
                <ExperienceCard key={i} experience={exp} />
              ))}
            </div>
          </Section>

          {/* Awards */}
          <Section id="awards">
            <SectionTitle
              title={common.awardsTitle}
              subtitle={common.awardsSubtitle}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              {awards.map((award, i) => (
                <AwardCard key={i} award={award} />
              ))}
            </div>
          </Section>

          {/* CV */}
          <Section id="cv">
            <SectionTitle
              title={common.cvTitle}
              subtitle={common.cvSubtitle}
            />
            <div className="rounded-2xl border border-gray-200/60 bg-white p-6 shadow-sm dark:border-gray-700/60 dark:bg-gray-900">
              <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                {cv.summary}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {cv.skills.map((skill) => (
                  <Tag key={skill}>{skill}</Tag>
                ))}
              </div>
              <div className="mt-4">
                <a
                  href={cv.downloadUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-600"
                >
                  <FileText className="h-4 w-4" />
                  {common.downloadCV}
                </a>
              </div>
            </div>
          </Section>

          {/* Contact */}
          <Section id="contact">
            <SectionTitle
              title={common.contactTitle}
              subtitle={common.contactSubtitle}
            />
            <div className="rounded-2xl border border-gray-200/60 bg-white p-6 shadow-sm dark:border-gray-700/60 dark:bg-gray-900">
              <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                {common.contactDescription}
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <a
                  href={`mailto:${profile.email}`}
                  className="inline-flex items-center gap-2 rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-600"
                >
                  <Mail className="h-4 w-4" />
                  {profile.email}
                </a>
                {profile.github && (
                  <a
                    href={profile.github}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
                  >
                    <GithubIcon className="h-4 w-4" />
                    GitHub
                  </a>
                )}
              </div>
            </div>
          </Section>
        </main>
      </div>
    </PageLayout>
  );
}
