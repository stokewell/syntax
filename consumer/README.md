# Syntax Consumer Mode

This directory contains development-time scaffolding infrastructure. It is not part of the browser runtime or the Syntax production bundle.

## Current public surface

```js
import {
  createProjectFileSet,
  generateProject,
  getRecipe,
  listRecipes,
} from './consumer/index.mjs';
```

`createProjectFileSet` validates and canonicalizes a project configuration, validates the selected recipe contract, and returns a deterministic in-memory file map.

`generateProject` performs collision preflight and writes that map to a target directory. Existing destination files are never silently replaced.

## Public recipes

- `blank` v1
- `portfolio` v1

Both support the `editorial` and `product` visual directions. Theme preference is the only optional behavior implemented in this phase.

See [`docs/CONSUMER_RECIPES.md`](../docs/CONSUMER_RECIPES.md) for recipe contracts and preview instructions.

## Fixtures and previews

The committed foundation fixture continues to prove exact deterministic output:

```bash
npm run consumer:fixtures
```

Public recipe previews are generated on demand:

```bash
npm run consumer:previews
```

Preview output is gitignored because each project contains a complete Syntax CSS bundle.

## Next phase

Issue #8 adds the interactive `npm run setup` flow, metadata prompts, generated consumer tests, and GitHub Pages preview configuration.
