import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

import { createAccentPalette, contrastRatio } from '../../consumer/lib/color.mjs';
import {
  ConsumerGenerationError,
  createProjectFileSet,
  getRecipe,
  listRecipes,
} from '../../consumer/index.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

async function readConfig(name) {
  return JSON.parse(
    await readFile(path.join(root, 'consumer/fixtures/configs', `${name}.json`), 'utf8'),
  );
}

function countOccurrences(value, pattern) {
  return [...value.matchAll(pattern)].length;
}

describe('public Consumer Mode recipes', () => {
  it('publishes Blank and Portfolio with explicit contracts', () => {
    expect(listRecipes()).toEqual([
      expect.objectContaining({
        id: 'blank',
        version: 1,
        visualDirections: ['editorial', 'product'],
        compatibleFeatures: ['theme'],
      }),
      expect.objectContaining({
        id: 'portfolio',
        version: 1,
        visualDirections: ['editorial', 'product'],
        compatibleFeatures: ['theme'],
      }),
    ]);
    expect(() => getRecipe('product')).toThrow(/not implemented yet/);
  });

  it('creates accessible light and dark accents from user input', () => {
    const palette = createAccentPalette('#6D4AFF');
    expect(contrastRatio(palette.light, '#FBFAF8')).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(palette.dark, '#181716')).toBeGreaterThanOrEqual(4.5);
  });

  it('generates a small Blank project without requiring JavaScript', async () => {
    const config = await readConfig('blank-editorial');
    const fileSet = await createProjectFileSet({ config, recipe: getRecipe('blank') });

    expect([...fileSet.files.keys()]).toEqual([
      'PROJECT_BRIEF.md',
      'README.md',
      'index.html',
      'site.css',
      'site.webmanifest',
      'syntax.css',
      'syntax.project.json',
    ]);
    expect(fileSet.files.get('index.html')).not.toContain('site.js');
    expect(fileSet.files.get('index.html')).not.toContain('Generated with Syntax');
    expect(fileSet.files.get('syntax.css')).toContain('Syntax v1.2.0');
  });

  it('adds only the selected theme enhancement to the Product Blank fixture', async () => {
    const config = await readConfig('blank-product');
    const fileSet = await createProjectFileSet({ config, recipe: getRecipe('blank') });

    expect(fileSet.files.has('site.js')).toBe(true);
    expect(fileSet.files.get('site.js')).toContain('syntax-theme-preference');
    expect(fileSet.files.get('site.css')).toContain("[data-direction='product']");
  });

  it('supports one-project and six-project Portfolio outputs', async () => {
    const editorial = await createProjectFileSet({
      config: await readConfig('portfolio-editorial'),
      recipe: getRecipe('portfolio'),
    });
    const product = await createProjectFileSet({
      config: await readConfig('portfolio-product'),
      recipe: getRecipe('portfolio'),
    });

    expect(countOccurrences(editorial.files.get('index.html'), /class="project-card"/g)).toBe(1);
    expect(countOccurrences(product.files.get('index.html'), /class="project-card"/g)).toBe(6);
    expect(editorial.files.has('assets/project-1.svg')).toBe(true);
    expect(product.files.has('assets/project-6.svg')).toBe(true);
  });

  it('mirrors project data without requiring a client-side renderer', async () => {
    const fileSet = await createProjectFileSet({
      config: await readConfig('portfolio-product'),
      recipe: getRecipe('portfolio'),
    });
    const projects = JSON.parse(fileSet.files.get('content/projects.json'));

    expect(projects).toHaveLength(6);
    expect(fileSet.files.get('index.html')).toContain('Tiny Signals');
    expect(fileSet.files.get('site.js')).not.toContain('projects.json');
  });

  it('rejects incompatible features and invalid Portfolio sizes', async () => {
    const incompatible = await readConfig('blank-editorial');
    incompatible.features = ['dialog'];
    await expect(
      createProjectFileSet({ config: incompatible, recipe: getRecipe('blank') }),
    ).rejects.toThrow(ConsumerGenerationError);

    const oversized = await readConfig('portfolio-product');
    oversized.recipe.data.projects.push({ ...oversized.recipe.data.projects[0], title: 'Seventh' });
    await expect(
      createProjectFileSet({ config: oversized, recipe: getRecipe('portfolio') }),
    ).rejects.toThrow(/between one and six projects/);
  });

  it('keeps recipe identity in project CSS rather than the Syntax bundle', async () => {
    const editorial = await createProjectFileSet({
      config: await readConfig('portfolio-editorial'),
      recipe: getRecipe('portfolio'),
    });
    const product = await createProjectFileSet({
      config: await readConfig('portfolio-product'),
      recipe: getRecipe('portfolio'),
    });

    expect(editorial.files.get('syntax.css')).toBe(product.files.get('syntax.css'));
    expect(editorial.files.get('site.css')).not.toBe(product.files.get('site.css'));
    expect(editorial.files.get('site.css')).toContain('--consumer-card-radius: 0.125rem');
    expect(product.files.get('site.css')).toContain('--consumer-card-radius: var(--radius-xl)');
  });
});
