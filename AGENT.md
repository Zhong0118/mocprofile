# AGENT.md

## 1. 项目目标

本项目是一个个人学术主页前端项目，用于展示个人简历、学术成果、工程项目、GitHub 仓库、个人 CV、获奖经历、教育经历、科研经历与联系方式等信息。

网站应具备以下核心特征：

1. 面向个人学术展示，整体风格简洁、专业、现代，适合研究生、科研人员、开发者使用。
2. 支持中文 / 英文切换，所有可展示文本均从配置文件中读取，避免写死在组件里。
3. 支持明暗模式切换，优先适配系统主题，同时允许用户手动切换。配色采用claude code相关配色即可
4. 支持响应式布局，桌面端为左侧个人信息栏 + 右侧内容区，移动端改为纵向卡片布局。
5. 支持组件化维护，学术成果、项目、仓库、经历、奖项等模块都应以数据驱动方式渲染。
6. 支持后续扩展新的页面、模块和语言版本。

最终目标是：用户只需要修改 `src/content/zh/*.ts` 和 `src/content/en/*.ts` 中的数据，即可完成中英文内容维护，而不需要改动核心组件代码。

---

## 2. 技术选型

### 2.1 推荐技术栈

优先使用 React + Vite + TypeScript + Tailwind CSS。

推荐方案：

- 框架：React 18+
- 构建工具：Vite
- 语言：TypeScript
- 样式：Tailwind CSS
- 组件库：shadcn/ui
- 图标库：lucide-react
- 动画：framer-motion
- 路由：react-router-dom
- 国际化：自定义轻量 i18n 数据加载，不强依赖复杂 i18n 框架
- 状态管理：React Context 或 Zustand，仅用于主题、语言等全局状态
- 部署：Vercel / Cloudflare Pages / Netlify 均可

### 2.2 为什么选择 React 而不是 Vue

本项目适合 React，原因如下：

1. shadcn/ui + Tailwind CSS 的组合更适合快速搭建现代化个人主页。
2. React 生态中适合学术主页、Portfolio、卡片展示、暗色主题切换的模板和组件更多。
3. 组件化粒度清晰，适合把 PaperCard、ProjectCard、RepoCard、ProfileSidebar 等封装成独立组件。
4. 后续如果需要接 GitHub API、RSS、博客文章、论文 BibTeX、Markdown 内容，React 生态支持较好。

Vue 也可以完成该项目，但本项目更偏向现代个人作品集和学术主页，推荐 React。

---

## 3. 页面组织方式

### 3.1 推荐采用“单页滚动 + 局部路由”的混合模式

首页采用单页滚动结构，导航栏点击后滚动到对应区块：

- Home / 首页
- About / 关于我
- Publications / 学术成果
- Projects / 工程项目
- GitHub / GitHub 仓库
- CV / 个人 CV
- Awards / 奖项荣誉
- Experience / 经历
- Contact / 联系方式

同时保留局部详情页能力：

- `/`：主页，包含所有主要内容模块。
- `/papers/:id`：论文详情页，可展示论文完整摘要、链接、引用格式、BibTeX、PDF 地址等。
- `/projects/:id`：项目详情页，可展示项目截图、技术架构、功能说明、部署链接、GitHub 链接等。
- `/cv`：独立 CV 页面，方便打印或导出。

这样做的好处：

1. 对访问者来说，首页浏览体验顺畅，不需要频繁跳转。
2. 对内容较多的论文和项目，可以通过详情页展开，首页保持简洁。
3. 后续可以继续扩展博客、论文详情、项目详情，不破坏整体结构。

---

## 4. 信息架构设计

### 4.1 顶部导航栏

导航栏固定在页面顶部，支持毛玻璃效果和明暗模式适配。

左侧：

- 网站名称，例如 `MocLab Academic`
- 或者个人英文名 / 中文名

中间：

- About
- Publications
- Projects
- GitHub
- CV
- Awards
- Contact

右侧：

- 明暗模式切换按钮
- 中英文切换按钮
- 跳转按钮：Blog，链接到 `https://moclab.top`

移动端：

- 使用汉堡菜单展开导航项。
- 右侧保留主题切换和语言切换。

### 4.2 首页整体布局

桌面端布局：

- 左侧固定或半固定个人信息栏，占 280px 到 340px。
- 右侧为主要内容区，最大宽度约 900px 到 1100px。
- 页面背景采用浅色 / 暗色渐变或轻量纹理。

