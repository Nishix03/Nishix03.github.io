/**
 * Cambiar el clip de un actor de <Clip>. Quita `hidden` al clip pedido (y se lo pone a los demás);
 * al volver a mostrarse, el navegador reinicia su animación CSS desde el cuadro 0.
 *
 * `override` cambia el tramo que se reproduce sin tocar los valores base del clip:
 *   --play-from / --play-end (desplazamiento en px), --play-steps (cuadros), --play-dur, --play-iter.
 * Devuelve una promesa que se cumple al acabar un clip de una pasada: true si sigue siendo el clip
 * activo, false si otro play() lo sustituyó antes. Un clip en bucle no termina nunca.
 */
const tokens = new WeakMap<HTMLElement, number>();
const overrides = ['--play-from', '--play-end', '--play-steps', '--play-dur', '--play-iter'];

export const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

export const getActor = (name: string) =>
  document.querySelector<HTMLElement>(`[data-actor="${name}"]`);

/** Ancho de un cuadro en px (ya escalado). */
export const frameWidth = (actor: HTMLElement, id: string) =>
  parseFloat(strip(actor, id)?.style.getPropertyValue('--clip-w') ?? '0');

const strip = (actor: HTMLElement, id: string) =>
  actor.querySelector<HTMLImageElement>(`[data-clip-name="${id}"]`);

export const play = (
  actor: HTMLElement,
  id: string,
  override: Record<string, string | number> = {},
): Promise<boolean> => {
  const token = (tokens.get(actor) ?? 0) + 1;
  tokens.set(actor, token);
  actor.dataset.clip = id;

  const target = strip(actor, id);
  // Solo hace falta forzar el reinicio si se vuelve a pedir el clip que ya estaba visible.
  if (target && !target.hidden) {
    target.hidden = true;
    void target.offsetWidth;
  }
  actor.querySelectorAll<HTMLImageElement>('[data-clip-name]').forEach((img) => {
    img.hidden = img !== target;
  });
  if (!target) return Promise.resolve(false);

  overrides.forEach((name) => target.style.removeProperty(name));
  Object.entries(override).forEach(([name, value]) =>
    target.style.setProperty(name, String(value)),
  );
  const loops =
    (override['--play-iter'] ?? target.style.getPropertyValue('--clip-iter')) === 'infinite';
  if (loops) return new Promise(() => {});
  return new Promise((resolve) => {
    const done = (event: AnimationEvent) => {
      if (event.target !== target) return;
      target.removeEventListener('animationend', done);
      resolve(tokens.get(actor) === token);
    };
    target.addEventListener('animationend', done);
  });
};
