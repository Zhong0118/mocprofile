# 资料收集与核对（content intake）

新增论文、经历、奖项、项目、仓库或技能时按这里的顺序做。目标是：每条公开内容都有作者确认和可核对的来源，未确认的草稿不进入公开仓库。

## 1. 原则

- **草稿不进仓库。** 填好的表格可能含未公开信息（投稿中的论文、导师、成绩、私人链接）。把 `docs/intake/` 中的空白模板复制到仓库**之外**的私人资料目录再填写，例如 `~/Documents/mocprofile-intake/`。仓库里只保留空白模板。
- **只公开作者允许公开的字段。** 每个模板都有“公开？”一栏；没有明确写“是”的字段不进入 `src/content/`。
- **事实要有来源。** 论文以出版方页面、arXiv 或录用通知为准；奖项以公开名单或证书为准；项目数字以 README、Release 或测试输出为准，并记下查阅日期。
- **不推断。** 不从机构名推断学位，不从仓库归属推断独立完成，不从参赛推断获奖，不补猜测的月份。
- **其他对话、私人笔记、未公开的研究目标不是来源。** 只有作者在本次提交中明确提供并同意公开的内容才算。

## 2. 流程

1. 选模板：

   | 条目 | 模板 | 写入位置 |
   | --- | --- | --- |
   | 论文 | [intake/publication.md](intake/publication.md) | `shared/records.ts` → `publications`；`locales/*.ts` → `publications` |
   | 经历（教育 / 研究 / 实习 / 工作） | [intake/experience.md](intake/experience.md) | `shared/records.ts` → `experience`；`locales/*.ts` → `experience` |
   | 奖项 | [intake/award.md](intake/award.md) | `shared/records.ts` → `awards`；`locales/*.ts` → `awards` |
   | 项目 | [intake/project.md](intake/project.md) | `shared/projects.ts`；`locales/*.ts` → `projects` |
   | 仓库 | [intake/repository.md](intake/repository.md) | `shared/repositories.ts`；`locales/*.ts` → `repositories` |
   | 技能 | [intake/skill.md](intake/skill.md) | `shared/skills.ts` |

2. 在私人目录中填写，附上来源链接或文件。
3. 作者逐项确认“公开？”一栏。
4. 只把确认公开的字段按 [content-guide.md](content-guide.md) 的格式写入 `src/content/`，中英文用同一个 ID。
5. 在 [content-audit.md](content-audit.md) 的“已采用”表中加一行：实体、来源、确认状态、处理方式。
6. 运行检查：

   ```bash
   pnpm dev      # 打开 http://localhost:5173/__content-review__/ 看各模块状态与校验结果
   pnpm test
   pnpm build
   ```

7. 提交时只包含 `src/content/`、`public/` 中的公开文件和文档更新，不要提交填好的表格。

## 3. 核对页

`pnpm dev` 下的 `/__content-review__/` 只在开发环境存在（生产构建不含该页面，`check-dist` 会检查）。它列出：

- 10 个模块各自的状态与条目数：有条目 / 暂无条目（空状态）/ 校验失败 / 已关闭；
- 结构校验与模板残留检查的结果（本地文件是否存在在构建时检查）；
- 项目筛选用一个不存在的关键词探测“无匹配”状态；
- 博客快照的条数、来源与抓取日期。

## 4. 常见拒收原因

| 情况 | 处理 |
| --- | --- |
| 投稿中的论文填了 venue | venue 留空，`publicationStatus: 'under-review'` |
| 作者顺序与出版页面不一致 | 以出版页面为准 |
| “获奖”只有参赛记录 | 不作为奖项；可在项目说明里写“参赛项目” |
| 项目效果数字没有来源 | 补 `source`，或删去数字 |
| 技能没有对应的公开项目 | 不列出，或先公开能体现它的项目 |
| 仓库 stars / 访问量 | 不记录 |
| 日期只记得年份 | 只写年份 |