移动端布局：

- 个人信息栏移动到顶部。
- 内容区纵向排列。
- 卡片宽度自适应。

### 4.3 左侧个人信息栏

内容包括：

- 个人头像
- 中文名 / 英文名
- 一句话签名
- 研究方向简述
- 地区，例如 China / Beijing / Singapore 等
- 邮箱
- GitHub
- Google Scholar / Semantic Scholar / ORCID / LinkedIn / X / Bilibili 等可选链接
- 个人博客入口
- 下载 CV 按钮

图标统一使用 lucide-react。

推荐图标：

- Mail
- Github
- MapPin
- FileText
- GraduationCap
- Globe
- BookOpen
- ExternalLink
- Linkedin

### 4.4 右侧内容区

内容区按模块分块展示，每个模块有标题、副标题和内容卡片。

推荐模块顺序：

1. Hero / 简介概览
2. About / 个人简介
3. Research Interests / 研究方向
4. Publications / 学术成果
5. Projects / 工程项目
6. GitHub Repositories / GitHub 仓库
7. Experience / 教育与经历
8. Awards / 奖项荣誉
9. CV / 个人 CV
10. Contact / 联系方式

---

## 5. 内容数据设计

所有文本内容必须从 `src/content` 中读取，不允许硬编码在组件中。

推荐目录结构：

```txt
src/
  content/
    zh/
      profile.ts
      navigation.ts
      publications.ts
      projects.ts
      repositories.ts
      experience.ts
      awards.ts
      cv.ts
      common.ts
    en/
      profile.ts
      navigation.ts
      publications.ts
      projects.ts
      repositories.ts
      experience.ts
      awards.ts
      cv.ts
      common.ts
```

也可以使用 JSON 文件，但 TypeScript 文件更适合类型检查和维护。

### 5.1 profile.ts

用于维护个人基础信息。

```ts
export const profile = {
  name: "中文名",
  englishName: "English Name",
  title: "研究生 / AI Researcher / Developer",
  signature: "探索可信 AI、智能体安全与 AIGC 内容识别。",
  location: "China",
  avatar: "/images/avatar.jpg",
  email: "your_email@example.com",
  blogUrl: "https://moclab.top",
  cvUrl: "/cv.pdf",
  github: "https://github.com/yourname",
  scholar: "",
  linkedin: "",
  orcid: "",
  researchInterests: [
    "AIGC Detection",
    "AI Agent Security",
    "Model Attribution",
    "Multimodal AI Safety"
  ]
};
```

### 5.2 navigation.ts

```ts
export const navigation = {
  brand: "MocLab Academic",
  items: [
    { label: "关于我", href: "#about" },
    { label: "学术成果", href: "#publications" },
    { label: "工程项目", href: "#projects" },
    { label: "GitHub", href: "#github" },
    { label: "CV", href: "#cv" },
    { label: "联系", href: "#contact" }
  ],
  blog: "博客"
};
```

### 5.3 publications.ts

论文以卡片形式展示。每个论文卡片左侧为图片，中间为论文信息，右侧或底部为链接按钮。

```ts
export const publications = [
  {
    id: "paper-001",
    title: "论文标题",
    authors: ["Author A", "Author B", "Author C"],
    venue: "期刊 / 会议名称",
    year: "2026",
    type: "Journal",
    image: "/images/publications/paper-001.png",
    abstract: "这里填写论文摘要。首页默认只显示摘要前几行，点击展开按钮后显示完整摘要。",
    tags: ["AIGC Detection", "Model Attribution", "Trustworthy AI"],
    links: {
      paper: "https://example.com/paper",
      pdf: "",
      code: "",
      project: "",
      bibtex: ""
    }
  }
];
```

字段说明：

- `id`：唯一标识，用于详情页路由。
- `title`：论文标题。
- `authors`：作者列表。
- `venue`：会议或期刊。
- `year`：年份。
- `type`：类型，例如 Journal、Conference、Preprint、Workshop。
- `image`：展示图。
- `abstract`：摘要。
- `tags`：关键词。
- `links.paper`：论文详情页或外部论文网页。
- `links.pdf`：PDF 链接。
- `links.code`：代码链接。
- `links.project`：项目页链接。
- `links.bibtex`：BibTeX 链接或内容。

### 5.4 projects.ts

工程项目与学术成果类似，但侧重项目截图、简介、技术栈和跳转链接。

