import { initActors } from './actors';
import { initKeys } from './keys';
import { initLoopPause, initVisibilityPause } from './loops';
import { initSelectGroups } from './select-group';
import { revealWhenReady } from './ready';

// Los listeners globales se registran una sola vez; lo que depende de la página se repite en cada navegación.
initKeys();
initVisibilityPause();

let activePage: Element | null = null;
const initPage = () => {
  const page = document.querySelector('.page-enter');
  if (!page || page === activePage) return;
  activePage = page;
  initSelectGroups();
  initLoopPause();
  initActors();
  void revealWhenReady();
};

// El módulo se ejecuta con el DOM listo, sin esperar las imágenes decorativas.
initPage();
document.addEventListener('astro:page-load', initPage);
