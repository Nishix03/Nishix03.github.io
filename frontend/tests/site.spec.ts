import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const pages = ['/', '/projects', '/stack', '/journey', '/contact'];

for (const path of pages) {
  test.describe(path, () => {
    test('sin violaciones de accesibilidad (axe)', async ({ page }) => {
      await page.goto(path);
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
  await expect(page.locator('#project-details > [data-panel]:not([hidden]) h3')).toHaveText(
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