```ts
export const projects = [
  {
    id: "project-001",
    title: "项目名称",
    subtitle: "项目一句话简介",
    image: "/images/projects/project-001.png",
    description: "项目简介。首页展示简短版本，详情页展示完整内容。",
    techStack: ["React", "FastAPI", "Tailwind CSS", "PyTorch"],
    status: "In Progress",
    year: "2026",
    links: {
      demo: "",
      github: "",
      detail: "/projects/project-001"
    }
  }
];
```

### 5.5 repositories.ts

GitHub 仓库卡片先保留静态数据，后续可以选择接入 GitHub API。

```ts
export const repositories = [
  {
    name: "repo-name",
    description: "仓库简介。",
    url: "https://github.com/yourname/repo-name",
    language: "TypeScript",
    stars: 0,
    forks: 0,
    tags: ["React", "AI", "Dashboard"]
  }
];
```

关于 GitHub 星标展示：

1. 初版建议使用静态配置字段 `stars` 和 `forks`，方便部署且不会受 API 限制影响。
2. 后续可接入 GitHub REST API 自动获取仓库 stars、forks、language 等信息。
3. 如果接入 API，建议封装为 `src/lib/github.ts`，并提供失败降级逻辑。

### 5.6 experience.ts

```ts
export const experience = [
  {
    title: "硕士研究生",
    organization: "学校 / 实验室名称",
    location: "城市 / 国家",
    start: "2024",
    end: "Present",
    description: [
      "研究方向：可信 AI、AIGC 检测、AI Agent 安全。",
      "参与相关科研项目与工程系统开发。"
    ],
    tags: ["Research", "AI Safety", "AIGC"]
  }
];
```

### 5.7 awards.ts

```ts
export const awards = [
  {
    title: "奖项名称",
    organization: "颁发机构",
    year: "2026",
    description: "奖项简介。",
    level: "National / Provincial / University"
  }
];
```

### 5.8 cv.ts

```ts
export const cv = {
  summary: "这里填写个人 CV 概览。",
  education: [],
  research: [],
  projects: [],
  skills: [
    "Python",
    "PyTorch",
    "React",
    "FastAPI",
    "Tailwind CSS"
  ],
  downloadUrl: "/cv.pdf"
};
```

---

## 6. 组件设计

推荐组件目录：

```txt
src/
  components/
    layout/
      Navbar.tsx
      PageLayout.tsx
      Sidebar.tsx
      Section.tsx
      Footer.tsx
    cards/
      PublicationCard.tsx
      ProjectCard.tsx
      RepositoryCard.tsx
      ExperienceCard.tsx
      AwardCard.tsx
    common/
      ThemeToggle.tsx
      LanguageToggle.tsx
      Tag.tsx
      IconLink.tsx
      ExpandableText.tsx
      SectionTitle.tsx
      ExternalLinkButton.tsx
  pages/
    HomePage.tsx
    PaperDetailPage.tsx
    ProjectDetailPage.tsx
    CVPage.tsx
  content/
    zh/
    en/
  hooks/
    useTheme.ts
    useLanguage.ts
  lib/
    content.ts
    github.ts
    utils.ts
  types/
    content.ts
```

### 6.1 Navbar

要求：

- 固定顶部。
- 背景半透明，支持 backdrop blur。
- 滚动时增加阴影或边框。
- 点击导航项平滑滚动。
- 右侧包含主题切换、语言切换、博客跳转。
- 移动端支持菜单展开。

### 6.2 Sidebar

要求：

- 展示头像、姓名、签名、地区、联系方式和外部链接。
- 桌面端 sticky，移动端普通卡片。
- 使用图标链接展示 GitHub、邮箱、博客、Scholar 等。
- 提供下载 CV 按钮。

### 6.3 Section

通用区块组件。

字段：

- `id`
- `title`
- `subtitle`
- `children`

要求：

- 每个 section 有统一上边距。
- 标题设计清晰。
- 进入视口时可有轻微动效。

### 6.4 PublicationCard

要求：

- 左侧图片，右侧内容。
- 标题醒目。
- 展示作者、期刊 / 会议、年份、类型。
- venue 和关键词使用 tag 展示。
- 摘要默认折叠，只显示 2 到 3 行。
- 点击“展开摘要 / 收起摘要”按钮切换完整摘要。
- 提供 Paper、PDF、Code、Project 等链接按钮。
- 卡片 hover 时有轻微上浮和阴影变化。

### 6.5 ProjectCard

