/**
 * Que todo aparezca a la vez: mientras <html> tenga data-loading, la página está oculta y sus
 * animaciones en pausa (avatar.css). Se quita cuando las tiras del avatar están decodificadas y las
 * fuentes cargadas, o a los 2,5 s si algo tarda demasiado, y entonces arrancan juntas la transición,
 * el avatar y los textos.
 *
 * Conceptos: `Promise.race` devuelve lo primero que termine; `Promise.all` espera a que terminen todas.
 * img.decode() descarga y decodifica la imagen para que se pinte sin parpadeos. `data-loading` es un
 * data-attribute que pone el HTML al inicio y que aquí se borra (el CSS usa su presencia para ocultar).
 * Lo llama init.ts en cada astro:page-load.
 */
// Tiempo máximo de espera, en milisegundos (2500 ms = 2,5 s). Mayúsculas = constante, como static final en Java.
const MAX_WAIT = 2500;

// Nombres de las imágenes de avatar de todas las páginas (public/avatar/<nombre>.webp) que se precargan luego.
const avatarFiles = [
  'hero-entry', 'hero-rest-0', 'hero-rest-1', 'about-entry', 'about-rest', 'projects-entry',
  'projects-rest', 'stack-entry', 'stack-rest', 'journey-entry', 'journey-rest', 'journey-walk',
  'contact-entry', 'contact-rest',
];

// Espera a que las imágenes estén decodificadas y las fuentes listas, pero nunca más de MAX_WAIT.
// `HTMLImageElement[]` es un array de elementos <img>.
const waitFor = (images: HTMLImageElement[]) =>
  // Carrera entre "todo cargó" y "pasó el tiempo máximo": gana el que termine primero.
  Promise.race([
    // `.catch(() => undefined)` evita que una imagen rota detenga todo. document.fonts.ready se cumple cuando
    // las fuentes web terminaron de cargar.
    Promise.all([...images.map((img) => img.decode().catch(() => undefined)), document.fonts.ready]),
    // Temporizador que "gana" la carrera tras MAX_WAIT ms (setTimeout ejecuta algo pasado cierto tiempo).
    new Promise((resolve) => setTimeout(resolve, MAX_WAIT)),
  ]);

// `async` marca que la función devuelve una Promise y puede usar await.
export const revealWhenReady = async () => {
  // Las tiras del avatar de entrada (clase cutin__strip) que hay en esta página.
  const images = [...document.querySelectorAll<HTMLImageElement>('.cutin__strip')];
  await waitFor(images);
  // documentElement es la etiqueta <html>. Quitar data-loading hace que el CSS muestre la página y reanude
  // las animaciones, todas a la vez.
  delete document.documentElement.dataset.loading;
};

/**
 * Con la página ya visible y el navegador libre, se piden en segundo plano los avatares de las demás
 * páginas: al cambiar de apartado ya están en caché y salen al instante. No se hace con ahorro de
 * datos ni en conexiones 2G.
 */
// Bandera para hacer el precalentamiento solo una vez en toda la sesión (no en cada navegación).
let warmed = false;
// Precarga en segundo plano (prefetch) los avatares del resto de páginas.
export const warmOtherAvatars = () => {
  // Ya se hizo antes: salir.
  if (warmed) return;
  // navigator.connection (info de red) no está en los tipos estándar de TypeScript, así que se amplía el tipo
  // con `Navigator & { ... }` (intersección: lo de Navigator más estos campos opcionales).
  const net = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
  // Respeta el modo ahorro de datos y las conexiones 2G: ahí no se descarga nada extra.
  if (net?.saveData || /2g/.test(net?.effectiveType ?? '')) return;
  // Se marca como hecho antes de programar el trabajo, para que no se programe dos veces.
  warmed = true;
  // requestIdleCallback ejecuta algo cuando el navegador está libre; si no existe (p. ej. Safari) se usa setTimeout.
  const idle = window.requestIdleCallback ?? ((cb: () => void) => setTimeout(cb, 1500));
  // Dentro se crean los <link rel="prefetch">, que le piden al navegador bajar las imágenes sin mostrarlas.
  idle(() => {
    // Un enlace por cada archivo de la lista.
    for (const name of avatarFiles) {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.as = 'image';
      link.href = `/avatar/${name}.webp`;
      // Añadirlo al <head> es lo que dispara la descarga.
      document.head.append(link);
    }
  });
};
