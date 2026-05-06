import type { CV } from '@/types/content';

export const cv: CV = {
  summary:
    '计算机科学硕士研究生，研究方向为可信 AI 与 AIGC 内容检测。具有扎实的深度学习和系统开发能力，发表学术论文多篇，参与多个 AI 安全相关工程项目。',
  education: [
    {
      title: '硕士研究生 · 计算机科学与技术',
      organization: 'XX 大学',
      location: '中国 · 北京',
      start: '2024',
      end: '至今',
      description: ['研究方向：可信 AI、AIGC 检测、AI Agent 安全'],
      tags: [],
    },
    {
      title: '本科 · 计算机科学与技术',
      organization: 'XX 大学',
      location: '中国 · 北京',
      start: '2020',
      end: '2024',
      description: ['GPA: 3.8/4.0，获国家奖学金'],
      tags: [],
    },
  ],
  research: [
    {
      title: '研究助理',
      organization: 'XX 实验室',
      location: '中国 · 北京',
      start: '2024',
      end: '至今',
      description: ['可信 AI 与 AIGC 检测研究'],
      tags: [],
    },
  ],
  projects: [
    {
      title: 'AI 内容检测平台',
      description: '面向 AIGC 内容的在线检测与分析系统。',
      techStack: ['React', 'FastAPI', 'PyTorch'],
    },
    {
      title: 'AgentSec 评估工具箱',
      description: 'LLM Agent 安全性自动化评估框架。',
      techStack: ['Python', 'LangChain', 'Docker'],
    },
  ],
  skills: [
    'Python',
    'PyTorch',
    'TensorFlow',
    'React',
    'TypeScript',
    'FastAPI',
    'Docker',
    'Git',
    'LaTeX',
  ],
  downloadUrl: '/cv.pdf',
};
