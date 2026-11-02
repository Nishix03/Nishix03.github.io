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
};

export const initSelectGroups = () => {
  document.querySelectorAll<HTMLElement>('[data-select-group]').forEach((group) => {
    const items = [...group.querySelectorAll<HTMLElement>('[data-select-item]')];
    items.forEach((item, index) => {
      const pick = () => select(group, index);
      item.addEventListener('pointerenter', pick);
      item.addEventListener('focus', pick);
      item.addEventListener('click', pick);
    });
  });
};
