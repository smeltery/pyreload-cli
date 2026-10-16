import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readdirSync } from 'node:fs';
import { join } from 'node:path';

function routes(directory = 'website/out', prefix = ''): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if (entry.name.startsWith('_') || entry.name === '404') return [];
    const route = `${prefix}/${entry.name}`;
    return entry.isDirectory()
      ? routes(join(directory, entry.name), route)
      : entry.name === 'index.html'
        ? [`${prefix}/`]
        : [];
  });
}

test('all routes, local links, fragments and images resolve', async ({
  page,
  request,
}) => {
  const checked = new Set<string>();
  for (const route of routes()) {
    const response = await page.goto(route);
    expect(response?.status(), route).toBe(200);
    await expect(page.locator('h1')).toHaveCount(1);
    const targets = await page
      .locator('a[href], img[src]')
      .evaluateAll((nodes) =>
        nodes
          .map(
            (node) =>
              node.getAttribute(node.tagName === 'IMG' ? 'src' : 'href')!,
          )
          .filter((url) => url.startsWith('/') || url.startsWith('#')),
      );
    for (const target of targets) {
      const url = new URL(target, page.url());
      if (checked.has(url.href)) continue;
      checked.add(url.href);
      const result = await request.get(url.href);
      expect(result.ok(), url.href).toBeTruthy();
      if (url.hash) {
        const body = await result.text();
        expect(body, url.href).toContain(
          `id="${decodeURIComponent(url.hash.slice(1))}"`,
        );
      }
    }
    expect(
      await page
        .locator('img')
        .evaluateAll((images) =>
          images.every((image) => image.complete && image.naturalWidth > 0),
        ),
      route,
    ).toBeTruthy();
  }
  expect((await request.get('/not-a-real-page/')).status()).toBe(404);
});

test('search handles matches, no results, reset and Escape', async ({
  page,
}) => {
  await page.goto('/');
  await page
    .getByRole('button', { name: 'Search documentation', exact: true })
    .first()
    .click();
  const dialog = page.getByRole('dialog', { name: 'Find your next step.' });
  const input = dialog.getByRole('searchbox');
  await input.fill('zzzz-no-results');
  await expect(dialog.getByText('No matches this time.')).toBeVisible();
  await dialog.getByRole('button', { name: 'Reset search' }).click();
  await input.fill('polling');
  await dialog.getByRole('link', { name: /Polling mode/ }).click();
  await expect(page).toHaveURL(/user-guide\/polling-mode/);
  await page.keyboard.press('ControlOrMeta+k');
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).not.toBeVisible();
});

test('mobile menus, themes, and responsive reflow', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.getByRole('button', { name: 'Menu', exact: true }).click();
  await expect(
    page.getByRole('dialog', { name: 'Navigation', exact: true }),
  ).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(
    page.getByRole('button', { name: 'Menu', exact: true }),
  ).toBeFocused();
  await page.getByRole('button', { name: 'Menu', exact: true }).click();
  await page
    .getByRole('navigation', { name: 'Mobile navigation' })
    .getByRole('link', { name: /Getting started/ })
    .click();
  await expect(page.locator('h1')).toHaveText('Installation');
  await page
    .getByRole('button', { name: 'Open documentation navigation' })
    .click();
  await page
    .getByRole('dialog')
    .getByRole('link', { name: 'CLI reference', exact: true })
    .click();
  await expect(page.locator('h1')).toHaveText('CLI reference');
  await page.getByRole('button', { name: 'Toggle theme' }).click();
  await expect(page.locator('.docs-shell')).toHaveAttribute(
    'data-theme',
    'light',
  );
  await page.reload();
  await expect(page.locator('.docs-shell')).toHaveAttribute(
    'data-theme',
    'light',
  );
  for (const route of [
    '/',
    '/docs/api/',
    '/docs/api/cli-reference/',
    '/brand/',
  ]) {
    for (const width of [320, 390, 768, 780, 781, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(route);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        `${route} at ${width}`,
      ).toBeTruthy();
    }
  }
});

for (const route of ['/', '/docs/', '/docs/api/cli-reference/', '/brand/']) {
  test(`accessibility ${route}`, async ({ page }) => {
    await page.goto(route);
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    expect(results.violations).toEqual([]);
  });
}
