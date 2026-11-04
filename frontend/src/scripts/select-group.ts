/**
 * Grupo de selección P3R. Un grupo marca cuál de sus ítems está activo al pasar el ratón, enfocar o pulsar,
 * y muestra el panel que le corresponde en cada contenedor objetivo.
 *
 *   <ul data-select-group data-select-attr="aria-pressed" data-select-targets="#detail,#card">
 *     <li><button data-select-item>…</button></li>
 *   </ul>
 *   <div id="detail"><article data-panel>…</article><article data-panel hidden>…</article></div>
 *
 * El estado vive en un atributo (data-sel o aria-pressed), así el CSS hace el resto y sin JS
 * se queda el primer ítem seleccionado.
 *
 * Conceptos:
 * - `[data-select-group]`, `[data-select-item]`, `[data-panel]` son data-attributes que ponemos en el HTML
 *   para que JS encuentre los elementos con querySelectorAll sin depender de clases de estilo.
 * - `CustomEvent` permite crear eventos propios (aquí "select:change") que otros scripts pueden escuchar.
 * - keys.ts usa los mismos [data-select-item] para mover el foco con las flechas.
 */
// Selecciona la opción número `index` de un grupo. `group` es el contenedor; `index`, la posición (0 = primera).
const select = (group: HTMLElement, index: number) => {
  // Convierte la lista de opciones del grupo en un array normal para poder usar forEach e índices.
  const items = [...group.querySelectorAll<HTMLElement>('[data-select-item]')];
  // Atributo donde se guarda el estado: el definido en data-select-attr o, por defecto, data-sel.
  // dataset.selectAttr corresponde al atributo data-select-attr (guiones -> camelCase).
  const attr = group.dataset.selectAttr ?? 'data-sel';
  // Si ya está seleccionada, no se hace nada (evita reiniciar animaciones).
  if (items[index]?.getAttribute(attr) === 'true') return;

  // Solo la elegida queda en "true"; las demás en "false". El CSS (o aria-pressed) pinta el resultado.
  items.forEach((item, i) => item.setAttribute(attr, String(i === index)));

  // Lista de selectores CSS de los contenedores de paneles (data-select-targets="#detail,#card").
  // split(',') separa el texto por comas; filter(Boolean) descarta los vacíos.
  const targets = (group.dataset.selectTargets ?? '').split(',').filter(Boolean);
  // Por cada contenedor objetivo...
  for (const selector of targets) {
    // ...se toman sus hijos directos con data-panel (el símbolo > significa "hijo directo").
    const panels = document.querySelectorAll<HTMLElement>(`${selector.trim()} > [data-panel]`);
    // Quitar y poner `hidden` reinicia las animaciones de entrada del panel (flip, cascada).
    // toggleAttribute (y no la propiedad .hidden) porque algún panel es un <text> de SVG.
    // Solo el panel del mismo índice queda visible; los demás reciben `hidden`.
    panels.forEach((panel, i) => panel.toggleAttribute('hidden', i !== index));
  }
  // Aviso para quien quiera reaccionar al cambio (por ejemplo, para animar algo al cambiar la selección).
  // Emite un evento propio; `detail` lleva datos extra (el índice elegido).
  group.dispatchEvent(new CustomEvent('select:change', { detail: { index } }));
};

// matchMedia consulta una media query desde JS: pantalla estrecha (móvil).
const narrow = window.matchMedia('(max-width: 767px)');
// Dispositivos sin ratón real (táctiles): no tienen "pasar el cursor".
const noHover = window.matchMedia('(hover: none)');

// Registra los eventos de todos los grupos de la página. Lo llama init.ts en cada astro:page-load.
export const initSelectGroups = () => {
  // Cada elemento con data-select-group es un grupo independiente.
  document.querySelectorAll<HTMLElement>('[data-select-group]').forEach((group) => {
    // Las opciones de este grupo.
    const items = [...group.querySelectorAll<HTMLElement>('[data-select-item]')];
    items.forEach((item, index) => {
      // Atajo que selecciona esta opción (closure: recuerda `group` e `index`, como una lambda de Java que captura variables).
      const pick = () => select(group, index);
      // Al pasar el cursor se selecciona, pero no con el dedo (un toque al empezar un scroll no debe elegir)
      // ni mientras la página se desplaza sola (el cursor queda quieto sobre otra fila).
      // Al pasar el ratón muy rápido por varias opciones no se cambia la selección en cada una (eso reiniciaba
      // los paneles y parpadeaba): solo cuando el cursor se queda 60 ms sobre la opción.
      let rest: number | undefined;
      // `rest` guarda el temporizador del "ratón quieto"; si el cursor sale antes de tiempo se cancela.
      item.addEventListener('pointerleave', () => window.clearTimeout(rest));
      item.addEventListener('pointerenter', (event) => {
        // En pantallas estrechas o sin hover solo seleccionan el clic y el foco: el cursor puede quedar quieto
        // sobre otra fila al terminar un scroll y no debe cambiar la selección.
        if (event.pointerType === 'touch' || narrow.matches || noHover.matches) return;
        if (document.documentElement.dataset.autoScroll === 'true') return;
        window.clearTimeout(rest);
        rest = window.setTimeout(pick, 60);
      });
      // Foco por teclado (Tab o flechas) = seleccionar.
      item.addEventListener('focus', pick);
      // Clic o toque = seleccionar (es lo que funciona en móvil).
      item.addEventListener('click', pick);
    });
  });
};
