# Syntax Consumer Mode foundation

This directory contains development-time scaffolding infrastructure. It is not part of the browser runtime or the Syntax production bundle.

The foundation API remains internal while its recipe and ownership contracts are being proven through Issues #6 and #7.

## Current surface

```js
import { createProjectFileSet, generateProject } from './consumer/index.mjs';
```

`createProjectFileSet` validates and canonicalizes a project configuration, renders a matching recipe definition, and returns a deterministic in-memory file map.

`generateProject` performs a collision preflight and writes that file map to a target directory. Existing destination files are never silently replaced.

## Foundation fixture

The committed foundation fixture proves deterministic output without claiming to be the finished Blank recipe:

```bash
npm run consumer:fixtures
```

The command regenerates `consumer/fixtures/expected/foundation/` from the committed configuration and fixture recipe. Unit tests compare newly generated output against those files byte for byte.

## Next phase

Issue #7 will add the public Blank and Portfolio recipe contracts. Interactive prompts remain deferred until deterministic generation is proven.

See:

- [`docs/CONSUMER_MODE_PLAN.md`](../docs/CONSUMER_MODE_PLAN.md)
- [`docs/CONSUMER_MODE_OWNERSHIP.md`](../docs/CONSUMER_MODE_OWNERSHIP.md)
- [`consumer/schema/syntax-project.schema.json`](schema/syntax-project.schema.json)
