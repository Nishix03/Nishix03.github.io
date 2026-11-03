import { defineConfig } from '@playwright/test';

// Las pruebas usan la versión ya construida (npm run build) para medir lo mismo que verá el visitante.
export default defineConfig({
  testDir: './tests',
  use: { baseURL: 'http://localhost:4321' },
  webServer: {
    command: 'npm run preview -- --port 4321',
    url: 'http://localhost:4321',
    reuseExistingServer: true,
  },
});
