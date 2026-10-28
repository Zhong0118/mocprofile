# 内容维护指南

所有公开内容都在 `src/content/` 下，组件代码不需要改。改完运行：

```bash
pnpm dev          # 本地预览（http://localhost:5173）；/__content-review__/ 显示每个模块的数据状态与校验结果
pnpm test         # 内容、筛选、路由、渲染测试
pnpm build        # 类型检查 + 内容校验 + 预渲染 + 产物检查
pnpm preview      # 按 Vercel 规则预览 dist/（http://localhost:4173，含真实 404）
```

`pnpm build` 会在内容有问题时直接失败并列出原因：模板残留、ID 重复、引用不存在、本地文件不存在、双语缺项、状态组合不合法、数字缺来源、仓库含 stars 等字段、技能缺证据。

新增论文、经历、奖项或项目前，先按 [content-intake.md](content-intake.md) 收集并核对资料。

## 文件职责

| 文件 | 放什么 |
| --- | --- |
| `src/content/shared/person.ts` | 署名、账号、头像、邮箱、个人链接；研究方向（`directions`）及其对应项目 |
| `src/content/shared/projects.ts` | 项目事实：ID、名称、类型、时间及其含义、状态、技术栈、链接、是否有详情页、首页顺序 |
| `src/content/shared/repositories.ts` | 公开仓库元数据：创建日期、语言、许可证、Release、对应项目、来源 |
| `src/content/shared/skills.ts` | 技能分组与证据（项目 / 仓库 ID） |
| `src/content/shared/records.ts` | 模块开关、站点地址与更新时间、论文、经历、奖项、CV 设置 |
| `src/content/locales/zh.ts`、`en.ts` | 界面文案、首页标语与简介、研究方式，以及按 ID 对应的方向 / 项目 / 仓库 / 论文 / 经历 / 奖项文字 |
| `src/content/generated/blog-feed.json` | 博客列表快照，由 `pnpm snapshot:blog` 生成，不要手改 |
| `public/` | 头像、配图、PDF 等静态文件 |

事实（日期、链接、作者顺序、官方题名、数字）只写在 `shared/`；可翻译的文字写在 `locales/`，两种语言用同一个 ID。

下面的例子都用 `example-` 前缀标出，复制后请换成真实内容，不要原样提交。

## 模块

首页与 CV 始终显示 10 个模块：关于、研究方向、项目、论文、技能、开源仓库、经历、奖项、CV、联系。没有条目的模块显示“暂未列出公开条目 / No public entries listed”，不会隐藏。添加第一条论文、经历或奖项后，空状态自动换成条目，不需要改组件。

确实不想公开某个模块时，在 `records.ts` 中关闭（会同时去掉导航与对应路由）：

```ts
const modules = { ...Object.fromEntries(MODULE_IDS.map((id) => [id, { enabled: true }])), awards: { enabled: false } };
```

## 首页标语、简介与研究方式

`locales/*.ts` 的 `person`：

```ts
person: {
  identity: ['北京邮电大学 · 北京'],   // 一到两行，不确定就删掉
  tagline: ['第一行标语', '第二行标语'],
  intro: '首页的一段介绍。',
  about: ['/about/ 页的段落……'],
  researchModel: [
    { title: '界定问题', text: '……', projectIds: ['agentguard-chain'] }, // projectIds 必须存在
  ],
},
```

## 研究方向

方向的条目和对应项目在 `shared/person.ts` 的 `directions`，文字在 `locales/*.ts` 的 `directions`：

```ts
// shared/person.ts
{ id: 'example-direction', projectIds: ['example-project'], publicationIds: [] },

// locales/zh.ts
'example-direction': { label: '方向名', question: '这个方向关注的具体问题？', approach: '公开工作的做法。' },
```

首页右侧的方向图与“研究方向”模块都读这里。方向只描述已公开的工作，不写成研究结论。

## 添加项目

1. `shared/projects.ts`：

```ts
{
  id: 'example-project',
  name: 'Example Project',
  kind: 'research-prototype',             // research-prototype | engineering | tool | competition
  start: '2027-01',
  startKind: 'actual',                    // 'repository-created' 会显示为“仓库创建于”
  status: 'ongoing',                      // ongoing | released | archived，只在有依据时填写
  techStack: ['Python', 'FastAPI'],
  resources: { code: 'https://github.com/…', release: 'https://github.com/…/releases' },
  detail: false,                          // true 时生成 /projects/{id}/，需要 sections
  homepageOrder: 4,                       // 首页精选顺序，1 是大卡片
}
```

2. `locales/*.ts` 的 `projects` 加 `role`、`summary`；可选 `roleNote`（角色边界）与 `schematic`（首页大卡片的示意流程，始终标为“示意”）。
3. 开详情页时写 `sections`，每段有稳定的 `id`，两种语言的 `id` 必须相同：

```ts
sections: [
  { id: 'problem', heading: '要解决的问题', kind: 'context', paragraphs: ['……'] },
  {
    id: 'implemented',
    heading: '已实现',
    kind: 'implemented',
    list: ['……'],
    source: { label: '仓库 README', url: 'https://github.com/…', retrievedAt: '2027-01-15' },
  },
  { id: 'next', heading: '计划中', kind: 'planned', list: ['……'] },
],
```

