// Content model. Shared facts (IDs, dates, links, authors, official titles) live in
// src/content/shared; translatable text lives in src/content/locales keyed by the same IDs.

export type Locale = 'zh' | 'en';
export const LOCALES: readonly Locale[] = ['zh', 'en'];

/** ISO-like partial date: "2026", "2026-06" or "2026-06-24". Never guess a missing month. */
export type PartialDate = string;

export interface ImageAsset {
  /** Path under public/, e.g. "/images/avatar.webp". */
  src: string;
  width: number;
  height: number;
}

/** Where a fact was read from, shown next to numbers copied from a README. */
export interface SourceNote {
  label: string;
  url?: string;
  /** Date the source was read. */
  retrievedAt: PartialDate;
}

// ------------------------------------------------------------------------------- modules

/** The ten public modules. Every module is rendered; empty data shows an empty state. */
export const MODULE_IDS = [
  'about',
  'research',
  'projects',
  'publications',
  'skills',
  'repositories',
  'experience',
  'awards',
  'cv',
  'contact',
] as const;
export type ModuleId = (typeof MODULE_IDS)[number];

export interface ModuleConfig {
  /** On by default. Turning a module off is an editorial decision, never a data-length check. */
  enabled: boolean;
}

// ------------------------------------------------------------------------------- person

export interface Person {
  id: string;
  displayName: string;
  /** Optional English signature if it differs from displayName. */
  englishName?: string;
  /** Public account handle shown as a secondary line. */
  handle?: string;
  avatar?: ImageAsset;
  email?: string;
  links: {
    github?: string;
    blog?: string;
    scholar?: string;
    orcid?: string;
    homepage?: string;
  };
}

/** A research direction backed by public work. Texts live in the locales. */
export interface ResearchDirection {
  id: string;
  projectIds: string[];
  publicationIds?: string[];
}

// ------------------------------------------------------------------------------- publications

export interface Author {
  name: string;
  /** Set to person.id to mark the site owner. Never derived from string matching. */
  personId?: string;
  equalContribution?: boolean;
}

export type PublicationType = 'journal' | 'conference' | 'workshop' | 'other';
export type PublicationStatus = 'published' | 'accepted' | 'preprint' | 'under-review';

export interface Publication {
  id: string;
  originalTitle: string;
  /** Language of the official title, used for a local lang attribute. */
  titleLang: Locale;
  authors: Author[];
  year: number;
  /** Optional exact date for ordering (YYYY-MM or YYYY-MM-DD). */
  date?: PartialDate;
  type: PublicationType;
  publicationStatus: PublicationStatus;
  /** Official venue. Must be empty for under-review work. */
  venue?: string;
  doi?: string;
  arxiv?: string;
  resources: {
    paper?: string;
    pdf?: string;
    code?: string;
    project?: string;
  };
  /** Exact, verified BibTeX. */
  bibtex?: string;
  abstract?: { lang: Locale; text: string };
  figure?: ImageAsset;
  /** Generates /papers/{id}/ when true. Requires real abstract or extra material. */
  detail?: boolean;
  directionIds?: string[];
  homepageOrder?: number;
}

// ------------------------------------------------------------------------------- projects

export type ProjectKind = 'research-prototype' | 'engineering' | 'tool' | 'competition';
export type ProjectStatus = 'ongoing' | 'released' | 'archived';

export interface Project {
  id: string;
  name: string;
  kind: ProjectKind;
  start: PartialDate;
  /**
   * What `start` means. "repository-created" is the GitHub creation month and is labelled as such;
   * "actual" is an author-confirmed start date.
   */
  startKind: 'repository-created' | 'actual';
  end?: PartialDate;
  /** Only set when backed by evidence (release page, README status). */
  status?: ProjectStatus;
  techStack?: string[];
  resources: {
    code?: string;
    demo?: string;
    release?: string;
    paper?: string;
  };
  image?: ImageAsset;
  detail?: boolean;
  /** Featured on the homepage, in this order. The first one is the large card. */
  homepageOrder?: number;
}

/** Filter groups on /projects/. Engineering and competition share one group. */
export const PROJECT_FILTERS = ['all', 'research', 'tool', 'engineering'] as const;
export type ProjectFilter = (typeof PROJECT_FILTERS)[number];

// ------------------------------------------------------------------------------- repositories

export interface Repository {
  id: string;
  owner: string;
  name: string;
  url: string;
  /** Primary language reported by GitHub, then languages confirmed in the README. */
  languages: string[];
  projectIds: string[];
  createdAt: PartialDate;
  release?: string;
  /** SPDX id, only when a license file exists in the repository. */
  license?: string;
  archived: boolean;
  fork: boolean;
  source: SourceNote;
}

