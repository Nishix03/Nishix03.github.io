/**
 * Datos en inglés de la página "Projects". Cada proyecto es una carta de tarot (estilo Persona 3 Reload).
 * El tipo Project (content/types.ts) define los campos; la versión en español (content/es/projects.ts) reutiliza
 * esta lista y solo reemplaza los textos traducibles.
 */
import type { Project } from '../types';

/**
 * Un proyecto = un arcano del tarot de P3R (plan §14.5). Rank sale de la evidencia, no de la opinión.
 * `Project[]` significa "lista de objetos Project".
 */
export const projects: Project[] = [
  {
    // Campos de cada proyecto: numeral/arcana/arcanaTitle/symbol = la carta de tarot; name y tag = nombre y etiqueta;
    // rank = nivel 1-5 según evidencia; status y type = estado y tipo; screenshot = texto marcador de la captura;
    // description y stack = descripción y tecnologías; cta y href = texto y enlace del botón.
    numeral: 'I',
    arcana: 'MAGICIAN',
    arcanaTitle: 'THE MAGICIAN',
    symbol: 'magician',
    name: 'GastroClinic',
    tag: 'IN DEVELOPMENT · Astro · React · TS',
    rank: 2,
    status: 'IN DEVELOPMENT',
    type: 'WEB APP / CLINIC',
    screenshot: '[Screenshot of the public landing — no patient data]',
    description:
      'Public landing with an appointment manager and an internal panel for a family clinic. Goal: replace a paid SaaS tool with something built to measure. Demo data only, backend in progress.',
    stack: 'Astro 7 · React 19 · TypeScript · Tailwind 4 · GSAP · Motion',
    cta: 'Private repo — screenshots only',
    href: '#',
  },
  {
    numeral: 'II',
    arcana: 'PRIESTESS',
    arcanaTitle: 'THE PRIESTESS',
    symbol: 'priestess',
    name: 'LeeContigo IA',
    tag: 'TEAM · 1ST PLACE futurX 2026',
    rank: 5,
    status: 'LIVE DEMO',
    type: 'AI READING TUTOR / TEAM',
    screenshot: '[Screenshot of the live demo]',
    description:
      '1st place, futurX 2026 (500+ participants, 9 countries). My part: XP and level system, sounds, tutorial fix and e2e guarantees G1–G5, in 6 merged PRs. The AI integration was done by the team.',
    stack: 'Team repo by Alvaro-mendoza-12 · Playwright e2e',
    cta: 'Open live demo ↗',
    href: 'https://lee-contigo-ia.vercel.app',
  },
  {
    numeral: 'III',
    arcana: 'EMPRESS',
    arcanaTitle: 'THE EMPRESS',
    symbol: 'empress',
    name: 'Business prototypes · Chiclayo',
    tag: 'DEMO · 6 INDUSTRIES',
    rank: 3,
    status: 'DEMO',
    type: 'WEB SYSTEM / 6 INDUSTRIES',
    screenshot: '[Contact sheet of the 6 heroes]',
    description:
      '6 industries on one shared core. Each business changes a single schema-validated negocio.json. Keyboard tests, axe and Lighthouse (median of 5).',
    stack: 'Shared core · JSON schema · Playwright · axe · Lighthouse',
    cta: '[Demo URL on GitHub Pages]',
    href: '#',
  },
  {
    numeral: 'IV',
    arcana: 'EMPEROR',
    arcanaTitle: 'THE EMPEROR',
    symbol: 'emperor',
    name: 'Task manager',
    tag: 'OTHER WORK · HTML/CSS/JS',
    rank: 2,
    status: 'GITHUB PAGES',
    type: 'WEB APP / PERSONAL',
    screenshot: '[Screenshot]',
    description: 'Small task manager in plain HTML, CSS and JavaScript.',
    stack: 'HTML · CSS · JavaScript',
    cta: '[Live link]',
    href: '#',
  },
  {
    numeral: 'V',
    arcana: 'HIEROPHANT',
    arcanaTitle: 'THE HIEROPHANT',
    symbol: 'hierophant',
    name: 'Appointment manager',
    tag: 'OTHER WORK · JAVA SWING',
    rank: 2,
    status: 'DESKTOP',
    type: 'DESKTOP APP / PERSONAL',
    screenshot: '[Screenshot]',
    description: 'Desktop appointment manager built with Java Swing.',
    stack: 'Java · Swing',
    cta: '[Repo link]',
    href: '#',
  },
];
