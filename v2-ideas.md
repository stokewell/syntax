# Syntax roadmap

This roadmap is ordered. Core reliability comes before ecosystem expansion.

## v1.1 — Stabilization

- [x] Correct public branding, metadata, canonical URLs, and root routing
- [x] Replace the accumulated demo script with a canonical showcase
- [x] Improve color contrast and focus-visible behavior
- [x] Add semantic font and theme controls
- [x] Repair dialog focus restoration and tab content preservation
- [x] Remove duplicate navigation CSS ownership
- [x] Add a production build, linting, tests, accessibility checks, and CI
- [x] Rewrite the README and style guide around the supported product surface

## v1.2 — Component hardening

- [ ] Add manual VoiceOver, NVDA, and keyboard test notes for every interactive component
- [ ] Add visual regression snapshots for light, dark, mobile, and reduced-motion states
- [ ] Add form validation patterns with accessible summaries and inline errors
- [ ] Document component events, properties, attributes, and browser support
- [ ] Decide which older demo files should be archived or deleted
- [ ] Publish a stable `dist/` artifact with each tagged release

## v1.3 — Design-system maturity

- [ ] Add automated token contrast tests
- [ ] Export design tokens as JSON alongside CSS custom properties
- [ ] Add RTL layout tests and logical-property audits
- [ ] Add a small set of editorial page templates built from the core primitives
- [ ] Add contribution guidelines and a release checklist

## Later, only with demonstrated demand

- Documentation search
- Figma library
- CLI scaffolding
- Plugin model
- Theme gallery
- VS Code integration

These are not prerequisites for Syntax to be useful. They should be pursued only after the core has users, stable releases, and clear maintenance capacity.
