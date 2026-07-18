import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

async function reportHitTarget(locator, label) {
  await locator.scrollIntoViewIfNeeded();
  const details = await locator.evaluate((element) => {
    const rect = element.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const stack = document
      .elementsFromPoint(x, y)
      .slice(0, 8)
      .map((node) => ({
        tag: node.tagName,
        id: node.id,
        className: typeof node.className === 'string' ? node.className : '',
        position: window.getComputedStyle(node).position,
        zIndex: window.getComputedStyle(node).zIndex,
        pointerEvents: window.getComputedStyle(node).pointerEvents,
      }));
    return {
      viewport: { width: window.innerWidth, height: window.innerHeight, scrollY: window.scrollY },
      rect: { left: rect.left, top: rect.top, width: rect.width, height: rect.height },
      stack,
    };
  });
  console.warn(`${label}: ${JSON.stringify(details)}`);
}

test.beforeEach(async ({ page }) => {
  await page.goto('/demo/', { waitUntil: 'domcontentloaded' });
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

test('dialog restores focus to its trigger', async ({ page }, testInfo) => {
  const trigger = page.getByRole('button', { name: 'Open dialog' });
  if (testInfo.project.name === 'mobile-chromium') await reportHitTarget(trigger, 'dialog-trigger-hit-test');
  await trigger.click();
  await expect(page.getByRole('dialog', { name: 'A dependable dialog' })).toBeVisible();
  await page.getByRole('button', { name: 'Done' }).click();
  await expect(trigger).toBeFocused();
});

test('theme preference cycles explicitly', async ({ page }, testInfo) => {
  const toggle = page.getByRole('button', { name: /Theme preference/ });
  if (testInfo.project.name === 'mobile-chromium') await reportHitTarget(toggle, 'theme-toggle-hit-test');
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
