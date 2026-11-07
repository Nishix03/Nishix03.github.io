import AxeBuilder from '@axe-core/playwright';
import { expect, test as base, type Page } from '@playwright/test';

// El fixture espera a que la interfaz y el retrato salgan de la espera compartida.
const test = base.extend({
  page: async ({ page }, use) => {
    const goto = page.goto.bind(page);
    page.goto = async (...args) => {
      const res = await goto(...args);
      await expect(page.locator('html')).not.toHaveAttribute('data-loading', { timeout: 10000 });
      return res;
    };
    await use(page);
  },
});

const pages = ['/', '/about', '/projects', '/stack', '/journey', '/contact', '/es/', '/es/contact'];

test('en móvil la interfaz y el retrato aparecen juntos al entrar y al navegar', async ({
  browser,
}) => {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  let release = () => {};
  const hold = () => new Promise<void>((resolve) => { release = resolve; });
  let pending = hold();
  await page.route('**/avatar/**', async (route) => {
    await pending;
    await route.continue();
  });
  try {
    await page.goto('/about', { waitUntil: 'domcontentloaded' });
    const assertPending = async () => {
      await expect(page.locator('html')).toHaveAttribute('data-loading');
      await expect(page.locator('main h1')).toBeHidden();
      await expect(page.locator('.cutin')).toBeHidden();
      await expect(page.locator('.page-enter')).toHaveCSS('animation-play-state', 'paused');
    };
    const assertVisible = async () => {
      await expect(page.locator('html')).not.toHaveAttribute('data-loading', { timeout: 10000 });
      await expect(page.locator('main h1')).toBeVisible();
      await expect(page.locator('.cutin')).toBeVisible();
    };
    await assertPending();
    release();
    await assertVisible();
    const entry = page.locator('.cutin__art > .cutin__clip--entry img');
    await expect.poll(() => entry.evaluate((img: HTMLImageElement) => img.currentSrc))
      .toMatch(/about-entry-mobile\.webp$/);
    pending = hold();
    await page.locator('#site-menu a[href="/stack"]').click();
    await page.waitForURL('**/stack');
    await assertPending();
    release();
    await assertVisible();
  } finally {
    release();
    await page.close();
  }
});

test('el relevo de las tiras del retrato mantiene un clip completamente visible', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await expect(page.locator('.cutin')).not.toHaveAttribute('data-rest-pending', { timeout: 10000 });
  const opacities = await page.locator('.cutin__art > .cutin__clip').evaluateAll((clips) => {
    const animations = clips.flatMap((clip) => clip.getAnimations());
    animations.forEach((animation) => animation.pause());
    // Cambio de entrada a reposo, mitad y reinicio del bucle de reposo.
    return [800, 800.5, 801, 3998, 4000, 4001, 7199, 7200].map((time) => {
      animations.forEach((animation) => { animation.currentTime = time; });
      return clips.map((clip) => Number(getComputedStyle(clip).opacity));
    });
  });
  for (const sample of opacities) {
    expect(sample).toContain(1);
    expect(sample.every((value) => value === 0 || value === 1)).toBe(true);
  }
});

test('pasar el cursor conserva el sprite visible mientras el siguiente se descarga', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  let release = () => {};
  const pending = new Promise<void>((resolve) => { release = resolve; });
  await page.route('**/p3-butterfly-hover.webp', async (route) => {
    await pending;
    await route.continue();
  });
  try {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    const actor = page.locator('[data-actor="butterfly"]');
    await page.locator('.hero__stage').hover();
    await page.waitForTimeout(200); // El cambio por puntero se decide tras 140 ms.
    await expect(actor.locator('img:not([hidden])')).toHaveAttribute('data-clip-name', 'p3-butterfly-fly');
    release();
    await expect(actor.locator('img:not([hidden])')).toHaveAttribute('data-clip-name', 'p3-butterfly-hover');
    await page.mouse.move(0, 0);
    await expect(actor.locator('img:not([hidden])')).toHaveAttribute('data-clip-name', 'p3-butterfly-fly');
    await expect(page.locator('.cutin')).toBeVisible();
  } finally {
    release();
  }
});

test('NishixAI carga al pulsar el botón y responde al primer Enter', async ({ page }) => {
  await page.goto('/');
  const button = page.getByRole('button', { name: 'NishixAI' });
  const island = page.locator('astro-island[client="chat"]');
  await expect(island).toHaveAttribute('ssr');
  await button.press('Enter');
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(island).not.toHaveAttribute('ssr');
  await expect(page.locator('.chat__input')).toBeFocused();
});

test('sprites reales: cargan todas las hojas y conservan el tamaño de cuadro', async ({ page }) => {
  test.setTimeout(90_000); // recorre seis páginas con hojas grandes
  for (const path of pages) {
    await page.goto(path);
    await expect(page.locator('.sprite--placeholder')).toHaveCount(0);
    for (const strip of await page.locator('.sprite__strip, .clip__strip:not([hidden])').all()) {
      await expect(strip).toHaveJSProperty('complete', true);
      const dimensions = await strip.evaluate((img: HTMLImageElement) => ({
        natural: img.naturalWidth,
        rendered: img.width,
        height: img.height,
        naturalHeight: img.naturalHeight,
        declaredWidth: Number(img.getAttribute('width')),
        declaredHeight: Number(img.getAttribute('height')),
      }));
      expect(dimensions.natural).toBeGreaterThan(0);
      expect(dimensions.naturalHeight).toBeGreaterThan(0);
      // La carta va a ×3 y la mariposa a ×1,15. El navegador redondea al píxel.
      expect(Math.abs(dimensions.rendered - dimensions.declaredWidth)).toBeLessThanOrEqual(1);
      expect(Math.abs(dimensions.height - dimensions.declaredHeight)).toBeLessThanOrEqual(1);
      expect(Math.abs(dimensions.height - dimensions.rendered * dimensions.naturalHeight / dimensions.natural))
        .toBeLessThanOrEqual(1.5);
    }
  }
});

