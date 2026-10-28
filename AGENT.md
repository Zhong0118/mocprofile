# AGENT.md

给后续在本仓库工作的 agent。2026-10-28 的学术主页重构替代了本文件旧版中的设计要求：常驻个人侧栏、每个模块都要有副标题和卡片、卡片悬停上浮、滚动淡入、固定数量的示例内容、GitHub 仓库卡片墙与 stars/forks、`/cv.pdf` 下载按钮、localStorage 决定语言。不要恢复这些设计。

## 1. 目标

个人研究主页：居中的阅读页面，简短的身份介绍，真实成果，独立的在线 CV，轻量交互。白底、深色文字、蓝色链接。

最终产物是静态网站：React + Vite + TypeScript + Tailwind CSS v4 + Lucide，构建期预渲染每个公开路由，客户端 hydrate。不要引入数据库、用户系统、CMS、运行时 SSR、站内搜索或整站框架迁移。包管理器为 pnpm，锁文件 `pnpm-lock.yaml`。

## 2. 内容真实性（最重要）

- 只有已确认、适合公开的内容能进入 `src/content/`。来源与待补充项记录在 `docs/content-audit.md`。
- 不得用示例经历、论文、奖项、指标或 stars 填充版面；没有内容的区块与导航自动隐藏。
- 论文区分 `type` 与 `publicationStatus`；投稿中的工作不能填 venue；作者顺序不可改，本人用 `personId` 标记。
- 项目角色、状态、所属组织必须有依据；仓库在本人名下不等于独立完成。
- 测试用的虚构数据只放在 `src/fixtures/`，生产代码不得导入（有测试检查）。`pnpm dev:fixtures` 通过 Vite alias 换入 fixtures，仅用于本地检查组件。

## 3. 结构

```txt
src/content/types.ts          内容模型
src/content/shared/           事实：ID、日期、链接、作者、官方题名
src/content/locales/zh|en.ts  可翻译文字与界面文案，按 ID 对应
src/content/selectors.ts      首页精选、CV、导航、详情查找的唯一逻辑
src/content/validate.ts       构建期内容校验
src/routing/                  路径规则、路由清单（manifest）、页面元信息
src/components/  src/pages/   布局、条目组件与页面
src/entry-client.tsx          BrowserRouter + hydrateRoot
src/entry-server.tsx          构建期 render(url)，StaticRouter
scripts/prerender.mjs         生成 dist/**/index.html、404.html、sitemap.xml、robots.txt
scripts/check-dist.mjs        检查静态产物
scripts/serve-dist.mjs        本地模拟 Vercel 静态规则
tests/                        vitest
```

路由：中文在根路径，英文在 `/en/`，一律带尾斜杠。语言只由 URL 决定。页面清单只来自 `buildRouteManifest`，prerender、sitemap、元信息都用它。`vercel.json` 使用 `trailingSlash: true`，不做全站 rewrite；未知路径由 `dist/404.html` 返回真实 HTTP 404。

## 4. 设计规则

- 颜色只用 `src/index.css` 中的语义 token（background、foreground、muted-foreground、link、separator、subtle-surface、focus-ring），浅色 / 深色两套。不用渐变、光晕、玻璃卡、网格背景、装饰动画、emoji 图标。
- 内容最大宽度 1040px；正文 measure 720px；详情 760px；CV 840px。字号见 `.t-*` 类。
- 论文是书目条目，项目是开放的文字条目，经历是“时间列 + 内容”。不加卡片外壳和阴影。
- 首屏内容首帧可读，不做滚动出现。动效只跟随用户操作：140ms / 180ms / 220ms，缓动 `cubic-bezier(0.22,1,0.36,1)`，`prefers-reduced-motion` 下关闭位移与平滑滚动。
- 导航与资源都是真实链接；同页锚点更新 hash；后退恢复阅读位置与焦点。
- 依赖 JS 的控件（主题、菜单按钮、复制、打印）使用 `.js-only`，无 JS 时隐藏；正文、导航与原生 `<details>` 无 JS 可用。
- 主题由 `index.html` 的 head 脚本在首绘前设定，只改 `<html>` 的 class，React 渲染的 DOM 与主题无关。

## 5. 保留的原则

1. 全部 TypeScript，数据结构集中定义类型。
2. 组件不写死中英文，文案来自 `locales/`；双语实体用同一 ID，不能因漏译而消失（校验会报错）。
3. 组件化、数据驱动，新增内容只改 `src/content/`。
4. 移动端与暗色模式必须单独检查（1440 / 1024 / 768 / 390 / 320）。
5. 首屏不依赖外部 API。

## 6. 交付前

```bash
pnpm test
pnpm build      # 失败即说明内容或产物有问题
pnpm preview    # 检查真实 404、尾斜杠跳转与无 JS 页面
```

只报告实际运行过的命令。作者维护说明见 `docs/content-guide.md`。
