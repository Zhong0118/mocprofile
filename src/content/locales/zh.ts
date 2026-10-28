import type { LocaleContent, SourceNote } from '../types';

const readme = (repo: string): SourceNote => ({
  label: '仓库 README',
  url: `https://github.com/Zhong0118/${repo}`,
  retrievedAt: '2026-10-28',
});

export const zh: LocaleContent = {
  ui: {
    siteTitle: 'mocX',
    skipToContent: '跳到正文',
    colon: '：',
    nav: {
      label: '主导航',
      home: '首页',
      about: '关于',
      projects: '项目',
      publications: '论文',
      repositories: '开源',
      cv: 'CV',
      blog: 'MocLab',
      external: '（外部链接）',
      menuOpen: '打开导航菜单',
      menuClose: '关闭导航菜单',
      tools: '显示设置',
    },
    languageSwitch: { label: 'EN – Switch to English', target: 'EN' },
    theme: { label: '深色模式' },
    modules: {
      about: '关于',
      research: '研究方向',
      projects: '项目',
      publications: '论文',
      skills: '技能',
      repositories: '开源仓库',
      experience: '教育与经历',
      awards: '奖项与荣誉',
      cv: '简历',
      contact: '联系',
    },
    moduleLead: {
      research: '公开项目覆盖的三个方向，每个方向都对应可查看的仓库。',
      projects: '研究原型、工具与工程项目。日期为 GitHub 仓库创建月份，不代表项目真实起止时间。',
      skills: '只列出在公开项目中用到的技术，不标熟练度。选择一项可查看对应项目。',
      repositories: '与上述项目一一对应的公开仓库，不含 fork。不显示 star 数。',
      cv: '在线简历与本站使用同一份数据，可直接打印为 A4。',
      contact: '目前通过 GitHub 和 MocLab 博客联系。',
    },
    emptyState: '暂未列出公开条目',
    noMatch: {
      title: '没有符合条件的条目',
      hint: '换个关键词，或清除筛选查看全部。',
      clear: '清除筛选',
    },
    hero: {
      primary: '查看项目',
      secondary: '在线 CV',
      directionsLabel: '研究方向',
      mapLabel: '研究方向与对应项目',
      mapCenter: '大模型智能体',
      relatedWork: '相关项目',
      viewAllInDirection: '查看全部方向',
    },
    more: {
      projects: (n) => `查看全部 ${n} 个项目`,
      publications: '打开论文页',
      repositories: (n) => `查看全部 ${n} 个仓库`,
      about: '更多关于我',
      cv: '打开在线 CV',
    },
    resources: {
      email: '邮箱',
      github: 'GitHub',
      blog: 'MocLab 博客',
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
      viewCode: '查看代码',
      getRelease: '获取发布版本',
      readCase: '阅读项目详情',
    },
    filters: {
      label: '筛选',
      search: '搜索',
      searchPlaceholder: '名称、简介或技术栈',
      clear: '清除筛选',
      results: (n, total) => `显示 ${n} / ${total} 项`,
      view: '视图',
      grid: '网格',
      list: '列表',
      language: '语言',
      allLanguages: '全部语言',
      year: '年份',
      type: '类型',
      status: '状态',
      all: '全部',
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
      filter: { all: '全部', research: '研究原型', tool: '工具', engineering: '工程与竞赛' },
      status: { ongoing: '进行中', released: '已发布', archived: '已归档' },
      repositoryCreated: (date) => `仓库创建于 ${date}`,
      since: (date) => `${date} 起`,
      techStack: '技术栈',
      moreTags: (n) => `+${n}`,
      schematic: '示意',
      featured: '代表项目',
      role: '角色',
    },
    repository: {
      copyUrl: '复制仓库地址',
      copied: '已复制',
      copyFailed: '复制失败，可手动选择',
      created: (date) => `创建于 ${date}`,
      license: '许可证',
      archived: '已归档',
      fork: 'Fork',
      source: (date) => `仓库信息来自 GitHub 公开数据，查阅于 ${date}。`,
      projects: '对应项目',
    },
    skills: {
      evidence: '使用证据',
      evidenceHint: '选择一项技术，查看用到它的公开项目。',
      usedIn: (n) => `${n} 个项目`,
      filterProjects: (skill) => `在项目目录中筛选“${skill}”`,
    },
    experience: {
      kind: { education: '教育', research: '研究', internship: '实习', employment: '工作' },
      present: '至今',
    },
    awards: {
      level: {
        international: '国际级',
        national: '国家级',
        provincial: '省部级',
        university: '校级',
        other: '其他',
      },
      participation: { individual: '个人', team: '团队' },
      evidence: '证明材料',
    },
    detail: {
      backToPublications: '返回论文',
      backToProjects: '返回项目目录',
      contents: '本页目录',
      sectionKind: {
        context: '背景',
        implemented: '已实现',
        planned: '未完成 / 计划中',
        status: '当前状态',
      },
      source: (label, date) => `来源：${label}，查阅于 ${date}`,
      related: '相关项目',
      overview: '概览',
      contentInOtherLanguage: (lang) => `以下正文暂只有${lang}版本。`,
    },
    about: {
      title: '关于',
      researchModel: '工作方式',
      education: '教育',
    },
    blog: {
      title: 'MocLab 近期文章',
      snapshot: (date) => `摘自 MocLab RSS，抓取于 ${date}`,
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
      awards: '奖项与荣誉',
      skills: '技能',
      repositories: '开源仓库',
      updatedAt: (date) => `内容更新于 ${date}`,
      summary: '在线简历与主页同源，列出全部公开项目，可打印为 A4。',
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
        'mocX（GitHub: Zhong0118）的个人主页：智能体安全、多智能体协作与 AIGC 识别方向的公开项目、开源仓库与在线 CV。',
      pageTitle: (page, name) => `${page} · ${name}`,
      aboutDescription: 'mocX 的简介、研究方向、工作方式、技能与联系方式。',
      projectsDescription: 'mocX 的全部公开项目：研究原型、工具、工程与竞赛项目，可按类型和关键词筛选。',
      publicationsDescription: 'mocX 的论文列表，可按年份、类型与状态筛选。',
      repositoriesDescription: 'mocX 在 GitHub 上与公开项目对应的仓库，可按语言筛选。',
      cvTitle: (name) => `简历 · ${name}`,
      cvDescription: (name) => `${name} 的在线简历：公开项目、技能、开源仓库与联系方式。`,
    },
  },
  person: {
    identity: ['北京邮电大学 · 北京'],
    tagline: ['关注大模型智能体的安全与协作', '用可运行的原型和工具检验想法'],
    intro:
      '我在 GitHub 上以 Zhong0118 发布代码，在 MocLab 博客记录技术笔记。近期的公开仓库多与大模型智能体有关：工具调用的安全监督、多智能体组织的演进，以及日常使用的桌面与 Agent 工具。',
    about: [
      '我在 GitHub 上以 Zhong0118 发布代码，技术笔记和过程记录写在 MocLab 博客。这个页面只列出能在公开仓库中核对的内容；学位、导师、论文与经历在作者确认前不显示。',
      '近期的公开项目集中在三个方向：LLM Agent 工具调用阶段的安全监督、依据执行证据演进的多智能体组织，以及 AIGC 内容的检测与溯源。此外也有一些自己日常使用的桌面与 Agent 工具。',
    ],
    researchModel: [
      {
        title: '界定问题',
        text: '先写清要处理的风险或协作问题。例如 AgentGuard-Chain 把安全边界放在工具调用生成之后、真实执行之前。',
        projectIds: ['agentguard-chain'],
      },
      {
        title: '做可运行的原型',
        text: '用最小的可运行系统落地想法：安全网关、策略演进循环、带来源的记忆存储。',
        projectIds: ['agentguard-chain', 'evoteam', 'mars'],
      },
      {
        title: '用证据检验',
        text: '用脚本化用例、单元测试或验证门槛检查结果，并在 README 中写明当前状态与局限。',
        projectIds: ['agentguard-chain', 'evoteam'],
      },
      {
        title: '公开记录',
        text: '代码放在 GitHub，过程与工具笔记写在 MocLab 博客。',
      },
    ],
  },
  directions: {
    'agent-security': {
      label: '智能体安全',
      question: 'LLM Agent 生成的工具调用在真正执行之前，如何发现越权和跨多个步骤才显现的风险行为链？',
      approach: '在工具调用与执行之间放置安全网关，对文件、命令、API 与外发行为做审计、评分、阻断和留证。',
    },
    'multi-agent': {
      label: '多智能体协作',
      question: '多智能体团队的角色结构和协作策略，能否依据跨任务的执行证据、经过验证后再改变？',
      approach: 'EvoTeam 用可版本化的 Strategy 和验证门槛约束演进；MARS 尝试把协作讨论整理成带来源的记忆。',
    },
    'aigc-attribution': {
      label: 'AIGC 识别与溯源',
      question: '如何判断一段内容是否由模型生成，并追溯它来自哪个模型？',
      approach: 'aigc_detector 仓库按检测、溯源与数据接入划分模块；目前只公开了仓库描述，没有公开效果数据。',
    },
  },
  publications: {},
  projects: {
    'agentguard-chain': {
      role: '仓库作者',
      roleNote: '仓库贡献者列表仅含本账号，这不等于独立完成；参赛名称与结果待作者补充。',
      summary:
        '面向 LLM Agent 的工具调用安全监督原型。安全边界放在 Agent 生成工具调用之后、工具真实执行之前，对文件访问、命令执行、API 调用和外发行为做审计、评分、阻断与留证，并检测“敏感读取 → 外部发送”这类跨步骤风险链。',
      schematic: {
        caption: '简化的调用流程，依据仓库 README 中的架构图绘制。',
        steps: ['Agent 生成工具调用', '安全网关审查', 'allow / ask / deny', '执行与结果脱敏', '审计留证'],
      },
      sections: [
        {
          id: 'problem',
          heading: '问题与背景',
          kind: 'context',
          paragraphs: [
            'Agent 生成的工具调用如果直接执行，会暴露在提示注入、工具调用劫持、危险命令执行、敏感文件访问、API 越权和多步外传等风险之下。项目面向比赛题目“面向大模型及其应用的安全性研究”，目标是监督工具调用本身，而不只是过滤 prompt。',
          ],
        },
        {
          id: 'implemented',
          heading: '已实现的功能',
          kind: 'implemented',
          list: [
            '输入风险标注：识别提示注入、越狱式请求和可疑上下文。',
            '工具调用前审查：统一审查文件、命令、API、消息、邮件等调用。',
            '行为链检测：检测“敏感读取 → 外部发送”“写脚本 → 执行脚本”等跨步骤风险链。',
            '人工确认：决策分为 allow / ask / deny，ask 可自动拒绝、自动允许或交互确认。',
            '结果审查与脱敏：检查工具返回内容中的密钥、密码、token 等敏感信息。',
            '审计留证：以 JSONL 记录工具调用事件、网关决策、执行结果和解释，并在 Streamlit Dashboard 中展示指标、告警和风险链。',
          ],
          source: readme('AgentGuard-Chain'),
        },
        {
          id: 'architecture',
          heading: '架构',
          kind: 'implemented',
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
          source: readme('AgentGuard-Chain'),
        },
        {
          id: 'status',
          heading: '当前状态',
          kind: 'status',
          paragraphs: [
            '安全网关、MiniAgent 的脚本与 LLM 两种模式、CoreCoder 受监督的离线回放与真实模式入口、风险解释器和基础 Dashboard 已完成。',
            '脚本化数据集包含 200 个 case、228 次工具调用；65 个单元测试通过。这些数字由仓库 README 自述，本站没有重新运行验证。',
          ],
          source: readme('AgentGuard-Chain'),
        },
      ],
    },
    evoteam: {
      role: '团队项目 · 仓库作者',
      roleNote: '这是团队项目，README 记录了组员与分工；此处只列出仓库作者身份，不代表独立完成。',
      summary:
        '基于 openJiuwen Core 的经验驱动多智能体组织演进系统。平时按当前 Strategy 执行任务，只有重复失败等证据达到阈值时才离线生成候选策略，经独立验证后才改变后续任务默认采用的组织方式。',
      sections: [
        {
          id: 'problem',
          heading: '问题与背景',
          kind: 'context',
          paragraphs: [
            '多智能体团队的角色结构与协作策略通常由开发者固定。EvoTeam 尝试根据跨任务的执行证据，对可版本化的 Strategy 做受约束修改，并要求候选策略通过验证门槛后才能晋升。主场景是复杂项目计划的生成与校验。',
          ],
        },
        {
          id: 'approach',
          heading: '做法',
          kind: 'context',
          paragraphs: [
            '初始 Strategy v0 为 Planner → Executor → Critic，Role Pool 由开发者定义。系统平时执行当前策略；重复失败、性能漂移、成本异常或低贡献证据达到阈值时启动离线演进；策略稳定后进入 STABLE，停止主动探索、继续监控。',
          ],
          pre: `在线执行：Task → Current Strategy → Orchestrator → Team / AgentInstance
         → Run → Evaluator → SealedRun → Experience → StrategyMonitor

离线演进：Trigger → EvolutionManager → Attribution → Mutation → Candidate
         → Validator → Improvement Attribution → Validation Gate
         → Promote / Reject → 后续任务使用已验证的 Strategy`,
          source: readme('EvoTeam'),
        },
        {
          id: 'implemented',
          heading: '已实现',
          kind: 'implemented',
          list: [
            '接入 openJiuwen 0.1.17.post1 的 ReActAgent。',
            '提供 init / run / observe / evolve 入口，SQLite Trace 与快照。',
            '重复失败监控；Prompt 修改与新增 Verifier 两类候选，以及多候选比较。',
            '已用 DeepSeek 完成复杂任务、有界返工和多候选真实 Gate Reject 回归。',
          ],
          source: readme('EvoTeam'),
        },
        {
          id: 'planned',
          heading: '尚未完成',
          kind: 'planned',
          list: [
            '漂移、成本与贡献监控。',
            'Tool / Skill Policy 与更通用的结构 Mutation。',
            '实验阈值仍需基线校准。',
          ],
          source: readme('EvoTeam'),
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
  repositories: {
    'agentguard-chain': { summary: '面向 LLM Agent 的工具调用越权风险评估与行为链检测框架。' },
    evoteam: { summary: '基于 openJiuwen Core 的自演进多智能体组织系统。' },
    pinnote: { summary: '跨 Windows / macOS 的极简贴屏 Markdown 便签，支持快捷键呼出与导出。' },
    'multi-tenant-crm-builder': { summary: '把散落在 Excel 中的业务流程变成带账号、权限和统计的在线 CRM。' },
    mars: { summary: '基于飞书群聊的 Agent 记忆管理引擎（本地 MVP）。' },
    'aigc-detector': { summary: '检测 AIGC 生成内容并做模型溯源。' },
    'paper-reader-skill': { summary: '读懂、讲解、批判论文并沉淀长期笔记的 Agent Skill。' },
    richeditor: { summary: '中国软件杯参赛项目：面向写作、学习和办公的智能富文本编辑器。' },
  },
  experience: {},
  awards: {},
  skillGroups: {
    languages: '编程语言',
    'frontend-desktop': '前端与桌面',
    'backend-data': '后端与数据',
    'agents-prototypes': '智能体与原型',
  },
};
