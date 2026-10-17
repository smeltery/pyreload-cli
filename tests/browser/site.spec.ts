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
  const missing = await request.get('/not-a-real-page/');
  expect(missing.status()).toBe(404);
  expect(await missing.text()).toContain('Back to a fresh start.');
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

test('clipboard denial gives visible recovery instructions', async ({
  page,
}) => {
  await page.goto('/');
  await page.evaluate(() =>
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: () => Promise.reject(new Error('Clipboard denied')) },
    }),
  );
  await page.getByRole('button', { name: 'Copy command' }).first().click();
  await expect(
    page
      .getByRole('status')
      .filter({ hasText: 'Copy unavailable. Select the text to copy.' }),
  ).toBeVisible();
});

test('docs chat popover matches the reference and supports keyboard dismissal', async ({
  page,
  request,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/docs/api/');
  const trigger = page.locator('.chat-links summary');
  await trigger.click();
  const menu = page.locator('.chat-menu');
  await expect(menu).toBeVisible();
  await expect(menu.getByRole('link')).toHaveCount(6);
  expect((await menu.boundingBox())?.width).toBe(224);
  for (const provider of ['v0', 'chatgpt', 'claude', 't3', 'scira', 'cursor']) {
    expect((await request.get(`/chat/${provider}.svg`)).status()).toBe(200);
  }
  const chat = menu.getByRole('link', { name: 'Open in ChatGPT' });
  expect(
    new URL((await chat.getAttribute('href'))!).searchParams.get('prompt'),
  ).toContain('http://127.0.0.1:3015/docs/api/');
  await trigger.press('Tab');
  await expect(menu.getByRole('link', { name: 'Open in v0' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(menu).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await trigger.click();
  await page.locator('h1').click();
  await expect(menu).not.toBeVisible();
  await page.getByRole('button', { name: 'Toggle theme' }).click();
  await trigger.click();
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .analyze();
  expect(results.violations).toEqual([]);
  await page.locator('.docs-toc a[href="#configuration"]').click();
  await expect(
    page.locator('.docs-toc a[href="#configuration"]'),
  ).toHaveAttribute('aria-current', 'location');
});

test('home examples support keyboard selection, copying, and expandable answers', async ({
  page,
}) => {
  await page.goto('/');
  const moduleTab = page.getByRole('tab', { name: 'Python module' });
  await page.getByRole('tab', { name: 'Python script' }).focus();
  await page.keyboard.press('ArrowRight');
  await expect(moduleTab).toBeFocused();
  await expect(moduleTab).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByRole('tabpanel')).toContainText(
    "pyreload -x 'python -m http.server 8000' -w '*.html'",
  );
  await page.evaluate(() =>
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: async (text: string) => {
          document.body.dataset.copied = text;
        },
      },
    }),
  );
  await page
    .getByRole('button', { name: 'Copy example command', exact: true })
    .click();
  await expect(page.locator('body')).toHaveAttribute(
    'data-copied',
    "pyreload -x 'python -m http.server 8000' -w '*.html'",
  );
  await moduleTab.focus();
  await page.keyboard.press('End');
  await expect(page.getByRole('tabpanel')).toContainText(
    'pyreload app.py --polling',
  );
  await page
    .getByRole('button', { name: 'Copy example configuration' })
    .click();
  const config = JSON.parse(
    (await page.locator('body').getAttribute('data-copied'))!,
  );
  expect(config.watch).toEqual(['*.py', '*.html']);
  await page
    .getByText('What if changes in Docker are not detected?', { exact: true })
    .click();
  await expect(
    page.getByRole('link', { name: 'Set up Docker', exact: true }),
  ).toBeVisible();
});

test('code examples are highlighted in static HTML and readable in both themes', async ({
  page,
  request,
}) => {
  const home = await (await request.get('/')).text();
  expect(home).toContain('hljs-built_in');
  expect(home).toContain('hljs-attr');
  await page.goto('/docs/user-guide/config-files/');
  const key = page.locator('pre code .hljs-attr').first();
  await expect(key).toBeVisible();
  const darkColor = await key.evaluate((el) => getComputedStyle(el).color);
  await page.getByRole('button', { name: 'Toggle theme' }).click();
  const lightColor = await key.evaluate((el) => getComputedStyle(el).color);
  expect(lightColor).not.toBe(darkColor);
  for (const theme of ['light', 'dark']) {
    if (theme === 'dark')
      await page.getByRole('button', { name: 'Toggle theme' }).click();
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2aa'])
      .analyze();
    expect(results.violations).toEqual([]);
  }
  await page.goto('/docs/getting-started/quick-start/');
  await expect(
    page.locator('code.language-python .hljs-built_in').first(),
  ).toBeVisible();
  await page.goto('/docs/use-cases/docker/');
  await expect(
    page.locator('code.language-dockerfile .hljs-keyword').first(),
  ).toBeVisible();
});
