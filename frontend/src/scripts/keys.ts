/**
 * Atajos de teclado del sitio (flechas y Esc). Se registra un único oyente global desde init.ts.
 * Conecta con los atributos HTML data-arrow-nav (el grupo navegable) y data-select-item (cada opción),
 * que son los mismos que usa select-group.ts para marcar la opción elegida.
 * `navigate` (de Astro, módulo virtual astro:transitions/client) cambia de página sin recargarla.
 */
import { navigate } from 'astro:transitions/client';

/**
 * Teclado de la interfaz (plan §10.2):
 *  - ↑ ↓ mueven el foco entre las opciones de un grupo [data-arrow-nav] (y entran al grupo principal
 *    si el foco está fuera); el foco ya las selecciona y Enter las confirma.
 *  - Esc vuelve al inicio desde cualquier apartado (si no hay un diálogo abierto que lo use).
 *
 * Conceptos: un `keydown` es el evento de "tecla pulsada"; event.key dice cuál (p. ej. 'ArrowDown').
 * event.preventDefault() evita la acción normal del navegador (por ejemplo, que la flecha haga scroll).
 */
export const initKeys = () => {
  // Un solo oyente para todo el documento (no uno por elemento): más barato y sirve para cualquier página.
  document.addEventListener('keydown', (event) => {
    // No interferir si otro código ya manejó la tecla o si se usa con Alt/Ctrl/Meta (atajos del navegador).
    if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return;

    // Flechas arriba/abajo: mover el foco entre opciones.
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      // event.target es el elemento donde estaba el foco. `as HTMLElement` es un casteo: le decimos a TypeScript
      // que es un elemento HTML (como un (HTMLElement) cast en Java; no hay comprobación en ejecución).
      const target = event.target as HTMLElement;
      // Si el usuario está escribiendo en un campo, las flechas no se tocan. closest() busca el elemento o un padre
      // que coincida con el selector.
      if (target.closest('input, textarea, select, [contenteditable]')) return;
      // Con el foco en un grupo se mueve dentro de él; si no, se entra al grupo principal de la página
      // (menú del Hero, proyectos o contactos) por su opción elegida. Enter la confirma (enlace o botón).
      // `a ?? b` usa b si a es null/undefined. [...lista] copia una colección en un array real (spread).
      // find() devuelve el primero que cumpla la condición; offsetParent es null si el elemento está oculto.
      const group =
        target.closest<HTMLElement>('[data-arrow-nav]') ??
        [...document.querySelectorAll<HTMLElement>('main [data-arrow-nav]')].find((g) => g.offsetParent);
      // No hay grupo navegable en esta página: no se hace nada.
      if (!group) return;
      // Todas las opciones del grupo, en orden de aparición, como array.
      const items = [...group.querySelectorAll<HTMLElement>('[data-select-item]')];
      // Posición de la opción enfocada ahora (-1 si el foco está fuera del grupo), como indexOf en una List de Java.
      const current = items.indexOf(document.activeElement as HTMLElement);
      // Evita que la flecha desplace la página.
      event.preventDefault();
      // El foco está fuera del grupo: se entra a él.
      if (current === -1) {
        // Preferir la opción ya seleccionada: dataset.sel es el data-sel="true", o aria-pressed="true" para botones.
        const chosen = items.find((i) => i.dataset.sel === 'true' || i.getAttribute('aria-pressed') === 'true');
        (chosen ?? items[0])?.focus();
        return;
      }
      // +1 al bajar, -1 al subir.
      const step = event.key === 'ArrowDown' ? 1 : -1;
      // El módulo (%) hace que dé la vuelta: tras la última opción se vuelve a la primera. Se suma items.length
      // para que no salga un índice negativo. focus() ya selecciona la opción (ver select-group.ts).
      items[(current + step + items.length) % items.length].focus();
      return;
    }

    // Esc vuelve al inicio del idioma actual (/ o /es/).
    // `startsWith` y `||` funcionan como en Java. Calcula la ruta de inicio según el idioma de la URL.
    const home = location.pathname === '/es' || location.pathname.startsWith('/es/') ? '/es/' : '/';
    // Esc navega al inicio solo si no estamos ya allí y no se está escribiendo.
    if (event.key === 'Escape' && location.pathname !== home) {
      // matches() comprueba si el propio elemento cumple el selector (a diferencia de closest, no mira a los padres).
      const typing = (event.target as HTMLElement).matches('input, textarea');
      if (!typing) navigate(home);
    }
  });
};
