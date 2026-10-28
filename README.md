# mocprofile

mocX（GitHub [Zhong0118](https://github.com/Zhong0118)）的个人主页：https://mocprofile.vercel.app

静态站点，React 19 + Vite + TypeScript + Tailwind CSS v4 + Motion for React，构建期为每个公开路由预渲染 HTML，客户端 hydrate。中文在 `/`，英文在 `/en/`。

## 页面

| 路径 | 内容 |
| --- | --- |
| `/` | 首页：身份与研究方向图、研究方向、代表项目、论文、技能、开源仓库、经历、奖项、CV、联系 |
| `/about/` | 研究方式、方向、技能、教育、经历、奖项、联系 |
| `/projects/` | 全部项目，按类型 / 关键词筛选，网格或列表视图（状态保存在 URL） |
| `/projects/{id}/` | 项目案例：目录、已实现 / 计划中分段、来源说明、相关项目 |
| `/publications/` | 论文列表 |
| `/repositories/` | 公开仓库，按语言 / 关键词筛选 |
| `/cv/` | 在线 CV，可打印为 A4 |

## 命令

```bash
pnpm install
pnpm dev              # 开发服务器（客户端渲染）；开发环境另有 /__content-review__/ 内容核对页
pnpm dev:fixtures     # 用测试 fixtures 检查组件边界情况（不会进入生产构建）
pnpm test             # vitest：内容校验、选择与筛选逻辑、路由、服务端渲染
pnpm build            # tsc → 客户端构建 → SSR 构建 → 预渲染 → 产物检查
pnpm preview          # 按 vercel.json 规则在 :4173 提供 dist/（真实 HTTP 404、gzip）
pnpm check:dist       # 单独重跑产物检查
pnpm snapshot:blog    # 手动更新 MocLab 博客列表快照（构建本身不联网）
```

`pnpm build` 的输出目录为 `dist/`；`dist-server/` 是构建中间产物，不部署。

## 修改内容

- 日常修改：[docs/content-guide.md](docs/content-guide.md)
- 新增论文、经历、奖项、项目等条目的资料收集与核对：[docs/content-intake.md](docs/content-intake.md)，模板在 [docs/intake/](docs/intake/)
- 内容来源与待补充材料：[docs/content-audit.md](docs/content-audit.md)
- 给 agent 的约定：[AGENT.md](AGENT.md)
- 第三方许可：[THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)

## 部署

Vercel 读取 `vercel.json`：构建命令 `pnpm build`，输出 `dist/`，`trailingSlash: true`。不做 SPA 全站 rewrite，未知路径与缺失文件由 `dist/404.html` 返回 HTTP 404。Preview 部署（`VERCEL_ENV=preview`）自动输出 `noindex` 与禁止抓取的 robots.txt。
