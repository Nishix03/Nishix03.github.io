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
  let intent = 0;
  const later = (rest: boolean) => {
    const request = ++intent;
    window.clearTimeout(wait);
    wait = window.setTimeout(async () => {
      const clip = rest ? 'p3-butterfly-hover' : 'p3-butterfly-fly';
      const image = actor.querySelector<HTMLImageElement>(`[data-clip-name="${clip}"]`);
      if (!image || actor.dataset.clip === clip) return;
      try {
        await image.decode();
      } catch {
        return;
      }
      if (request !== intent || !actor.isConnected) return;
      route?.toggleAttribute('data-rest', rest);
      void play(actor, clip);
    }, 140);
  };
  stage.addEventListener('pointerenter', () => later(true));
  stage.addEventListener('pointerleave', () => later(false));
};

/** Se llama en cada astro:page-load: cada página arranca a sus actores. */
export const initActors = () => {
  initButterfly();
};
