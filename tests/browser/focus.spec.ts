import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('search focuses the rounded field and preserves visible keyboard navigation', async ({
  page,
}) => {
  for (const route of ['/', '/docs/api/']) {
    await page.goto(route);
    for (const width of [390, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await page
        .getByRole('button', { name: 'Search documentation' })
        .first()
        .click();
      const dialog = page.getByRole('dialog', { name: 'Find your next step.' });
      const input = dialog.getByRole('searchbox');
      await expect(input).toBeFocused();
      expect(
        await input.evaluate((el) => getComputedStyle(el).outlineStyle),
      ).toBe('none');
      const field = dialog.locator('.panel-search');
      expect(
        await field.evaluate((el) => ({
          outline: getComputedStyle(el).outlineWidth,
          radius: getComputedStyle(el).borderRadius,
        })),
      ).toEqual({ outline: '2px', radius: '12px' });
      await input.fill('polling');
      await page.keyboard.press('Tab');
      const result = dialog.getByRole('link', { name: /Polling/ });
      await expect(result).toBeFocused();
      expect(
        await result.evaluate((el) => getComputedStyle(el).outlineWidth),
      ).toBe('2px');
      const audit = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
        .analyze();
      expect(audit.violations).toEqual([]);
      await page.keyboard.press('Escape');
      await expect(dialog).not.toBeVisible();
    }
  }
});

test('text selection stays readable in both documentation themes and highlighted code', async ({
  page,
}) => {
  await page.goto('/docs/user-guide/config-files/');
  for (const theme of ['dark', 'light']) {
    if (theme === 'light')
      await page.getByRole('button', { name: 'Toggle theme' }).click();
    for (const selector of ['h1', 'code .hljs-attr']) {
      const colors = await page
        .locator(selector)
        .first()
        .evaluate((el) => {
          const selection = getComputedStyle(el, '::selection');
          return {
            color: selection.color,
            background: selection.backgroundColor,
          };
        });
      expect(colors).toEqual({
        color: 'rgb(41, 43, 37)',
        background: 'rgb(213, 223, 199)',
      });
    }
  }
});