含两位以上数字的段落必须带 `source`。`kind: 'planned'` 的内容会显示为虚线框和“计划中”标记，不要把计划写进 `implemented`。

项目类型筛选：`research-prototype` → 研究原型；`tool` → 工具；`engineering` 与 `competition` → 工程与竞赛。

## 添加仓库

`shared/repositories.ts` 中每个公开、非 fork、对应已列项目的仓库一条：

```ts
repo('example-project', 'example-project', '2027-01-03', ['Python'], ['example-project'], { license: 'MIT' }),
```

- `languages`：GitHub 主语言，再加 README 中能确认的语言。
- `license` 只在仓库有许可证文件时填写；`release` 只在有 Releases 页面时填写。
- 不写 stars、forks、watchers、下载量（校验会拦截）。
- 文字在 `locales/*.ts` 的 `repositories`：`{ summary: '一句话。' }`。

## 技能

`shared/skills.ts`，每项技能至少引用一个项目（或 `repositoryIds`）作为证据：

```ts
{ id: 'example-skill', name: 'PyTorch', projectIds: ['example-project'] },
```

PyTorch、TensorFlow、Docker、Kubernetes、LaTeX 等容易被泛写的技能，还必须出现在证据项目的 `techStack` 里。不写熟练度或百分比。分组名称在 `locales/*.ts` 的 `skillGroups`。

## 添加论文

1. `shared/records.ts` 的 `publications`：

```ts
{
  id: 'example-paper-2027',               // 稳定 ID，改题名时不要改
  originalTitle: 'Official Title As Published',
  titleLang: 'en',
  authors: [
    { name: 'Coauthor A', equalContribution: true },
    { name: 'Your Name', personId: 'zhong0118', equalContribution: true }, // 用 personId 标记本人
    { name: 'Coauthor B' },
  ],
  year: 2027,
  date: '2027-05',
  type: 'conference',                     // journal | conference | workshop | other
  publicationStatus: 'accepted',          // published | accepted | preprint | under-review
  venue: 'Official Venue Name 2027',      // under-review 时必须留空
  arxiv: '2701.00001',
  resources: { paper: 'https://…', pdf: 'https://…', code: 'https://…' },
  bibtex: `@inproceedings{…}`,
  abstract: { lang: 'en', text: '…' },
  detail: true,                           // 生成 /papers/{id}/，需要 abstract 或额外材料
  directionIds: ['agent-security'],
  homepageOrder: 1,
}
```

2. `locales/*.ts` 的 `publications` 加同一 ID 的一句话说明：`{ summary: '一句具体问题或贡献。' }`。

## 经历与奖项

```ts
// shared/records.ts
experience: [
  { id: 'example-edu', kind: 'education', start: '2024-09', end: 'present' }, // education | research | internship | employment
],
awards: [
  { id: 'example-award', date: '2027-08', level: 'national', participation: 'team', relatedProjectIds: ['example-project'], evidence: 'https://…' },
],

// locales/zh.ts
experience: {
  'example-edu': { role: '硕士研究生', organization: '学校 · 学院', degree: '工学硕士', field: '网络空间安全', highlights: ['……'] },
},
awards: {
  'example-award': { title: '比赛名称 · 奖项等级', issuer: '主办方', role: '队长' },
},
```

日期只写确定的部分（`'2024'` 或 `'2024-09'`），不要补猜测的月份。参赛不等于获奖，奖项需要公开的结果或证书链接。

## 首页顺序与数量

首页最多显示 3 个项目（1 张大卡 + 2 张侧卡）、4 个仓库、4 篇论文、3 条经历。集合里只要有条目设置了 `homepageOrder`，首页就只显示这些条目，按数字从小到大排列；都没设置时按日期倒序取前几条。仓库按项目顺序排列。`/projects/`、`/repositories/`、CV 显示完整列表。

## 博客列表

```bash
pnpm snapshot:blog
```

读取 MocLab 的公开 RSS，只保存标题、链接、日期与简介到 `src/content/generated/blog-feed.json`。构建不联网，RSS 不可用时页面照常显示博客入口。

## 肖像与 CV PDF

- 肖像：把正方形图片放到 `public/images/avatar.webp`（建议 352×352，≤120 KB），在 `shared/person.ts` 加 `avatar: { src: '/images/avatar.webp', width: 352, height: 352 }`。
- CV PDF：放到 `public/files/cv-zh.pdf`，在 `records.ts` 的 `cv.pdf` 中登记 `{ zh: { href: '/files/cv-zh.pdf', updatedAt: '2027-01-15' } }`。构建会检查文件存在且是 PDF。

## 动效

动效集中在 `src/motion/index.tsx`（时长、缓动、错峰）。内容变化不需要改动效；新增可筛选列表时沿用 `/projects/` 的 `AnimatePresence` + `layout` 写法。系统开启“减少动态效果”时只保留淡入淡出。

## 发布

提交并推送到 GitHub，Vercel 会运行 `pnpm build` 并发布 `dist/`。Preview 部署自动加 `noindex`，canonical 始终指向 `site.url`。
