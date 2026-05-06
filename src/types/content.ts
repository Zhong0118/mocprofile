export interface Profile {
  name: string;
  englishName: string;
  title: string;
  signature: string;
  location: string;
  avatar: string;
  email: string;
  blogUrl: string;
  cvUrl: string;
  github: string;
  scholar: string;
  linkedin: string;
  orcid: string;
  researchInterests: string[];
}

export interface NavigationItem {
  label: string;
  href: string;
}

export interface Navigation {
  brand: string;
  items: NavigationItem[];
  blog: string;
}

export interface PublicationLink {
  paper: string;
  pdf: string;
  code: string;
  project: string;
  bibtex: string;
}

export interface Publication {
  id: string;
  title: string;
  authors: string[];
  venue: string;
  year: string;
  type: 'Journal' | 'Conference' | 'Preprint' | 'Workshop';
  image: string;
  abstract: string;
  tags: string[];
  links: PublicationLink;
}

export interface ProjectLinks {
  demo: string;
  github: string;
  detail: string;
}

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  description: string;
  techStack: string[];
  status: string;
  year: string;
  links: ProjectLinks;
}

export interface Repository {
  name: string;
  description: string;
  url: string;
  language: string;
  stars: number;
  forks: number;
  tags: string[];
}

export interface Experience {
  title: string;
  organization: string;
  location: string;
  start: string;
  end: string;
  description: string[];
  tags: string[];
}

export interface Award {
  title: string;
  organization: string;
  year: string;
  description: string;
  level: string;
}

export interface CV {
  summary: string;
  education: Experience[];
  research: Experience[];
  projects: { title: string; description: string; techStack: string[] }[];
  skills: string[];
  downloadUrl: string;
}

export interface CommonText {
  expandAbstract: string;
  collapseAbstract: string;
  viewPaper: string;
  viewPDF: string;
  viewCode: string;
  viewProject: string;
  viewBibtex: string;
  viewDemo: string;
  viewOnGithub: string;
  viewDetail: string;
  downloadCV: string;
  present: string;
  backToHome: string;
  notFoundTitle: string;
  notFoundDescription: string;
  heroGreeting: string;
  heroDescription: string;
  aboutTitle: string;
  aboutContent: string[];
  researchInterestsTitle: string;
  publicationsTitle: string;
  publicationsSubtitle: string;
  projectsTitle: string;
  projectsSubtitle: string;
  githubTitle: string;
  githubSubtitle: string;
  experienceTitle: string;
  experienceSubtitle: string;
  awardsTitle: string;
  awardsSubtitle: string;
  cvTitle: string;
  cvSubtitle: string;
  contactTitle: string;
  contactSubtitle: string;
  contactDescription: string;
  footerText: string;
  stars: string;
  forks: string;
}

export interface SiteContent {
  profile: Profile;
  navigation: Navigation;
  publications: Publication[];
  projects: Project[];
  repositories: Repository[];
  experience: Experience[];
  awards: Award[];
  cv: CV;
  common: CommonText;
}

export type Language = 'zh' | 'en';
