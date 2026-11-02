import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

// Sitio estático: se puede publicar en GitHub Pages tal cual.
export default defineConfig({
  site: 'https://nishix03.github.io',
  integrations: [react()],
  // Con <ClientRouter /> las páginas se precargan al pasar el ratón,
  // así el cambio entre apartados se siente instantáneo.
  prefetch: { prefetchAll: true, defaultStrategy: 'hover' },
  vite: { plugins: [tailwindcss()] },
});
