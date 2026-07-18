import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/lab/', { waitUntil: 'domcontentloaded' });
});

test('loads every Component Lab category', async ({ page }) => {
  await expect(page).toHaveTitle(/Component Lab/);
  await expect(page.getByRole('heading', { level: 1, name: 'Component Lab' })).toBeVisible();

  for (const name of [
    'Images as functional examples',
    'Encapsulated behavior without a framework',
    'UI components without custom elements',
    'Real structures, not static diagrams',
    'Editorial range and stress testing',
    'The complete restored motion toolkit',
  ]) {
    await expect(page.getByRole('heading', { name })).toBeVisible();
  }
});

test('registers the restored custom elements', async ({ page }) => {
  const registered = await page.evaluate(() =>
    ['responsive-image', 'custom-card', 'toggle-switch', 'tabs-container'].every((name) =>
      Boolean(customElements.get(name)),
    ),
  );
  expect(registered).toBe(true);
});

test('interactive toggle reports its state', async ({ page }) => {
  const toggle = page.locator('#interactive-toggle').locator('input');
  await toggle.evaluate((input) => input.click());
  await expect(page.getByText('Toggle state: OFF')).toBeVisible();
});

test('Web Component tabs support keyboard navigation', async ({ page }) => {
  const tabs = page.locator('tabs-container').first();
  const first = tabs.locator('[role="tab"]').first();
  await first.focus();
  await page.keyboard.press('ArrowRight');
  await expect(tabs.locator('[role="tab"]').nth(1)).toBeFocused();
});

test('motion controls invoke the shipped animation framework', async ({ page }) => {
  await page.getByRole('button', { name: 'Pulse' }).click();
  await expect
    .poll(async () => page.locator('#basic-demo').evaluate((element) => element.getAnimations().length))
    .toBeGreaterThan(0);
});

test('has no serious or critical axe violations', async ({ page }) => {
  const results = await new AxeBuilder({ page }).analyze();
  const blocking = results.violations.filter((violation) =>
    ['serious', 'critical'].includes(violation.impact),
  );
  expect(blocking).toEqual([]);
});
