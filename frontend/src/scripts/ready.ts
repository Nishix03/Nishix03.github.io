/**
 * Que todo aparezca a la vez: mientras <html> tenga data-loading, la página está oculta y sus
 * animaciones en pausa (avatar.css). Se quita cuando las tiras del avatar están decodificadas y las
 * fuentes cargadas, o a los 2,5 s si algo tarda demasiado, y entonces arrancan juntas la transición,
 * el avatar y los textos.
 */
const MAX_WAIT = 2500;

const avatarFiles = [
  'hero-entry', 'hero-rest-0', 'hero-rest-1', 'about-entry', 'about-rest', 'projects-entry',
  'projects-rest', 'stack-entry', 'stack-rest', 'journey-entry', 'journey-rest', 'journey-walk',
  'contact-entry', 'contact-rest',
];

const waitFor = (images: HTMLImageElement[]) =>
  Promise.race([
    Promise.all([...images.map((img) => img.decode().catch(() => undefined)), document.fonts.ready]),
    new Promise((resolve) => setTimeout(resolve, MAX_WAIT)),
  ]);

export const revealWhenReady = async () => {
  const images = [...document.querySelectorAll<HTMLImageElement>('.cutin__strip')];
  await waitFor(images);
  delete document.documentElement.dataset.loading;
};

/**
 * Con la página ya visible y el navegador libre, se piden en segundo plano los avatares de las demás
 * páginas: al cambiar de apartado ya están en caché y salen al instante. No se hace con ahorro de
 * datos ni en conexiones 2G.
 */
let warmed = false;
export const warmOtherAvatars = () => {
  if (warmed) return;
  const net = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
  if (net?.saveData || /2g/.test(net?.effectiveType ?? '')) return;
  warmed = true;
  const idle = window.requestIdleCallback ?? ((cb: () => void) => setTimeout(cb, 1500));
  idle(() => {
    for (const name of avatarFiles) {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.as = 'image';
      link.href = `/avatar/${name}.webp`;
      document.head.append(link);
    }
  });
};
