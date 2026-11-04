/**
 * Textos en inglés de la página "Journey" (trayectoria): estudios, cifras, línea de tiempo de hitos, bitácora
 * de la expedición reciente y certificados de Platzi.
 *
 * Los hitos usan el tipo Milestone (content/types.ts). Los bloqueados (`locked: true`) son objetivos futuros.
 */
import type { Milestone } from '../types';

// Frase de introducción de la página.
export const journeyIntro =
  'Studies and milestones, in order. Locked ones are the road ahead, not achievements.';

// Tarjeta de estudios actuales: kicker (rótulo), title y detail.
export const education = {
  kicker: 'EDUCATION · IN PROGRESS',
  title: 'Systems Engineering student',
  detail: 'USAT · Chiclayo, Perú · 4th semester',
};

// Cifras destacadas: n es el número (como texto, por ejemplo "1st") y label su explicación.
export const facts = [
  { n: '17', label: 'Platzi courses passed' },
  { n: '1', label: 'learning path completed' },
  { n: '1st', label: 'place at futurX 2026 (team)' },
  { n: '6', label: 'industry prototypes shipped' },
];

// Línea de tiempo en orden. date es la fecha mostrada; locked indica si aún no se logra.
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

// Entrada principal de la bitácora (el último logro destacado).
export const diary = {
  // Rótulo pequeño sobre el título.
  kicker: 'EXPEDITION LOG · OCT 2026',
  title: 'Won futurX 2026 with LeeContigo IA',
  // Texto principal de la entrada.
  body: '1st place out of 500+ participants from 9 countries. 6 merged PRs on the team repo: XP system, sounds, tutorial fix and the G1–G5 guarantees.',
  // Enlace a la noticia: label (texto) y href (URL).
  link: {
    label: 'Read the USAT news ↗',
    href: 'https://www.usat.edu.pe/noticias/estudiantes-de-ingenieria-de-sistemas-y-computacion-usat-obtienen-el-primer-lugar-en-la-hackathon-futurx-2026/',
  },
  // Lo que aprendí con esta experiencia.
  learned:
    'Learned: I leaned on Claude to plan which branch each teammate would own to improve the prototype’s features, so we could work in parallel without stepping on each other’s code. I also learned to analyze how people interact with an interface built for a specific audience or niche.',
};

// Bloque de certificados: url del perfil, kicker (rótulo), items (lista) y cta (texto del enlace).
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
