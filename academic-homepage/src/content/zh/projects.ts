import type { Project } from '@/types/content';

export const projects: Project[] = [
  {
    id: 'project-001',
    title: 'AI 内容检测平台',
    subtitle: '面向 AIGC 内容的在线检测与分析系统',
    image: '/images/projects/project-001.png',
    description:
      '一个基于 Web 的 AIGC 内容检测平台，支持图像和文本的 AI 生成内容识别。系统采用前后端分离架构，前端使用 React，后端使用 FastAPI，集成多种检测模型。',
    techStack: ['React', 'FastAPI', 'PyTorch', 'Tailwind CSS', 'PostgreSQL'],
    status: '开发中',
    year: '2026',
    links: {
      demo: 'https://demo.example.com',
      github: 'https://github.com/yourname/aigc-detector',
      detail: '/projects/project-001',
    },
  },
  {
    id: 'project-002',
    title: 'AgentSec 评估工具箱',
    subtitle: 'LLM Agent 安全性自动化评估框架',
    image: '/images/projects/project-002.png',
    description:
      '一套用于评估 LLM 驱动智能体安全性的工具箱，包含提示注入检测、权限逃逸测试、数据泄露检测等功能模块。支持自定义测试用例和批量评估。',
    techStack: ['Python', 'LangChain', 'OpenAI API', 'Docker'],
    status: '已完成',
    year: '2025',
    links: {
      demo: '',
      github: 'https://github.com/yourname/agentsec-toolkit',
      detail: '/projects/project-002',
    },
  },
  {
    id: 'project-003',
    title: '学术主页生成器',
    subtitle: '面向研究人员的个人学术主页模板',
    image: '/images/projects/project-003.png',
    description:
      '基于 React + Tailwind CSS 的个人学术主页模板，支持中英文切换、暗色模式、响应式布局。用户只需修改配置文件即可完成内容维护。',
    techStack: ['React', 'TypeScript', 'Tailwind CSS', 'Vite'],
    status: '已完成',
    year: '2026',
    links: {
      demo: '',
      github: '',
      detail: '/projects/project-003',
    },
  },
];
