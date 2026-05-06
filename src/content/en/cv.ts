import type { CV } from '@/types/content';

export const cv: CV = {
  summary:
    'M.S. student in Computer Science, focusing on Trustworthy AI and AIGC content detection. Strong skills in deep learning and system development, with multiple publications and AI security engineering projects.',
  education: [
    {
      title: 'M.S. in Computer Science',
      organization: 'XX University',
      location: 'Beijing, China',
      start: '2024',
      end: 'Present',
      description: ['Research: Trustworthy AI, AIGC Detection, AI Agent Security'],
      tags: [],
    },
    {
      title: 'B.S. in Computer Science',
      organization: 'XX University',
      location: 'Beijing, China',
      start: '2020',
      end: '2024',
      description: ['GPA: 3.8/4.0, National Scholarship recipient'],
      tags: [],
    },
  ],
  research: [
    {
      title: 'Research Assistant',
      organization: 'XX Lab',
      location: 'Beijing, China',
      start: '2024',
      end: 'Present',
      description: ['Trustworthy AI and AIGC Detection research'],
      tags: [],
    },
  ],
  projects: [
    {
      title: 'AI Content Detection Platform',
      description: 'Online detection and analysis system for AIGC content.',
      techStack: ['React', 'FastAPI', 'PyTorch'],
    },
    {
      title: 'AgentSec Evaluation Toolkit',
      description: 'Automated security evaluation framework for LLM Agents.',
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
