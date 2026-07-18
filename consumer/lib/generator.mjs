import { createHash } from 'node:crypto';
import { access, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';

import { CONSUMER_GENERATOR_VERSION } from './constants.mjs';
import { assertSafeRelativePath, resolveInside } from './path-safety.mjs';
import { validateAndNormalizeConfig } from './validation.mjs';

export class ConsumerGenerationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ConsumerGenerationError';
  }
}

export function stableStringify(value) {
  if (value === null || typeof value !== 'object') return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map((item) => stableStringify(item)).join(',')}]`;

  const entries = Object.keys(value)
    .sort()
    .map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`);
  return `{${entries.join(',')}}`;
}

function withTrailingNewline(value) {
  return `${String(value).replace(/\r\n?/g, '\n').replace(/\n*$/, '')}\n`;
}

function validateRecipeDefinition(recipe, config) {
  if (recipe === null || typeof recipe !== 'object' || Array.isArray(recipe)) {
    throw new ConsumerGenerationError('Recipe definition must be an object.');
  }
  if (recipe.id !== config.recipe.id || recipe.version !== config.recipe.version) {
    throw new ConsumerGenerationError(
      `Recipe definition ${String(recipe.id)}@${String(recipe.version)} does not match configuration ${config.recipe.id}@${config.recipe.version}.`,
    );
  }
  if (!Array.isArray(recipe.files) || recipe.files.length === 0) {
    throw new ConsumerGenerationError('Recipe definition must contain at least one file.');
  }
}

function renderRecipeFiles(recipe, config) {
  const files = new Map();
  for (const [index, definition] of recipe.files.entries()) {
    if (definition === null || typeof definition !== 'object' || Array.isArray(definition)) {
      throw new ConsumerGenerationError(`Recipe file ${index} must be an object.`);
    }

    const relativePath = assertSafeRelativePath(definition.path);
    if (relativePath === 'syntax.project.json') {
      throw new ConsumerGenerationError('Recipes may not define syntax.project.json.');
    }
    if (files.has(relativePath)) {
      throw new ConsumerGenerationError(`Recipe contains a duplicate file path: ${relativePath}`);
    }

    const hasContent = typeof definition.content === 'string';
    const hasRenderer = typeof definition.render === 'function';
    if (hasContent === hasRenderer) {
      throw new ConsumerGenerationError(
        `Recipe file ${relativePath} must define exactly one of content or render.`,
      );
    }

    const rendered = hasRenderer ? definition.render({ config }) : definition.content;
    if (typeof rendered !== 'string') {
      throw new ConsumerGenerationError(`Recipe file ${relativePath} did not render a string.`);
    }
    files.set(relativePath, withTrailingNewline(rendered));
  }

  return files;
}

function createConfigurationHash(config) {
  return createHash('sha256').update(stableStringify(config)).digest('hex');
}

export function createProjectFileSet({ config: inputConfig, recipe }) {
  const config = validateAndNormalizeConfig(inputConfig);
  const configWithoutGenerated = { ...config };
  delete configWithoutGenerated.generated;

  validateRecipeDefinition(recipe, configWithoutGenerated);
  const files = renderRecipeFiles(recipe, configWithoutGenerated);
  const generatedPaths = [...files.keys(), 'syntax.project.json'].sort();
  const manifest = {
    ...configWithoutGenerated,
    generated: {
      generatorVersion: CONSUMER_GENERATOR_VERSION,
      configurationHash: createConfigurationHash(configWithoutGenerated),
      files: generatedPaths,
    },
  };
  files.set('syntax.project.json', `${JSON.stringify(manifest, null, 2)}\n`);

  return {
    config: configWithoutGenerated,
    manifest,
    files: new Map([...files.entries()].sort(([left], [right]) => left.localeCompare(right))),
  };
}

async function fileExists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

export async function generateProject({
  config,
  recipe,
  outputDirectory,
  unsafeAllowOverwriteForTests = false,
}) {
  if (typeof outputDirectory !== 'string' || outputDirectory.trim() === '') {
    throw new ConsumerGenerationError('outputDirectory must be a non-empty path.');
  }
  if (unsafeAllowOverwriteForTests && process.env.VITEST !== 'true') {
    throw new ConsumerGenerationError(
      'unsafeAllowOverwriteForTests is only available while running the Vitest suite.',
    );
  }

  const fileSet = createProjectFileSet({ config, recipe });
  const root = path.resolve(outputDirectory);
  const destinations = [...fileSet.files.keys()].map((relativePath) => ({
    relativePath,
    absolutePath: resolveInside(root, relativePath),
  }));

  if (!unsafeAllowOverwriteForTests) {
    const collisions = [];
    for (const destination of destinations) {
      if (await fileExists(destination.absolutePath)) collisions.push(destination.relativePath);
    }
    if (collisions.length > 0) {
      throw new ConsumerGenerationError(
        `Refusing to overwrite project-owned files: ${collisions.sort().join(', ')}`,
      );
    }
  }

  const writtenFiles = [];
  try {
    for (const destination of destinations) {
      await mkdir(path.dirname(destination.absolutePath), { recursive: true });
      await writeFile(destination.absolutePath, fileSet.files.get(destination.relativePath), 'utf8');
      writtenFiles.push(destination.absolutePath);
    }
  } catch (error) {
    if (!unsafeAllowOverwriteForTests) {
      await Promise.all(writtenFiles.map((filePath) => rm(filePath, { force: true })));
    }
    throw new ConsumerGenerationError(`Unable to generate project: ${error.message}`);
  }

  return {
    outputDirectory: root,
    manifest: fileSet.manifest,
    files: destinations.map(({ relativePath }) => relativePath),
  };
}

export async function readGeneratedProject(outputDirectory) {
  const manifestPath = resolveInside(outputDirectory, 'syntax.project.json');
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
  return validateAndNormalizeConfig(manifest);
}
