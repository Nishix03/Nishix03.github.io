/** La interfaz y el barrido esperan la entrada del retrato. Su último cuadro cubre el reposo. */
export const revealWhenReady = async () => {
  const avatar = document.querySelector<HTMLElement>('.cutin');
  if (avatar) {
    const [entry, ...rest] = avatar.querySelectorAll<HTMLImageElement>('.cutin__art > .cutin__clip img');
    const opening = entry?.decode();
    avatar.dataset.restPending = '';
    void Promise.allSettled(rest.map((strip) => strip.decode())).then((results) => {
      if (results.every(({ status }) => status === 'fulfilled')) delete avatar.dataset.restPending;
    });
    await opening?.catch(() => undefined);
    if (!avatar.isConnected) return;
  }
  delete document.documentElement.dataset.loading;
};
