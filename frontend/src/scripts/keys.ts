import { navigate } from 'astro:transitions/client';

/**
 * Teclado de la interfaz (plan §10.2):
 *  - ↑ ↓ mueven el foco entre las opciones de un grupo [data-arrow-nav]; el foco ya las selecciona.
 *  - Esc vuelve al inicio desde cualquier apartado (si no hay un diálogo abierto que lo use).
 */
export const initKeys = () => {
  document.addEventListener('keydown', (event) => {
    if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return;

    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      const group = (event.target as HTMLElement).closest<HTMLElement>('[data-arrow-nav]');
      if (!group) return;
      const items = [...group.querySelectorAll<HTMLElement>('[data-select-item]')];
      const current = items.indexOf(document.activeElement as HTMLElement);
      if (current === -1) return;
      event.preventDefault();
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
