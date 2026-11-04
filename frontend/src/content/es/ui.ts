/**
 * Textos de la interfaz en español: misma estructura y campos que content/en/ui.ts (menú, botones, etiquetas
 * de accesibilidad y títulos de cada apartado), con el texto traducido.
 * Si falta un campo respecto al inglés, TypeScript lo avisa gracias al tipo en content/index.ts.
 */
import type { PageKey } from '../types';

export const ui = {
  siteTitle: 'Iván Rodas — portafolio',
  description:
    'Iván Rodas, estudiante de Ingeniería de Sistemas (USAT). Proyectos full-stack, un stack honesto y el camino recorrido.',
  handle: '@Nishix_03',
  nav: [
    { page: 'about', label: 'Sobre mí' },
    { page: 'projects', label: 'Proyectos' },
    { page: 'stack', label: 'Stack' },
    { page: 'journey', label: 'Trayectoria' },
    { page: 'contact', label: 'Contacto' },
  ] satisfies { page: PageKey; label: string }[],
  back: 'Esc Volver',
  backLabel: 'Volver al inicio',
  skip: 'Saltar al contenido',
  mainNav: 'Principal',
  language: 'Idioma',
  menu: 'Menú',
  close: 'Cerrar',
  comingSoon: 'Próximamente',
  linkSoon: 'Enlace próximamente',
  backToList: '↑ Volver a la lista',
  milestones: 'hitos',
  nextLocked: 'SIGUIENTE · BLOQUEADO',
  nextSteps: 'Siguientes pasos',
  cvSoon: 'próximamente',
  langName: { en: 'English', es: 'Español' },
  pages: {
    about: { title: 'Sobre mí', word: 'PERSONA', num: '01' },
    projects: {
      title: 'Proyectos',
      hint: '¿Qué vínculo quieres ver? · el rango sale de la evidencia',
      word: 'SOCIAL LINK',
      num: '02',
      rank: 'RANGO',
    },
    stack: { title: 'Stack', word: 'SKILLS', num: '03' },
    journey: { title: 'Trayectoria', word: 'LEVEL', num: '04' },
    contact: { title: 'Construyamos', accent: 'algo', word: 'LINK', num: '05' },
  },
};
