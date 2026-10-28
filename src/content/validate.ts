// Build-time content checks for the risks that actually hurt this site: template residue,
// broken references, fake links, missing translations and impossible status/date combinations.
import { LOCALES, MODULE_IDS, type ContentBundle, type ImageAsset, type PartialDate } from './types';
import { buildRouteManifest } from '@/routing/manifest';

/** Strings that only ever appear in template or demo material. */
export const TEMPLATE_MARKERS = [
  '张三',
  'San Zhang',
  '李四',
  '王五',
  'XX 大学',
  'XX大学',
  'XX 实验室',
  'XX 科技',
  'your_email',
  'yourname',
  'example.com',
  'xxxx.xxxxx',
  'paper-001',
  'project-001',
  'Lorem ipsum',
  'Fixture Person',
];

const DATE_RE = /^\d{4}(-(0[1-9]|1[0-2])(-(0[1-9]|[12]\d|3[01]))?)?$/;
const PLATFORM_HOMEPAGES = [
  'https://scholar.google.com',
  'https://scholar.google.com/',
  'https://orcid.org',
  'https://orcid.org/',
  'https://github.com',
  'https://github.com/',
  'https://www.linkedin.com',
  'https://www.linkedin.com/',
];

/** Metric fields that must never be stored for repositories (no fake or volatile popularity). */
const FORBIDDEN_REPO_KEYS = ['stars', 'stargazers', 'stargazers_count', 'forks', 'forks_count', 'watchers', 'views'];
/** Skills that need explicit evidence; they tend to be added to profiles by habit. */
const SKILLS_NEEDING_EVIDENCE = ['PyTorch', 'TensorFlow', 'Docker', 'LaTeX', 'Kubernetes'];

export interface ValidateOptions {
  /** Returns true when a public/ path exists. Omit to skip file checks (e.g. in the browser). */
  assetExists?: (publicPath: string) => boolean;
}

/**
 * Template residue check, kept separate from the structural checks below: fixtures and intake
 * templates are deliberately fake and only run validateContent; public content runs both.
 */
export function findTemplateResidue(bundle: ContentBundle): string[] {
  const serialized = JSON.stringify(bundle, (_k, v) => (typeof v === 'function' ? String(v) : v));
  return TEMPLATE_MARKERS.filter((m) => serialized.includes(m)).map(
    (m) => `template marker "${m}" found in public content`,
  );
}