test('los ciclos pixel se pausan fuera de pantalla', async ({ page }) => {
  await page.goto('/');
  const stage = page.locator('.hero__butterfly');
  await stage.scrollIntoViewIfNeeded();
  await expect(stage).toHaveAttribute('data-paused', 'false');
  await stage.evaluate((el) => {
    (el as HTMLElement).style.position = 'fixed';
    (el as HTMLElement).style.top = '-1000px';
  });
  await expect(stage).toHaveAttribute('data-paused', 'true');
  await expect(stage.locator('.clip__strip:not([hidden])')).toHaveCSS(
    'animation-play-state',
    'paused',
  );
});

// axe mide colores reales: se espera a que acaben las entradas (la más larga dura ~1,5 s).
const settle = (page: Page) => page.waitForTimeout(2000);

for (const path of pages) {
  test.describe(path, () => {
    test('sin violaciones de accesibilidad (axe)', async ({ page }) => {
      // El inicio tiene muchas animaciones infinitas a la vez y axe tarda más en calcular contrastes.
      test.setTimeout(90_000);
      await page.goto(path);
      await settle(page);
      const results = await new AxeBuilder({ page }).analyze();
      expect(results.violations).toEqual([]);
    });

    test('sin desbordamiento horizontal en 360 px y 1440 px', async ({ page }) => {
      for (const width of [360, 1440]) {
        await page.setViewportSize({ width, height: 900 });
        await page.goto(path);
        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth - window.innerWidth,
        );
        expect(overflow).toBeLessThanOrEqual(0);
      }
    });

    test('con movimiento reducido todo queda visible y sin animaciones de entrada', async ({
      browser,
    }) => {
      const context = await browser.newContext({ reducedMotion: 'reduce' });
      const page = await context.newPage();
      await page.goto(path);
      const running = await page.evaluate(
        () => document.getAnimations().filter((a) => a.playState === 'running').length,
      );
      expect(running).toBe(0);
      await expect(page.locator('main')).toBeVisible();
      await context.close();
    });
  });
}

test('el avatar de cada página es decorativo y carga sus tiras', async ({ page }) => {
  for (const path of ['/', '/about', '/projects', '/stack', '/journey', '/contact']) {
    await page.goto(path);
    const cutin = page.locator('.cutin').first();
    await expect(cutin).toHaveAttribute('aria-hidden', 'true');
    for (const strip of await cutin.locator('.cutin__strip').all()) {
      await expect(strip).toHaveJSProperty('complete', true);
      expect(await strip.evaluate((img: HTMLImageElement) => img.naturalWidth)).toBeGreaterThan(0);
    }
  }
});

test('Contact muestra un icono pixel por cada medio de contacto', async ({ page }) => {
  await page.goto('/contact');
  await expect(page.locator('.contact__list .contact__ico')).toHaveCount(6);
});

test('el selector de idioma cambia a español en la misma página y conserva el idioma al navegar', async ({
  page,
}) => {
  await page.goto('/stack');
  await page.locator('.header__tools a[hreflang="es"]').click();
  await expect(page).toHaveURL(/\/es\/stack/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'es');
  await expect(page.locator('a.header__link[aria-current="page"]')).toHaveText('Stack');
  await page.locator('a.header__link', { hasText: 'Proyectos' }).click();
  await expect(page).toHaveURL(/\/es\/projects/);
  await expect(page.locator('h1')).toHaveText('Proyectos');
  await page.locator('.header__tools a[hreflang="en"]').click();
  await expect(page).toHaveURL(/\/projects/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
});

test('las flechas entran al menú sin hacer clic y Enter abre el apartado', async ({ page }) => {
  await page.goto('/');
  const options = page.locator('.hero__options a');
  await page.keyboard.press('ArrowDown');
  await expect(options.first()).toBeFocused();
  await page.keyboard.press('ArrowDown');
  await expect(options.nth(1)).toBeFocused();
  await expect(options.nth(1)).toHaveAttribute('data-sel', 'true');
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
  await page.getByRole('button', { name: 'NishixAI' }).click();
  await page.getByRole('button', { name: 'Who is Iván?' }).click();
  await expect(page.locator('.chat__bubble')).toHaveCount(3);
  await page.locator('a.header__link', { hasText: 'Stack' }).click();
  await expect(page).toHaveURL(/\/stack$/);
  await expect(page.locator('.chat__bubble')).toHaveCount(3);
});

test('el Stack nunca supera el tope de su RANK', async ({ page }) => {
  await page.goto('/stack');
  const caps: Record<string, number> = { R1: 30, R2: 45, R3: 60, R4: 75, R5: 85 };
  const tiles = await page.locator('.tile').all();
  for (const tile of tiles) {
    const rank = (await tile.locator('.tile__rank').innerText()).trim();
    const percent = parseInt(await tile.locator('.tile__percent').innerText(), 10);
    expect(percent).toBeLessThanOrEqual(caps[rank]);
  }
});