// ------------------------------------------------------------------------------- skills

export interface Skill {
  id: string;
  /** Technology name, the same in every language. */
  name: string;
  /** Public work that shows the skill. At least one project or repository is required. */
  projectIds: string[];
  repositoryIds?: string[];
}

export interface SkillGroup {
  id: string;
  skills: Skill[];
}

// ------------------------------------------------------------------------------- experience, awards

export type ExperienceKind = 'education' | 'research' | 'internship' | 'employment';

export interface Experience {
  id: string;
  kind: ExperienceKind;
  /** Only the known precision: "2024" or "2024-09". */
  start: PartialDate;
  /** "present" for ongoing roles; undefined when not public. */
  end?: PartialDate | 'present';
  relatedProjectIds?: string[];
  homepageOrder?: number;
}

export type AwardLevel = 'international' | 'national' | 'provincial' | 'university' | 'other';

export interface Award {
  id: string;
  date: PartialDate;
  level?: AwardLevel;
  participation: 'individual' | 'team';
  relatedProjectIds?: string[];
  /** Public certificate, announcement or result list. */
  evidence?: string;
}

// ------------------------------------------------------------------------------- CV, site, blog

export interface CvConfig {
  /** Last real content update of the CV material. */
  updatedAt: PartialDate;
  /** One entry per real PDF file. Leave empty if there is no PDF. */
  pdf?: Partial<Record<Locale, { href: string; updatedAt: PartialDate }>>;
}

export interface SiteConfig {
  /** Production origin without trailing slash. */
  url: string;
  /** Date of the latest real content edit (shown in the footer). */
  updatedAt: PartialDate;
  copyrightStartYear: number;
  modules: Record<ModuleId, ModuleConfig>;
}

export interface BlogFeedSnapshot {
  source: string;
  retrievedAt: PartialDate;
  items: { title: string; url: string; date: PartialDate; description?: string }[];
}

// ------------------------------------------------------------------------------- locale texts

export type SectionKind = 'context' | 'implemented' | 'planned' | 'status';

export interface DetailSection {
  /** Stable anchor for the table of contents. */
  id: string;
  heading: string;
  /** Lets readers tell finished work from plans. */
  kind?: SectionKind;
  paragraphs?: string[];
  list?: string[];
  /** Preformatted text such as an architecture flow copied from the source README. */
  pre?: string;
  /** Required when the section repeats numbers from a README or other source. */
  source?: SourceNote;
}

export interface PublicationText {
  /** One sentence on the concrete problem or contribution. */
  summary: string;
  /** Verified translated title, shown in addition to the official title. */
  translatedTitle?: string;
  figureAlt?: string;
  figureCaption?: string;
  sections?: DetailSection[];
}

export interface ProjectText {
  role: string;
  /** Limits of the role, e.g. "team project; contribution split is in the README". */
  roleNote?: string;
  /** Two to three sentences: problem and what was actually built. */
  summary: string;
  /** Simplified flow drawn on the featured card. Always labelled as a schematic. */
  schematic?: { caption: string; steps: string[] };
  imageAlt?: string;
  sections?: DetailSection[];
}

export interface RepositoryText {
  summary: string;
}

export interface DirectionText {
  label: string;
  /** One sentence: the problem this direction looks at. */
  question: string;
  /** How the public work approaches it. */
  approach: string;
}

export interface ExperienceText {
  role: string;
  organization: string;
  degree?: string;
  field?: string;
  description?: string;
  highlights?: string[];
}

export interface AwardText {
  title: string;
  issuer?: string;
  /** Own role in a team award. */
  role?: string;
  description?: string;
}

