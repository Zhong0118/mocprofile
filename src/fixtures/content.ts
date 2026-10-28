// TEST FIXTURES ONLY. Everything here is fictional and exists to exercise edge cases
// (long titles, twenty authors, empty collections, overflow beyond homepage limits, PDF links).
// Never import this file from production code; `pnpm dev:fixtures` swaps it in via a Vite alias.
import { MODULE_IDS, type ContentBundle, type LocaleContent, type ModuleConfig, type ModuleId, type Publication } from '@/content/types';
import { zh } from '@/content/locales/zh';
import { en } from '@/content/locales/en';

const FIGURE =
  'data:image/svg+xml,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="304" height="228" viewBox="0 0 304 228"><rect width="304" height="228" fill="#e8edf5"/><path d="M20 200 L90 120 L150 160 L220 60 L284 100" fill="none" stroke="#1d4ed8" stroke-width="6"/><text x="20" y="40" font-family="sans-serif" font-size="22" fill="#17202b">Fixture figure</text></svg>',
  );

const twentyAuthors = Array.from({ length: 20 }, (_, i) =>
  i === 2
    ? { name: 'Fixture Person', personId: 'fixture-person', equalContribution: true }
    : { name: `Coauthor Number${i + 1} Longsurname`, equalContribution: i < 2 },
);

const pubs: Publication[] = [
  {
    id: 'fx-long-title',
    originalTitle:
      'An Intentionally Very Long Fixture Title That Keeps Going To Check Natural Wrapping Of Bibliographic Entries Without Ellipsis Or Truncation In Narrow Viewports',
    titleLang: 'en',
    authors: twentyAuthors,
    year: 2026,
    date: '2026-05',
    type: 'conference',
    publicationStatus: 'accepted',
    venue: 'Fixture Conference on Edge Cases (FCEC)',
    arxiv: '0000.00000',
    resources: { paper: 'https://fixture.invalid/paper', pdf: 'https://fixture.invalid/paper.pdf', code: 'https://fixture.invalid/code' },
    bibtex: '@inproceedings{fixture2026long,\n  title     = {An Intentionally Very Long Fixture Title},\n  author    = {Person, Fixture and others},\n  booktitle = {FCEC},\n  year      = {2026}\n}',
    abstract: {
      lang: 'en',
      text: 'This fixture abstract only exists to test the disclosure behaviour of bibliography entries. It is long enough to wrap over several lines on mobile and desktop so the expanded state can be inspected, including a long URL https://fixture.invalid/a/really/long/path/that/should/wrap/anywhere/without/overflowing.',
    },
    figure: { src: FIGURE, width: 304, height: 228 },
    detail: true,
    homepageOrder: 1,
  },
  {
    id: 'fx-preprint',
    originalTitle: 'Fixture Preprint Without Figure',
    titleLang: 'en',
    authors: [{ name: 'Fixture Person', personId: 'fixture-person' }, { name: 'Another Author' }],
    year: 2025,
    type: 'other',
    publicationStatus: 'preprint',
    arxiv: '0000.00001',
    resources: { pdf: 'https://fixture.invalid/preprint.pdf' },
    homepageOrder: 2,
  },
  ...[3, 4, 5].map(
    (n): Publication => ({
      id: `fx-paper-${n}`,
      originalTitle: `Fixture Journal Paper ${n}`,
      titleLang: 'en',
      authors: [{ name: 'Another Author' }, { name: 'Fixture Person', personId: 'fixture-person' }],
      year: 2020 + n,
      type: 'journal',
      publicationStatus: 'published',
      venue: 'Fixture Journal',
      doi: `10.0000/fixture.${n}`,
      resources: {},
      homepageOrder: n,
    }),
  ),
];

function localeFixture(base: LocaleContent, lang: 'zh' | 'en'): LocaleContent {
  const t = (zhText: string, enText: string) => (lang === 'zh' ? zhText : enText);
  return {
    ...base,
    person: {
      identity: [t('测试用身份（Fixture）', 'Fixture identity line')],
      tagline: [t('测试用定位第一行', 'Fixture tagline one'), t('测试用定位第二行', 'Fixture tagline two')],
      intro: t('这是隔离测试用的示例简介，用于检查排版与边界情况，不代表任何真实个人。', 'This is an isolated fixture introduction used to check layout and edge cases. It does not describe a real person.'),
      about: [t('示例关于段落。', 'Fixture about paragraph.')],
      researchModel: [{ title: t('示例步骤', 'Fixture step'), text: t('示例说明。', 'Fixture text.'), projectIds: ['fx-project-a'] }],
    },
    directions: {
      'fx-direction': { label: t('测试方向', 'Fixture direction'), question: t('示例问题？', 'Fixture question?'), approach: t('示例做法。', 'Fixture approach.') },
    },
    publications: Object.fromEntries(
      pubs.map((p) => [p.id, { summary: t(`示例条目 ${p.id} 的一句话说明。`, `One-sentence fixture summary for ${p.id}.`), figureAlt: p.figure ? t('示例折线图', 'Fixture line chart') : undefined, figureCaption: p.figure ? t('图 1：示例图注。', 'Figure 1: fixture caption.') : undefined }]),
    ),
    projects: {
      'fx-project-a': {
        role: t('负责人（示例）', 'Lead (fixture)'),
        summary: t('示例项目 A。', 'Fixture project A.'),
        schematic: { caption: t('示例示意。', 'Fixture schematic.'), steps: ['A', 'B', 'C', 'D', 'E'] },
        sections: [
          { id: 'background', heading: t('背景', 'Background'), kind: 'context', paragraphs: [t('示例段落。', 'Fixture paragraph.')], pre: 'const a = "a very long line of code that should scroll horizontally inside its own block instead of widening the page";' },
          { id: 'planned', heading: t('计划', 'Planned'), kind: 'planned', list: [t('示例计划。', 'Fixture plan.')] },
        ],
      },
      'fx-project-b': { role: t('成员（示例）', 'Member (fixture)'), summary: t('示例项目 B。', 'Fixture project B.') },
      'fx-project-c': { role: t('成员（示例）', 'Member (fixture)'), summary: t('示例项目 C。', 'Fixture project C.') },
      'fx-project-d': { role: t('成员（示例）', 'Member (fixture)'), summary: t('示例项目 D。', 'Fixture project D.') },
    },
    repositories: { 'fx-repo-a': { summary: t('示例仓库。', 'Fixture repository.') } },
    experience: Object.fromEntries(
      ['fx-exp-1', 'fx-exp-2', 'fx-exp-3', 'fx-exp-4'].map((id, i) => [
        id,
        { role: t(`示例身份 ${i + 1}`, `Fixture role ${i + 1}`), organization: t('示例机构', 'Fixture Institute'), description: t('一句示例说明。', 'One fixture sentence.') },
      ]),
    ),
    awards: { 'fx-award': { title: t('示例奖项', 'Fixture award'), issuer: t('示例机构', 'Fixture Institute') } },
    skillGroups: { 'fx-skills': t('编程', 'Programming') },
  };
}

