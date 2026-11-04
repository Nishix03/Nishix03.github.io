import { navigate } from 'astro:transitions/client';

/**
 * Teclado de la interfaz (plan §10.2):
 *  - ↑ ↓ mueven el foco entre las opciones de un grupo [data-arrow-nav] (y entran al grupo principal
 *    si el foco está fuera); el foco ya las selecciona y Enter las confirma.
 *  - Esc vuelve al inicio desde cualquier apartado (si no hay un diálogo abierto que lo use).
 */
export const initKeys = () => {
  document.addEventListener('keydown', (event) => {
    if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return;

    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      const target = event.target as HTMLElement;
      if (target.closest('input, textarea, select, [contenteditable]')) return;
      // Con el foco en un grupo se mueve dentro de él; si no, se entra al grupo principal de la página
      // (menú del Hero, proyectos o contactos) por su opción elegida. Enter la confirma (enlace o botón).
      const group =
        target.closest<HTMLElement>('[data-arrow-nav]') ??
        [...document.querySelectorAll<HTMLElement>('main [data-arrow-nav]')].find((g) => g.offsetParent);
      if (!group) return;
      const items = [...group.querySelectorAll<HTMLElement>('[data-select-item]')];
      const current = items.indexOf(document.activeElement as HTMLElement);
      event.preventDefault();
      if (current === -1) {
        const chosen = items.find((i) => i.dataset.sel === 'true' || i.getAttribute('aria-pressed') === 'true');
        (chosen ?? items[0])?.focus();
        return;
      }
      const step = event.key === 'ArrowDown' ? 1 : -1;
      items[(current + step + items.length) % items.length].focus();
      return;
    }

    // Esc vuelve al inicio del idioma actual (/ o /es/).
    const home = location.pathname === '/es' || location.pathname.startsWith('/es/') ? '/es/' : '/';
    if (event.key === 'Escape' && location.pathname !== home) {
      const typing = (event.target as HTMLElement).matches('input, textarea');
      if (!typing) navigate(home);
    }
  });
};
