# mocprofile

mocX（GitHub [Zhong0118](https://github.com/Zhong0118)）的个人研究主页：https://mocprofile.vercel.app

静态站点，React 19 + Vite + TypeScript + Tailwind CSS v4，构建期为每个公开路由预渲染 HTML，客户端 hydrate。中文在 `/`，英文在 `/en/`。

## 命令

```bash
pnpm install
pnpm dev              # 开发服务器（客户端渲染）
pnpm dev:fixtures     # 用测试 fixtures 检查组件边界情况（不会进入生产构建）
pnpm test             # vitest：内容校验、选择逻辑、路由、服务端渲染
pnpm build            # tsc → 客户端构建 → SSR 构建 → 预渲染 → 产物检查
pnpm preview          # 按 vercel.json 规则在 :4173 提供 dist/（含真实 HTTP 404）
pnpm check:dist       # 单独重跑产物检查
```

`pnpm build` 的输出目录为 `dist/`；`dist-server/` 是构建中间产物，不部署。

## 修改内容

见 [docs/content-guide.md](docs/content-guide.md)。内容来源与待补充材料见 [docs/content-audit.md](docs/content-audit.md)，给 agent 的约定见 [AGENT.md](AGENT.md)。

## 部署

Vercel 读取 `vercel.json`：构建命令 `pnpm build`，输出 `dist/`，`trailingSlash: true`。不做 SPA 全站 rewrite，未知路径与缺失文件由 `dist/404.html` 返回 HTTP 404。Preview 部署（`VERCEL_ENV=preview`）自动输出 `noindex` 与禁止抓取的 robots.txt。
