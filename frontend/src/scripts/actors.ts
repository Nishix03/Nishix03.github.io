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
  stage.addEventListener('pointerenter', () => {
    route?.setAttribute('data-rest', '');
    play(actor, 'p3-butterfly-hover');
  });
  stage.addEventListener('pointerleave', () => {
    route?.removeAttribute('data-rest');
    play(actor, 'p3-butterfly-fly');
  });
};

/** Se llama en cada astro:page-load: cada página arranca a sus actores. */
export const initActors = () => {
  initButterfly();
};
