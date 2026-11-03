import type { Milestone } from '../types';
import { diary as diaryEn, platzi as platziEn } from '../en/journey';

export const journeyIntro =
  'Estudios e hitos, en orden. Los bloqueados son el camino que viene, no logros.';

export const education = {
  kicker: 'EDUCACIÓN · EN CURSO',
  title: 'Estudiante de Ingeniería de Sistemas',
  detail: 'USAT · Chiclayo, Perú · 4.º ciclo',
};

export const facts = [
  { n: '17', label: 'cursos aprobados en Platzi' },
  { n: '1', label: 'ruta de aprendizaje completada' },
  { n: '1.º', label: 'puesto en futurX 2026 (equipo)' },
  { n: '6', label: 'prototipos de negocio entregados' },
];

export const milestones: Milestone[] = [
  { date: '2024', label: 'Empecé en Platzi', locked: false },
  { date: 'FEB 2026', label: 'Ruta de Fundamentos Web', locked: false },
  { date: 'ABR 2026', label: 'Introducción al Backend', locked: false },
  { date: 'OCT 2026', label: 'Java, SQL y bases de datos', locked: false },
  { date: 'OCT 2026', label: 'Prototipos de Chiclayo en línea', locked: false },
  { date: 'OCT 2026', label: 'Ganamos futurX 2026', locked: false },
  { date: 'BLOQUEADO', label: 'GastroClinic + backend', locked: true },
  { date: 'BLOQUEADO', label: 'GastroClinic en producción', locked: true },
  { date: 'BLOQUEADO', label: 'GastroClinic + IA', locked: true },
];

export const diary = {
  kicker: 'BITÁCORA · OCT 2026',
  title: 'Ganamos futurX 2026 con LeeContigo IA',
  body: '1.er puesto entre más de 500 participantes de 9 países. 6 PR integrados en el repositorio del equipo: sistema de XP, sonidos, corrección del tutorial y las garantías G1–G5.',
  link: { label: 'Leer la noticia de la USAT ↗', href: diaryEn.link.href },
  learned:
    'Aprendí: me apoyé en Claude para planear qué rama tomaría cada integrante para mejorar las funciones del prototipo, y así trabajamos en paralelo sin pisarnos el código. También aprendí a analizar cómo interactúan las personas con una interfaz pensada para un público o nicho concreto.',
};

export const platzi = {
  url: platziEn.url,
  kicker: 'CERTIFICADOS',
  items: [
    'Platzi Expert+ · estudiante desde 2024',
    '17 cursos aprobados (Escuela de Desarrollo Web)',
    'Ruta completada: Fundamentos de Desarrollo Web Profesional (feb 2026)',
    'Lo último: Java SE: SQL y Bases de Datos, Java, Fundamentos de Bases de Datos y SQL (oct 2026)',
  ],
  cta: 'Ver mi perfil de Platzi ↗',
};
