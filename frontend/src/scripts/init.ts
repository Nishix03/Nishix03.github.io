/**
 * Punto de arranque de los scripts del sitio. Es el único archivo que se enlaza desde las páginas; reúne a los
 * demás módulos (actors, keys, loops, select-group, ready) y decide CUÁNDO se ejecuta cada uno.
 *
 * Conceptos: cada archivo .ts es un módulo (parecido a una clase/paquete de Java) y `import { x } from './y'`
 * trae lo que ese archivo exportó. Astro usa "view transitions": navega entre páginas sin recargarlas del todo,
 * por eso hay eventos propios como `astro:page-load`.
 */
import { initActors } from './actors';
import { initKeys } from './keys';
import { initLoopPause, initVisibilityPause } from './loops';
import { initSelectGroups } from './select-group';
import { revealWhenReady, warmOtherAvatars } from './ready';

// Los listeners globales se registran una sola vez; lo que depende de la página se repite en cada navegación.
// Se ejecutan una sola vez al cargar el sitio: los oyentes globales (teclado, visibilidad de pestaña) viven en
// `document`, que Astro conserva al navegar. Si se registraran en cada página se duplicarían.
initKeys();
initVisibilityPause();

// `astro:page-load` se dispara en la primera carga y también tras cada navegación interna. Lo que depende del
// HTML de la página actual (grupos, personajes, bucles) debe repetirse aquí.
// `async` permite usar `await`: esperar un resultado sin bloquear el navegador (como un Future.get() de Java).
document.addEventListener('astro:page-load', async () => {
  // Espera a que carguen imágenes y fuentes (o a 2,5 s máximo) y quita la pantalla oculta (ver ready.ts).
  await revealWhenReady();
  // Con todo visible, precarga en segundo plano los avatares de otras páginas.
  warmOtherAvatars();
  // Activa los menús de selección (Hero, proyectos...) de esta página (select-group.ts).
  initSelectGroups();
  // Pausa las animaciones en bucle que estén fuera de pantalla (loops.ts).
  initLoopPause();
  // Arranca a los personajes pixel de esta página (actors.ts).
  initActors();
});
