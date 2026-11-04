/**
 * Textos en español de la página "Proyectos". No repite la lista completa: toma los proyectos en inglés y
 * les superpone los textos traducidos.
 */
import type { Project } from '../types';
import { projects as projectsEn } from '../en/projects';

// Mismos proyectos que en inglés (numeral, arcano, rango, enlaces); aquí solo cambia el texto.
// Diccionario cuya clave es el numeral romano del proyecto (I, II...) y cuyo valor es un Project parcial
// (`Partial<Project>`: solo los campos que cambian). Si un campo no aparece aquí se queda el del inglés.
const es: Record<string, Partial<Project>> = {
  I: {
    tag: 'EN DESARROLLO · Astro · React · TS',
    status: 'EN DESARROLLO',
    type: 'APP WEB / CLÍNICA',
    screenshot: '[Captura de la landing pública, sin datos de pacientes]',
    description:
      'Landing pública con gestor de citas y un panel interno para una clínica familiar. Objetivo: reemplazar una herramienta SaaS de pago por algo hecho a medida. Solo datos de demostración; el backend está en progreso.',
    cta: 'Repositorio privado: solo capturas',
  },
  II: {
    tag: 'EQUIPO · 1.er PUESTO futurX 2026',
    status: 'DEMO EN VIVO',
    type: 'TUTOR DE LECTURA CON IA / EQUIPO',
    screenshot: '[Captura de la demo en vivo]',
    description:
      '1.er puesto en futurX 2026 (más de 500 participantes, 9 países). Mi parte: sistema de XP y niveles, sonidos, la corrección del tutorial y las garantías e2e G1–G5, en 6 PR integrados. La integración de IA la hizo el equipo.',
    stack: 'Repositorio del equipo de Alvaro-mendoza-12 · Playwright e2e',
    cta: 'Abrir la demo ↗',
  },
  III: {
    name: 'Prototipos de negocios · Chiclayo',
    tag: 'DEMO · 6 RUBROS',
    type: 'SISTEMA WEB / 6 RUBROS',
    screenshot: '[Hoja de contacto de los 6 héroes]',
    description:
      '6 rubros sobre un mismo núcleo. Cada negocio cambia un único negocio.json validado con un esquema. Pruebas con teclado, axe y Lighthouse (mediana de 5).',
    stack: 'Núcleo compartido · esquema JSON · Playwright · axe · Lighthouse',
    cta: '[URL de la demo en GitHub Pages]',
  },
  IV: {
    name: 'Gestor de tareas',
    tag: 'OTROS TRABAJOS · HTML/CSS/JS',
    type: 'APP WEB / PERSONAL',
    screenshot: '[Captura]',
    description: 'Pequeño gestor de tareas en HTML, CSS y JavaScript puro.',
    cta: '[Enlace en vivo]',
  },
  V: {
    name: 'Gestor de citas',
    tag: 'OTROS TRABAJOS · JAVA SWING',
    status: 'ESCRITORIO',
    type: 'APP DE ESCRITORIO / PERSONAL',
    screenshot: '[Captura]',
    description: 'Gestor de citas de escritorio hecho con Java Swing.',
    cta: '[Enlace al repositorio]',
  },
};

// map() recorre los proyectos en inglés y, para cada uno, mezcla (spread) los textos de `es` usando su
// numeral como clave.
export const projects: Project[] = projectsEn.map((project) => ({ ...project, ...es[project.numeral] }));
