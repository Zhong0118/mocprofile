import type { LocaleContent } from '../types';

export const zh: LocaleContent = {
  ui: {
    siteTitle: 'mocX',
    skipToContent: '跳到正文',
    colon: '：',
    nav: {
      label: '主导航',
      about: '简介',
      publications: '论文',
      projects: '项目',
      cv: 'CV',
      blog: '博客',
      menuOpen: '打开导航菜单',
      menuClose: '关闭导航菜单',
    },
    languageSwitch: { label: 'Switch to English', target: 'EN' },
    theme: { label: '深色模式' },
    sections: {
      publications: '论文',
      projects: '精选项目',
      experience: '经历',
      contact: '联系',
    },
    fullListInCv: {
      publications: '完整论文列表（CV）',
      projects: '完整项目列表（CV）',
      experience: '完整经历（CV）',
    },
    resources: {
      email: '邮箱',
      github: 'GitHub',
      blog: '博客',
      scholar: 'Google Scholar',
      orcid: 'ORCID',
      cv: '在线 CV',
      paper: '论文页',
      pdf: 'PDF',
      code: '代码',
      project: '项目页',
      demo: '演示',
      release: '发布版本',
      detail: '详情',
      bibtex: 'BibTeX',
      doi: 'DOI',
      arxiv: 'arXiv',
    },
    publication: {
      type: { journal: '期刊', conference: '会议', workshop: 'Workshop', other: '其他' },
      status: {
        published: '已发表',
        accepted: '已录用',
        preprint: '预印本',
        'under-review': '投稿中',
      },
      abstract: '摘要',
      showAbstract: '展开摘要',
      hideAbstract: '收起摘要',
      equalContribution: '* 共同第一作者',
      copyBibtex: '复制 BibTeX',
      copied: '已复制',
      copyFailed: '复制失败，可手动选择',
      originalLanguage: (lang) => `原文（${lang}）`,
    },
    project: {
      kind: {
        'research-prototype': '研究原型',
        engineering: '工程项目',
        tool: '工具',
        competition: '竞赛项目',
      },
      status: { ongoing: '进行中', released: '已发布', archived: '已归档' },
      since: (date) => `${date} 起`,
      techStack: '技术栈',
    },
    experience: {
      kind: { education: '教育', research: '研究', employment: '工作' },
      present: '至今',
    },
    detail: {
      backToPublications: '返回论文',
      backToProjects: '返回项目',
      contentInOtherLanguage: (lang) => `以下正文暂只有${lang}版本。`,
    },
    cv: {
      title: '简历',
      print: '打印 / 保存为 PDF',
      downloadPdf: '下载 PDF',
      downloadOtherLanguagePdf: '下载英文 PDF',
      education: '教育',
      experience: '研究与工作经历',
      publications: '论文',
      projects: '项目',
      awards: '奖项',
      skills: '技能',
      updatedAt: (date) => `内容更新于 ${date}`,
    },
    footer: {
      updatedAt: (date) => `最后更新：${date}`,
      copyright: (years, name) => `© ${years} ${name}`,
    },
    notFound: {
      title: '页面不存在',
      description: '这个地址没有对应的页面，可能已被移除或输入有误。',
      home: '返回首页',
    },
    languageName: { zh: '中文', en: '英文' },
    meta: {
      homeTitle: (name, handle) => (handle ? `${name}（${handle}）· 个人主页` : `${name} · 个人主页`),
      homeDescription:
        'mocX（GitHub: Zhong0118）的个人主页：智能体安全、多智能体协作与 AIGC 识别方向的公开项目与在线 CV。',
      cvTitle: (name) => `简历 · ${name}`,
      cvDescription: (name) => `${name} 的在线简历：公开项目与联系方式。`,
    },
  },
  person: {
    identity: ['北京邮电大学 · 北京'],
    intro: [
      '我在 GitHub 上以 Zhong0118 发布代码，技术笔记和过程记录写在 MocLab 博客。近期的公开仓库大多与大模型智能体有关，也包括一些日常使用的桌面与 Agent 工具。',
      '公开项目目前集中在三个方向：',
    ],
    focus: {
      'agent-security': {
        label: '智能体安全',
        text: '监督 LLM Agent 在工具调用阶段的越权风险，以及跨多个步骤才显现的风险行为链。',
      },
      'multi-agent': {
        label: '多智能体协作',
        text: '让团队的角色结构与协作策略依据跨任务执行证据、经过验证后再改变。',
      },
      'aigc-attribution': {
        label: 'AIGC 识别与溯源',
        text: '检测生成内容，并判断其来源模型。',
      },
    },
  },
  publications: {},
  projects: {
    'agentguard-chain': {
      role: '仓库作者',
      summary:
        '面向 LLM Agent 的工具调用安全监督原型。安全边界放在 Agent 生成工具调用之后、工具真实执行之前，对文件访问、命令执行、API 调用和外发行为做审计、评分、阻断与留证，并检测“敏感读取 → 外部发送”这类跨步骤风险链。',
      sections: [
        {
          heading: '问题与背景',
          paragraphs: [
            'Agent 生成的工具调用如果直接执行，会暴露在提示注入、工具调用劫持、危险命令执行、敏感文件访问、API 越权和多步外传等风险之下。项目面向比赛题目“面向大模型及其应用的安全性研究”，目标是监督工具调用本身，而不只是过滤 prompt。',
          ],
        },
        {
          heading: '实现内容',
          list: [
            '输入风险标注：识别提示注入、越狱式请求和可疑上下文。',
            '工具调用前审查：统一审查文件、命令、API、消息、邮件等调用。',
            '行为链检测：检测“敏感读取 → 外部发送”“写脚本 → 执行脚本”等跨步骤风险链。',
            '人工确认：决策分为 allow / ask / deny，ask 可自动拒绝、自动允许或交互确认。',
            '结果审查与脱敏：检查工具返回内容中的密钥、密码、token 等敏感信息。',
            '审计留证：以 JSONL 记录工具调用事件、网关决策、执行结果和解释，并在 Streamlit Dashboard 中展示指标、告警和风险链。',
          ],
        },
        {
          heading: '架构',
          pre: `Agent / LLM planner
    ↓
ToolCallEvent
    ↓
AgentGuardGateway
    ↓
PolicyEngine + ParameterChecker + ChainDetector + RiskScorer
    ↓
allow / ask / deny
    ↓
Tool executor
    ↓
ResultInspector + OutputRedactor
    ↓
AuditLogger
    ↓
Dashboard`,
        },
        {
          heading: '当前状态',
          paragraphs: [
            '据仓库 README 记录：安全网关、MiniAgent 的脚本与 LLM 两种模式、CoreCoder 受监督的离线回放与真实模式入口、风险解释器和基础 Dashboard 已完成；脚本化数据集包含 200 个 case、228 次工具调用；65 个单元测试通过。',
          ],
        },
      ],
    },
    evoteam: {
      role: '团队项目 · 仓库作者',
      summary:
        '基于 openJiuwen Core 的经验驱动多智能体组织演进系统。平时按当前 Strategy 执行任务，只有重复失败等证据达到阈值时才离线生成候选策略，经独立验证后才改变后续任务默认采用的组织方式。',
      sections: [
        {
          heading: '问题与背景',
          paragraphs: [
            '多智能体团队的角色结构与协作策略通常由开发者固定。EvoTeam 尝试根据跨任务的执行证据，对可版本化的 Strategy 做受约束修改，并要求候选策略通过验证门槛后才能晋升。主场景是复杂项目计划的生成与校验。',
          ],
        },
        {
          heading: '做法',
          paragraphs: [
            '初始 Strategy v0 为 Planner → Executor → Critic，Role Pool 由开发者定义。系统平时执行当前策略；重复失败、性能漂移、成本异常或低贡献证据达到阈值时启动离线演进；策略稳定后进入 STABLE，停止主动探索、继续监控。',
          ],
          pre: `在线执行：Task → Current Strategy → Orchestrator → Team / AgentInstance
         → Run → Evaluator → SealedRun → Experience → StrategyMonitor

离线演进：Trigger → EvolutionManager → Attribution → Mutation → Candidate
         → Validator → Improvement Attribution → Validation Gate
         → Promote / Reject → 后续任务使用已验证的 Strategy`,
        },
        {
          heading: '当前进展与局限',
          paragraphs: [
            '据仓库 README 记录：已接入 openJiuwen 0.1.17.post1 的 ReActAgent，提供 init / run / observe / evolve 入口、SQLite Trace 与快照、重复失败监控、Prompt 与新增 Verifier 两类候选及多候选比较；已用 DeepSeek 完成复杂任务、有界返工和多候选真实 Gate Reject 回归。',
            '漂移、成本与贡献监控，Tool / Skill Policy，以及更通用的结构 Mutation 尚未完成；实验阈值仍需基线校准。',
          ],
        },
      ],
    },
    pinnote: {
      role: '仓库作者',
      summary:
        '支持 Markdown 的桌面便签，可贴在屏幕上、收起成小胶囊，并通过全局快捷键呼出。安装包发布在 GitHub Releases；据 README，当前开发版已在 Apple Silicon macOS 上构建验证。',
    },
    'multi-tenant-crm-builder': {
      role: '仓库作者',
      summary:
        '面向多家公司的可配置 CRM 平台，目标是把中小企业散落在 Excel 中的业务流程变成带员工账号、权限和数据统计的在线系统。采用 pnpm monorepo，Web、API 与 Worker 分进程部署。',
    },
    mars: {
      role: '仓库作者',
      summary:
        '面向企业协作场景的 Agent 记忆管理引擎原型，计划把飞书群聊、笔记与会议讨论整理成带来源的结构化记忆。目前为本地 MVP：已完成数据模型、SQLite 存储与样例聊天导入，记忆抽取与检索尚未实现。',
    },
    'aigc-detector': {
      role: '仓库作者',
      summary: '检测 AIGC 生成内容并进行模型溯源的系统仓库，包含检测、溯源与数据接入等模块。',
    },
    'paper-reader-skill': {
      role: '仓库作者',
      summary:
        '用于精读论文、讲解方法与公式、核查证据、补齐相关文献脉络并沉淀持续更新笔记的 Agent Skill，提供 quick、deep、critique、compare 等 9 种模式。MIT 许可证。',
    },
    richeditor: {
      role: '仓库作者',
      summary:
        '中国软件杯参赛项目：面向写作、学习和办公场景的智能富文本编辑器，包含文档管理、AI 辅助写作、图片 OCR 和本地知识库问答。前端 Vue 3 + Tiptap，后端 Flask + MongoDB。',
    },
  },
  experience: {},
  awards: {},
  skillGroups: {},
};
