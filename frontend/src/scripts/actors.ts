/**
 * Lo que hace cada personaje pixel en su sección (guía de Codex: IMPLEMENTATION.md).
 * Los cuadros los anima el CSS de <Clip>; aquí solo se decide qué clip toca y cuándo.
 * Todo se encadena con `animationend`: si la sección sale de pantalla o la pestaña se oculta,
 * las animaciones se pausan (loops.ts) y la secuencia espera sola, sin temporizadores.
 */
import { frameWidth, getActor, play, reducedMotion } from './clips';
import { clip, type ClipId } from '../sprites/clips';

/* ---------- Hero: Boyfriend canta con las flechas ---------- */
type Dir = 'up' | 'down' | 'left' | 'right';
const keyDirs: Record<string, Dir> = {
  ArrowUp: 'up',
  ArrowDown: 'down',
  ArrowLeft: 'left',
  ArrowRight: 'right',
};
let held: Dir | null = null;
let pressing: Promise<boolean> = Promise.resolve(true);

const lightArrow = (dir: Dir | null) => {
  document.querySelectorAll<HTMLElement>('[data-arrow]').forEach((arrow) => {
    arrow.toggleAttribute('data-hit', arrow.dataset.arrow === dir);
  });
};

/** Anticipación → golpe → sostén: se queda en el cuadro de sostén mientras la tecla siga pulsada. */
const press = (dir: Dir) => {
  const actor = getActor('boyfriend');
  if (!actor || reducedMotion()) return;
  const id = `boyfriend-${dir}` as ClipId;
  const { sustainFrame = 2, fps } = clip(id);
  const w = frameWidth(actor, id);
  held = dir;
  lightArrow(dir);
  pressing = play(actor, id, {
    '--play-steps': sustainFrame + 1,
    '--play-end': `${-sustainFrame * w}px`,
    '--play-dur': `${((sustainFrame + 1) / fps) * 1000}ms`,
    '--play-iter': 1,
  });
};

/** Al soltar: termina el tramo que esté sonando, enseña el cuadro de recuperación y vuelve al reposo. */
const release = async (dir: Dir) => {
  if (held !== dir) return;
  held = null;
  const actor = getActor('boyfriend');
  if (!actor) return;
  if (!(await pressing) || held) return; // otra flecha tomó el relevo
  const id = `boyfriend-${dir}` as ClipId;
  const { releaseFrame = 3, fps } = clip(id);
  const x = `${-releaseFrame * frameWidth(actor, id)}px`;
  const recovered = await play(actor, id, {
    '--play-from': x,
    '--play-end': x,
    '--play-steps': 2,
    '--play-dur': `${1000 / fps}ms`,
    '--play-iter': 1,
  });
  if (!recovered) return;
  lightArrow(null);
  play(actor, 'boyfriend-idle');
};

const isTyping = (target: EventTarget | null) =>
  target instanceof HTMLElement &&
  !!target.closest('input, textarea, select, [contenteditable="true"], [contenteditable=""]');

/** Se registra una sola vez: los listeners viven en document y buscan al actor en cada evento. */
export const initBoyfriendKeys = () => {
  document.addEventListener('keydown', (event) => {
    const dir = keyDirs[event.key];
    if (!dir || event.repeat || event.altKey || event.ctrlKey || event.metaKey) return;
    if (isTyping(event.target)) return;
    // Sin preventDefault: ↑↓ siguen moviendo el foco del menú al instante (keys.ts).
    press(dir);
  });
  document.addEventListener('keyup', (event) => {
    const dir = keyDirs[event.key];
    if (dir) release(dir);
  });
  // Flechas táctiles: las mismas acciones con el dedo o el ratón.
  document.addEventListener('pointerdown', (event) => {
    const arrow = (event.target as HTMLElement).closest<HTMLElement>('[data-arrow]');
    if (arrow) press(arrow.dataset.arrow as Dir);
  });
  const letGo = () => held && release(held);
  document.addEventListener('pointerup', letGo);
  document.addEventListener('pointercancel', letGo);
  window.addEventListener('blur', letGo);
};

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

/* ---------- Contact: Frisk saluda al llegar ---------- */
let friskObserver: IntersectionObserver | undefined;

const initFrisk = () => {
  friskObserver?.disconnect();
  const actor = getActor('frisk');
  if (!actor || reducedMotion()) return;
  let greeting = false;
  const greet = async () => {
    if (greeting) return; // no se reinicia a mitad del saludo
    greeting = true;
    if (await play(actor, 'frisk-greet')) play(actor, 'frisk-idle');
    greeting = false;
  };
  friskObserver = new IntersectionObserver(
    ([entry]) => {
      if (!entry?.isIntersecting) return;
      friskObserver?.disconnect();
      greet();
    },
    { threshold: 0.6 },
  );
  friskObserver.observe(actor);
  document.querySelector('.contact__list')?.addEventListener('focusin', greet);
};

/** Se llama en cada astro:page-load: cada página arranca a sus actores. */
export const initActors = () => {
  initButterfly();
  initFrisk();
};
