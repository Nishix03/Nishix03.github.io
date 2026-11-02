/**
 * Pausa las animaciones que no se ven (plan A14): fuera de pantalla con IntersectionObserver
 * y con la pestaña oculta. Así el presupuesto de animación se gasta solo en lo visible.
 */
let observer: IntersectionObserver | undefined;

export const initLoopPause = () => {
  observer?.disconnect();
  observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      (entry.target as HTMLElement).dataset.paused = String(!entry.isIntersecting);
    }
  });
  document.querySelectorAll('[data-loop]').forEach((el) => observer?.observe(el));
};

export const initVisibilityPause = () => {
  const sync = () => {
    document.documentElement.dataset.hidden = String(document.hidden);
  };
  document.addEventListener('visibilitychange', sync);
  sync();
};
