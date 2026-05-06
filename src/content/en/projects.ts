import type { Project } from '@/types/content';

export const projects: Project[] = [
  {
    id: 'project-001',
    title: 'AI Content Detection Platform',
    subtitle: 'Online detection and analysis system for AIGC content',
    image: '/images/projects/project-001.png',
    description:
      'A web-based AIGC content detection platform supporting AI-generated content identification for images and text. Built with a decoupled frontend-backend architecture using React and FastAPI, integrating multiple detection models.',
    techStack: ['React', 'FastAPI', 'PyTorch', 'Tailwind CSS', 'PostgreSQL'],
    status: 'In Progress',
    year: '2026',
    links: {
      demo: 'https://demo.example.com',
      github: 'https://github.com/yourname/aigc-detector',
      detail: '/projects/project-001',
    },
  },
  {
    id: 'project-002',
    title: 'AgentSec Evaluation Toolkit',
    subtitle: 'Automated security evaluation framework for LLM Agents',
    image: '/images/projects/project-002.png',
    description:
      'A toolkit for evaluating the security of LLM-driven agents, including prompt injection detection, privilege escalation testing, and data leakage detection modules.',
    techStack: ['Python', 'LangChain', 'OpenAI API', 'Docker'],
    status: 'Completed',
    year: '2025',
    links: {
      demo: '',
      github: 'https://github.com/yourname/agentsec-toolkit',
      detail: '/projects/project-002',
    },
  },
  {
    id: 'project-003',
    title: 'Academic Homepage Generator',
    subtitle: 'Personal academic homepage template for researchers',
    image: '/images/projects/project-003.png',
    description:
      'A personal academic homepage template built with React + Tailwind CSS, supporting bilingual switching, dark mode, and responsive layout.',
    techStack: ['React', 'TypeScript', 'Tailwind CSS', 'Vite'],
    status: 'Completed',
    year: '2026',
    links: {
      demo: '',
      github: '',
      detail: '/projects/project-003',
    },
  },
];
