import type { LocaleContent } from '../types';

// Project texts are translated from the Chinese READMEs of the same repositories.
// They are pending review by the author (see docs/content-audit.md).
export const en: LocaleContent = {
  ui: {
    siteTitle: 'mocX',
    skipToContent: 'Skip to content',
    colon: ': ',
    nav: {
      label: 'Main navigation',
      about: 'About',
      publications: 'Publications',
      projects: 'Projects',
      cv: 'CV',
      blog: 'Blog',
      menuOpen: 'Open navigation menu',
      menuClose: 'Close navigation menu',
    },
    languageSwitch: { label: '切换到中文', target: '中文' },
    theme: { label: 'Dark mode' },
    sections: {
      publications: 'Publications',
      projects: 'Selected projects',
      experience: 'Experience',
      contact: 'Contact',
    },
    fullListInCv: {
      publications: 'Full list of publications (CV)',
      projects: 'Full list of projects (CV)',
      experience: 'Full experience (CV)',
    },
    resources: {
      email: 'Email',
      github: 'GitHub',
      blog: 'Blog',
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
      copyFailed: 'Copy failed — select the text manually',
      originalLanguage: (lang) => `Original (${lang})`,
    },
    project: {
      kind: {
        'research-prototype': 'Research prototype',
        engineering: 'Engineering project',
        tool: 'Tool',
        competition: 'Competition project',
      },
      status: { ongoing: 'Ongoing', released: 'Released', archived: 'Archived' },
      since: (date) => `Since ${date}`,
      techStack: 'Stack',
    },
    experience: {
      kind: { education: 'Education', research: 'Research', employment: 'Employment' },
      present: 'Present',
    },
    detail: {
      backToPublications: 'Back to publications',
      backToProjects: 'Back to projects',
      contentInOtherLanguage: (lang) => `The text below is only available in ${lang}.`,
    },
    cv: {
      title: 'Curriculum Vitae',
      print: 'Print / Save as PDF',
      downloadPdf: 'Download PDF',
      downloadOtherLanguagePdf: 'Download Chinese PDF',
      education: 'Education',
      experience: 'Research & Employment',
      publications: 'Publications',
      projects: 'Projects',
      awards: 'Awards',
      skills: 'Skills',
      updatedAt: (date) => `Content updated ${date}`,
    },
    footer: {
      updatedAt: (date) => `Last updated: ${date}`,
      copyright: (years, name) => `© ${years} ${name}`,
    },
    notFound: {
      title: 'Page not found',
      description: 'There is no page at this address. It may have been removed or mistyped.',
      home: 'Back to home',
    },
    languageName: { zh: 'Chinese', en: 'English' },
    meta: {
      homeTitle: (name, handle) => (handle ? `${name} (${handle}) · Homepage` : `${name} · Homepage`),
      homeDescription:
        'Homepage of mocX (GitHub: Zhong0118): public projects on agent security, multi-agent collaboration and AIGC detection, plus an online CV.',
      cvTitle: (name) => `CV · ${name}`,
      cvDescription: (name) => `Online CV of ${name}: public projects and contact links.`,
    },
  },
  person: {
    identity: ['Beijing University of Posts and Telecommunications · Beijing'],
    intro: [
      'I publish code on GitHub as Zhong0118 and keep technical notes on the MocLab blog. Most of my recent public repositories deal with LLM agents, alongside a few desktop and agent tools I use day to day.',
      'The public projects currently cover three directions:',
    ],
    focus: {
      'agent-security': {
        label: 'Agent security',
        text: 'supervising privilege risks of LLM agents at tool-call time, including risky behaviour chains that only show up across several steps.',
      },
      'multi-agent': {
        label: 'Multi-agent collaboration',
        text: 'letting a team’s role structure and collaboration strategy change only after cross-task evidence and validation support it.',
      },
      'aigc-attribution': {
        label: 'AIGC detection and attribution',
        text: 'detecting generated content and identifying the model it came from.',
      },
    },
  },
  publications: {},
  projects: {
    'agentguard-chain': {
      role: 'Repository author',
      summary:
        'A prototype that supervises the tool calls of LLM agents. It places the security boundary after the agent emits a tool call and before the tool runs, auditing, scoring, blocking and logging file access, command execution, API calls and outbound actions, and it detects cross-step chains such as “read sensitive data → send externally”.',
      sections: [
        {
          heading: 'Problem',
          paragraphs: [
            'If tool calls generated by an agent run directly, they are exposed to prompt injection, tool-call hijacking, dangerous commands, sensitive file access, API privilege abuse and multi-step exfiltration. The project targets the competition topic “Security research on large models and their applications” and supervises the tool calls themselves rather than only filtering prompts.',
          ],
        },
        {
          heading: 'What is implemented',
          list: [
            'Input risk labelling for prompt injection, jailbreak-style requests and suspicious context.',
            'Pre-execution review of file, command, API, message and email tool calls.',
            'Behaviour-chain detection for cross-step risks such as “read sensitive data → send externally” and “write script → run script”.',
            'Human confirmation with allow / ask / deny decisions; ask can auto-deny, auto-allow or prompt interactively.',
            'Result inspection and redaction of keys, passwords and tokens in tool output.',
            'Audit trail in JSONL (tool-call events, gateway decisions, results and explanations), shown in a Streamlit dashboard with metrics, alerts and risk chains.',
          ],
        },
        {
          heading: 'Architecture',
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
        },
        {
          heading: 'Current status',
          paragraphs: [
            'According to the repository README: the security gateway, the scripted and LLM modes of MiniAgent, guarded offline replay and a real-mode entry for CoreCoder, the risk explainer and a basic dashboard are complete; the scripted dataset contains 200 cases with 228 tool calls; 65 unit tests pass.',
          ],
        },
      ],
    },
    evoteam: {
      role: 'Team project · repository author',
      summary:
        'An experience-driven system for evolving multi-agent organisations, built on openJiuwen Core. It runs tasks with the current Strategy and only proposes candidate strategies offline when evidence such as repeated failures crosses a threshold; a candidate changes the default organisation for later tasks only after independent validation.',
      sections: [
        {
          heading: 'Problem',
          paragraphs: [
            'Roles and collaboration strategies in multi-agent teams are usually fixed by developers. EvoTeam makes constrained changes to a versioned Strategy based on cross-task execution evidence, and a candidate must pass a validation gate before it is promoted. The main scenario is generating and checking complex project plans.',
          ],
        },
        {
          heading: 'Approach',
          paragraphs: [
            'The initial Strategy v0 is Planner → Executor → Critic, with a developer-defined role pool. The system runs the current strategy; repeated failures, performance drift, cost anomalies or low-contribution evidence above a threshold trigger offline evolution; once stable, the strategy enters STABLE and the system stops exploring but keeps monitoring.',
          ],
          pre: `Online:  Task → Current Strategy → Orchestrator → Team / AgentInstance
         → Run → Evaluator → SealedRun → Experience → StrategyMonitor

Offline: Trigger → EvolutionManager → Attribution → Mutation → Candidate
         → Validator → Improvement Attribution → Validation Gate
         → Promote / Reject → later tasks use the validated Strategy`,
        },
        {
          heading: 'Progress and limitations',
          paragraphs: [
            'According to the repository README: the real ReActAgent of openJiuwen 0.1.17.post1 is integrated, with init / run / observe / evolve entry points, SQLite traces and snapshots, repeated-failure monitoring, two candidate types (prompt changes and an added Verifier) and multi-candidate comparison. Regression runs with DeepSeek cover complex tasks, bounded rework and real gate rejections of multiple candidates.',
            'Drift, cost and contribution monitoring, tool / skill policies and more general structural mutations are not finished yet; experiment thresholds still need baseline calibration.',
          ],
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
  experience: {},
  awards: {},
  skillGroups: {},
};
