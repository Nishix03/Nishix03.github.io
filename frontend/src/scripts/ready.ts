/** Las tiras del retrato arrancan juntas. El resto de la página ya es interactivo. */
export const revealWhenReady = async () => {
  const avatar = document.querySelector('.cutin');
  if (avatar) {
    const strips = avatar.querySelectorAll<HTMLImageElement>('.cutin__art > .cutin__clip img');
    await Promise.allSettled(Array.from(strips, (strip) => strip.decode()));
    if (!avatar.isConnected) return;
  }
  delete document.documentElement.dataset.loading;
};
