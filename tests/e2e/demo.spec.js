import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/demo/');
});

test('loads the canonical Syntax showcase', async ({ page }) => {
  await expect(page).toHaveTitle(/Syntax/);
  await expect(page.getByRole('heading', { level: 1, name: 'Syntax' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Use this template' })).toBeVisible();
});

test('tabs work with keyboard navigation', async ({ page }) => {
  const uiTab = page.getByRole('tab', { name: 'UI' });
  await uiTab.focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('tab', { name: 'Typography' })).toBeFocused();
  await expect(page.getByRole('tabpanel', { name: 'Typography' })).toBeVisible();
});

test('dialog restores focus to its trigger', async ({ page }) => {
  const trigger = page.getByRole('button', { name: 'Open dialog' });
  await trigger.click();
  await expect(page.getByRole('dialog', { name: 'A dependable dialog' })).toBeVisible();
  await page.getByRole('button', { name: 'Done' }).click();
  await expect(trigger).toBeFocused();
});

test('theme preference cycles explicitly', async ({ page }) => {
  const toggle = page.getByRole('button', { name: /Theme preference/ });
  await toggle.click();
  await expect(page.locator('html')).toHaveAttribute('data-theme-preference', 'light');
  await toggle.click();
  await expect(page.locator('html')).toHaveAttribute('data-theme-preference', 'dark');
});

test('has no serious or critical axe violations', async ({ page }) => {
  const results = await new AxeBuilder({ page }).analyze();
  const blocking = results.violations.filter((violation) =>
    ['serious', 'critical'].includes(violation.impact),
  );
  expect(blocking).toEqual([]);
});
