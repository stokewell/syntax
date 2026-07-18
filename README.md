# Syntax

[Live demo](https://stokewell.github.io/syntax/) · [Use this template](https://github.com/stokewell/syntax/generate) · [Report an issue](https://github.com/stokewell/syntax/issues)

Syntax is a **typography-first website starter and lightweight design system for handcrafted content sites**. It provides expressive type, practical layout primitives, accessible components, explicit theming, and zero runtime dependencies.

Syntax grew from the earlier [Base](https://github.com/stokewell/base) project. The stabilization release narrows the product around a dependable core rather than treating every experiment as framework surface area.

## What is in core

- Semantic HTML and a modern CSS foundation
- Design tokens for color, spacing, typography, shape, elevation, motion, and layering
- Responsive containers, grids, utilities, and editorial layouts
- Buttons, cards, forms, alerts, navigation, dialogs, tabs, and accordions
- Explicit `system`, `light`, and `dark` theme preferences
- A curated font-pair preview tool backed by one canonical configuration
- Native custom elements for responsive images, cards, toggles, and tabs
- Keyboard behavior and reduced-motion support
- A build that produces `dist/syntax.css` and `dist/syntax.js`

## Optional extras

The font playground, Web Components, and animation utilities are useful additions, but they are not required to use the CSS foundation. Syntax remains a starter first, not an application framework.

## Quick start

### Use the repository as a template

Select **Use this template** on GitHub, then clone your new repository.

### Install development tools

```bash
npm install
npx playwright install chromium
```

### Run checks and build

```bash
npm run check
```

The production bundle is generated in `dist/`:

```html
<link rel="stylesheet" href="dist/syntax.css" />
<script src="dist/syntax.js" defer></script>
```

During development, the modular source files can be loaded directly:

```html
<link rel="stylesheet" href="css/style.css" />
<link rel="stylesheet" href="css/layouts.css" />

<script src="js/config/font-pairs.js" defer></script>
<script src="js/utilities/theme-toggle.js" defer></script>
<script src="js/utilities/font-switcher.js" defer></script>
<script src="js/components/navigation.js" defer></script>
<script src="js/components/modal.js" defer></script>
<script src="js/components/web-components.js" defer></script>
<script src="js/utilities/micro-animations.js" defer></script>
<script src="js/main.js" defer></script>
```

## Project structure

```text
syntax/
├── css/
│   ├── tokens.css
│   ├── reset.css
│   ├── base.css
│   ├── themes.css
│   ├── layouts.css
│   ├── style.css
│   └── components/
├── js/
│   ├── config/font-pairs.js
│   ├── components/
│   ├── utilities/
│   └── main.js
├── demo/
│   ├── index.html
│   └── demo.css
├── scripts/build.mjs
├── tests/
└── docs/STYLE_GUIDE.md
```

## Design tokens

Customize Syntax through semantic variables rather than component-specific overrides:

```css
:root {
  --color-primary: #087f7f;
  --color-on-primary: #ffffff;
  --font-heading: 'EB Garamond', Georgia, serif;
  --font-body: 'Plus Jakarta Sans', system-ui, sans-serif;
  --radius-lg: 1rem;
  --space-3: 1.5rem;
}
```

The light and dark themes redefine semantic roles such as `--color-bg`, `--color-surface`, `--color-text`, and `--color-border`. Components should consume these roles instead of introducing isolated colors.

## Theme controller

Syntax stores an explicit preference instead of silently converting the system setting into a permanent override:

```js
SyntaxTheme.setPreference('system');
SyntaxTheme.setPreference('light');
SyntaxTheme.setPreference('dark');
```

## Font pairings

All pairings live in `js/config/font-pairs.js`. The selector UI, Google Fonts request, CSS variables, and saved preference derive from that single source.

```js
SyntaxFonts.applyPair('modernSans');
```

## Components

### Dialog

```html
<button data-modal-target="example-dialog">Open dialog</button>

<div
  id="example-dialog"
  class="modal"
  role="dialog"
  aria-modal="true"
  aria-labelledby="dialog-title"
  hidden
>
  <div class="modal-content">
    <button data-modal-close aria-label="Close dialog">×</button>
    <h2 id="dialog-title">Dialog title</h2>
    <p>Dialog content.</p>
  </div>
</div>
```

The controller traps focus, closes on Escape, and restores focus to the original trigger.

### Toggle switch

```html
<toggle-switch label="Email summaries" checked></toggle-switch>
```

### Tabs

```html
<tabs-container>
  <tab-item label="First" selected>First panel</tab-item>
  <tab-item label="Second">Second panel</tab-item>
</tabs-container>
```

The tabs component preserves its light-DOM content and supports Arrow keys, Home, and End.

## Quality checks

- ESLint for JavaScript
- Stylelint for canonical CSS
- Prettier formatting checks
- Vitest unit tests
- Playwright desktop and mobile smoke tests
- axe-core checks for serious and critical accessibility violations
- GitHub Actions on pushes and pull requests

Automated checks support, but do not replace, manual keyboard and screen-reader testing.

## Browser support

Syntax targets current evergreen browsers. Progressive enhancement is preferred: core content remains usable without JavaScript, while dialogs, navigation, font previews, and custom elements add behavior when JavaScript is available.

## Status

The current work is the **v1.1 stabilization release**. The focus is correctness, accessibility, coherent architecture, delivery, and documentation. See [v2-ideas.md](v2-ideas.md) for the ordered roadmap.

## License

MIT. See [LICENSE](LICENSE).
