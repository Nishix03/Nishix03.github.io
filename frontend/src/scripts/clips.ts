/**
 * Cambiar el clip de un actor de <Clip>. Quita `hidden` al clip pedido (y se lo pone a los demás);
 * al volver a mostrarse, el navegador reinicia su animación CSS desde el cuadro 0.
 *
 * `override` cambia el tramo que se reproduce sin tocar los valores base del clip:
 *   --play-from / --play-end (desplazamiento en px), --play-steps (cuadros), --play-dur, --play-iter.
 * Devuelve una promesa que se cumple al acabar un clip de una pasada: true si sigue siendo el clip
 * activo, false si otro play() lo sustituyó antes. Un clip en bucle no termina nunca.
 *
 * Conceptos:
 * - Un "clip" es una imagen en tira (sprite sheet): varios cuadros pegados en horizontal. El CSS la anima
 *   moviéndola cuadro a cuadro; aquí solo se elige cuál tira se ve.
 * - Una Promise es una promesa de un resultado futuro (algo parecido a un Future de Java): aquí se cumple
 *   cuando termina la animación.
 * - Este archivo lo usan actors.ts (para reproducir clips) y nadie más lo anima: es la pieza base.
 */
// WeakMap es un mapa clave->valor (como un HashMap de Java) cuyas claves son elementos del DOM; si el elemento
// desaparece de la página, su entrada se libera sola. Guarda un "número de turno" por actor para saber cuál
// fue la última llamada a play().
const tokens = new WeakMap<HTMLElement, number>();
// Lista de variables CSS (--nombre) que play() puede cambiar. Se limpian antes de cada reproducción nueva.
const overrides = ['--play-from', '--play-end', '--play-steps', '--play-dur', '--play-iter'];

// matchMedia consulta una media query desde JS. prefers-reduced-motion es una preferencia del sistema operativo
// para quien se marea o prefiere pocas animaciones; devuelve true/false.
export const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

// querySelector busca en el documento el PRIMER elemento que cumpla un selector CSS. El selector [data-actor="x"]
// significa "el que tenga el atributo data-actor igual a x". Devuelve null si no existe.
export const getActor = (name: string) =>
  document.querySelector<HTMLElement>(`[data-actor="${name}"]`);

/** Ancho de un cuadro en px (ya escalado). */
// Lee de la variable CSS --clip-w del clip la anchura de un solo cuadro. `?? '0'` usa "0" si no hay valor.
// parseFloat convierte el texto "48px" en el número 48.
export const frameWidth = (actor: HTMLElement, id: string) =>
  parseFloat(strip(actor, id)?.style.getPropertyValue('--clip-w') ?? '0');

// Busca dentro del actor la imagen (<img>) cuyo data-clip-name sea el id pedido.
const strip = (actor: HTMLElement, id: string) =>
  actor.querySelector<HTMLImageElement>(`[data-clip-name="${id}"]`);

// `override: Record<string, string | number> = {}` es un diccionario texto->(texto o número) con valor por
// defecto vacío; Record<K, V> en TS equivale a un Map<K, V> de Java. `Promise<boolean>` es lo que devuelve.
export const play = (
  actor: HTMLElement,
  id: string,
  override: Record<string, string | number> = {},
): Promise<boolean> => {
  // Cada llamada a play() aumenta el turno del actor. Al final se compara: si el turno cambió, otra llamada
  // "ganó" y este clip ya no es el activo.
  const token = (tokens.get(actor) ?? 0) + 1;
  tokens.set(actor, token);
  // dataset es la vía de JS a los data-attributes: esto escribe data-clip="id" en el HTML, útil para el CSS.
  actor.dataset.clip = id;

  // `target` es la imagen del clip pedido (o null si el id no existe).
  const target = strip(actor, id);
  // querySelectorAll devuelve TODAS las coincidencias. Se recorren (forEach, como un for-each de Java) y solo la
  // imagen elegida queda visible; el resto se oculta con el atributo `hidden`.
  actor.querySelectorAll<HTMLImageElement>('[data-clip-name]').forEach((img) => {
    img.hidden = img !== target;
  });
  // Si el clip no existe, se devuelve ya una promesa cumplida con false (no hay nada que esperar).
  if (!target) return Promise.resolve(false);

  // Primero borra los ajustes que dejó la reproducción anterior...
  overrides.forEach((name) => target.style.removeProperty(name));
  // ...y luego aplica los nuevos. Object.entries convierte el diccionario en pares [nombre, valor];
  // setProperty escribe cada variable CSS en el estilo en línea del clip.
  Object.entries(override).forEach(([name, value]) =>
    target.style.setProperty(name, String(value)),
  );
  // Ocultar, forzar un cálculo de layout y mostrar: así se reinicia aunque ya fuera el clip visible.
  target.hidden = true;
  // Leer offsetWidth obliga al navegador a recalcular el layout; sin esto agruparía el ocultar/mostrar y no
  // reiniciaría la animación. `void` indica que ignoramos el valor leído.
  void target.offsetWidth;
  target.hidden = false;

  // Si el clip es infinito (en bucle) nunca emite "animationend", así que no hay nada que esperar.
  const loops =
    (override['--play-iter'] ?? target.style.getPropertyValue('--clip-iter')) === 'infinite';
  // Una promesa que nunca se resuelve: quien haga await a un bucle se queda esperando para siempre (a propósito).
  if (loops) return new Promise(() => {});
  // Para clips de una sola pasada: se resuelve cuando el navegador avisa con el evento `animationend`.
  return new Promise((resolve) => {
    // Función oyente del evento. `AnimationEvent` es el tipo del evento de fin de animación.
    const done = (event: AnimationEvent) => {
      // Ignora eventos de animaciones de otros elementos hijos (los eventos "burbujean" hacia arriba).
      if (event.target !== target) return;
      // Se desregistra el oyente para no acumularlos en cada reproducción.
      target.removeEventListener('animationend', done);
      // Cumple la promesa con true si este play() sigue siendo la última orden; false si lo sustituyeron.
      resolve(tokens.get(actor) === token);
    };
    // Activa el oyente: el navegador llamará a done cuando termine la animación CSS.
    target.addEventListener('animationend', done);
  });
};
