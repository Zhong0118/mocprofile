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
  homepageOrder?: number;
}

export type ProjectKind = 'research-prototype' | 'engineering' | 'tool' | 'competition';
export type ProjectStatus = 'ongoing' | 'released' | 'archived';

export interface Project {
  id: string;
  name: string;
  kind: ProjectKind;
  /** Start date. Leave end undefined if it is not known. */
  start: PartialDate;
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
  homepageOrder?: number;
}

export type ExperienceKind = 'education' | 'research' | 'employment';

export interface Experience {
  id: string;
  kind: ExperienceKind;
  start: PartialDate;
  /** "present" for ongoing roles; undefined when not public. */
  end?: PartialDate | 'present';
  homepageOrder?: number;
}

export interface Award {
  id: string;
  date: PartialDate;
}

export interface SkillGroup {
  id: string;
  items: string[];
}

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
}

/** A focus statement in the introduction, optionally pointing at evidence. */
export interface FocusItem {
  id: string;
  projectId?: string;
  publicationId?: string;
}

export interface DetailSection {
  heading: string;
  paragraphs?: string[];
  list?: string[];
  /** Preformatted text such as an architecture flow copied from the source README. */
  pre?: string;
}

export interface PublicationText {
  /** One sentence on the concrete problem or contribution. */
  summary: string;
  /** Verified translated title, shown in addition to the official title. */
  translatedTitle?: string;
  figureAlt?: string;
  figureCaption?: string;
  /** Extra detail-page sections backed by real material. */
  sections?: DetailSection[];
}

export interface ProjectText {
  role: string;
  /** Two to three sentences: problem and what was actually built. */
  summary: string;
  imageAlt?: string;
  sections?: DetailSection[];
}

export interface ExperienceText {
  role: string;
  organization: string;
  description?: string;
}

export interface AwardText {
  title: string;
  issuer?: string;
}

export interface UiText {
  siteTitle: string;
  skipToContent: string;
  /** Separator between a label and its text, e.g. "：" or ": ". */
  colon: string;
  nav: {
    label: string;
    about: string;
    publications: string;
    projects: string;
    cv: string;
    blog: string;
    menuOpen: string;
    menuClose: string;
  };
  languageSwitch: { label: string; target: string };
  theme: { label: string };
  sections: {
    publications: string;
    projects: string;
    experience: string;
    contact: string;
  };
  fullListInCv: { publications: string; projects: string; experience: string };
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
    status: Record<ProjectStatus, string>;
    since: (date: string) => string;
    techStack: string;
  };
  experience: {
    kind: Record<ExperienceKind, string>;
    present: string;
  };
  detail: {
    backToPublications: string;
    backToProjects: string;
    contentInOtherLanguage: (lang: string) => string;
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
    updatedAt: (date: string) => string;
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
    cvTitle: (name: string) => string;
    cvDescription: (name: string) => string;
  };
}

export interface LocaleContent {
  ui: UiText;
  person: {
    /** Confirmed identity / affiliation lines. Omit when unknown. */
    identity?: string[];
    intro: string[];
    focus: Record<string, { label: string; text: string }>;
  };
  publications: Record<string, PublicationText>;
  projects: Record<string, ProjectText>;
  experience: Record<string, ExperienceText>;
  awards: Record<string, AwardText>;
  skillGroups: Record<string, string>;
}

export interface ContentBundle {
  site: SiteConfig;
  person: Person;
  focus: FocusItem[];
  publications: Publication[];
  projects: Project[];
  experience: Experience[];
  awards: Award[];
  skills: SkillGroup[];
  cv: CvConfig;
  locales: Record<Locale, LocaleContent>;
}
