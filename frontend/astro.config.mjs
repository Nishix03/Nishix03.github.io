import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

// Sitio estático: se puede publicar en GitHub Pages tal cual.
export default defineConfig({
  site: 'https://nishix03.github.io',
  integrations: [react()],
  // Con <ClientRouter /> las páginas se precargan cuando su enlace aparece en pantalla (no al pasar
  // el ratón: en móvil no hay ratón y cada cambio de página tardaba ~1 s). Cada página pesa ~8 KB
  // comprimida; Astro no precarga si el visitante activó el ahorro de datos.
  prefetch: { prefetchAll: true, defaultStrategy: 'viewport' },
  vite: { plugins: [tailwindcss()] },
});
