import type { Award } from '@/types/content';

export const awards: Award[] = [
  {
    title: '国家奖学金',
    organization: '教育部',
    year: '2023',
    description: '本科期间学业成绩和科研表现优异，获得国家奖学金。',
    level: '国家级',
  },
  {
    title: '全国大学生信息安全竞赛一等奖',
    organization: '教育部高等学校信息安全类专业教学指导委员会',
    year: '2023',
    description: '参赛项目：基于多模态特征的 AIGC 内容检测系统。',
    level: '国家级',
  },
  {
    title: '优秀毕业论文',
    organization: 'XX 大学',
    year: '2024',
    description: '本科毕业论文获评校级优秀毕业论文。',
    level: '校级',
  },
];
