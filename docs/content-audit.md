# 内容清单（content audit）

记录站点公开内容的来源、确认状态和处理决定。只记录适合放进这个公开仓库的信息。
审阅日期：2026-10-28；基线提交 `e6d095c`，v2 重建（10 个常驻模块）基于 `4212489`。

分类：

- **已确认**：用户明确提供，或能从用户本人公开资料中对应核实。
- **待确认**：可能属于用户，但依据不足。不进入生产数据。
- **模板**：张三、XX 大学、示例论文、example 链接、演示奖项与指标等。已从生产代码删除。

## 1. 已采用（生产数据）

| 实体 / 字段 | 值 | 来源 | 状态 | 公开 | 处理 |
| --- | --- | --- | --- | --- | --- |
| 署名 `person.displayName` | mocX | GitHub 个人资料 `name` 字段（github.com/Zhong0118） | 已确认（公开资料） | 是 | 作为 H1 与站点短标 |
| 账号 `person.handle` | Zhong0118 | GitHub 登录名 | 已确认 | 是 | 次级署名行 |
| GitHub | https://github.com/Zhong0118 | 同上 | 已确认 | 是 | 简介、页脚、CV、JSON-LD sameAs |
| 博客 | https://moclab.top | GitHub 资料 `blog` 字段；旧 AGENT.md 中用户指定的博客入口 | 已确认 | 是 | 导航“博客”、页脚 |
| 机构 / 地点 | 北京邮电大学 · 北京 | GitHub 资料 `company`、`location` 字段 | 已确认（只有机构名，无身份） | 是 | 仅显示机构与城市，不写学位、身份、实验室 |
| 项目 AgentGuard-Chain | 见 `src/content/shared/projects.ts` | 公开仓库 README；贡献者列表仅含 Zhong0118 | 已确认（仓库事实） | 是 | 首页精选 #1，有详情页 |
| 项目 EvoTeam | 同上 | 公开仓库 README（提到组员与分工，为团队项目） | 已确认（仓库事实） | 是 | 首页精选 #2，有详情页；角色写“团队项目 · 仓库作者” |
| 项目 PinNote | 同上 | README；GitHub Releases v1.0.0–v1.1.4 | 已确认 | 是 | 首页精选 #3；状态“已发布”来自 Releases |
| 项目 Multi-tenant CRM Builder | 同上 | 仓库描述与 README | 已确认（仓库事实） | 是 | 仅 CV |
| 项目 MARS | 同上 | README “Project Status” 段 | 已确认 | 是 | 仅 CV；状态“进行中”依据 README 中未实现项 |
| 项目 aigc_detector | 同上 | 仓库描述（无 README，目录含 detection / provenance / ingestion） | 已确认（仅描述级） | 是 | 仅 CV，说明只用仓库描述，不写效果 |
| 项目 Paper Reader Skill | 同上 | README、MIT 许可证 | 已确认 | 是 | 仅 CV |
| 项目 RichEditor / BD-Note | 同上 | README（“中国软件杯参赛项目”） | 已确认（仓库事实） | 是 | 仅 CV；未写获奖情况 |
| 简介文字（中/英） | `src/content/locales/*.ts` | 依据上列公开仓库整理，只描述公开项目覆盖的方向 | **措辞待作者核对** | 是 | 用“公开项目集中在……”描述作品，不宣称研究结论 |
| 项目英文说明 | `src/content/locales/en.ts` | 由中文 README 翻译整理 | **译文待作者校对** | 是 | 同一 ID 双语对应 |
| 内容更新时间 | 2026-10-28 | 本轮整理内容的日期 | 已确认 | 是 | 页脚与 CV 显示 |
| 研究方向（3 个） | `shared/person.ts` `directions`；文字在 `locales/*.ts` | 由上列公开项目归纳：智能体安全 → AgentGuard-Chain；多智能体协作 → EvoTeam、MARS；AIGC 识别与溯源 → aigc_detector | **措辞待作者核对** | 是 | 首页方向图与研究方向模块；写“关注”，不写研究结论 |
| 标语、研究方式（4 步） | `locales/*.ts` `person.tagline`、`researchModel` | 依据公开 README 中的做法整理（原型、测试、状态说明） | **措辞待作者核对** | 是 | 首页标语、`/about/` |
| 公开仓库（8 个） | `shared/repositories.ts` | GitHub 公开接口 `api.github.com/users/Zhong0118/repos`（无 token），查阅于 2026-10-28：创建日期、主语言、fork / archived；许可证与 Release 来自仓库文件与 Releases 页 | 已确认（仓库元数据） | 是 | 首页 4 个、`/repositories/` 全部、CV；只有 paper-reader-skill 有 MIT 许可证，PinNote 有 Release |
| 技能（4 组 20 项） | `shared/skills.ts` | 各项目 `techStack` 与仓库语言；每项引用至少一个项目 | 已确认（以公开代码为证据） | 是 | 首页技能模块、`/about/`、CV；不写熟练度 |
| 项目案例（AgentGuard-Chain、EvoTeam） | `locales/*.ts` `sections` | 仓库 README（查阅于 2026-10-28），每段注明来源；“已实现”“计划中”分开 | 已确认（仓库事实），本站未重新运行验证 | 是 | `/projects/{id}/`；AgentGuard 的状态段写明“本站没有重新运行验证” |
| 首页大卡片示意流程 | `locales/*.ts` `schematic` | 简化自 AgentGuard-Chain README 的架构图 | 已确认 | 是 | 始终标注“示意” |
| 博客文章列表（4 篇） | `src/content/generated/blog-feed.json` | MocLab 公开 RSS 的手动快照（`pnpm snapshot:blog`），只存标题、链接、日期、简介 | 已确认（公开 RSS） | 是 | 联系模块；构建不联网 |