const modules = Object.fromEntries(MODULE_IDS.map((id) => [id, { enabled: true }])) as Record<ModuleId, ModuleConfig>;

export const fixtureContent: ContentBundle = {
  site: { url: 'https://fixture.invalid', updatedAt: '2026-01-01', copyrightStartYear: 2024, modules },
  person: {
    id: 'fixture-person',
    displayName: 'Fixture Person',
    handle: 'fixture',
    email: 'person@fixture.invalid',
    links: { github: 'https://github.com/fixture-person', blog: 'https://fixture.invalid/blog' },
  },
  directions: [{ id: 'fx-direction', projectIds: ['fx-project-a'] }],
  publications: pubs,
  projects: [
    { id: 'fx-project-a', name: 'Fixture Project A', kind: 'research-prototype', start: '2026-01', startKind: 'actual', status: 'ongoing', techStack: ['Python', 'PyTorch'], resources: { code: 'https://github.com/fixture-person/fixture-a' }, image: { src: FIGURE, width: 304, height: 228 }, detail: true, homepageOrder: 1 },
    { id: 'fx-project-b', name: 'Fixture Project B', kind: 'tool', start: '2025-03', startKind: 'actual', end: '2025-09', status: 'archived', resources: {} },
    { id: 'fx-project-c', name: 'Fixture Project C', kind: 'engineering', start: '2024', startKind: 'repository-created', resources: { demo: 'https://fixture.invalid/c' } },
    { id: 'fx-project-d', name: 'Fixture Project D', kind: 'competition', start: '2023-06', startKind: 'repository-created', resources: {} },
  ],
  repositories: [
    {
      id: 'fx-repo-a',
      owner: 'fixture-person',
      name: 'fixture-a',
      url: 'https://github.com/fixture-person/fixture-a',
      languages: ['Python'],
      projectIds: ['fx-project-a'],
      createdAt: '2026-01-02',
      archived: false,
      fork: false,
      source: { label: 'fixture', retrievedAt: '2026-01-02' },
    },
  ],
  experience: [
    { id: 'fx-exp-1', kind: 'education', start: '2024-09', end: 'present' },
    { id: 'fx-exp-2', kind: 'research', start: '2023-06', end: '2024-08' },
    { id: 'fx-exp-3', kind: 'employment', start: '2022', end: '2023' },
    { id: 'fx-exp-4', kind: 'education', start: '2018-09', end: '2022-06' },
  ],
  awards: [{ id: 'fx-award', date: '2023', participation: 'team' }],
  skills: [
    {
      id: 'fx-skills',
      skills: [
        { id: 'fx-python', name: 'Python', projectIds: ['fx-project-a'] },
        { id: 'fx-pytorch', name: 'PyTorch', projectIds: ['fx-project-a'] },
      ],
    },
  ],
  cv: { updatedAt: '2026-01-01', pdf: { zh: { href: '/fixture-cv-zh.pdf', updatedAt: '2026-01-01' } } },
  locales: { zh: localeFixture(zh, 'zh'), en: localeFixture(en, 'en') },
};

/** Only an identity: no publications, projects, repositories, skills, experience or awards. */
export const emptyContent: ContentBundle = {
  ...fixtureContent,
  directions: [],
  publications: [],
  projects: [],
  repositories: [],
  experience: [],
  awards: [],
  skills: [],
  cv: { updatedAt: '2026-01-01' },
  blog: undefined,
  locales: {
    zh: { ...fixtureContent.locales.zh, person: { ...fixtureContent.locales.zh.person, researchModel: [] }, directions: {}, publications: {}, projects: {}, repositories: {}, experience: {}, awards: {}, skillGroups: {} },
    en: { ...fixtureContent.locales.en, person: { ...fixtureContent.locales.en.person, researchModel: [] }, directions: {}, publications: {}, projects: {}, repositories: {}, experience: {}, awards: {}, skillGroups: {} },
  },
};

// Same export name as src/content/index.ts so the @site-content alias can swap the two.
export const content = fixtureContent;
