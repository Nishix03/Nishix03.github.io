import type { Milestone } from '../types';

export const journeyIntro =
  'Studies and milestones, in order. Locked ones are the road ahead, not achievements.';

export const education = {
  kicker: 'EDUCATION · IN PROGRESS',
  title: 'Systems Engineering student',
  detail: 'USAT · Chiclayo, Perú · 4th semester',
};

export const facts = [
  { n: '17', label: 'Platzi courses passed' },
  { n: '1', label: 'learning path completed' },
  { n: '1st', label: 'place at futurX 2026 (team)' },
  { n: '6', label: 'industry prototypes shipped' },
];

export const milestones: Milestone[] = [
  { date: '2024', label: 'Started on Platzi', locked: false },
  { date: 'FEB 2026', label: 'Web Fundamentals path', locked: false },
  { date: 'APR 2026', label: 'Intro to Backend', locked: false },
  { date: 'OCT 2026', label: 'Java, SQL & databases', locked: false },
  { date: 'OCT 2026', label: 'Chiclayo prototypes live', locked: false },
  { date: 'OCT 2026', label: 'Won futurX 2026', locked: false },
  { date: 'LOCKED', label: 'GastroClinic + backend', locked: true },
  { date: 'LOCKED', label: 'GastroClinic in production', locked: true },
  { date: 'LOCKED', label: 'GastroClinic + AI', locked: true },
];

export const diary = {
  kicker: 'EXPEDITION LOG · OCT 2026',
  title: 'Won futurX 2026 with LeeContigo IA',
  body: '1st place out of 500+ participants from 9 countries. 6 merged PRs on the team repo: XP system, sounds, tutorial fix and the G1–G5 guarantees.',
  link: {
    label: 'Read the USAT news ↗',
    href: 'https://www.usat.edu.pe/noticias/estudiantes-de-ingenieria-de-sistemas-y-computacion-usat-obtienen-el-primer-lugar-en-la-hackathon-futurx-2026/',
  },
  learned:
    'Learned: I leaned on Claude to plan which branch each teammate would own to improve the prototype’s features, so we could work in parallel without stepping on each other’s code. I also learned to analyze how people interact with an interface built for a specific audience or niche.',
};

export const platzi = {
  url: 'https://platzi.com/p/ivannishix/',
  kicker: 'CERTIFICATES',
  items: [
    'Platzi Expert+ · student since 2024',
    '17 courses passed (Web Development school)',
    'Path completed: Professional Web Development Fundamentals (Feb 2026)',
    'Latest: Java SE: SQL and Databases, Java, Databases and SQL Fundamentals (Oct 2026)',
  ],
  cta: 'View my Platzi profile ↗',
};