要求：

- 左侧项目截图。
- 中间展示项目名、副标题、简介、状态和年份。
- 技术栈用 tag 展示。
- 提供 Demo、GitHub、Detail 链接。
- 与论文卡片风格统一。

### 6.6 RepositoryCard

要求：

- 展示仓库名、简介、语言、stars、forks、tags。
- 卡片右上角显示 GitHub icon。
- 最多展示 6 个仓库。
- 初版从静态数据读取。
- 后续可接入 GitHub API 自动更新 stars。

### 6.7 CVPage

要求：

- 页面布局适合打印。
- 分块展示教育经历、科研经历、工程项目、技能、获奖。
- 提供下载 PDF CV 的按钮。
- 支持 `/cv` 独立路由。

---

## 7. 交互设计

### 7.1 明暗模式

实现方式：

- 使用 Tailwind CSS 的 `dark` class 策略。
- 将用户选择保存在 `localStorage`。
- 初次访问时读取系统主题。

状态值：

- `light`
- `dark`
- `system`

初版可以只做 light / dark 两种。

### 7.2 中英文切换

实现方式：

- 使用全局 LanguageContext。
- 语言值为 `zh` 或 `en`。
- 根据当前语言从 `src/content/zh` 或 `src/content/en` 读取对应内容。
- 用户选择保存在 `localStorage`。

要求：

- 切换语言时页面不刷新。
- 当前滚动位置尽量保持。
- 所有导航、按钮、标题、模块文本都要跟随语言变化。

### 7.3 摘要展开

`ExpandableText` 组件实现：

- 默认显示限定行数。
- 点击按钮展开完整内容。
- 再次点击收起。
- 按钮文本从 `common.ts` 读取，支持中英文。

### 7.4 平滑滚动

导航栏点击锚点后平滑滚动到对应 section。

注意顶部固定导航栏遮挡问题，需要设置 scroll-margin-top。

---

## 8. 样式规范

整体设计关键词：

- Academic
- Minimal
- Clean
- Modern
- Card-based
- Responsive
- Dark-mode friendly

### 8.1 颜色

浅色模式：

- 背景：近白色或浅灰色。
- 卡片：白色。
- 文字：深灰 / 黑色。
- 强调色：蓝色、青色或紫色均可。

暗色模式：

- 背景：深灰或近黑色。
- 卡片：深灰。
- 文字：浅灰 / 白色。
- 边框：半透明灰色。

### 8.2 卡片

- 圆角：`rounded-2xl`
- 阴影：轻量 shadow
- 边框：`border border-border/60`
- hover：轻微 translate-y 和 shadow 变化

### 8.3 字体

- 默认使用系统字体。
- 英文可使用 Inter。
- 中文保持系统无衬线字体，避免加载过慢。

### 8.4 动画

使用 framer-motion 实现轻量动效：

- section 进入时淡入。
- card hover 时轻微上浮。
- 不要使用过度复杂动画，避免影响学术主页的专业感。

---

## 9. 路由设计

使用 react-router-dom。

```tsx
<Route path="/" element={<HomePage />} />
<Route path="/papers/:id" element={<PaperDetailPage />} />
<Route path="/projects/:id" element={<ProjectDetailPage />} />
<Route path="/cv" element={<CVPage />} />
```

首页内部仍使用 section anchor：

```txt
#about
#publications
#projects
#github
#cv
#awards
#contact
```

---

## 10. 文件与资源管理

静态资源放在 `public` 目录：

```txt
public/
  images/
    avatar.jpg
    publications/
      paper-001.png
    projects/
      project-001.png
    repos/
  cv.pdf
```

图片要求：

- 头像建议正方形。
- 论文和项目配图建议 16:9。
- 卡片图片需要设置 object-cover，防止变形。
- 图片不存在时显示默认占位图。

---

## 11. GitHub 仓库模块说明

初版不强制接入 GitHub API，原因：

1. 静态部署更稳定。
2. 不需要 token。
3. 不受 GitHub API rate limit 影响。
4. 用户可以手动维护 stars 和 forks。

后续增强方案：

- 使用 GitHub REST API：`https://api.github.com/repos/{owner}/{repo}`
- 构建时拉取仓库信息。
- 或者前端运行时拉取并缓存。

建议先实现静态版本，再预留 `src/lib/github.ts`。

---

## 12. 具体开发任务拆分

### Phase 1：项目初始化

