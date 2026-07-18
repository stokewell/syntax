import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function replaceOnce(source, search, replacement, file) {
  if (!source.includes(search)) throw new Error(`Missing migration anchor in ${file}`);
  return source.replace(search, replacement);
}

async function transform(relativePath, callback) {
  const filePath = path.join(root, relativePath);
  const source = await readFile(filePath, 'utf8');
  await writeFile(filePath, callback(source, relativePath), 'utf8');
}

await transform('consumer/recipes/shared.mjs', (source, file) => {
  let next = replaceOnce(
    source,
    "import { createSyntaxCssBundle } from '../../scripts/lib/syntax-bundle.mjs';",
    "import { createSyntaxCssBundle } from '../../scripts/lib/syntax-bundle.mjs';\nimport { renderFeatureScript } from '../lib/features.mjs';\nimport { createProjectToolingFiles } from '../lib/project-files.mjs';",
    file,
  );
  next = replaceOnce(
    next,
    "  if (hasFeature(config, 'theme')) {\n    files.push({ path: 'site.js', content: renderThemeScript() });\n  }\n\n  return files;",
    "  files.push(...createProjectToolingFiles(config));\n\n  const featureScript = renderFeatureScript(config);\n  if (featureScript) files.push({ path: 'site.js', content: featureScript });\n\n  return files;",
    file,
  );
  return next;
});

await transform('consumer/recipes/blank.mjs', (source, file) => {
  let next = replaceOnce(
    source,
    "import { renderDirectionVariables } from '../directions/index.mjs';",
    "import { renderDirectionVariables } from '../directions/index.mjs';\nimport {\n  navigationAttributes,\n  renderDialogAction,\n  renderFeatureCss,\n  renderMobileNavigationToggle,\n  renderProjectDialog,\n  responsiveImageAttributes,\n} from '../lib/features.mjs';",
    file,
  );
  next = replaceOnce(
    next,
    'function renderIndex(config) {',
    "function renderBlankArtwork(config) {\n  return `<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 1200 720\" role=\"img\" aria-labelledby=\"title description\">\n  <title id=\"title\">${escapeHtml(config.project.name)} concept artwork</title>\n  <desc id=\"description\">An abstract composition generated for ${escapeHtml(config.project.name)}.</desc>\n  <rect width=\"1200\" height=\"720\" fill=\"#F3EFEA\" />\n  <circle cx=\"940\" cy=\"160\" r=\"300\" fill=\"${escapeHtml(config.accentColor)}\" opacity=\"0.18\" />\n  <path d=\"M120 560 420 220l230 250 170-160 250 250Z\" fill=\"none\" stroke=\"#24211F\" stroke-width=\"30\" stroke-linejoin=\"round\" />\n</svg>`;\n}\n\nfunction renderIndex(config) {",
    file,
  );
  next = replaceOnce(
    next,
    "  const themeScript = hasFeature(config, 'theme') ? '<script src=\"./site.js\" defer></script>' : '';",
    "  const featureScript = config.features.length > 0 ? '<script src=\"./site.js\" defer></script>' : '';",
    file,
  );
  next = replaceOnce(
    next,
    '        <a class="site-name" href="#top">${escapeHtml(config.project.name)}</a>\n        <nav class="site-nav" aria-label="Primary navigation">',
    '        <a class="site-name" href="#top">${escapeHtml(config.project.name)}</a>\n        ${renderMobileNavigationToggle(config)}\n        <nav class="site-nav" ${navigationAttributes(config)} aria-label="Primary navigation">',
    file,
  );
  next = replaceOnce(
    next,
    '<div class="blank-hero__actions">${renderActions(config)}</div>',
    '<div class="blank-hero__actions">${renderActions(config)}${renderDialogAction(config)}</div>',
    file,
  );
  next = replaceOnce(
    next,
    '          <p class="blank-hero__note">${escapeHtml(data.note)}</p>',
    "          <p class=\"blank-hero__note\">${escapeHtml(data.note)}</p>\n          ${\n            config.features.includes('responsive-image')\n              ? `<figure class=\"blank-hero__art\"><img src=\"./assets/hero-art.svg\" width=\"1200\" height=\"720\" alt=\"Abstract concept artwork for ${escapeHtml(config.project.name)}\" loading=\"eager\" ${responsiveImageAttributes(config)} /></figure>`\n              : ''\n          }",
    file,
  );
  next = replaceOnce(
    next,
    '    ${themeScript}\n  </body>',
    '    ${renderProjectDialog(config, escapeHtml)}\n    ${featureScript}\n  </body>',
    file,
  );
  next = replaceOnce(
    next,
    "@media (prefers-reduced-motion: reduce) {\n  html {\n    scroll-behavior: auto;\n  }\n}`;",
    "@media (prefers-reduced-motion: reduce) {\n  html {\n    scroll-behavior: auto;\n  }\n}\n\n.blank-hero__art {\n  max-width: 52rem;\n  margin: var(--space-6) auto 0;\n  overflow: hidden;\n  border-radius: var(--consumer-card-radius);\n}\n\n.blank-hero__art img {\n  display: block;\n  width: 100%;\n  height: auto;\n}\n\n${renderFeatureCss(config)}`;",
    file,
  );
  next = replaceOnce(
    next,
    "    { path: 'site.css', render: () => renderSiteCss(config) },",
    "    { path: 'site.css', render: () => renderSiteCss(config) },\n    { path: 'assets/hero-art.svg', render: () => renderBlankArtwork(config) },",
    file,
  );
  next = replaceOnce(
    next,
    "  compatibleFeatures: Object.freeze(['theme']),",
    "  compatibleFeatures: Object.freeze([\n    'theme',\n    'mobile-navigation',\n    'responsive-image',\n    'dialog',\n  ]),",
    file,
  );
  next = next.replace('- `site.js`: optional theme preference behavior when selected', '- `site.js`: selected optional behavior only\n- `tests/consumer.spec.js`: consumer-specific browser and accessibility checks');
  return next;
});

