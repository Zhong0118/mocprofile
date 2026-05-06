import type { Publication } from '@/types/content';

export const publications: Publication[] = [
  {
    id: 'paper-001',
    title: '基于多模态特征融合的 AIGC 图像检测方法',
    authors: ['张三', '李四', '王五'],
    venue: 'IEEE Transactions on Information Forensics and Security',
    year: '2026',
    type: 'Journal',
    image: '/images/publications/paper-001.png',
    abstract:
      '本文提出了一种基于多模态特征融合的 AIGC 图像检测方法，能够有效区分真实图像与 AI 生成图像。该方法结合频域分析和语义特征提取，在多个基准数据集上取得了最优性能。实验结果表明，该方法在跨域泛化能力方面优于现有方法。',
    tags: ['AIGC 检测', '多模态融合', '图像取证'],
    links: {
      paper: 'https://example.com/paper-001',
      pdf: '',
      code: 'https://github.com/yourname/aigc-detection',
      project: '',
      bibtex: '@article{zhang2026aigc, title={...}, author={Zhang et al.}, journal={IEEE TIFS}, year={2026}}',
    },
  },
  {
    id: 'paper-002',
    title: 'AgentGuard: A Framework for Securing LLM-based Autonomous Agents',
    authors: ['San Zhang', 'Si Li', 'Wu Wang'],
    venue: 'ACM Conference on Computer and Communications Security (CCS)',
    year: '2025',
    type: 'Conference',
    image: '/images/publications/paper-002.png',
    abstract:
      '本文提出了 AgentGuard 框架，用于检测和防御针对 LLM 驱动自主智能体的攻击。框架包含行为监控、意图分析和安全策略执行三个核心模块，能够在运行时识别潜在的提示注入、越权操作和数据泄露等安全威胁。',
    tags: ['AI Agent', '安全', 'LLM'],
    links: {
      paper: 'https://example.com/paper-002',
      pdf: 'https://example.com/paper-002.pdf',
      code: '',
      project: '',
      bibtex: '',
    },
  },
  {
    id: 'paper-003',
    title: '面向文本生成模型的溯源与归因技术综述',
    authors: ['张三', '赵六'],
    venue: 'arXiv Preprint',
    year: '2025',
    type: 'Preprint',
    image: '/images/publications/paper-003.png',
    abstract:
      '本文系统综述了文本生成模型溯源与归因领域的研究进展，涵盖了基于水印、指纹、统计特征和神经网络的归因方法。文章分析了各类方法的优缺点，讨论了该领域面临的关键挑战，并展望了未来研究方向。',
    tags: ['模型溯源', '文本生成', '综述'],
    links: {
      paper: 'https://arxiv.org/abs/xxxx.xxxxx',
      pdf: '',
      code: '',
      project: '',
      bibtex: '',
    },
  },
];