1. 使用 Vite 创建 React + TypeScript 项目。
2. 安装 Tailwind CSS。
3. 配置 shadcn/ui。
4. 安装 lucide-react、framer-motion、react-router-dom。
5. 配置基础目录结构。
6. 配置 ESLint 和 Prettier。

### Phase 2：全局能力

1. 实现 ThemeProvider。
2. 实现 LanguageProvider。
3. 实现内容加载工具 `getContent(language)`。
4. 实现基础类型定义。
5. 实现 light / dark 样式。

### Phase 3：布局组件

1. 实现 Navbar。
2. 实现 Sidebar。
3. 实现 PageLayout。
4. 实现 Section。
5. 实现 Footer。

### Phase 4：内容卡片组件

1. PublicationCard。
2. ProjectCard。
3. RepositoryCard。
4. ExperienceCard。
5. AwardCard。
6. ExpandableText。
7. Tag。
8. IconLink。

### Phase 5：首页整合

1. Hero / About。
2. Research Interests。
3. Publications。
4. Projects。
5. GitHub。
6. Experience。
7. Awards。
8. CV。
9. Contact。

### Phase 6：详情页

1. PaperDetailPage。
2. ProjectDetailPage。
3. CVPage。
4. 404 页面。

### Phase 7：优化与部署

1. 响应式适配。
2. SEO 基础信息。
3. OpenGraph 信息。
4. favicon。
5. Vercel / Cloudflare Pages 部署配置。
6. README 编写。

---

## 13. 推荐 package.json 依赖

```json
{
  "dependencies": {
    "@vitejs/plugin-react": "latest",
    "vite": "latest",
    "react": "latest",
    "react-dom": "latest",
    "react-router-dom": "latest",
    "lucide-react": "latest",
    "framer-motion": "latest",
    "clsx": "latest",
    "tailwind-merge": "latest",
    "class-variance-authority": "latest"
  },
  "devDependencies": {
    "typescript": "latest",
    "tailwindcss": "latest",
    "postcss": "latest",
    "autoprefixer": "latest",
    "eslint": "latest",
    "prettier": "latest"
  }
}
```

---

## 14. 推荐首页结构伪代码

```tsx
export default function HomePage() {
  const { content } = useContent();

  return (
    <PageLayout>
      <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
        <Sidebar profile={content.profile} />
        <main className="space-y-16">
          <Hero data={content.profile} />
          <About data={content.about} />
          <ResearchInterests items={content.profile.researchInterests} />
          <PublicationSection items={content.publications} />
          <ProjectSection items={content.projects} />
          <RepositorySection items={content.repositories.slice(0, 6)} />
          <ExperienceSection items={content.experience} />
          <AwardSection items={content.awards} />
          <CVSection data={content.cv} />
          <ContactSection data={content.profile} />
        </main>
      </div>
    </PageLayout>
  );
}
```

---

## 15. 代码质量要求

1. 所有组件使用 TypeScript。
2. 所有数据结构在 `src/types/content.ts` 中定义类型。
3. 组件不直接写死中英文文本。
4. 所有按钮文案、section 标题、提示文本从 content 中读取。
5. 所有外部链接使用 `target="_blank"` 和 `rel="noreferrer"`。
6. 图片必须设置 alt。
7. 卡片组件必须可复用。
8. 移动端必须可用。
9. 暗色模式下所有文本和边框必须清晰可见。
10. 首页首屏加载不应依赖外部 API。

---

## 16. 内容占位策略

由于用户后续会自行填写真实信息，初版应提供少量示例数据。

示例数据要求：

- 论文：3 条。
- 项目：3 条。
- GitHub 仓库：6 条。
- 经历：2 到 3 条。
- 奖项：3 条。
- CV：一份简洁结构。

所有示例数据必须明显是 placeholder，避免误导。

---

## 17. README 要求

项目必须包含 README.md，内容包括：

1. 项目介绍。
2. 技术栈。
3. 快速启动命令。
4. 目录结构。
5. 如何修改中文内容。
6. 如何修改英文内容。
7. 如何替换头像、论文图片、项目截图和 CV PDF。
8. 如何新增论文。
9. 如何新增项目。
10. 如何部署到 Vercel / Cloudflare Pages。

---

## 18. 启动命令

```bash
npm install
npm run dev
```

构建命令：

```bash
npm run build
```

预览命令：

```bash
npm run preview
```

---

## 19. Agent 执行注意事项

开发 Agent 在实现时应遵循以下要求：

