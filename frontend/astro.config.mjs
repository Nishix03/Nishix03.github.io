import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

// Sitio estático: se puede publicar en GitHub Pages tal cual.
export default defineConfig({
  site: 'https://nishix03.github.io',
  integrations: [
    react(),
    {
      name: 'nishix-chat-on-demand',
      hooks: {
        'astro:config:setup': ({ addClientDirective }) => {
          addClientDirective({ name: 'chat', entrypoint: './src/scripts/chat-on-demand.ts' });
        },
      },
    },
  ],
  // Anticipa la navegación con ratón o teclado sin pedir todas las rutas visibles.
  prefetch: { prefetchAll: true, defaultStrategy: 'hover' },
  vite: { plugins: [tailwindcss()] },
});
