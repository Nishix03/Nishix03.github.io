/**
 * Textos de la interfaz en inglés (los que no pertenecen a una sola página): título del sitio, menú, botones,
 * etiquetas de accesibilidad y títulos de cada apartado. Los usa el layout en todas las páginas.
 *
 * Concepto: `satisfies` comprueba que un valor cumple un tipo sin cambiar el tipo concreto del valor;
 * aquí asegura que cada entrada del menú tenga una `page` válida (PageKey) y un `label`.
 */
import type { PageKey } from '../types';

export const ui = {
  // Título que aparece en la pestaña del navegador.
  siteTitle: 'Iván Rodas — portfolio',
  // Descripción para buscadores y redes (etiqueta meta description).
  description:
    'Iván Rodas, Systems Engineering student (USAT). Full-stack projects, honest stack, and the road so far.',
  // Usuario público de redes.
  handle: '@Nishix_03',
  // Entradas del menú principal: page (apartado) y label (texto).
  nav: [
    { page: 'about', label: 'About' },
    { page: 'projects', label: 'Projects' },
    { page: 'stack', label: 'Stack' },
    { page: 'journey', label: 'Journey' },
    { page: 'contact', label: 'Contact' },
  ] satisfies { page: PageKey; label: string }[],
  // Texto del botón Volver (con la tecla Esc, ver scripts/keys.ts).
  back: 'Esc Return',
  // Texto alternativo del botón Volver para lectores de pantalla.
  backLabel: 'Return to home',
  // Enlace de accesibilidad "saltar al contenido" para quien navega con teclado.
  skip: 'Skip to content',
  // Nombre accesible del menú principal.
  mainNav: 'Main',
  // Etiqueta del selector de idioma.
  language: 'Language',
  // Texto del botón que abre el menú en móvil.
  menu: 'Menu',
  // Texto del botón de cerrar.
  close: 'Close',
  // Aviso genérico de contenido pendiente.
  comingSoon: 'Coming soon',
  // Aviso para enlaces que aún no existen.
  linkSoon: 'Link coming soon',
  // Enlace para volver a la lista (en móvil).
  backToList: '↑ Back to the list',
  // Palabra para contar hitos ("9 milestones").
  milestones: 'milestones',
  // Rótulo del siguiente hito bloqueado en Journey.
  nextLocked: 'NEXT · LOCKED',
  // Título de la lista de hitos bloqueados.
  nextSteps: 'Next steps',
  // Aviso mientras no hay CV para descargar.
  cvSoon: 'coming soon',
  // Nombre de cada idioma escrito en su propio idioma, para el selector.
  langName: { en: 'English', es: 'Español' },
  // Datos por página: title (título), word (palabra grande decorativa), num (número de apartado).
  // Algunas añaden hint, rank o accent según lo que necesite su diseño.
  pages: {
    about: { title: 'About me', word: 'PERSONA', num: '01' },
    projects: {
      title: 'Projects',
      hint: 'Whose link do you want to view? · rank comes from evidence',
      word: 'SOCIAL LINK',
      num: '02',
      rank: 'RANK',
    },
    stack: { title: 'Stack', word: 'SKILLS', num: '03' },
    journey: { title: 'Journey', word: 'LEVEL', num: '04' },
    contact: { title: 'Let’s build', accent: 'something', word: 'LINK', num: '05' },
  },
};
