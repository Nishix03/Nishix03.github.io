/**
 * site.spec.ts — pruebas automáticas end-to-end (E2E) del portafolio.
 *
 * Playwright abre un navegador real, entra a las páginas y comprueba cosas como lo haría un
 * visitante (sprites cargados, accesibilidad, sin desbordes, teclado, idioma, chat...).
 * Es parecido a las pruebas JUnit de Java: cada `test(...)` es un caso con sus `expect(...)`
 * (aserciones, como assertEquals), pero aquí se "maneja" una página web de verdad.
 *
 * Conceptos nuevos:
 *  - async/await: las acciones del navegador tardan, así que devuelven promesas; `await` espera
 *    a que terminen antes de seguir con la línea siguiente.
 *  - locator: una "dirección" (selector CSS, rol, texto) para encontrar elementos de la página.
 *    Los `expect` sobre locators reintentan solos hasta que se cumplen o se acaba el tiempo.
 *  - fixture: recurso que Playwright prepara para cada prueba (como `page`, `browser`).
 *    Se recibe como argumento: `async ({ page }) => ...`.
 *  - axe (axe-core): motor que revisa la accesibilidad (contraste, etiquetas, roles ARIA).
 *
 * Se ejecutan con `npx playwright test` (ver playwright.config.ts).
 */

// AxeBuilder conecta axe-core con Playwright para auditar accesibilidad.
import AxeBuilder from '@axe-core/playwright';
// `expect` = aserciones; `test` (renombrado `base`) = definir pruebas; `Page` es solo un tipo (TypeScript).
import { expect, test as base, type Page } from '@playwright/test';

// La página espera a que el avatar y las fuentes estén listos (scripts/ready.ts) antes de mostrarse.
// Cada page.goto espera también a ese momento, como lo vería el visitante.
// `base.extend` crea una versión personalizada de `test` donde se redefine el fixture `page`.
const test = base.extend({
  // `use` es la función que entrega el fixture a la prueba (lo que haya antes es preparación,
  // lo que haya después sería limpieza).
  page: async ({ page }, use) => {
    // Guardamos el goto original (atado a `page`) para poder llamarlo dentro del nuevo.
    const goto = page.goto.bind(page);
    // Reemplazamos goto: navega y luego espera a que <html> pierda el atributo data-loading.
    page.goto = async (...args) => {
      const res = await goto(...args);
      await expect(page.locator('html')).not.toHaveAttribute('data-loading', { timeout: 5000 });
      return res;
    };
    // Entrega la `page` modificada a la prueba.
    await use(page);
  },
});

// Rutas que se recorren en varias pruebas (inglés y español).
const pages = ['/', '/about', '/projects', '/stack', '/journey', '/contact', '/es/', '/es/contact'];

test('sprites reales: cargan todas las hojas y conservan el tamaño de cuadro', async ({ page }) => {
  test.setTimeout(90_000); // recorre seis páginas con hojas grandes (el _ en 90_000 es solo legibilidad)
  for (const path of pages) {
    await page.goto(path);
    // No debe quedar ningún sprite "de relleno" (placeholder) sin reemplazar.
    await expect(page.locator('.sprite--placeholder')).toHaveCount(0);
    // Recorre cada tira de sprites visible (las ocultas con `hidden` se excluyen con :not).
    for (const strip of await page.locator('.sprite__strip, .clip__strip:not([hidden])').all()) {
      // `complete` es true cuando el navegador terminó de cargar la imagen.
      await expect(strip).toHaveJSProperty('complete', true);
      // evaluate() ejecuta código DENTRO del navegador y devuelve el resultado a la prueba.
      const dimensions = await strip.evaluate((img: HTMLImageElement) => ({
        natural: img.naturalWidth, // ancho real de la imagen
        rendered: img.width, // ancho con el que se pinta en pantalla
        height: img.naturalHeight,
      }));
      expect(dimensions.natural).toBeGreaterThan(0);
      // Los clips pueden ir a escala entera (la carta va ×3): el ancho pintado es múltiplo exacto.
      // (% es el resto de la división, igual que en Java; resto 0 = múltiplo exacto.)
      expect(dimensions.rendered % dimensions.natural).toBe(0);
      expect(dimensions.height).toBeGreaterThan(0);
    }
  }
});

