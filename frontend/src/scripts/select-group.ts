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
 */
const select = (group: HTMLElement, index: number) => {
  const items = [...group.querySelectorAll<HTMLElement>('[data-select-item]')];
  const attr = group.dataset.selectAttr ?? 'data-sel';
  if (items[index]?.getAttribute(attr) === 'true') return;

  items.forEach((item, i) => item.setAttribute(attr, String(i === index)));

  const targets = (group.dataset.selectTargets ?? '').split(',').filter(Boolean);
  for (const selector of targets) {
    const panels = document.querySelectorAll<HTMLElement>(`${selector.trim()} > [data-panel]`);
    // Quitar y poner `hidden` reinicia las animaciones de entrada del panel (flip, cascada).
    // toggleAttribute (y no la propiedad .hidden) porque algún panel es un <text> de SVG.
    panels.forEach((panel, i) => panel.toggleAttribute('hidden', i !== index));
  }
  // Aviso para quien quiera reaccionar al cambio (por ejemplo, para animar algo al cambiar la selección).
  group.dispatchEvent(new CustomEvent('select:change', { detail: { index } }));
};

const narrow = window.matchMedia('(max-width: 767px)');
const noHover = window.matchMedia('(hover: none)');

export const initSelectGroups = () => {
  document.querySelectorAll<HTMLElement>('[data-select-group]').forEach((group) => {
    const items = [...group.querySelectorAll<HTMLElement>('[data-select-item]')];
    items.forEach((item, index) => {
      const pick = () => select(group, index);
      // Al pasar el cursor se selecciona, pero no con el dedo (un toque al empezar un scroll no debe elegir)
      // ni mientras la página se desplaza sola (el cursor queda quieto sobre otra fila).
      // Al pasar el ratón muy rápido por varias opciones no se cambia la selección en cada una (eso reiniciaba
      // los paneles y parpadeaba): solo cuando el cursor se queda 60 ms sobre la opción.
      let rest: number | undefined;
      item.addEventListener('pointerleave', () => window.clearTimeout(rest));
      item.addEventListener('pointerenter', (event) => {
        // En pantallas estrechas o sin hover solo seleccionan el clic y el foco: el cursor puede quedar quieto
        // sobre otra fila al terminar un scroll y no debe cambiar la selección.
        if (event.pointerType === 'touch' || narrow.matches || noHover.matches) return;
        if (document.documentElement.dataset.autoScroll === 'true') return;
        window.clearTimeout(rest);
        rest = window.setTimeout(pick, 60);
      });
      item.addEventListener('focus', pick);
      item.addEventListener('click', pick);
    });
  });
};
