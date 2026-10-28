// Build-time content checks for the risks that actually hurt this site: template residue,
// broken references, fake links, missing translations and impossible status/date combinations.
import { LOCALES, type ContentBundle, type ImageAsset, type PartialDate } from './types';
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

export interface ValidateOptions {
  /** Returns true when a public/ path exists. Omit to skip file checks (e.g. in the browser). */
  assetExists?: (publicPath: string) => boolean;
  /** Skip the template-marker scan (used for fixtures, which are deliberately fake). */
  allowTemplateMarkers?: boolean;
}

export function validateContent(bundle: ContentBundle, options: ValidateOptions = {}): string[] {
  const errors: string[] = [];
  const err = (msg: string) => errors.push(msg);

  // --- template residue -----------------------------------------------------------------
  if (!options.allowTemplateMarkers) {
    const serialized = JSON.stringify(bundle, (_k, v) => (typeof v === 'function' ? String(v) : v));
    for (const marker of TEMPLATE_MARKERS) {
      if (serialized.includes(marker)) err(`template marker "${marker}" found in public content`);
    }
  }

  // --- IDs -------------------------------------------------------------------------------
  const collections = {
    publications: bundle.publications,
    projects: bundle.projects,
    experience: bundle.experience,
    awards: bundle.awards,
    skills: bundle.skills,
    focus: bundle.focus,
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
    if (p.detail && LOCALES.some((l) => !bundle.locales[l].projects[p.id]?.sections?.length)) {
      err(`project ${p.id}: detail page enabled without detail sections in every locale`);
    }
  }
  for (const e of bundle.experience) {
    checkDate(`experience ${e.id}.start`, e.start);
    if (e.end && e.end !== 'present') {
      checkDate(`experience ${e.id}.end`, e.end);
      if (e.end < e.start) err(`experience ${e.id}: end before start`);
    }
  }
  for (const a of bundle.awards) checkDate(`award ${a.id}.date`, a.date);

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
  for (const f of bundle.focus) {
    if (f.projectId && !bundle.projects.some((p) => p.id === f.projectId)) {
      err(`focus ${f.id}: unknown project "${f.projectId}"`);
    }
    if (f.publicationId && !bundle.publications.some((p) => p.id === f.publicationId)) {
      err(`focus ${f.id}: unknown publication "${f.publicationId}"`);
    }
  }

  // --- locale mappings -------------------------------------------------------------------
  const entityMaps = {
    publications: bundle.publications.map((x) => x.id),
    projects: bundle.projects.map((x) => x.id),
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
    for (const f of bundle.focus) {
      if (!loc.person.focus[f.id]) err(`locale ${locale}: missing focus text "${f.id}"`);
    }
    if (loc.person.intro.length === 0) err(`locale ${locale}: empty introduction`);
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