await transform('consumer/recipes/portfolio.mjs', (source, file) => {
  let next = replaceOnce(
    source,
    "import { renderDirectionVariables } from '../directions/index.mjs';",
    "import { renderDirectionVariables } from '../directions/index.mjs';\nimport {\n  navigationAttributes,\n  renderDialogAction,\n  renderFeatureCss,\n  renderMobileNavigationToggle,\n  renderProjectDialog,\n  responsiveImageAttributes,\n} from '../lib/features.mjs';",
    file,
  );
  next = replaceOnce(next, 'function renderProjectCard(project, index) {', 'function renderProjectCard(config, project, index) {', file);
  next = replaceOnce(
    next,
    "const cards = data.projects.map((project, index) => renderProjectCard(project, index)).join('');",
    "const cards = data.projects.map((project, index) => renderProjectCard(config, project, index)).join('');",
    file,
  );
  next = replaceOnce(next, '      decoding="async"\n    />', '      decoding="async"\n      ${responsiveImageAttributes(config)}\n    />', file);
  next = replaceOnce(
    next,
    "  const themeScript = hasFeature(config, 'theme') ? '<script src=\"./site.js\" defer></script>' : '';",
    "  const featureScript = config.features.length > 0 ? '<script src=\"./site.js\" defer></script>' : '';",
    file,
  );
  next = replaceOnce(
    next,
    '        <a class="site-name" href="#top">${escapeHtml(config.project.name)}</a>\n        <nav class="site-nav" aria-label="Primary navigation">',
    '        <a class="site-name" href="#top">${escapeHtml(config.project.name)}</a>\n        ${renderMobileNavigationToggle(config)}\n        <nav class="site-nav" ${navigationAttributes(config)} aria-label="Primary navigation">',
    file,
  );
  next = replaceOnce(
    next,
    '<div class="portfolio-hero__actions">${renderActions(config)}</div>',
    '<div class="portfolio-hero__actions">${renderActions(config)}${renderDialogAction(config)}</div>',
    file,
  );
  next = replaceOnce(next, '    ${themeScript}\n  </body>', '    ${renderProjectDialog(config, escapeHtml)}\n    ${featureScript}\n  </body>', file);
  next = replaceOnce(
    next,
    "  .project-card__art:focus-visible img {\n    transform: none;\n  }\n}`;",
    "  .project-card__art:focus-visible img {\n    transform: none;\n  }\n}\n\n${renderFeatureCss(config)}`;",
    file,
  );
  next = replaceOnce(
    next,
    "  compatibleFeatures: Object.freeze(['theme']),",
    "  compatibleFeatures: Object.freeze([\n    'theme',\n    'mobile-navigation',\n    'responsive-image',\n    'dialog',\n  ]),",
    file,
  );
  next = next.replace('- `site.js`: optional theme preference behavior when selected', '- `site.js`: selected optional behavior only\n- `tests/consumer.spec.js`: consumer-specific browser and accessibility checks');
  return next;
});

