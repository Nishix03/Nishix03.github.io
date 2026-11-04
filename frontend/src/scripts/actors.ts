/**
 * Lo que hace cada personaje pixel en su sección (guía de Codex: IMPLEMENTATION.md).
 * Los cuadros los anima el CSS de <Clip>; aquí solo se decide qué clip toca y cuándo.
 * Todo se encadena con `animationend`: si la sección sale de pantalla o la pestaña se oculta,
 * las animaciones se pausan (loops.ts) y la secuencia espera sola, sin temporizadores.
 */
import { getActor, play, reducedMotion } from './clips';

/* ---------- Hero: la mariposa se posa sobre la silueta ---------- */
const initButterfly = () => {
  const actor = getActor('butterfly');
  const stage = actor?.closest<HTMLElement>('.hero__stage');
  if (!actor || !stage || reducedMotion()) return;
  const route = actor.closest<HTMLElement>('.hero__butterfly');
  // Se posa (o vuelve a volar) solo si el cursor se queda o se va de verdad: pasarlo rápido por encima
  // ya no cambia el clip a cada momento (eso hacía parpadear la mariposa).
  let wait: number | undefined;
  const later = (fn: () => void) => {
    window.clearTimeout(wait);
    wait = window.setTimeout(fn, 140);
  };
  stage.addEventListener('pointerenter', () =>
    later(() => {
      route?.setAttribute('data-rest', '');
      play(actor, 'p3-butterfly-hover');
    }),
  );
  stage.addEventListener('pointerleave', () =>
    later(() => {
      route?.removeAttribute('data-rest');
      play(actor, 'p3-butterfly-fly');
    }),
  );
};

/** Se llama en cada astro:page-load: cada página arranca a sus actores. */
export const initActors = () => {
  initButterfly();
};