项目字段的取值规则：

- `start` 为仓库创建月份，不表示项目真实开始时间；作者可改为实际时间。
- 角色统一写“仓库作者”：贡献者列表只有本账号，但这不代表独立完成，团队项目另行标注。
- `status` 只在 README 或 Releases 能证明时填写；其余留空。
- 未写 stars / forks / 访问量；客户端不请求 GitHub API，仓库元数据是构建前手动整理的快照。

## 1.1 v2 模型迁移（2026-10-28）

| 变化 | 说明 |
| --- | --- |
| 模块常驻 | 10 个模块（about、research、projects、publications、skills、repositories、experience、awards、cv、contact）都渲染；空集合显示“暂未列出公开条目 / No public entries listed”。v1 的“空区块自动隐藏”已取消 |
| `site.modules` | 新增；模块只能由编辑关闭，不由条目数量决定 |
| `Project.startKind` | 新增；现有 8 个项目都是 `repository-created`，显示为“仓库创建于” |
| `Repository`、`SkillGroup`、`ResearchDirection` | 新增实体，来源见上表 |
| `DetailSection.id / kind / source` | 详情段落新增稳定锚点、“背景 / 已实现 / 计划中 / 状态”标记与来源；含两位以上数字的段落必须有来源 |
| `Award.participation`、`Experience.kind` | 奖项区分个人 / 团队；经历分教育、研究、实习、工作 |
| `person.focus` | 由 `directions` 与 locale 中的 `tagline`、`about`、`researchModel` 取代 |
| 论文、经历、奖项 | 仍为空，等待作者按 `docs/content-intake.md` 提供 |

## 2. 未采用

| 内容 | 原因 | 处理 |
| --- | --- | --- |
| 张三 / San Zhang、XX 大学、XX 实验室、XX 科技公司 | 模板 | 删除 |
| your_email@example.com、github.com/yourname、example.com、arxiv xxxx.xxxxx、scholar.google.com 首页 | 模板 / 平台首页 | 删除；校验脚本拦截 |
| 示例论文 paper-001～003（TIFS、CCS、综述） | 模板，无原始依据 | 删除；`/papers/paper-001/` 返回 404 |
| 示例项目 project-001～003、六个示例仓库及其 stars/forks | 模板 | 删除；`/projects/project-001/` 返回 404 |
| GPA 3.8、国家奖学金、信安竞赛一等奖、优秀毕业论文、实习经历 | 模板 | 删除 |
| `/cv.pdf`、`/images/avatar.jpg` 等未提交的资源 | 文件不存在 | 删除引用；现在返回真实 404 |
| 用户 Git 提交邮箱 | 未在 GitHub 资料中公开 | 不在站点显示 |
| 中文姓名、学位、年级、导师、实验室 | 无公开依据 | 不显示，列入待补充 |
| fork 仓库（reader、pi、CoreCoder 等） | 不是本人项目 | 不展示 |
| 研究方向示例（规格书第 6.2 节） | 需作者确认 | 只用于描述已公开项目，不写成研究结论 |

## 3. 待作者补充

1. 希望默认展示的署名：mocX、中文姓名，或其他英文名。
2. 在北京邮电大学的实际身份（本科 / 硕士 / 博士 / 其他）、入学时间，是否公开导师或实验室。
3. 一段由本人确认的研究简介（中文约 120–180 字），以及是否把三个方向写成研究兴趣。
4. 论文：官方题名、完整作者顺序、状态、venue / 年份、论文 / PDF / 代码链接；是否公开投稿中的工作。
5. 各项目的本人角色与时间，尤其是 EvoTeam 的团队分工、RichEditor 是否获奖、AgentGuard-Chain 参加的比赛名称与结果。
6. 教育、研究 / 工作经历、奖项和愿意公开的时间范围。
7. 可选：真实肖像、项目截图或研究图。
8. 可选：CV PDF、文件语言和最后内容更新时间。
9. 可选：公开联系邮箱、Google Scholar / ORCID 个人页。
10. ~~确认生产域名~~ 已确认（2026-10-28，作者）：`site.url`（canonical、sitemap）保持 https://mocprofile.vercel.app。https://academic.moclab.top 指向同一部署，但不作为 canonical；未改 DNS 或 Vercel 配置。
11. 核对研究方向、标语、研究方式与项目英文说明的措辞。
12. 可选：AgentGuard-Chain、EvoTeam 之外，哪些项目值得写案例详情页。
