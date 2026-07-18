# Changelog

All notable changes to Syntax are documented here.

## 1.1.0 — Stabilization

### Changed

- Repositioned Syntax as a typography-first website starter and lightweight design system.
- Replaced the public demo with a canonical, accessible showcase.
- Updated branding, metadata, canonical URLs, manifest data, and the repository-root experience.
- Reorganized design tokens around semantic color roles.
- Replaced ordinal font tokens with a canonical named pairing configuration.
- Consolidated header ownership by limiting `controls.css` to floating controls and the font dialog.
- Added explicit system, light, and dark theme preferences.
- Updated buttons to use theme-aware foreground tokens.

### Fixed

- Theme initialization no longer converts the system preference into a stored manual preference.
- Dialog focus is captured before focus moves and is restored to the trigger on close.
- Modal close buttons now position relative to the modal card.
- Tabs preserve light-DOM content and avoid rebinding keyboard listeners on every render.
- Responsive images now observe and update `srcset`, `sizes`, source, alternative text, ratio, and loading behavior.
- Clickable custom cards are keyboard operable.
- Global focus-outline removal was replaced with visible `:focus-visible` treatment.

### Added

- Build output for bundled CSS and JavaScript.
- ESLint, Stylelint, Prettier, Vitest, Playwright, and axe-core checks.
- GitHub Actions CI and build artifacts.
- A rewritten style guide and ordered roadmap.
