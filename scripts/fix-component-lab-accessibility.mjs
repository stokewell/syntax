import { readFile, rm, writeFile } from 'node:fs/promises';

async function replaceRequired(path, replacements) {
  const url = new URL(`../${path}`, import.meta.url);
  let source = await readFile(url, 'utf8');

  for (const [before, after, description] of replacements) {
    if (!source.includes(before)) {
      throw new Error(`Unable to locate ${description} in ${path}.`);
    }
    source = source.replace(before, after);
  }

  await writeFile(url, source);
}

await replaceRequired('js/components/web-components.js', [
  ['          <img hidden>', '          <img alt="" hidden>', 'Custom Card image template'],
  [
    `        button.setAttribute('aria-controls', itemId);\n        button.textContent = item.getAttribute('label') || \`Tab \${index + 1}\`;`,
    `        const label = item.getAttribute('label') || \`Tab \${index + 1}\`;\n        button.textContent = label;`,
    'cross-shadow aria-controls assignment',
  ],
  [
    `        item.setAttribute('aria-labelledby', button.id);`,
    `        item.removeAttribute('aria-labelledby');\n        item.setAttribute('aria-label', label);`,
    'cross-shadow aria-labelledby assignment',
  ],
]);

await replaceRequired('lab/index.html', [
  [
    `                    <button class="btn-outline-sm" type="button" tabindex="-1">View details</button>`,
    `                    <span class="small">Activate the whole card</span>`,
    'nested image-card button',
  ],
]);

await replaceRequired('tests/e2e/lab.spec.js', [
  [
    `test('restored image examples load successfully', async ({ page }) => {\n  const loaded = await page.evaluate(async () => {\n    const images = [\n      document.querySelector('responsive-image')?.shadowRoot?.querySelector('img'),\n      document.querySelector('#image-custom-card')?.shadowRoot?.querySelector('img'),\n      document.querySelector('.lab-media-frame img'),\n    ].filter(Boolean);\n\n    await Promise.all(\n      images.map((image) =>\n        image.complete\n          ? Promise.resolve()\n          : new Promise((resolve, reject) => {\n              image.addEventListener('load', resolve, { once: true });\n              image.addEventListener('error', reject, { once: true });\n            }),\n      ),\n    );\n    return images.length === 3 && images.every((image) => image.naturalWidth > 0);\n  });\n  expect(loaded).toBe(true);\n});`,
    `test('restored image examples load successfully', async ({ page }) => {\n  const images = [\n    page.locator('responsive-image img'),\n    page.locator('#image-custom-card img'),\n    page.locator('.lab-media-frame img'),\n  ];\n\n  for (const image of images) {\n    await image.scrollIntoViewIfNeeded();\n    await expect\n      .poll(async () => image.evaluate((element) => element.complete && element.naturalWidth > 0))\n      .toBe(true);\n  }\n});`,
    'lazy-image test',
  ],
]);

await replaceRequired('.github/workflows/ci.yml', [
  [
    `      - name: Run browser and accessibility tests\n        run: npm run test:e2e > e2e-report.txt 2>&1\n\n      - name: Upload browser test report\n        if: always()\n        uses: actions/upload-artifact@v4\n        with:\n          name: component-lab-e2e-report\n          path: e2e-report.txt\n`,
    `      - name: Run browser and accessibility tests\n        run: npm run test:e2e\n`,
    'temporary browser report upload',
  ],
]);

await rm(new URL('./fix-component-lab-accessibility.mjs', import.meta.url));
await rm(new URL('../.github/workflows/fix-component-lab-accessibility.yml', import.meta.url));
