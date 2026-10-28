// DEV ONLY. Reached at /__content-review__/ under `pnpm dev`; App only registers the route when
// import.meta.env.DEV is true, so the module is dropped from production builds (check-dist verifies).
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { filterProjects, isModuleEnabled } from '@/content/selectors';
import { findTemplateResidue, validateContent } from '@/content/validate';
import { MODULE_IDS, type ModuleId } from '@/content/types';
import { useSite } from '@/site/context';
import { cn } from '@/lib/utils';

type State = 'records' | 'none' | 'no-match' | 'invalid' | 'unavailable' | 'disabled';

const LABEL: Record<State, string> = {
  records: 'has records',
  none: 'none listed (empty state)',
  'no-match': 'filter no-match',
  invalid: 'validation failed',
  unavailable: 'external resource unavailable',
  disabled: 'module disabled',
};

function Pill({ state }: { state: State }) {
  return (
    <span className={cn('badge', state === 'records' ? '' : state === 'invalid' || state === 'unavailable' ? 'text-danger badge-planned' : 'badge-neutral')}>
      {LABEL[state]}
    </span>
  );
}

function Row({ name, state, detail }: { name: string; state: State; detail?: ReactNode }) {
  return (
    <tr className="border-b border-border align-top">
      <td className="py-2 pr-4 font-medium">{name}</td>
      <td className="py-2 pr-4">
        <Pill state={state} />
      </td>
      <td className="t-meta py-2 text-fg-2">{detail}</td>
    </tr>
  );
}

export default function ContentReviewPage() {
  const { bundle, locale } = useSite();
  const errors = [...validateContent(bundle), ...findTemplateResidue(bundle)];
  const counts: Record<ModuleId, number> = {
    about: bundle.locales[locale].person.about.length,
    research: bundle.directions.length,
    projects: bundle.projects.length,
    publications: bundle.publications.length,
    skills: bundle.skills.reduce((n, g) => n + g.skills.length, 0),
    repositories: bundle.repositories.length,
    experience: bundle.experience.length,
    awards: bundle.awards.length,
    cv: bundle.projects.length + bundle.publications.length + bundle.experience.length,
    contact: Object.values(bundle.person.links).filter(Boolean).length,
  };
  const probe = filterProjects(bundle, locale, { type: 'all', q: 'zzz-no-such-project' });

  return (
    <div className="page-wrap page-top mb-24">
      <p className="t-eyebrow">dev only · never deployed</p>
      <h1 className="t-h1 mt-1">Content review</h1>
      <p className="t-small measure mt-2 text-fg-2">
        Module states for the current content bundle ({locale}). Intake templates and rules: docs/content-intake.md.
      </p>

      <h2 className="t-h3 mt-8">Validation</h2>
      {errors.length === 0 ? (
        <p className="t-small mt-2">
          <Pill state="records" /> validateContent + findTemplateResidue: 0 problems (file existence is checked at build time).
        </p>
      ) : (
        <ul className="t-small mt-2 list-disc pl-5 text-danger">
          {errors.map((e) => (
            <li key={e}>{e}</li>
          ))}
        </ul>
      )}

      <h2 className="t-h3 mt-8">Modules</h2>
      <table className="t-small mt-2 w-full border-collapse text-left">
        <tbody>
          {MODULE_IDS.map((id) => (
            <Row
              key={id}
              name={id}
              state={!isModuleEnabled(bundle, id) ? 'disabled' : errors.some((e) => e.includes(id)) ? 'invalid' : counts[id] ? 'records' : 'none'}
              detail={`${counts[id]} item(s)`}
            />
          ))}
          <Row name="projects filter probe" state={probe.length ? 'records' : 'no-match'} detail='query "zzz-no-such-project" renders the no-match state' />
          <Row
            name="blog feed snapshot"
            state={bundle.blog?.items.length ? 'records' : 'unavailable'}
            detail={bundle.blog ? `${bundle.blog.items.length} posts, fetched ${bundle.blog.retrievedAt} from ${bundle.blog.source}` : 'no snapshot; run pnpm snapshot:blog'}
          />
        </tbody>
      </table>

      <h2 className="t-h3 mt-8">Pages</h2>
      <ul className="t-small mt-2 flex flex-wrap gap-x-4">
        {['/', '/about/', '/projects/', '/projects/?q=zzz', '/publications/', '/repositories/', '/cv/'].map((p) => (
          <li key={p}>
            <Link to={p} className="prose-link">
              {p}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
