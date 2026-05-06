import type { Publication } from '@/types/content';

export const publications: Publication[] = [
  {
    id: 'paper-001',
    title: 'Multimodal Feature Fusion for AIGC Image Detection',
    authors: ['San Zhang', 'Si Li', 'Wu Wang'],
    venue: 'IEEE Transactions on Information Forensics and Security',
    year: '2026',
    type: 'Journal',
    image: '/images/publications/paper-001.png',
    abstract:
      'This paper proposes a multimodal feature fusion method for AIGC image detection that effectively distinguishes real images from AI-generated ones. The method combines frequency domain analysis and semantic feature extraction, achieving state-of-the-art performance on multiple benchmark datasets.',
    tags: ['AIGC Detection', 'Multimodal Fusion', 'Image Forensics'],
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
      'This paper presents AgentGuard, a framework for detecting and defending against attacks targeting LLM-driven autonomous agents. The framework includes behavior monitoring, intent analysis, and security policy enforcement modules.',
    tags: ['AI Agent', 'Security', 'LLM'],
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
    title: 'A Survey on Source Attribution for Text Generation Models',
    authors: ['San Zhang', 'Liu Zhao'],
    venue: 'arXiv Preprint',
    year: '2025',
    type: 'Preprint',
    image: '/images/publications/paper-003.png',
    abstract:
      'This paper provides a comprehensive survey of source attribution techniques for text generation models, covering watermark-based, fingerprint-based, statistical, and neural network-based attribution methods.',
    tags: ['Model Attribution', 'Text Generation', 'Survey'],
    links: {
      paper: 'https://arxiv.org/abs/xxxx.xxxxx',
      pdf: '',
      code: '',
      project: '',
      bibtex: '',
    },
  },
];
