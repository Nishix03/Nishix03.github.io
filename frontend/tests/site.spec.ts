import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

const pages = ['/', '/projects', '/stack', '/journey', '/contact'];

test('sprites reales: cargan todas las hojas y conservan el tamaño de cuadro', async ({ page }) => {
  for (const path of pages) {
    await page.goto(path);
    await expect(page.locator('.sprite--placeholder')).toHaveCount(0);
    for (const strip of await page.locator('.sprite__strip, .clip__strip:not([hidden])').all()) {
      await expect(strip).toHaveJSProperty('complete', true);
      const dimensions = await strip.evaluate((img: HTMLImageElement) => ({
        natural: img.naturalWidth,
        rendered: img.width,
        height: img.naturalHeight,
      }));
      expect(dimensions.natural).toBeGreaterThan(0);
      // Los clips pueden ir a escala entera (la carta va ×3): el ancho pintado es múltiplo exacto.
      expect(dimensions.rendered % dimensions.natural).toBe(0);
      expect(dimensions.height).toBeGreaterThan(0);
    }
  }
});

test('los ciclos pixel se pausan fuera de pantalla', async ({ page }) => {
  await page.goto('/contact');
  const stage = page.locator('.contact__frisk');
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

test('Boyfriend canta con cada flecha, sostiene la pose y vuelve al reposo', async ({ page }) => {
  await page.goto('/');
  const boyfriend = page.locator('[data-actor="boyfriend"]');
  // Fuera de pantalla sus clips están en pausa (loops.ts) y la pose esperaría a verse.
  await boyfriend.scrollIntoViewIfNeeded();
  await expect(boyfriend).toHaveAttribute('data-clip', 'boyfriend-idle');
  for (const [key, dir] of [
    ['ArrowLeft', 'left'],
    ['ArrowRight', 'right'],
  ]) {
    await page.keyboard.down(key);
    await expect(boyfriend).toHaveAttribute('data-clip', `boyfriend-${dir}`);
    // Solo se enciende la flecha pulsada
    await expect(page.locator('[data-arrow][data-hit]')).toHaveAttribute('data-arrow', dir);
    await page.keyboard.up(key);
    await expect(boyfriend).toHaveAttribute('data-clip', 'boyfriend-idle');
    await expect(page.locator('[data-arrow][data-hit]')).toHaveCount(0);
  }
});

test('Blue-Eyes sale de la carta al cambiar de proyecto y se queda en el último cuadro', async ({
  page,
}) => {
  await page.goto('/projects');
  const strip = page.locator('[data-clip-name="blue-eyes-emerge-summon"]');
  await page.locator('.project-row').nth(2).hover();
  await expect
    .poll(() => strip.evaluate((img) => img.getAnimations()[0]?.playState))
    .toBe('finished');
  // Cuadro 11 de 12: la tira queda desplazada 11 cuadros de 256 px.
  await expect(strip).toHaveCSS('transform', 'matrix(1, 0, 0, 1, -2816, 0)');
});

test('Springtrap se traba sin cambiar de lado y gira en el extremo', async ({ page }) => {
  await page.goto('/stack');
  const patrol = page.locator('.stack__patrol');
  const springtrap = page.locator('[data-actor="springtrap"]');
  // Tras ~6 ciclos de paso (≈5 s) se traba mirando hacia donde caminaba.
  await expect(patrol).toHaveAttribute('data-phase', 'glitch', { timeout: 8000 });
  await expect(springtrap).toHaveAttribute('data-clip', 'springtrap-glitch-right');
  await expect(patrol).toHaveAttribute('data-phase', 'walk');
  // Se adelanta el recorrido hasta el final: llega al extremo, gira y vuelve por la izquierda.
  await patrol.locator('.stack__patrol-track').evaluate((el) => {
    const anim = el.getAnimations()[0];
    if (anim) anim.currentTime = Number(anim.effect?.getTiming().duration) - 50;
  });
  await expect(springtrap).toHaveAttribute('data-clip', 'springtrap-turn-left');
  await expect(patrol).toHaveAttribute('data-dir', 'left');
  await expect(springtrap).toHaveAttribute('data-clip', 'springtrap-walk-left');
});

test('Frisk saluda al llegar a Contact y vuelve al reposo', async ({ page }) => {
  await page.goto('/contact');
  const frisk = page.locator('[data-actor="frisk"]');
  await frisk.scrollIntoViewIfNeeded();
  await expect(frisk).toHaveAttribute('data-clip', 'frisk-greet');
  await expect(frisk).toHaveAttribute('data-clip', 'frisk-idle');
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

test('la cabecera marca la página actual con aria-current', async ({ page }) => {
  await page.goto('/stack');
  await expect(page.locator('a.header__link[aria-current="page"]')).toHaveText('Stack');
});

test('el hero cambia la pose al enfocar otra opción y las flechas mueven el foco', async ({
  page,
}) => {
  await page.goto('/');
  const options = page.locator('.hero__options a');
  await options.first().focus();
  await page.keyboard.press('ArrowDown');
  await expect(options.nth(1)).toBeFocused();
  await expect(options.nth(1)).toHaveAttribute('data-sel', 'true');
  await expect(page.locator('.hero__pose:not([hidden])')).toContainText('POSE 2');
});

test('elegir un proyecto cambia la carta, el detalle y el numeral de la tableta', async ({
  page,
}) => {
  await page.goto('/projects');
  await page.locator('.project-row').nth(1).hover();
  await expect(page.locator('#project-details > [data-panel]:not([hidden]) h2')).toHaveText(
    'LeeContigo IA',
  );
  await expect(page.locator('#project-numerals > :not([hidden])')).toHaveText('II');
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
