import { expect, test } from '@playwright/test';

for (const path of ['/guide/']) {
  test(`field guide follows the consumer contract at ${path}`, async ({ page }) => {
    await page.goto(path);

    await expect(page).toHaveTitle(/Syntax Field Guide/);
    await expect(
      page.getByRole('heading', {
        level: 1,
        name: 'Build a small website without first becoming a framework engineer.',
      }),
    ).toBeVisible();
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      'content',
      /beginner-friendly/i,
    );
    await expect(page.getByRole('navigation', { name: 'Guide navigation' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Start the walkthrough' })).toHaveAttribute(
      'href',
      '#workflow',
    );

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    );
    expect(overflow).toBe(false);
  });
}
