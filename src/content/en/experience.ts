import type { Experience } from '@/types/content';

export const experience: Experience[] = [
  {
    title: 'M.S. Student',
    organization: 'XX University · School of Computer Science',
    location: 'Beijing, China',
    start: '2024',
    end: 'Present',
    description: [
      'Research: Trustworthy AI, AIGC Detection, AI Agent Security.',
      'Participated in national research projects, published 3 papers.',
      'Developed multiple AI security engineering systems.',
    ],
    tags: ['Research', 'AI Safety', 'AIGC'],
  },
  {
    title: 'B.S. Student',
    organization: 'XX University · School of Computer Science',
    location: 'Beijing, China',
    start: '2020',
    end: '2024',
    description: [
      'Major: Computer Science and Technology, GPA 3.8/4.0.',
      'Thesis: Deep Learning-based AI Generated Content Detection.',
      'Won multiple competition awards and scholarships.',
    ],
    tags: ['Study', 'Competition', 'Deep Learning'],
  },
  {
    title: 'Research Intern',
    organization: 'XX Tech · AI Security Lab',
    location: 'Shanghai, China',
    start: 'Jun 2023',
    end: 'Sep 2023',
    description: [
      'Participated in LLM security evaluation project.',
      'Developed prompt injection detection module.',
      'Authored technical reports and patent applications.',
    ],
    tags: ['Internship', 'LLM', 'Security Evaluation'],
  },
];