/** Structural and reference checks for any bundle (public content, fixtures, intake samples). */
export function validateContent(bundle: ContentBundle, options: ValidateOptions = {}): string[] {
  const errors: string[] = [];
  const err = (msg: string) => errors.push(msg);

  // --- modules ---------------------------------------------------------------------------
  for (const id of MODULE_IDS) {
    if (!bundle.site.modules?.[id]) err(`site.modules: missing config for module "${id}"`);
  }

  // --- IDs -------------------------------------------------------------------------------
  const collections = {
    publications: bundle.publications,
    projects: bundle.projects,
    repositories: bundle.repositories,
    experience: bundle.experience,
    awards: bundle.awards,
    skillGroups: bundle.skills,
    skills: bundle.skills.flatMap((g) => g.skills),
    directions: bundle.directions,
  } as const;
  for (const [name, items] of Object.entries(collections)) {
    const seen = new Set<string>();
    for (const item of items) {
      if (!/^[a-z0-9][a-z0-9-]*$/.test(item.id)) err(`${name}: invalid id "${item.id}"`);
      if (seen.has(item.id)) err(`${name}: duplicate id "${item.id}"`);
      seen.add(item.id);
    }
  }

  // --- routes ----------------------------------------------------------------------------
  const paths = buildRouteManifest(bundle).map((r) => r.path);
  const dupPaths = paths.filter((p, i) => paths.indexOf(p) !== i);
  for (const p of new Set(dupPaths)) err(`route: duplicate path ${p}`);
  for (const p of paths) if (!p.endsWith('/')) err(`route: missing trailing slash ${p}`);

  // --- links -----------------------------------------------------------------------------
  const checkUrl = (where: string, url: string | undefined) => {
    if (url === undefined) return;
    if (url.trim() === '' || url.startsWith('#') || /^javascript:/i.test(url)) {
      err(`${where}: placeholder link "${url}"`);
    } else if (PLATFORM_HOMEPAGES.includes(url)) {
      err(`${where}: platform homepage "${url}" is not a personal page`);
    } else if (!/^https:\/\//.test(url) && !url.startsWith('/') && !url.startsWith('mailto:')) {
      err(`${where}: link must be https:// or a site path, got "${url}"`);
    } else if (url.startsWith('/') && options.assetExists && /\.[a-z0-9]+$/i.test(url) && !options.assetExists(url)) {
      err(`${where}: local file ${url} does not exist in public/`);
    }
  };
  const checkImage = (where: string, img: ImageAsset | undefined) => {
    if (!img) return;
    if (!(img.width > 0 && img.height > 0)) err(`${where}: image needs width and height`);
    if (img.src.startsWith('/')) checkUrl(where, img.src);
    else if (!img.src.startsWith('data:')) err(`${where}: image must be a local file, got "${img.src}"`);
  };

  const { person } = bundle;
  if (!person.displayName.trim()) err('person: displayName is empty');
  for (const [k, v] of Object.entries(person.links)) checkUrl(`person.links.${k}`, v);
  if (person.email !== undefined && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(person.email)) {
    err(`person.email: invalid "${person.email}"`);
  }
  checkImage('person.avatar', person.avatar);

  for (const p of bundle.publications) {
    for (const [k, v] of Object.entries(p.resources)) checkUrl(`publication ${p.id}.${k}`, v);
    checkImage(`publication ${p.id}.figure`, p.figure);
  }
  for (const p of bundle.projects) {
    for (const [k, v] of Object.entries(p.resources)) checkUrl(`project ${p.id}.${k}`, v);
    checkImage(`project ${p.id}.image`, p.image);
  }
  for (const r of bundle.repositories) checkUrl(`repository ${r.id}.url`, r.url);
  for (const r of bundle.repositories) checkUrl(`repository ${r.id}.release`, r.release);
  for (const a of bundle.awards) checkUrl(`award ${a.id}.evidence`, a.evidence);
  for (const item of bundle.blog?.items ?? []) checkUrl(`blog item "${item.title}"`, item.url);
  for (const [lang, pdf] of Object.entries(bundle.cv.pdf ?? {})) {
    if (!pdf) continue;
    if (!pdf.href.endsWith('.pdf')) err(`cv.pdf.${lang}: must point to a .pdf file`);
    checkUrl(`cv.pdf.${lang}`, pdf.href);
    checkDate(`cv.pdf.${lang}.updatedAt`, pdf.updatedAt);
  }

  // --- dates and status ------------------------------------------------------------------
  function checkDate(where: string, d: PartialDate | undefined) {
    if (d !== undefined && !DATE_RE.test(d)) err(`${where}: invalid date "${d}"`);
  }
  checkDate('site.updatedAt', bundle.site.updatedAt);
  checkDate('cv.updatedAt', bundle.cv.updatedAt);

  for (const p of bundle.publications) {
    checkDate(`publication ${p.id}.date`, p.date);
    if (p.date && !p.date.startsWith(String(p.year))) err(`publication ${p.id}: date and year disagree`);
    if (!p.originalTitle.trim()) err(`publication ${p.id}: empty title`);
    if (p.authors.length === 0) err(`publication ${p.id}: no authors`);
    if (!p.authors.some((a) => a.personId === person.id)) {
      err(`publication ${p.id}: site owner not marked in authors (personId "${person.id}")`);
    }
    for (const a of p.authors) {
      if (a.personId && a.personId !== person.id) err(`publication ${p.id}: unknown personId "${a.personId}"`);
    }
    if (p.publicationStatus === 'under-review' && p.venue) {
      err(`publication ${p.id}: under-review work must not list a venue`);
    }
    if ((p.publicationStatus === 'published' || p.publicationStatus === 'accepted') && !p.venue) {
      err(`publication ${p.id}: ${p.publicationStatus} work needs its venue`);
    }
    if (p.publicationStatus === 'preprint' && !p.arxiv && !p.resources.paper && !p.resources.pdf) {
      err(`publication ${p.id}: preprint needs a public link`);
    }
    if (p.detail && !p.abstract && !bundle.locales.zh.publications[p.id]?.sections?.length) {
      err(`publication ${p.id}: detail page enabled without abstract or extra material`);
    }
  }
  for (const p of bundle.projects) {
    checkDate(`project ${p.id}.start`, p.start);
    checkDate(`project ${p.id}.end`, p.end);
    if (p.end && p.end < p.start) err(`project ${p.id}: end before start`);
    if (p.status === 'ongoing' && p.end) err(`project ${p.id}: ongoing project has an end date`);
    if ((p.techStack?.length ?? 0) > 4) err(`project ${p.id}: list at most four technologies`);
    if (p.startKind !== 'repository-created' && p.startKind !== 'actual') {
      err(`project ${p.id}: startKind must say what the start date means`);
    }
    if (p.detail && LOCALES.some((l) => !bundle.locales[l].projects[p.id]?.sections?.length)) {
      err(`project ${p.id}: detail page enabled without detail sections in every locale`);
    }
    for (const l of LOCALES) {
      const sections = bundle.locales[l].projects[p.id]?.sections ?? [];
      const ids = sections.map((x) => x.id);
      if (new Set(ids).size !== ids.length) err(`project ${p.id} (${l}): duplicate section ids`);
      for (const sec of sections) {
        if (!/^[a-z0-9][a-z0-9-]*$/.test(sec.id)) err(`project ${p.id} (${l}): invalid section id "${sec.id}"`);
        // Numbers copied from a README (cases, tests, versions) must say where they come from.
        const text = [...(sec.paragraphs ?? []), ...(sec.list ?? [])].join(' ');
        if (/\d{2,}/.test(text) && !sec.source) {
          err(`project ${p.id} (${l}): section "${sec.id}" states numbers without a source note`);
        }
        if (sec.source) checkDate(`project ${p.id} section ${sec.id}.source`, sec.source.retrievedAt);
      }
      if (l !== 'zh') {
        const zhIds = (bundle.locales.zh.projects[p.id]?.sections ?? []).map((x) => x.id).join();
        if (ids.join() !== zhIds) err(`project ${p.id}: section ids differ between zh and ${l}`);
      }
    }
  }
  for (const e of bundle.experience) {
    checkDate(`experience ${e.id}.start`, e.start);
    if (e.end && e.end !== 'present') {
      checkDate(`experience ${e.id}.end`, e.end);
      if (e.end < e.start) err(`experience ${e.id}: end before start`);
    }
  }
  for (const a of bundle.awards) {
    checkDate(`award ${a.id}.date`, a.date);
    if (a.participation !== 'individual' && a.participation !== 'team') {
      err(`award ${a.id}: participation must be individual or team`);
    }
  }

  // --- homepage order --------------------------------------------------------------------
  for (const [name, items] of [
    ['publications', bundle.publications],
    ['projects', bundle.projects],
    ['experience', bundle.experience],
  ] as const) {
    const orders = items.map((i) => i.homepageOrder).filter((o) => o !== undefined);
    if (new Set(orders).size !== orders.length) err(`${name}: duplicate homepageOrder`);
  }

  // --- references ------------------------------------------------------------------------
  const projectIds = new Set(bundle.projects.map((p) => p.id));
  const repoIds = new Set(bundle.repositories.map((r) => r.id));
  const pubIds = new Set(bundle.publications.map((p) => p.id));
  const refs = (where: string, ids: string[] | undefined, known: Set<string>, kind: string) => {
    for (const id of ids ?? []) if (!known.has(id)) err(`${where}: unknown ${kind} "${id}"`);
  };
  for (const d of bundle.directions) {
    refs(`direction ${d.id}`, d.projectIds, projectIds, 'project');
    refs(`direction ${d.id}`, d.publicationIds, pubIds, 'publication');
    if (d.projectIds.length + (d.publicationIds?.length ?? 0) === 0) err(`direction ${d.id}: no public work behind it`);
  }
  for (const p of bundle.publications) refs(`publication ${p.id}`, p.directionIds, new Set(bundle.directions.map((d) => d.id)), 'direction');
  for (const e of bundle.experience) refs(`experience ${e.id}`, e.relatedProjectIds, projectIds, 'project');
  for (const a of bundle.awards) refs(`award ${a.id}`, a.relatedProjectIds, projectIds, 'project');
  for (const l of LOCALES) {
    for (const step of bundle.locales[l].person.researchModel) {
      refs(`locale ${l} researchModel "${step.title}"`, step.projectIds, projectIds, 'project');
    }
  }

  // --- repositories: deduplicated, consistent with projects, no popularity metrics -------------
  const seenRepo = new Map<string, string>();
  for (const r of bundle.repositories) {
    const key = `${r.owner}/${r.name}`.toLowerCase();
    if (seenRepo.has(key)) err(`repository ${r.id}: duplicates ${seenRepo.get(key)} (${key})`);
    seenRepo.set(key, r.id);
    if (r.url.toLowerCase() !== `https://github.com/${key}`) err(`repository ${r.id}: url does not match owner/name`);
    if (r.projectIds.length === 0) err(`repository ${r.id}: not linked to any project`);
    refs(`repository ${r.id}`, r.projectIds, projectIds, 'project');
    for (const pid of r.projectIds) {
      const code = bundle.projects.find((p) => p.id === pid)?.resources.code;
      if (code && code.toLowerCase() !== r.url.toLowerCase()) err(`repository ${r.id}: project ${pid} links a different code URL`);
    }
    if (r.languages.length === 0) err(`repository ${r.id}: list at least the primary language`);
    checkDate(`repository ${r.id}.createdAt`, r.createdAt);
    checkDate(`repository ${r.id}.source.retrievedAt`, r.source.retrievedAt);
    for (const k of FORBIDDEN_REPO_KEYS) if (k in r) err(`repository ${r.id}: must not store "${k}"`);
  }

  // --- skills need evidence ----------------------------------------------------------------
  for (const g of bundle.skills) {
    if (g.skills.length === 0) err(`skill group ${g.id}: empty group`);
    for (const sk of g.skills) {
      if (sk.projectIds.length + (sk.repositoryIds?.length ?? 0) === 0) err(`skill ${sk.id}: no evidence`);
      refs(`skill ${sk.id}`, sk.projectIds, projectIds, 'project');
      refs(`skill ${sk.id}`, sk.repositoryIds, repoIds, 'repository');
      if (SKILLS_NEEDING_EVIDENCE.includes(sk.name)) {
        const used = sk.projectIds.some((id) => bundle.projects.find((p) => p.id === id)?.techStack?.includes(sk.name));
        if (!used) err(`skill ${sk.id}: "${sk.name}" is not in the tech stack of any evidence project`);
      }
    }
  }

  // --- locale mappings -------------------------------------------------------------------
  const entityMaps = {
    publications: bundle.publications.map((x) => x.id),
    projects: bundle.projects.map((x) => x.id),
    repositories: bundle.repositories.map((x) => x.id),
    directions: bundle.directions.map((x) => x.id),
    experience: bundle.experience.map((x) => x.id),
    awards: bundle.awards.map((x) => x.id),
    skillGroups: bundle.skills.map((x) => x.id),
  } as const;
  for (const locale of LOCALES) {
    const loc = bundle.locales[locale];
    for (const [name, ids] of Object.entries(entityMaps)) {
      const map = loc[name as keyof typeof entityMaps] as Record<string, unknown>;
      for (const id of ids) if (!map[id]) err(`locale ${locale}: missing ${name} text for "${id}"`);
      for (const id of Object.keys(map)) if (!ids.includes(id)) err(`locale ${locale}: orphan ${name} text "${id}"`);
    }
    if (!loc.person.intro.trim()) err(`locale ${locale}: empty introduction`);
    if (loc.person.tagline.length === 0) err(`locale ${locale}: empty tagline`);
    const emptyUi = findEmptyStrings(loc.ui, 'ui');
    for (const path of emptyUi) err(`locale ${locale}: empty UI text at ${path}`);
  }
  // Same UI keys in every locale.
  const keysOf = (o: object, prefix = ''): string[] =>
    Object.entries(o).flatMap(([k, v]) =>
      v && typeof v === 'object' ? keysOf(v, `${prefix}${k}.`) : [`${prefix}${k}`],
    );
  const zhKeys = keysOf(bundle.locales.zh.ui).sort().join();
  const enKeys = keysOf(bundle.locales.en.ui).sort().join();
  if (zhKeys !== enKeys) err('locale: zh and en UI texts have different keys');

  return errors;
}

function findEmptyStrings(value: unknown, path: string): string[] {
  if (typeof value === 'string') return value.trim() ? [] : [path];
  if (value && typeof value === 'object') {
    return Object.entries(value).flatMap(([k, v]) => findEmptyStrings(v, `${path}.${k}`));
  }
  return [];
}
