# AGENT.md

给后续在本仓库工作的 agent。2026-10-28 的完整主页重建（v2）替代了更早的规则：v1 里“没有内容的区块与导航自动隐藏”“不加卡片外壳”“不展示仓库”的要求已经作废，不要恢复。同样不要恢复的旧设计：常驻个人侧栏、滚动淡入、stars/forks、虚构的 `/cv.pdf`、localStorage 决定语言。

## 1. 目标

mocX（GitHub Zhong0118）的个人主页：身份与研究方向、代表项目、论文、技能、开源仓库、经历、奖项、CV、联系方式，共 10 个模块。白底、深色文字、蓝色强调，卡片与轻量动效只服务于浏览与筛选。

最终产物是静态网站：React 19 + Vite + TypeScript + Tailwind CSS v4 + Lucide + Motion for React（`motion/react`）。构建期预渲染每个公开路由，客户端 hydrate。不要引入数据库、用户系统、CMS、运行时 SSR、全站框架迁移。包管理器为 pnpm。

## 2. 内容真实性（最重要）

- 只有已确认、适合公开的内容能进入 `src/content/`。来源与待补充项记录在 `docs/content-audit.md`，新增条目的流程见 `docs/content-intake.md`。
- 不编造经历、论文、奖项、成果数字、star 数量、访问量、时间线或“正在进行”的活动；不从其他对话、私人笔记或未公开的研究目标自动填入履历。
- **模块常驻**：10 个模块都渲染。集合为空时显示空状态“暂未列出公开条目 / No public entries listed”，不隐藏模块或导航。模块只能通过 `site.modules[id].enabled` 由编辑决定关闭，不能由条目数量决定。
- 论文区分 `type` 与 `publicationStatus`；投稿中的工作不填 venue；作者顺序不可改，本人用 `personId` 标记。
- 项目角色、状态、所属组织必须有依据；仓库在本人名下不等于独立完成。`startKind: 'repository-created'` 的日期显示为“仓库创建于”。
- 详情页里来自 README 的数字必须带 `source`（校验会检查）；“已实现”与“计划中”分段标注。
- 技能必须引用至少一个项目或仓库作为证据；不写熟练度百分比。
- 仓库只写可核实的元数据（创建日期、语言、许可证、Release）。禁止 stars、forks、watchers、下载量字段（校验会拦截）。
- 客户端不请求需要凭证的 API，不放任何 token。博客列表是手动快照（`pnpm snapshot:blog`），构建不联网。
- 测试用虚构数据只放在 `src/fixtures/`，生产代码不得导入。`pnpm dev:fixtures` 通过 Vite alias 换入 fixtures。

## 3. 结构

```txt
src/content/types.ts            内容模型（模块、项目、仓库、技能、方向、经历、奖项、论文）
src/content/shared/             事实：ID、日期、链接、作者、仓库元数据、技能证据、研究方向
src/content/locales/zh|en.ts    可翻译文字与界面文案，按 ID 对应
src/content/generated/          构建外手动生成的快照（博客）
src/content/selectors.ts        首页精选、筛选、关联、日期标签的唯一逻辑
src/content/validate.ts         构建期结构校验 + 模板残留检查
src/routing/                    路径、路由清单（manifest）、页面元信息
src/motion/                     MotionProvider、时长与缓动 token
src/site/                       hydration 标记、共享元素过渡、返回位置记忆、链接规则
src/components/  src/pages/     组件与页面
src/pages/ContentReviewPage.tsx 仅开发环境的内容核对页 /__content-review__/
scripts/prerender.mjs           生成 dist/**/index.html、404.html、sitemap.xml、robots.txt
scripts/check-dist.mjs          检查静态产物
scripts/serve-dist.mjs          本地模拟 Vercel 静态规则（308 尾斜杠、真实 404、gzip）
scripts/fetch-blog.mjs          博客 RSS 手动快照
tests/                          vitest
```

路由：中文在根路径，英文在 `/en/`，一律带尾斜杠，语言只由 URL 决定。页面清单只来自 `buildRouteManifest`。索引页：`/about/`、`/projects/`、`/publications/`、`/repositories/`、`/cv/`；详情页：`/projects/{id}/`（`detail: true`）、`/papers/{id}/`。`vercel.json` 使用 `trailingSlash: true`，不做全站 rewrite；未知路径由 `dist/404.html` 返回真实 HTTP 404。

## 4. 设计与交互规则

- 颜色只用 `src/index.css` 的语义 token，浅色 / 深色两套，正文对比度 ≥ 4.5:1。不用渐变、光晕、玻璃卡、装饰动画、emoji 图标。
- 页面外层用 `.page-wrap`（78rem）+ `.grid-layout`（4 / 8 / 12 列）。不要改用 Tailwind 自带的页面宽度工具类：它会覆盖宽度并在窄屏溢出，`check-dist` 会拦截。
- 首屏首帧可读，内容不依赖动画出现（产物中不得有 `opacity:0` 的预渲染样式）。
- 动效只跟随用户操作，时长见 `src/motion/index.tsx`（按压 120ms、悬停 160ms、反馈 180ms、面板 260ms、布局 320ms、共享元素 380ms），缓动 `cubic-bezier(0.22,1,0.36,1)`。`MotionConfig reducedMotion="user"`，减少动态时只保留淡入淡出。
- 筛选状态只存在 URL 查询参数里（`?type=&q=&view=`），用 `replace` 更新；读取前先等 hydration，保证预渲染输出与首次渲染一致。更新时从当前 URL 读最新状态，不用渲染闭包里的旧值。
- 卡片只有一个主链接（拉伸覆盖整卡），代码 / Release 是独立的次级链接，不嵌套链接。
- 后退恢复滚动位置与焦点；卡片 ↔ 详情的共享元素过渡在 `src/site/shared-element.ts`。
- 依赖 JS 的控件（筛选、主题、菜单、复制）使用 `.js-only`；无 JS 时正文、全部条目与导航可用。

## 5. 保留的原则

1. 全部 TypeScript，数据结构集中定义类型。
2. 组件不写死中英文，文案来自 `locales/`；双语实体用同一 ID，缺译会让校验失败。
3. 新增内容只改 `src/content/`。
4. 移动端与暗色模式单独检查：1440 / 1366 / 1280 / 1024 / 768 / 390 / 320，以及 640（相当于 200% 缩放）。
5. 首屏不依赖外部 API。

## 6. 交付前

```bash
pnpm test
pnpm build      # 失败即说明内容或产物有问题
pnpm preview    # 检查真实 404、尾斜杠跳转、无 JS 页面与打印
```

只报告实际运行过的命令。受访问保护的 Preview 落到登录页时记为“受阻”，不要关闭保护，也不要把登录页的结果当成本站成绩。作者维护说明见 `docs/content-guide.md`。
