import type { SkillGroup } from '../types';

// Skills listed only where a public project or repository uses them (tech stacks in
// projects.ts, languages in repositories.ts). No proficiency levels or percentages.
export const skills: SkillGroup[] = [
  {
    id: 'languages',
    skills: [
      { id: 'python', name: 'Python', projectIds: ['agentguard-chain', 'evoteam', 'mars', 'aigc-detector', 'paper-reader-skill'] },
      { id: 'typescript', name: 'TypeScript', projectIds: ['pinnote', 'multi-tenant-crm-builder'] },
      { id: 'rust', name: 'Rust', projectIds: ['pinnote'] },
    ],
  },
  {
    id: 'frontend-desktop',
    skills: [
      { id: 'svelte', name: 'Svelte 5', projectIds: ['pinnote'] },
      { id: 'tauri', name: 'Tauri 2', projectIds: ['pinnote'] },
      { id: 'vue', name: 'Vue 3', projectIds: ['richeditor'] },
      { id: 'tiptap', name: 'Tiptap', projectIds: ['richeditor'] },
      { id: 'nextjs', name: 'Next.js', projectIds: ['multi-tenant-crm-builder'] },
      { id: 'streamlit', name: 'Streamlit', projectIds: ['agentguard-chain'] },
    ],
  },
  {
    id: 'backend-data',
    skills: [
      { id: 'fastapi', name: 'FastAPI', projectIds: ['mars'] },
      { id: 'nestjs', name: 'NestJS', projectIds: ['multi-tenant-crm-builder'] },
      { id: 'flask', name: 'Flask', projectIds: ['richeditor'] },
      { id: 'pydantic', name: 'Pydantic', projectIds: ['evoteam', 'mars'] },
      { id: 'prisma', name: 'Prisma', projectIds: ['multi-tenant-crm-builder'] },
      { id: 'postgresql', name: 'PostgreSQL', projectIds: ['multi-tenant-crm-builder'] },
      { id: 'sqlite', name: 'SQLite', projectIds: ['evoteam', 'mars'] },
      { id: 'mongodb', name: 'MongoDB', projectIds: ['richeditor'] },
    ],
  },
  {
    id: 'agents-prototypes',
    skills: [
      { id: 'openjiuwen', name: 'openJiuwen Core', projectIds: ['evoteam'] },
      { id: 'agent-skill', name: 'Agent Skill', projectIds: ['paper-reader-skill'] },
      { id: 'react-agent', name: 'ReAct Agent', projectIds: ['evoteam'] },
    ],
  },
];
