import type { Technology } from '../types';
import { stack as stackEn } from '../en/stack';

export const stackIntro =
  'Tecnologías que utilizo en mi formación y en mis proyectos. Los porcentajes son una autoevaluación de mi experiencia práctica, respaldada por los cursos y trabajos indicados en cada tarjeta. Los niveles van de R1 (formación) a R5 (proyectos de equipo o premiados).';

// Mismas tecnologías, rangos y porcentajes que en inglés; solo se traduce la evidencia.
const evidence: Record<string, string> = {
  html: '2 cursos · Chiclayo, gestor de tareas',
  css: '2 cursos · Chiclayo, gestor de tareas',
  javascript: '3 cursos · Chiclayo, gestor de tareas',
  git: '1 curso · 6 PR integrados en equipo',
  playwright: 'e2e de LeeContigo (equipo) · Chiclayo',
  java: '2 cursos · app en Swing',
  sql: '2 cursos',
  typescript: 'GastroClinic (en desarrollo)',
  astro: 'GastroClinic (en desarrollo)',
  react: 'GastroClinic (en desarrollo)',
  tailwind: 'GastroClinic (en desarrollo)',
  gsap: 'GastroClinic (en desarrollo)',
  'claude-code': 'Prototipos de Chiclayo · este portafolio',
  codex: 'Sprites y revisiones de código de este portafolio',
};

export const stack: Technology[] = stackEn.map((tech) => ({
  ...tech,
  evidence: evidence[tech.id] ?? tech.evidence,
}));
