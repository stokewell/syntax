export {
  CONSUMER_GENERATOR_VERSION,
  CONSUMER_SCHEMA_VERSION,
  DEPLOYMENT_IDS,
  FEATURE_IDS,
  PROJECT_MODES,
  RECIPE_IDS,
  SCHEMA_URL,
  SYNTAX_VERSION,
  VISUAL_DIRECTIONS,
} from './lib/constants.mjs';
export {
  ConsumerGenerationError,
  createProjectFileSet,
  generateProject,
  readGeneratedProject,
  stableStringify,
} from './lib/generator.mjs';
export { ConsumerPathError, assertSafeRelativePath, resolveInside } from './lib/path-safety.mjs';
export { ConsumerConfigError, validateAndNormalizeConfig } from './lib/validation.mjs';
