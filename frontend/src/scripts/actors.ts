/**
 * Lo que hace cada personaje pixel en su sección (guía de Codex: IMPLEMENTATION.md).
 * Los cuadros los anima el CSS de <Clip>; aquí solo se decide qué clip toca y cuándo.
 * Todo se encadena con `animationend`: si la sección sale de pantalla o la pestaña se oculta,
 * las animaciones se pausan (loops.ts) y la secuencia espera sola, sin temporizadores.
 *
 * Para Iván (conceptos nuevos):
 * - "Actor" = un elemento HTML con el atributo data-actor="nombre". Un data-attribute es un atributo
 *   inventado por nosotros que empieza por data-; en JS se lee con element.dataset.
 * - `export const f = () => {...}` es una función flecha (como una lambda de Java) guardada en una
 *   constante; `export` la hace visible para otros archivos, parecido a `public` en Java.
 * - Este archivo no anima nada por sí mismo: solo reacciona al ratón y le pide a play() (clips.ts)
 *   que cambie de clip. Lo llama init.ts en cada carga de página.
 */
// import trae funciones de otro archivo (como un import de Java). Aquí vienen de clips.ts:
// getActor busca el personaje, play cambia su clip y reducedMotion dice si el usuario pidió menos movimiento.
import { getActor, play, reducedMotion } from './clips';

/* ---------- Hero: la mariposa se posa sobre la silueta ---------- */
// Prepara a la mariposa del Hero. No devuelve nada; solo registra los eventos del ratón.
const initButterfly = () => {
  // Busca en el HTML al personaje con data-actor="butterfly". Puede ser null si esta página no lo tiene.
  const actor = getActor('butterfly');
  // `?.` (encadenamiento opcional): si actor es null no falla, simplemente da undefined.
  // closest<HTMLElement>(...) sube por los padres hasta hallar uno con esa clase CSS; el <HTMLElement> le dice
  // a TypeScript qué tipo devuelve (parecido a los genéricos de Java, como List<String>).
  // `stage` es el escenario del Hero: donde se detecta el cursor.
  const stage = actor?.closest<HTMLElement>('.hero__stage');
  // Guarda de salida temprana: sin mariposa, sin escenario, o si el usuario prefiere poco movimiento, no se hace nada.
  if (!actor || !stage || reducedMotion()) return;
  // `route` es el contenedor que mueve a la mariposa por la pantalla; su atributo data-rest activa en el CSS
  // el modo "posada".
  const route = actor.closest<HTMLElement>('.hero__butterfly');
  // Se posa (o vuelve a volar) solo si el cursor se queda o se va de verdad: pasarlo rápido por encima
  // ya no cambia el clip a cada momento (eso hacía parpadear la mariposa).
  // `number | undefined` es un tipo unión: puede ser un número (id del temporizador) o no tener valor todavía.
  // Sirve para poder cancelar el temporizador anterior.
  let wait: number | undefined;
  // Retrasa una acción 140 ms y cancela la pendiente: es un "antirrebote" (debounce).
  // `fn: () => void` es un parámetro que es una función sin argumentos ni retorno (como un Runnable en Java).
  const later = (fn: () => void) => {
    window.clearTimeout(wait);
    wait = window.setTimeout(fn, 140);
  };
  // addEventListener registra un "oyente": cuando ocurre el evento (aquí, el cursor entra al escenario) se ejecuta
  // la función que le pasamos. Es como un ActionListener de Swing. pointerenter funciona con ratón y táctil.
  stage.addEventListener('pointerenter', () =>
    later(() => {
      // Marca la ruta como "en reposo": el CSS detiene el vuelo y la mariposa se posa. El valor vacío basta, solo importa que exista.
      route?.setAttribute('data-rest', '');
      // Cambia el clip a la tira de sprites de la mariposa posada (los ids de clips están en sprites/clips.json).
      play(actor, 'p3-butterfly-hover');
    }),
  );
  // Lo contrario: al salir el cursor, se quita data-rest y vuelve el clip de vuelo.
  stage.addEventListener('pointerleave', () =>
    later(() => {
      route?.removeAttribute('data-rest');
      play(actor, 'p3-butterfly-fly');
    }),
  );
};

/** Se llama en cada astro:page-load: cada página arranca a sus actores. */
export const initActors = () => {
  // Aquí irán los demás personajes (uno por sección) a medida que se añadan.
  initButterfly();
};
