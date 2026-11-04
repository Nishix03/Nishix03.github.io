/**
 * Pausa las animaciones que no se ven (plan A14): fuera de pantalla con IntersectionObserver
 * y con la pestaña oculta. Así el presupuesto de animación se gasta solo en lo visible.
 *
 * Conceptos:
 * - IntersectionObserver es una API del navegador que avisa cuando un elemento entra o sale de la zona visible.
 * - El resultado se escribe en data-paused / data-hidden; el CSS los lee para poner en pausa (animation-play-state).
 * Cada elemento que quiera este ahorro debe tener el atributo data-loop en el HTML.
 */
// Variable a nivel de módulo (como un campo static de Java). `| undefined` = aún no creado.
// Se guarda para poder desconectar el observador anterior al cambiar de página.
let observer: IntersectionObserver | undefined;

// Se llama desde init.ts en cada astro:page-load.
export const initLoopPause = () => {
  // Suelta lo observado en la página anterior para no acumular observadores.
  observer?.disconnect();
  // La función que se le pasa se ejecuta cada vez que cambia la visibilidad de algún elemento observado.
  observer = new IntersectionObserver((entries) => {
    // Cada "entry" describe un elemento observado y si está visible (isIntersecting).
    for (const entry of entries) {
      // Escribe data-paused="true" (fuera de pantalla) o "false" (visible); String() convierte el booleano a texto.
      (entry.target as HTMLElement).dataset.paused = String(!entry.isIntersecting);
    }
  });
  // Observa todos los elementos marcados con data-loop (los que tienen animaciones en bucle).
  document.querySelectorAll('[data-loop]').forEach((el) => observer?.observe(el));
};

// Segunda causa de pausa: cuando la pestaña no se ve. Se llama una sola vez (init.ts).
export const initVisibilityPause = () => {
  // Copia document.hidden (true si la pestaña está oculta) a data-hidden en <html>, que el CSS lee.
  const sync = () => {
    document.documentElement.dataset.hidden = String(document.hidden);
  };
  // El navegador dispara visibilitychange al cambiar de pestaña o minimizar.
  document.addEventListener('visibilitychange', sync);
  // Se ejecuta una vez ya, para fijar el estado inicial.
  sync();
};
