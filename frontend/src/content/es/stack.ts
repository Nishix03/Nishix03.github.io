/**
 * Textos en español del apartado "Stack". Las tecnologías, rangos y porcentajes vienen del inglés (que ya
 * valida los topes); aquí solo se traduce el texto de evidencia y la introducción.
 */
import type { Technology } from '../types';
import { stack as stackEn } from '../en/stack';

// Toma cada tecnología en inglés y reemplaza su evidencia. `evidence[tech.id] ?? tech.evidence` significa
// "la traducción si existe; si no, el texto original" (?? es el operador de valor por defecto).
// Introducción en español de las reglas de rangos.
export const stackIntro =
  'El dominio es una autoevaluación con tope según la evidencia: RANGO 1 (curso) ≤ 30 % · RANGO 2 (proyecto personal) ≤ 45 % · RANGO 3 (entregado) ≤ 60 % · RANGO 4 (producción) ≤ 75 % · RANGO 5 (equipo o premio) ≤ 85 %. Soy estudiante: nada está al 100 %.';

// Mismas tecnologías, rangos y porcentajes que en inglés; solo se traduce la evidencia.
// Diccionario id de tecnología -> evidencia traducida.
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
