import type { LocaleContent, SourceNote } from '../types';

// Project texts are translated from the Chinese READMEs of the same repositories.
// They are pending review by the author (see docs/content-audit.md).
const readme = (repo: string): SourceNote => ({
  label: 'repository README',
  url: `https://github.com/Zhong0118/${repo}`,
  retrievedAt: '2026-10-28',
});

export const en: LocaleContent = {
  ui: {
    siteTitle: 'mocX',
    skipToContent: 'Skip to content',
    colon: ': ',
    nav: {
      label: 'Main navigation',
      home: 'Home',
      about: 'About',
      projects: 'Projects',
      publications: 'Publications',
      repositories: 'Open source',
      cv: 'CV',
      blog: 'MocLab',
      external: ' (external link)',
      menuOpen: 'Open navigation menu',
      menuClose: 'Close navigation menu',
      tools: 'Display settings',
    },
    languageSwitch: { label: '中文 – 切换到中文页面', target: '中文' },
    theme: { label: 'Dark mode' },
    modules: {
      about: 'About',
      research: 'Research directions',
      projects: 'Projects',
      publications: 'Publications',
      skills: 'Skills',
      repositories: 'Repositories',
      experience: 'Education & experience',
      awards: 'Awards & honors',
      cv: 'CV',
      contact: 'Contact',
    },
    moduleLead: {
      research: 'Three directions covered by the public projects, each linked to repositories you can inspect.',
      projects:
        'Research prototypes, tools and engineering projects. Dates are GitHub repository creation months, not the actual project periods.',
      skills: 'Only technologies used in public projects, without proficiency levels. Select one to see where it is used.',
      repositories: 'Public repositories behind the projects above, forks excluded. Star counts are not shown.',
      cv: 'The online CV uses the same data as this site and prints on A4.',
      contact: 'For now, reach me through GitHub or the MocLab blog.',
    },
    emptyState: 'No public entries listed',
    noMatch: {
      title: 'Nothing matches these filters',
      hint: 'Try another keyword or clear the filters to see everything.',
      clear: 'Clear filters',
    },
    hero: {
      primary: 'View projects',
      secondary: 'Online CV',
      directionsLabel: 'Research directions',
      mapLabel: 'Research directions and related projects',
      mapCenter: 'LLM agents',
      relatedWork: 'Related projects',
      viewAllInDirection: 'All directions',
    },
    more: {
      projects: (n) => `See all ${n} projects`,
      publications: 'Open publications',
      repositories: (n) => `See all ${n} repositories`,
      about: 'More about me',
      cv: 'Open the online CV',
    },
    resources: {
      email: 'Email',
      github: 'GitHub',
      blog: 'MocLab blog',
      scholar: 'Google Scholar',
      orcid: 'ORCID',
      cv: 'Online CV',
      paper: 'Paper',
      pdf: 'PDF',
      code: 'Code',
      project: 'Project page',
      demo: 'Demo',
      release: 'Releases',
      detail: 'Details',
      bibtex: 'BibTeX',
      doi: 'DOI',
      arxiv: 'arXiv',
      viewCode: 'View code',
      getRelease: 'Get a release',
      readCase: 'Read the case study',
    },
    filters: {
      label: 'Filters',
      search: 'Search',
      searchPlaceholder: 'Name, summary or stack',
      clear: 'Clear filters',
      results: (n, total) => `Showing ${n} of ${total}`,
      view: 'View',
      grid: 'Grid',
      list: 'List',
      language: 'Language',
      allLanguages: 'All languages',
      year: 'Year',
      type: 'Type',
      status: 'Status',
      all: 'All',
    },
    publication: {
      type: { journal: 'Journal', conference: 'Conference', workshop: 'Workshop', other: 'Other' },
      status: {
        published: 'Published',
        accepted: 'Accepted',
        preprint: 'Preprint',
        'under-review': 'Under review',
      },
      abstract: 'Abstract',
      showAbstract: 'Show abstract',
      hideAbstract: 'Hide abstract',
      equalContribution: '* Equal contribution',
      copyBibtex: 'Copy BibTeX',
      copied: 'Copied',
      copyFailed: 'Copy failed; select the text manually',
      originalLanguage: (lang) => `Original (${lang})`,
    },
    project: {
      kind: {
        'research-prototype': 'Research prototype',
        engineering: 'Engineering project',
        tool: 'Tool',
        competition: 'Competition project',
      },
      filter: { all: 'All', research: 'Research prototypes', tool: 'Tools', engineering: 'Engineering & competition' },
      status: { ongoing: 'Ongoing', released: 'Released', archived: 'Archived' },
      repositoryCreated: (date) => `Repository created ${date}`,
      since: (date) => `Since ${date}`,
      techStack: 'Stack',
      moreTags: (n) => `+${n}`,
      schematic: 'Schematic',
      featured: 'Featured project',
      role: 'Role',
    },
    repository: {
      copyUrl: 'Copy repository URL',
      copied: 'Copied',
      copyFailed: 'Copy failed; select the text manually',
      created: (date) => `Created ${date}`,
      license: 'License',
      archived: 'Archived',
      fork: 'Fork',
      source: (date) => `Repository facts from public GitHub data, read on ${date}.`,
      projects: 'Project',
    },
    skills: {
      evidence: 'Evidence',
      evidenceHint: 'Select a technology to see the public projects that use it.',
      usedIn: (n) => (n === 1 ? '1 project' : `${n} projects`),
      filterProjects: (skill) => `Filter the project directory by “${skill}”`,
    },
    experience: {
      kind: { education: 'Education', research: 'Research', internship: 'Internship', employment: 'Employment' },
      present: 'present',
    },
    awards: {
      level: {
        international: 'International',
        national: 'National',
        provincial: 'Provincial',
        university: 'University',
        other: 'Other',
      },
      participation: { individual: 'Individual', team: 'Team' },
      evidence: 'Evidence',
    },
    detail: {
      backToPublications: 'Back to publications',
      backToProjects: 'Back to projects',
      contents: 'On this page',
      sectionKind: {
        context: 'Context',
        implemented: 'Implemented',
        planned: 'Not finished / planned',
        status: 'Current status',
      },
      source: (label, date) => `Source: ${label}, read on ${date}`,
      related: 'Related projects',
      overview: 'Overview',
      contentInOtherLanguage: (lang) => `The following text is only available in ${lang}.`,
    },
    about: {
      title: 'About',
      researchModel: 'How I work',
      education: 'Education',
    },
    blog: {
      title: 'Recent posts on MocLab',
      snapshot: (date) => `From the MocLab RSS feed, fetched ${date}`,
    },
    cv: {
      title: 'Curriculum Vitae',
      print: 'Print / save as PDF',
      downloadPdf: 'Download PDF',
      downloadOtherLanguagePdf: 'Download Chinese PDF',
      education: 'Education',
      experience: 'Research and work experience',
      publications: 'Publications',
      projects: 'Projects',
      awards: 'Awards & honors',
      skills: 'Skills',
      repositories: 'Repositories',
      updatedAt: (date) => `Content updated ${date}`,
      summary: 'Built from the same data as the homepage, lists every public project and prints on A4.',
    },
    footer: {
      updatedAt: (date) => `Last updated ${date}`,
      copyright: (years, name) => `© ${years} ${name}`,
    },
    notFound: {
      title: 'Page not found',
      description: 'There is no page at this address. It may have been removed or mistyped.',
      home: 'Back to the homepage',
    },
    languageName: { zh: 'Chinese', en: 'English' },
    meta: {
      homeTitle: (name, handle) => (handle ? `${name} (${handle}) · Personal homepage` : `${name} · Personal homepage`),
      homeDescription:
        'Homepage of mocX (GitHub: Zhong0118): public projects, repositories and an online CV on agent security, multi-agent collaboration and AIGC detection.',
      pageTitle: (page, name) => `${page} · ${name}`,
      aboutDescription: 'About mocX: research directions, way of working, skills and contact.',
      projectsDescription:
        'All public projects of mocX — research prototypes, tools, engineering and competition projects — filterable by type and keyword.',
      publicationsDescription: 'Publications of mocX, filterable by year, type and status.',
      repositoriesDescription: 'GitHub repositories of mocX behind the public projects, filterable by language.',
      cvTitle: (name) => `CV · ${name}`,
      cvDescription: (name) => `Online CV of ${name}: public projects, skills, repositories and contact.`,
    },
  },
  person: {
    identity: ['Beijing University of Posts and Telecommunications · Beijing'],
    tagline: ['Interested in the security and collaboration of LLM agents', 'Testing ideas with runnable prototypes and tools'],
    intro:
      'I publish code on GitHub as Zhong0118 and keep technical notes on the MocLab blog. Most recent public repositories deal with LLM agents: supervising tool calls, evolving multi-agent teams, and desktop and agent tools I use day to day.',
    about: [
      'I publish code on GitHub as Zhong0118 and keep technical notes and working logs on the MocLab blog. This page only lists what can be checked against public repositories; degree, advisor, publications and experience stay hidden until the author confirms them.',
      'Recent public projects cover three directions: supervising LLM agents at tool-call time, multi-agent organisations that change based on execution evidence, and detecting and attributing AI-generated content. There are also a few desktop and agent tools I use myself.',
    ],
    researchModel: [
      {
        title: 'Define the problem',
        text: 'Start by stating the risk or collaboration problem. AgentGuard-Chain, for example, puts the security boundary after a tool call is generated and before it runs.',
        projectIds: ['agentguard-chain'],
      },
      {
        title: 'Build a runnable prototype',
        text: 'Turn the idea into the smallest system that runs: a security gateway, a strategy evolution loop, a memory store with provenance.',
        projectIds: ['agentguard-chain', 'evoteam', 'mars'],
      },
      {
        title: 'Check it with evidence',
        text: 'Use scripted cases, unit tests or validation gates, and state the current status and limits in the README.',
        projectIds: ['agentguard-chain', 'evoteam'],
      },
      {
        title: 'Write it down in public',
        text: 'Code goes to GitHub; notes on process and tools go to the MocLab blog.',
      },
    ],
  },
  directions: {
    'agent-security': {
      label: 'Agent security',
      question:
        'How can tool calls generated by an LLM agent be checked for privilege abuse and multi-step risk chains before they actually run?',
      approach:
        'A security gateway between tool-call generation and execution audits, scores, blocks and logs file, command, API and outbound actions.',
    },
    'multi-agent': {
      label: 'Multi-agent collaboration',
      question:
        'Can the roles and collaboration strategy of a multi-agent team change only after cross-task evidence and validation support it?',
      approach:
        'EvoTeam constrains evolution with versioned strategies and a validation gate; MARS tries to turn team discussions into memory with provenance.',
    },
    'aigc-attribution': {
      label: 'AIGC detection and attribution',
      question: 'How can we tell whether content was generated by a model, and which model it came from?',
      approach:
        'The aigc_detector repository is split into detection, provenance and ingestion modules; only its description is public so far, with no published results.',
    },
  },
  publications: {},
  projects: {
    'agentguard-chain': {
      role: 'Repository author',
      roleNote:
        'The contributor list contains only this account, which does not mean the work was done alone; the competition name and result are still to be added by the author.',
      summary:
        'A prototype that supervises the tool calls of LLM agents. It places the security boundary after the agent emits a tool call and before the tool runs, auditing, scoring, blocking and logging file access, command execution, API calls and outbound actions, and it detects cross-step chains such as “read sensitive data → send externally”.',
      schematic: {
        caption: 'Simplified call flow, drawn from the architecture diagram in the repository README.',
        steps: ['Agent emits a tool call', 'Gateway review', 'allow / ask / deny', 'Run and redact', 'Audit log'],
      },
      sections: [
        {
          id: 'problem',
          heading: 'Problem',
          kind: 'context',
          paragraphs: [
            'If tool calls generated by an agent run directly, they are exposed to prompt injection, tool-call hijacking, dangerous commands, sensitive file access, API privilege abuse and multi-step exfiltration. The project targets the competition topic “Security research on large models and their applications” and supervises the tool calls themselves rather than only filtering prompts.',
          ],
        },
        {
          id: 'implemented',
          heading: 'What is implemented',
          kind: 'implemented',
          list: [
            'Input risk labelling for prompt injection, jailbreak-style requests and suspicious context.',
            'Pre-execution review of file, command, API, message and email tool calls.',
            'Behaviour-chain detection for cross-step risks such as “read sensitive data → send externally” and “write script → run script”.',
            'Human confirmation with allow / ask / deny decisions; ask can auto-deny, auto-allow or prompt interactively.',
            'Result inspection and redaction of keys, passwords and tokens in tool output.',
            'Audit trail in JSONL (tool-call events, gateway decisions, results and explanations), shown in a Streamlit dashboard with metrics, alerts and risk chains.',
          ],
          source: readme('AgentGuard-Chain'),
        },
        {
          id: 'architecture',
          heading: 'Architecture',
          kind: 'implemented',
          pre: `Agent / LLM planner
    ↓
ToolCallEvent
    ↓
AgentGuardGateway
    ↓
PolicyEngine + ParameterChecker + ChainDetector + RiskScorer
    ↓
allow / ask / deny
    ↓
Tool executor
    ↓
ResultInspector + OutputRedactor
    ↓
AuditLogger
    ↓
Dashboard`,
          source: readme('AgentGuard-Chain'),
        },
        {
          id: 'status',
          heading: 'Current status',
          kind: 'status',
          paragraphs: [
            'The security gateway, the scripted and LLM modes of MiniAgent, guarded offline replay and a real-mode entry for CoreCoder, the risk explainer and a basic dashboard are complete.',
            'The scripted dataset contains 200 cases with 228 tool calls, and 65 unit tests pass. These numbers are reported by the repository README; this site has not re-run them.',
          ],
          source: readme('AgentGuard-Chain'),
        },
      ],
    },
    evoteam: {
      role: 'Team project · repository author',
      roleNote:
        'This is a team project; the README lists the members and their tasks. Only the repository-author role is stated here, which does not mean the work was done alone.',
      summary:
        'An experience-driven system for evolving multi-agent organisations, built on openJiuwen Core. It runs tasks with the current Strategy and only proposes candidate strategies offline when evidence such as repeated failures crosses a threshold; a candidate changes the default organisation for later tasks only after independent validation.',
      sections: [
        {
          id: 'problem',
          heading: 'Problem',
          kind: 'context',
          paragraphs: [
            'Roles and collaboration strategies in multi-agent teams are usually fixed by developers. EvoTeam makes constrained changes to a versioned Strategy based on cross-task execution evidence, and a candidate must pass a validation gate before it is promoted. The main scenario is generating and checking complex project plans.',
          ],
        },
        {
          id: 'approach',
          heading: 'Approach',
          kind: 'context',
          paragraphs: [
            'The initial Strategy v0 is Planner → Executor → Critic, with a developer-defined role pool. The system runs the current strategy; repeated failures, performance drift, cost anomalies or low-contribution evidence above a threshold trigger offline evolution; once stable, the strategy enters STABLE and the system stops exploring but keeps monitoring.',
          ],
          pre: `Online:  Task → Current Strategy → Orchestrator → Team / AgentInstance
         → Run → Evaluator → SealedRun → Experience → StrategyMonitor

Offline: Trigger → EvolutionManager → Attribution → Mutation → Candidate
         → Validator → Improvement Attribution → Validation Gate
         → Promote / Reject → later tasks use the validated Strategy`,
          source: readme('EvoTeam'),
        },
        {
          id: 'implemented',
          heading: 'Implemented',
          kind: 'implemented',
          list: [
            'Integration of the real ReActAgent from openJiuwen 0.1.17.post1.',
            'init / run / observe / evolve entry points, SQLite traces and snapshots.',
            'Repeated-failure monitoring; two candidate types (prompt changes and an added Verifier) and multi-candidate comparison.',
            'Regression runs with DeepSeek covering complex tasks, bounded rework and real gate rejections of multiple candidates.',
          ],
          source: readme('EvoTeam'),
        },
        {
          id: 'planned',
          heading: 'Not finished yet',
          kind: 'planned',
          list: [
            'Drift, cost and contribution monitoring.',
            'Tool / skill policies and more general structural mutations.',
            'Experiment thresholds still need baseline calibration.',
          ],
          source: readme('EvoTeam'),
        },
      ],
    },
    pinnote: {
      role: 'Repository author',
      summary:
        'A Markdown sticky note for the desktop that stays on screen, collapses into a small capsule and opens with a global shortcut. Installers are published on GitHub Releases; according to the README, the current development build has been verified on Apple Silicon macOS.',
    },
    'multi-tenant-crm-builder': {
      role: 'Repository author',
      summary:
        'A configurable CRM platform for multiple companies, aiming to turn business processes that small companies keep in Excel into an online system with staff accounts, permissions and statistics. It is a pnpm monorepo with separately deployed web, API and worker processes.',
    },
    mars: {
      role: 'Repository author',
      summary:
        'A prototype memory engine for agents in enterprise collaboration, intended to turn Feishu chats, notes and meeting discussions into structured memory with provenance. It is currently a local MVP: data models, SQLite storage and sample chat ingestion are done; memory extraction and retrieval are not implemented yet.',
    },
    'aigc-detector': {
      role: 'Repository author',
      summary:
        'A repository for detecting AI-generated content and attributing it to source models, with modules for detection, provenance and data ingestion.',
    },
    'paper-reader-skill': {
      role: 'Repository author',
      summary:
        'An agent skill for reading papers in depth: explaining methods and equations, checking evidence, filling in related work and keeping continuously updated notes. It offers nine modes such as quick, deep, critique and compare. MIT licensed.',
    },
    richeditor: {
      role: 'Repository author',
      summary:
        'An entry for the China Software Cup: an intelligent rich-text editor for writing, study and office work, with document management, AI-assisted writing, image OCR and question answering over a local knowledge base. Vue 3 + Tiptap front end, Flask + MongoDB back end.',
    },
  },
  repositories: {
    'agentguard-chain': { summary: 'Framework for assessing privilege risks and detecting behaviour chains in LLM agent tool calls.' },
    evoteam: { summary: 'Self-evolving multi-agent organisation system built on openJiuwen Core.' },
    pinnote: { summary: 'Minimal on-screen Markdown sticky notes for Windows and macOS, with a global shortcut and export.' },
    'multi-tenant-crm-builder': {
      summary: 'Turns business processes kept in Excel into an online CRM with accounts, permissions and statistics.',
    },
    mars: { summary: 'Agent memory engine based on Feishu group chats (local MVP).' },
    'aigc-detector': { summary: 'Detects AI-generated content and attributes it to source models.' },
    'paper-reader-skill': { summary: 'Agent skill for understanding, explaining and critiquing papers and keeping long-term notes.' },
    richeditor: { summary: 'China Software Cup entry: an intelligent rich-text editor for writing, study and office work.' },
  },
  experience: {},
  awards: {},
  skillGroups: {
    languages: 'Languages',
    'frontend-desktop': 'Front end & desktop',
    'backend-data': 'Back end & data',
    'agents-prototypes': 'Agents & prototypes',
  },
};
