// playwright.config.ts — configuración de Playwright, la herramienta que abre un navegador real
// de forma automática para probar la web (pruebas "end-to-end", E2E: simulan a un visitante).
// Es TypeScript (.ts): JavaScript con tipos, parecido a declarar tipos en Java.

// defineConfig solo da autocompletado/validación de las opciones.
import { defineConfig } from '@playwright/test';

// Las pruebas usan la versión ya construida (npm run build) para medir lo mismo que verá el visitante.
export default defineConfig({
  // Carpeta donde viven los archivos de prueba (*.spec.ts).
  testDir: './tests',
  // `baseURL` permite escribir page.goto('/about') en vez de la URL completa.
  use: { baseURL: 'http://localhost:4321' },
  // Antes de correr las pruebas, Playwright levanta este servidor local por ti.
  webServer: {
    // Comando que sirve el sitio ya compilado (en el puerto 4321).
    command: 'npm run preview -- --port 4321',
    // Playwright espera a que esta dirección responda antes de empezar las pruebas.
    url: 'http://localhost:4321',
    // Si ya hay un servidor corriendo en ese puerto, lo reutiliza en vez de arrancar otro.
    reuseExistingServer: true,
  },
});
