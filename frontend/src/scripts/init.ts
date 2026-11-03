import { initActors } from './actors';
import { initKeys } from './keys';
import { initLoopPause, initVisibilityPause } from './loops';
import { initSelectGroups } from './select-group';
import { revealWhenReady, warmOtherAvatars } from './ready';

// Los listeners globales se registran una sola vez; lo que depende de la página se repite en cada navegación.
initKeys();
initVisibilityPause();

document.addEventListener('astro:page-load', async () => {
  await revealWhenReady();
  warmOtherAvatars();
  initSelectGroups();
  initLoopPause();
  initActors();
});
