import type { Technology } from '../types';

/**
 * Regla de honestidad (plan §16.4): el porcentaje es autoevaluación y nunca pasa del tope de su RANK.
 * R1 curso ≤ 30 · R2 proyecto personal ≤ 45 · R3 entregado ≤ 60 · R4 producción ≤ 75 · R5 equipo o premio ≤ 85.
 */
export const rankCaps = { 1: 30, 2: 45, 3: 60, 4: 75, 5: 85 } as const;

export const stackIntro =
  "Mastery is self-assessed and capped by evidence: RANK 1 (course) ≤ 30% · RANK 2 (personal project) ≤ 45% · RANK 3 (shipped) ≤ 60% · RANK 4 (production) ≤ 75% · RANK 5 (team or award) ≤ 85%. I'm a student: nothing is at 100%.";

const tech = (
  id: string,
  name: string,
  code: string,
  background: string,
  foreground: string,
  rank: Technology['rank'],
  percent: number,
  evidence: string,
): Technology => {
  if (percent > rankCaps[rank]) {
    throw new Error(`${name}: ${percent}% supera el tope de RANK ${rank} (${rankCaps[rank]}%)`);
  }
  return { id, name, code, background, foreground, rank, percent, evidence };
};

export const stack: Technology[] = [
  tech('html', 'HTML', 'H5', '#e44d26', '#ffffff', 3, 55, '2 courses · Chiclayo, task manager'),
  tech('css', 'CSS', 'C3', '#2965f1', '#ffffff', 3, 55, '2 courses · Chiclayo, task manager'),
  tech(
    'javascript',
    'JavaScript',
    'JS',
    '#f7df1e',
    '#0b1a12',
    3,
    45,
    '3 courses · Chiclayo, task manager',
  ),
  tech('git', 'Git & GitHub', 'GT', '#f05032', '#ffffff', 5, 50, '1 course · 6 merged team PRs'),
  tech(
    'playwright',
    'Playwright',
    'PW',
    '#2ead33',
    '#ffffff',
    5,
    35,
    'LeeContigo e2e (team) · Chiclayo',
  ),
  tech('java', 'Java', 'JV', '#e76f00', '#ffffff', 2, 35, '2 courses · Swing app'),
  tech('sql', 'SQL', 'SQ', '#336791', '#ffffff', 1, 25, '2 courses'),
  tech(
    'typescript',
    'TypeScript',
    'TS',
    '#3178c6',
    '#ffffff',
    2,
    25,
    'GastroClinic (in development)',
  ),
  tech('astro', 'Astro', 'AS', '#ff5d01', '#ffffff', 2, 25, 'GastroClinic (in development)'),
  tech('react', 'React', 'RE', '#61dafb', '#0b1a12', 2, 25, 'GastroClinic (in development)'),
  tech(
    'tailwind',
    'Tailwind CSS',
    'TW',
    '#38bdf8',
    '#0b1a12',
    2,
    30,
    'GastroClinic (in development)',
  ),
  tech('gsap', 'GSAP', 'GS', '#88ce02', '#0b1a12', 2, 20, 'GastroClinic (in development)'),
  tech(
    'claude-code',
    'Claude Code',
    'CC',
    '#d97757',
    '#ffffff',
    3,
    50,
    'Chiclayo prototypes · this portfolio',
  ),
  tech('codex', 'Codex', 'CX', '#10141a', '#f2fff7', 1, 20, 'Sprites and code reviews for this portfolio'),
];