await transform('consumer/index.mjs', (source) => `${source.trimEnd()}\nexport { SETUP_FEATURE_IDS, selectedSetupFeatures } from './lib/features.mjs';\nexport { assertNoTemplateResidue, scanPublicContent, scanTemplateResidue } from './lib/residue.mjs';\nexport {\n  ConsumerSetupError,\n  applySetupPlan,\n  createSetupPlan,\n  formatSetupSummary,\n} from './lib/setup.mjs';\n`);

await transform('tests/unit/consumer-recipes.test.js', (source, file) => {
  let next = source.replaceAll("compatibleFeatures: ['theme']", "compatibleFeatures: ['theme', 'mobile-navigation', 'responsive-image', 'dialog']");
  next = replaceOnce(next, "    incompatible.features = ['dialog'];", "    incompatible.features = ['tabs'];", file);
  next = next.replace("      'PROJECT_BRIEF.md',", "      '.github/workflows/consumer-ci.yml',\n      'PROJECT_BRIEF.md',");
  next = next.replace("      'index.html',", "      'assets/hero-art.svg',\n      'index.html',\n      'package.json',\n      'playwright.config.js',\n      'scripts/scan-template-residue.mjs',");
  next = next.replace("      'syntax.project.json',", "      'syntax.project.json',\n      'tests/consumer.spec.js',");
  return next;
});

await transform('package.json', (source) => {
  const packageJson = JSON.parse(source);
  packageJson.scripts.setup = 'node scripts/setup.mjs';
  packageJson.scripts['test:consumer-setup'] = 'node scripts/verify-consumer-setup.mjs';
  packageJson.scripts.check = 'npm run lint && npm run format:check && npm run test && npm run build && npm run test:e2e && npm run test:consumer-setup';
  for (const key of ['format', 'format:check']) {
    packageJson.scripts[key] = packageJson.scripts[key].replace('docs/CONSUMER_RECIPE_EVIDENCE.md', 'docs/CONSUMER_RECIPE_EVIDENCE.md docs/CONSUMER_SETUP.md');
  }
  return `${JSON.stringify(packageJson, null, 2)}\n`;
});

await transform('.github/workflows/ci.yml', (source, file) =>
  replaceOnce(source, '      - name: Upload production bundle\n        uses: actions/upload-artifact@v4', '      - name: Verify generated consumer project\n        run: npm run test:consumer-setup\n\n      - name: Upload production bundle\n        uses: actions/upload-artifact@v4', file),
);

await transform('.gitignore', (source) => source.includes('consumer/setup-smoke/') ? source : `${source.trimEnd()}\nconsumer/setup-smoke/\n`);
await transform('consumer/README.md', (source) => source.replace('Theme preference is the only optional behavior implemented in this phase.', 'Setup supports theme preference, mobile navigation, responsive-image enhancement, and native dialog behavior without loading unselected modules.').replace('Issue #8 adds the interactive `npm run setup` flow, metadata prompts, generated consumer tests, and GitHub Pages preview configuration.', 'Run `npm run setup` for the interactive workflow, or provide `--config` and `--yes` for agents and CI. See `docs/CONSUMER_SETUP.md`.'));
await transform('CHANGELOG.md', (source, file) => replaceOnce(source, '### Added\n', '### Added\n\n- Interactive and noninteractive `npm run setup` workflows with a pre-write summary and transactional rollback.\n- Personalized package metadata, Open Graph data, manifests, project briefs, consumer tests, CI, and root Pages publishing instructions.\n- Selectable theme, mobile-navigation, responsive-image, and dialog enhancements with no unselected feature code.\n- Public template-residue scanning and a generated-project verification gate.\n', file));

await writeFile(path.join(root, 'docs/CONSUMER_SETUP.md'), `# Syntax Consumer Mode setup\n\nConsumer Mode turns a fresh Syntax template into a personalized, tested prototype while keeping setup tooling out of the browser bundle.\n\n## Interactive setup\n\n\`\`\`bash\nnpm install\nnpm run setup\n\`\`\`\n\nThe command asks only questions that alter generated output, displays the complete write plan, and waits for confirmation before touching the repository.\n\n## Noninteractive setup\n\n\`\`\`bash\nnpm run setup -- --config project.config.json --output . --yes\nnpm run setup -- --config project.config.json --dry-run\n\`\`\`\n\nSetup refuses an existing \`syntax.project.json\`, blocks project-owned collisions, and restores replaced template files if any write or residue check fails.\n\nGenerated projects receive personalized metadata, a project brief, project-owned CSS, selected optional behavior, Playwright and axe tests, a small CI workflow, a residue scanner, and Pages instructions when selected.\n`, 'utf8');

console.log('Applied Consumer Mode setup phase migration.');
