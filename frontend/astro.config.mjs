// astro.config.mjs — configuración principal de Astro, el framework que construye este sitio.
// Astro toma las páginas y componentes de src/ y genera HTML estático listo para publicar.
// Es un módulo ES (.mjs): se usa `import` / `export default`, como importar clases en Java.

// defineConfig solo ayuda al editor con autocompletado y validación de las opciones.
import { defineConfig } from 'astro/config';
// Integración de React: permite usar componentes React dentro de Astro.
import react from '@astrojs/react';
// Plugin de Tailwind (framework de CSS con clases utilitarias) para Vite, el empaquetador que usa Astro.
import tailwindcss from '@tailwindcss/vite';

// Sitio estático: se puede publicar en GitHub Pages tal cual.
// `export default` es lo que Astro lee al arrancar; es el objeto de configuración.
export default defineConfig({
  // URL pública final; Astro la usa para generar enlaces absolutos (por ejemplo, canonical y sitemap).
  site: 'https://nishix03.github.io',
  // Integraciones: extensiones que añaden capacidades a Astro (aquí, React).
  integrations: [react()],
  // Con <ClientRouter /> las páginas se precargan cuando su enlace aparece en pantalla (no al pasar
  // el ratón: en móvil no hay ratón y cada cambio de página tardaba ~1 s). Cada página pesa ~8 KB
  // comprimida; Astro no precarga si el visitante activó el ahorro de datos.
  // (prefetch = descargar de antemano la página siguiente para que el cambio parezca instantáneo;
  // 'viewport' = hacerlo cuando el enlace entra en la zona visible.)
  prefetch: { prefetchAll: true, defaultStrategy: 'viewport' },
  // Opciones de Vite (el motor de desarrollo/empaquetado bajo Astro): aquí se activa Tailwind.
  vite: { plugins: [tailwindcss()] },
});