1. 不要只生成单个 HTML 文件，应生成完整工程结构。
2. 不要把内容写死在 React 组件中。
3. 优先实现可维护的数据驱动结构。
4. 中文和英文内容必须完全分离。
5. 不要过度设计后端，本项目是静态前端项目。
6. GitHub 信息初版使用静态数据，不要强依赖 GitHub API。
7. 所有链接都应允许用户后续自行修改。
8. 所有图片路径都应允许用户后续自行替换。
9. 页面应该美观，但不能过度花哨。
10. 优先保证结构清晰、可部署、可维护。

---

## 20. 推荐最终目录结构

```txt
academic-homepage/
  public/
    images/
      avatar.jpg
      placeholder-paper.png
      placeholder-project.png
      publications/
      projects/
    cv.pdf
  src/
    components/
      layout/
        Navbar.tsx
        PageLayout.tsx
        Sidebar.tsx
        Section.tsx
        Footer.tsx
      cards/
        PublicationCard.tsx
        ProjectCard.tsx
        RepositoryCard.tsx
        ExperienceCard.tsx
        AwardCard.tsx
      common/
        ThemeToggle.tsx
        LanguageToggle.tsx
        Tag.tsx
        IconLink.tsx
        ExpandableText.tsx
        SectionTitle.tsx
        ExternalLinkButton.tsx
    content/
      zh/
        profile.ts
        navigation.ts
        publications.ts
        projects.ts
        repositories.ts
        experience.ts
        awards.ts
        cv.ts
        common.ts
      en/
        profile.ts
        navigation.ts
        publications.ts
        projects.ts
        repositories.ts
        experience.ts
        awards.ts
        cv.ts
        common.ts
    hooks/
      useTheme.ts
      useLanguage.ts
      useContent.ts
    lib/
      content.ts
      github.ts
      utils.ts
    pages/
      HomePage.tsx
      PaperDetailPage.tsx
      ProjectDetailPage.tsx
      CVPage.tsx
      NotFoundPage.tsx
    providers/
      ThemeProvider.tsx
      LanguageProvider.tsx
    types/
      content.ts
    App.tsx
    main.tsx
    index.css
  AGENT.md
  README.md
  package.json
  tailwind.config.ts
  vite.config.ts
  tsconfig.json
```

---

## 21. 验收标准

完成后需要满足：

1. 首页可以正常展示个人信息、学术成果、工程项目、GitHub 仓库、CV、奖项、经历和联系方式。
2. 顶部导航栏可以跳转到对应模块。
3. 明暗模式可以正常切换并持久化。
4. 中英文可以正常切换并持久化。
5. 所有内容来自 `src/content/zh` 和 `src/content/en`。
6. 论文摘要可以展开和收起。
7. 项目、论文、仓库链接可以跳转。
8. `/papers/:id`、`/projects/:id`、`/cv` 路由可访问。
9. 移动端布局正常。
10. `npm run build` 可以成功构建。
11. README 中说明如何修改内容和部署。

---

## 22. 可选增强功能

初版完成后可继续增加：

1. 从 BibTeX 自动生成论文列表。
2. 从 GitHub API 自动同步仓库 stars。
3. 接入 Google Scholar 链接。
4. 增加论文搜索和筛选。
5. 增加项目分类筛选。
6. 增加时间线视图。
7. 增加 Markdown 驱动详情页。
8. 增加 SEO metadata。
9. 增加访问统计。
10. 增加 RSS 或博客文章入口。

---

## 23. 给开发 Agent 的最终指令

请基于本 AGENT.md 创建一个完整的 React + Vite + TypeScript + Tailwind CSS 个人学术主页项目。

重点要求：

1. 使用组件化结构实现。
2. 使用 `src/content/zh` 和 `src/content/en` 维护所有中英文内容。
3. 实现明暗模式切换、中英文切换、顶部导航、个人信息侧栏、论文卡片、项目卡片、GitHub 仓库卡片、CV 页面、奖项与经历模块。
4. 首页采用单页滚动布局，同时提供论文详情页、项目详情页和 CV 独立页。
5. 使用 lucide-react 提供图标，使用 Tailwind CSS 和 shadcn/ui 风格完成美观、专业、响应式的界面。
6. 初始内容使用 placeholder 数据，保证用户后续只改 content 文件和 public 图片即可维护网站。
7. 保证 `npm install`、`npm run dev`、`npm run build` 能正常运行。

