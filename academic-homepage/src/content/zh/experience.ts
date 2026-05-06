import type { Experience } from '@/types/content';

export const experience: Experience[] = [
  {
    title: '硕士研究生',
    organization: 'XX 大学 · 计算机科学与技术学院',
    location: '中国 · 北京',
    start: '2024',
    end: '至今',
    description: [
      '研究方向：可信 AI、AIGC 检测、AI Agent 安全。',
      '参与国家级科研项目，发表学术论文 3 篇。',
      '开发多个 AI 安全相关工程系统。',
    ],
    tags: ['研究', 'AI 安全', 'AIGC'],
  },
  {
    title: '本科生',
    organization: 'XX 大学 · 计算机科学与技术学院',
    location: '中国 · 北京',
    start: '2020',
    end: '2024',
    description: [
      '主修计算机科学与技术，GPA 3.8/4.0。',
      '本科毕业论文：基于深度学习的 AI 生成内容检测。',
      '获得多项竞赛奖项和奖学金。',
    ],
    tags: ['学习', '竞赛', '深度学习'],
  },
  {
    title: '研究实习生',
    organization: 'XX 科技公司 · AI 安全实验室',
    location: '中国 · 上海',
    start: '2023.06',
    end: '2023.09',
    description: [
      '参与 LLM 安全评估项目。',
      '开发提示注入检测模块。',
      '撰写技术报告和专利申请。',
    ],
    tags: ['实习', 'LLM', '安全评估'],
  },
];
