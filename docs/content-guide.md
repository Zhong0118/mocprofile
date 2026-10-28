# 内容维护指南

所有公开内容都在 `src/content/` 下，组件代码不需要改。改完运行：

```bash
pnpm dev          # 本地预览（http://localhost:5173，客户端渲染）
pnpm build        # 类型检查 + 内容校验 + 预渲染 + 产物检查
pnpm preview      # 按 Vercel 规则预览 dist/（http://localhost:4173，含真实 404）
pnpm test         # 内容、路由、渲染测试
```

`pnpm build` 会在内容有问题时直接失败，并列出原因（模板残留、ID 重复、本地文件不存在、双语缺项、状态组合不合法等）。

## 文件职责

| 文件 | 放什么 |
| --- | --- |
| `src/content/shared/person.ts` | 署名、账号、头像、邮箱、个人链接；简介中的方向条目（`focus`） |
| `src/content/shared/projects.ts` | 项目事实：ID、名称、类型、时间、状态、技术栈、链接、配图、是否有详情页、首页顺序 |
| `src/content/shared/records.ts` | 论文、经历、奖项、技能、CV 设置、站点地址与更新时间 |
| `src/content/locales/zh.ts`、`en.ts` | 界面文案、身份行、简介段落，以及按 ID 对应的项目 / 论文 / 经历说明 |
| `public/` | 头像、配图、PDF 等静态文件 |

事实（日期、链接、作者顺序、官方题名）只写在 `shared/`；可翻译的文字写在 `locales/`，两种语言用同一个 ID。

下面的例子都用 `example-` 前缀标出，复制后请换成真实内容，不要原样提交。

## 改简介

编辑 `src/content/locales/zh.ts` 与 `en.ts` 中的 `person`：

```ts
person: {
  identity: ['北京邮电大学 · 北京'],         // 一到两行，不确定就删掉
  intro: ['第一段……', '第二段……'],
  focus: {
    'agent-security': { label: '智能体安全', text: '……' },
  },
},
```

`focus` 的条目和顺序由 `shared/person.ts` 的 `focus` 数组决定，`projectId` 指向对应项目，首页会自动链接到详情页、首页条目或 CV。

## 添加论文

1. 在 `shared/records.ts` 的 `publications` 中添加：

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
  detail: true,                           // 需要 abstract 或额外材料
  homepageOrder: 1,
}
```

2. 在 `zh.ts` 和 `en.ts` 的 `publications` 中加同一 ID 的一句话说明：

```ts
publications: {
  'example-paper-2027': { summary: '一句具体问题或贡献。' },
},
```

有论文后，首页“论文”区块、导航和 CV 栏目会自动出现，`/papers/{id}/` 只在 `detail: true` 时生成。

## 添加项目

1. `shared/projects.ts`：

```ts
{
  id: 'example-project',
  name: 'Example Project',
  kind: 'research-prototype',             // research-prototype | engineering | tool | competition
  start: '2027-01',
  status: 'ongoing',                      // 只在有依据时填写
  techStack: ['Python', 'PyTorch'],       // 最多四项
  resources: { code: 'https://github.com/…' },
  image: { src: '/images/projects/example.webp', width: 1100, height: 690 },
  detail: false,
}
```

2. `zh.ts` / `en.ts` 的 `projects` 中加 `role`、`summary`；要开详情页时再加 `sections`（只写有材料的段落），并把 `detail` 设为 `true`。

## 调整首页顺序

首页最多显示 4 篇论文、3 个项目、3 条经历。集合里只要有条目设置了 `homepageOrder`，首页就只显示这些条目，按数字从小到大排列；都没设置时按日期倒序。CV 始终显示完整列表。

## 更新经历

`shared/records.ts`：

```ts
experience: [
  { id: 'example-edu', kind: 'education', start: '2024-09', end: 'present' },
],
```

`locales/*.ts`：

```ts
experience: {
  'example-edu': { role: '硕士研究生', organization: '学校 · 学院', description: '一句说明。' },
},
```

日期只写确定的部分（`'2024'` 或 `'2024-09'`），不要补猜测的月份。

## 替换肖像

1. 把压缩后的正方形图片放到 `public/images/avatar.webp`（建议 352×352，≤120 KB）。
2. 在 `shared/person.ts` 加：`avatar: { src: '/images/avatar.webp', width: 352, height: 352 }`。

没有肖像时不需要任何占位图。

## 更新 CV PDF

1. 把 PDF 放到 `public/files/cv-zh.pdf`。
2. 在 `shared/records.ts` 的 `cv` 中设置：

```ts
cv: {
  updatedAt: '2027-01-15',
  pdf: { zh: { href: '/files/cv-zh.pdf', updatedAt: '2027-01-15' } },
},
```

只有中文 PDF 时，英文 CV 页会显示“Download Chinese PDF”。PDF 与网页 CV 内容不一致时，请同时更新两者的 `updatedAt`。构建会检查文件是否存在、是否真的是 PDF。

## 发布

提交并推送到 GitHub，Vercel 会运行 `pnpm build` 并发布 `dist/`。Preview 部署自动加 `noindex`，canonical 始终指向生产域名 `site.url`。
