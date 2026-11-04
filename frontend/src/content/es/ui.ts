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
      hint: 'Proyectos personales y en equipo. Selecciona uno para conocer su objetivo, mi participación y las tecnologías utilizadas.',
      word: 'SOCIAL LINK',
      num: '02',
      rank: 'RANGO',
    },
    stack: { title: 'Stack', word: 'SKILLS', num: '03' },
    journey: { title: 'Trayectoria', word: 'LEVEL', num: '04' },
    contact: { title: 'Construyamos', accent: 'algo', word: 'LINK', num: '05' },
  },
};