test('los ciclos pixel se pausan fuera de pantalla', async ({ page }) => {
  await page.goto('/');
  // Escenario de la mariposa del hero.
  const stage = page.locator('.hero__butterfly');
  await stage.scrollIntoViewIfNeeded();
  // Visible en pantalla: la animación debe estar corriendo (no pausada).
  await expect(stage).toHaveAttribute('data-paused', 'false');
  // Truco: lo sacamos de la pantalla (arriba, a -1000 px) para simular que el visitante no lo ve.
  await stage.evaluate((el) => {
    (el as HTMLElement).style.position = 'fixed';
    (el as HTMLElement).style.top = '-1000px';
  });
  // Fuera de pantalla, el script debe marcarlo pausado y el CSS debe detener la animación.
  await expect(stage).toHaveAttribute('data-paused', 'true');
  await expect(stage.locator('.clip__strip:not([hidden])')).toHaveCSS(
    'animation-play-state',
    'paused',
  );
});

// axe mide colores reales: se espera a que acaben las entradas (la más larga dura ~1,5 s).
// Función auxiliar: espera 2 s fijos para que terminen las animaciones de entrada.
const settle = (page: Page) => page.waitForTimeout(2000);

// Se generan estas 3 pruebas para CADA ruta de `pages` (un describe por ruta).
for (const path of pages) {
  test.describe(path, () => {
    test('sin violaciones de accesibilidad (axe)', async ({ page }) => {
      // El inicio tiene muchas animaciones infinitas a la vez y axe tarda más en calcular contrastes.
      test.setTimeout(90_000);
      await page.goto(path);
      await settle(page);
      // analyze() audita la página; esperamos que la lista de violaciones esté vacía.
      const results = await new AxeBuilder({ page }).analyze();
      expect(results.violations).toEqual([]);
    });

    test('sin desbordamiento horizontal en 360 px y 1440 px', async ({ page }) => {
      // 360 px = móvil, 1440 px = escritorio.
      for (const width of [360, 1440]) {
        await page.setViewportSize({ width, height: 900 });
        await page.goto(path);
        // Si el contenido es más ancho que la ventana habría barra horizontal (diferencia > 0).
        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth - window.innerWidth,
        );
        expect(overflow).toBeLessThanOrEqual(0);
      }
    });

    test('con movimiento reducido todo queda visible y sin animaciones de entrada', async ({
      browser,
    }) => {
      // Contexto nuevo que simula la preferencia del sistema "reducir movimiento" (accesibilidad).
      const context = await browser.newContext({ reducedMotion: 'reduce' });
      const page = await context.newPage();
      await page.goto(path);
      // Cuenta las animaciones CSS/Web que siguen corriendo: debe ser 0.
      const running = await page.evaluate(
        () => document.getAnimations().filter((a) => a.playState === 'running').length,
      );
      expect(running).toBe(0);
      // Aun sin animaciones, el contenido principal debe verse.
      await expect(page.locator('main')).toBeVisible();
      // Cerrar el contexto que creamos a mano libera recursos.
      await context.close();
    });
  });
}

test('el avatar de cada página es decorativo y carga sus tiras', async ({ page }) => {
  for (const path of ['/', '/about', '/projects', '/stack', '/journey', '/contact']) {
    await page.goto(path);
    const cutin = page.locator('.cutin').first();
    // aria-hidden="true" lo oculta a lectores de pantalla: es solo decoración.
    await expect(cutin).toHaveAttribute('aria-hidden', 'true');
    for (const strip of await cutin.locator('.cutin__strip').all()) {
      await expect(strip).toHaveJSProperty('complete', true);
      expect(await strip.evaluate((img: HTMLImageElement) => img.naturalWidth)).toBeGreaterThan(0);
    }
  }
});

test('Contact muestra un icono pixel por cada medio de contacto', async ({ page }) => {
  await page.goto('/contact');
  // Deben ser exactamente 6 iconos en la lista de contacto.
  await expect(page.locator('.contact__list .contact__ico')).toHaveCount(6);
});

