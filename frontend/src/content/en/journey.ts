import type { Milestone } from '../types';

export const journeyIntro =
  'My education, projects and learning milestones. The timeline separates completed achievements from upcoming goals, which are marked as locked.';

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
  body: 'Our team placed first among more than 500 participants from 9 countries. I contributed the points and level system, sounds, a tutorial fix and automated tests of user flows, through six contributions merged into the team repository.',
  link: {
    label: 'Read the USAT news ↗',
    href: 'https://www.usat.edu.pe/noticias/estudiantes-de-ingenieria-de-sistemas-y-computacion-usat-obtienen-el-primer-lugar-en-la-hackathon-futurx-2026/',
  },
  learned:
    'I learned to organize development across separate branches, using Claude to help plan tasks and support parallel work. I also gained experience analyzing how people use an interface designed around their needs.',
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