export interface UiText {
  siteTitle: string;
  skipToContent: string;
  /** Separator between a label and its text, e.g. "：" or ": ". */
  colon: string;
  nav: {
    label: string;
    home: string;
    about: string;
    projects: string;
    publications: string;
    repositories: string;
    cv: string;
    blog: string;
    external: string;
    menuOpen: string;
    menuClose: string;
    tools: string;
  };
  languageSwitch: { label: string; target: string };
  theme: { label: string };
  modules: Record<ModuleId, string>;
  /** Short lead under each module title. */
  moduleLead: Partial<Record<ModuleId, string>>;
  emptyState: string;
  noMatch: { title: string; hint: string; clear: string };
  hero: {
    primary: string;
    secondary: string;
    directionsLabel: string;
    mapLabel: string;
    mapCenter: string;
    relatedWork: string;
    viewAllInDirection: string;
  };
  more: {
    projects: (n: number) => string;
    publications: string;
    repositories: (n: number) => string;
    about: string;
    cv: string;
  };
  resources: {
    email: string;
    github: string;
    blog: string;
    scholar: string;
    orcid: string;
    cv: string;
    paper: string;
    pdf: string;
    code: string;
    project: string;
    demo: string;
    release: string;
    detail: string;
    bibtex: string;
    doi: string;
    arxiv: string;
    viewCode: string;
    getRelease: string;
    readCase: string;
  };
  filters: {
    label: string;
    search: string;
    searchPlaceholder: string;
    clear: string;
    results: (n: number, total: number) => string;
    view: string;
    grid: string;
    list: string;
    language: string;
    allLanguages: string;
    year: string;
    type: string;
    status: string;
    all: string;
  };
  publication: {
    type: Record<PublicationType, string>;
    status: Record<PublicationStatus, string>;
    abstract: string;
    showAbstract: string;
    hideAbstract: string;
    equalContribution: string;
    copyBibtex: string;
    copied: string;
    copyFailed: string;
    originalLanguage: (lang: string) => string;
  };
  project: {
    kind: Record<ProjectKind, string>;
    filter: Record<ProjectFilter, string>;
    status: Record<ProjectStatus, string>;
    repositoryCreated: (date: string) => string;
    since: (date: string) => string;
    techStack: string;
    moreTags: (n: number) => string;
    schematic: string;
    featured: string;
    role: string;
  };
  repository: {
    copyUrl: string;
    copied: string;
    copyFailed: string;
    created: (date: string) => string;
    license: string;
    archived: string;
    fork: string;
    source: (date: string) => string;
    projects: string;
  };
  skills: {
    evidence: string;
    evidenceHint: string;
    usedIn: (n: number) => string;
    filterProjects: (skill: string) => string;
  };
  experience: {
    kind: Record<ExperienceKind, string>;
    present: string;
  };
  awards: {
    level: Record<AwardLevel, string>;
    participation: Record<Award['participation'], string>;
    evidence: string;
  };
  detail: {
    backToPublications: string;
    backToProjects: string;
    contents: string;
    sectionKind: Record<SectionKind, string>;
    source: (label: string, date: string) => string;
    related: string;
    overview: string;
    contentInOtherLanguage: (lang: string) => string;
  };
  about: {
    title: string;
    researchModel: string;
    education: string;
  };
  blog: {
    title: string;
    snapshot: (date: string) => string;
  };
  cv: {
    title: string;
    print: string;
    downloadPdf: string;
    downloadOtherLanguagePdf: string;
    education: string;
    experience: string;
    publications: string;
    projects: string;
    awards: string;
    skills: string;
    repositories: string;
    updatedAt: (date: string) => string;
    summary: string;
  };
  footer: {
    updatedAt: (date: string) => string;
    copyright: (years: string, name: string) => string;
  };
  notFound: { title: string; description: string; home: string };
  languageName: Record<Locale, string>;
  meta: {
    homeTitle: (name: string, handle?: string) => string;
    homeDescription: string;
    pageTitle: (page: string, name: string) => string;
    aboutDescription: string;
    projectsDescription: string;
    publicationsDescription: string;
    repositoriesDescription: string;
    cvTitle: (name: string) => string;
    cvDescription: (name: string) => string;
  };
}

export interface LocaleContent {
  ui: UiText;
  person: {
    /** Confirmed identity / affiliation lines. Omit when unknown. */
    identity?: string[];
    /** Two short positioning lines under the name. */
    tagline: string[];
    /** Homepage introduction, 70–120 characters. */
    intro: string;
    /** Longer paragraphs for /about/. */
    about: string[];
    researchModel: { title: string; text: string; projectIds?: string[] }[];
  };
  directions: Record<string, DirectionText>;
  publications: Record<string, PublicationText>;
  projects: Record<string, ProjectText>;
  repositories: Record<string, RepositoryText>;
  experience: Record<string, ExperienceText>;
  awards: Record<string, AwardText>;
  skillGroups: Record<string, string>;
}

export interface ContentBundle {
  site: SiteConfig;
  person: Person;
  directions: ResearchDirection[];
  publications: Publication[];
  projects: Project[];
  repositories: Repository[];
  experience: Experience[];
  awards: Award[];
  skills: SkillGroup[];
  cv: CvConfig;
  blog?: BlogFeedSnapshot;
  locales: Record<Locale, LocaleContent>;
}