test('el selector de idioma cambia a español en la misma página y conserva el idioma al navegar', async ({
  page,
}) => {
  await page.goto('/stack');
  // Clic en el enlace de idioma español de la cabecera.
  await page.locator('.header__tools a[hreflang="es"]').click();
  // Una expresión regular (/.../) comprueba que la URL contenga /es/stack.
  await expect(page).toHaveURL(/\/es\/stack/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'es');
  await expect(page.locator('a.header__link[aria-current="page"]')).toHaveText('Stack');
  // Navegar a otra sección debe mantener el idioma español...
  await page.locator('a.header__link', { hasText: 'Proyectos' }).click();
  await expect(page).toHaveURL(/\/es\/projects/);
  await expect(page.locator('h1')).toHaveText('Proyectos');
  // ...y volver al inglés debe llevar a la versión sin /es.
  await page.locator('.header__tools a[hreflang="en"]').click();
  await expect(page).toHaveURL(/\/projects/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
});

test('las flechas entran al menú sin hacer clic y Enter abre el apartado', async ({ page }) => {
  await page.goto('/');
  const options = page.locator('.hero__options a');
  // Simula pulsar teclas reales. La primera flecha abajo debe enfocar la primera opción.
  await page.keyboard.press('ArrowDown');
  await expect(options.first()).toBeFocused();
  await page.keyboard.press('ArrowDown');
  await expect(options.nth(1)).toBeFocused();
  await expect(options.nth(1)).toHaveAttribute('data-sel', 'true');
  // Enter abre el apartado seleccionado (Projects).
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/projects/);
  await expect(page.locator('html')).not.toHaveAttribute('data-loading', { timeout: 5000 });
  // En Projects las flechas recorren los proyectos y cambian el detalle.
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('ArrowDown');
  await expect(page.locator('#project-details > [data-panel]:not([hidden]) h2')).toHaveText('LeeContigo IA');
});

test('la cabecera marca la página actual con aria-current', async ({ page }) => {
  await page.goto('/stack');
  // aria-current="page" indica a los lectores de pantalla en qué página estás.
  await expect(page.locator('a.header__link[aria-current="page"]')).toHaveText('Stack');
});

test('el hero no cambia el avatar con la opción y las flechas mueven el foco', async ({
  page,
}) => {
  await page.goto('/');
  const options = page.locator('.hero__options a');
  await options.first().focus();
  await page.keyboard.press('ArrowDown');
  await expect(options.nth(1)).toBeFocused();
  await expect(options.nth(1)).toHaveAttribute('data-sel', 'true');
  // Un solo avatar en reposo: seleccionar otra opción no lo cambia ni lo reinicia.
  await expect(page.locator('.hero .cutin')).toHaveCount(1);
});

test('elegir un proyecto cambia la carta y el detalle', async ({ page }) => {
  await page.goto('/projects');
  // hover() pasa el ratón por encima de la segunda fila de proyecto (índice 1: se empieza en 0).
  await page.locator('.project-row').nth(1).hover();
  await expect(page.locator('#project-details > [data-panel]:not([hidden]) h2')).toHaveText(
    'LeeContigo IA',
  );
});

test('Esc vuelve al inicio desde un apartado', async ({ page }) => {
  await page.goto('/journey');
  await page.keyboard.press('Escape');
  await expect(page).toHaveURL('/');
});

test('el chat de NishixAI abre, responde y se mantiene al cambiar de página', async ({ page }) => {
  await page.goto('/');
  // getByRole busca por rol accesible y nombre, como lo "ve" un lector de pantalla.
  await page.getByRole('button', { name: 'NishixAI' }).click();
  await page.getByRole('button', { name: 'Who is Iván?' }).click();
  // 3 burbujas: mensaje de bienvenida + pregunta + respuesta.
  await expect(page.locator('.chat__bubble')).toHaveCount(3);
  await page.locator('a.header__link', { hasText: 'Stack' }).click();
  await expect(page).toHaveURL(/\/stack$/);
  // Tras cambiar de página, la conversación sigue ahí.
  await expect(page.locator('.chat__bubble')).toHaveCount(3);
});

test('el Stack nunca supera el tope de su RANK', async ({ page }) => {
  await page.goto('/stack');
  // Record<string, number> = diccionario (como Map<String, Integer>): rango -> porcentaje máximo.
  const caps: Record<string, number> = { R1: 30, R2: 45, R3: 60, R4: 75, R5: 85 };
  const tiles = await page.locator('.tile').all();
  for (const tile of tiles) {
    const rank = (await tile.locator('.tile__rank').innerText()).trim();
    // parseInt(texto, 10) convierte "70%" en 70 (base decimal).
    const percent = parseInt(await tile.locator('.tile__percent').innerText(), 10);
    expect(percent).toBeLessThanOrEqual(caps[rank]);
  }
});
