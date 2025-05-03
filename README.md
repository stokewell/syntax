# Syntax - Modern Web Framework

[Live Demo](https://stokewell.github.io/syntax/demo/) ·  [Use this Template](https://github.com/stokewell/syntax/generate) 

> **Credit**: Syntax is built upon the excellent [Base framework](https://github.com/stokewell/base) - a lightweight foundation for modern websites. This project extends Base with additional features while maintaining its clean, minimalist approach.

![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)
![Responsive](https://img.shields.io/badge/responsive-yes-brightgreen)
![Status](https://img.shields.io/badge/status-template--ready-blueviolet)
![Components](https://img.shields.io/badge/web--components-yes-orange)

A handcrafted, design-led framework built with attention to **typography**, **modular layout**, and **visual clarity**. Created for developers who care about quality and performance.  
No framework bloat — just semantic HTML, custom design tokens, and clean CSS structured for elegance and reuse.

## 🎯 TL;DR
- Modern website framework with **zero framework dependencies**
- Built around **typography** with dynamic font pairing system and intuitive floating selector UI
- Includes **web components**, **micro-animations**, and **responsive layouts**
- Features **dark mode**, **performance optimizations**, and **elegant accessibility** built-in
- **Modular CSS** with design tokens and themeable components
- **Interactive controls** with fixed positioning for easy access from anywhere on the page
- **Enhanced tabs interface** with smooth transitions and anchor link navigation
- **Refined typography** with widow prevention and optimal readability controls

## 👤 Who It's For

This framework is ideal for:

- Designers and developers building typographically expressive websites
- Studios and agencies seeking high-end presentation without extra frameworks
- Creators who value performance, clarity, and maintainability
- Anyone tired of overengineered boilerplates

## ✍️ Typography System

This framework includes a flexible typography system with optional starter font pairings including:
- Serif + Sans-Serif combinations (DM Serif Display + Inter, EB Garamond + Plus Jakarta Sans)

Fonts are easily configurable using CSS variables (`--font-heading`, `--font-body`).

An interactive **font pairing preview tool** is included to experiment with alternative combinations before committing changes.

To change fonts permanently, update the `--font-heading` and `--font-body` variables in `tokens.css`.

## 🛠️ Core Design Goals

- **Typography-first** layout with fluid rhythm, optimal line length, and scale
- **Responsive design** from 360px to 1920px+
- **Built-in Light/Dark Mode**, using `prefers-color-scheme` + manual toggle
- **Modular layout system** with blog, portfolio, magazine formats
- **Native Web Components** with shadow DOM encapsulation
- **Micro-animation framework** for subtle interface interactions
- **Responsive image system** with lazy loading
- **Design tokens** for color, spacing, typography, transitions, and more
- **Accessibility-first (WCAG 2.1 AA)** — keyboard nav, contrast, ARIA
- **Minimal JavaScript** — just enough for interactivity, no framework overhead

## 📂 Folder Structure

```
/syntax-framework/
├── /css/
│   ├── tokens.css         # Design tokens: spacing, colors, typography, z-index, etc.
│   ├── reset.css          # CSS reset (or normalize)
│   ├── base.css           # Core styles: typography, layout scaffolding
│   ├── /components/       # Modular component styles organized by functionality
│   │   ├── modern-header.css    # Header and navigation
│   │   ├── hero.css             # Hero section
│   │   ├── buttons.css          # Button styles
│   │   ├── cards.css            # Card components
│   │   └── ...                  # Other component styles
│   ├── layouts.css        # Layout variants: blog, portfolio, magazine, dashboard
│   ├── themes.css         # Light/dark theme variables & overrides
│   └── style.css          # Entrypoint file importing all others in order
│
├── /js/
│   ├── main.js                   # Main entry point
│   ├── /utilities/               # Core functionality
│   │   ├── theme-toggle.js       # Theme switcher with localStorage
│   │   ├── font-switcher.js      # Font pairing preview tool
│   │   ├── lazy-loader.js        # Image lazy loading with IntersectionObserver
│   │   └── micro-animations.js   # Tiny animation framework with presets
│   ├── /components/              # UI Components
│   │   ├── navigation.js         # Navigation and dropdown behavior
│   │   ├── modal.js              # Accessible modal system
│   │   └── web-components.js     # Native custom elements for reusable UI
│   └── /development/             # Debugging and development tools
│
├── /demo/
│   ├── index.html         # Main demo of styles, tokens, and layout
│   └── components.html    # Web Components and layout variants showcase
│
├── CLAUDE.md              # Guidelines for Claude AI coding assistant
├── v2-ideas.md            # Future roadmap and enhancement ideas  
├── CREDITS.md             # Attributions for third-party resources
└── README.md              # You're here
```

## ⚙️ Usage Instructions

### 1. Include styles and scripts

In your `<head>`:

```html
<link rel="stylesheet" href="css/style.css">
<link rel="stylesheet" href="css/layouts.css"> <!-- Optional layout variants -->
```

At the end of your `<body>`:

```html
<!-- Main Framework JS -->
<script src="js/main.js" defer></script>

<!-- Utilities -->
<script src="js/utilities/theme-toggle.js" defer></script>
<script src="js/utilities/font-switcher.js" defer></script>
<script src="js/utilities/lazy-loader.js" defer></script>
<script src="js/utilities/micro-animations.js" defer></script>

<!-- Components -->
<script src="js/components/web-components.js" defer></script>
<script src="js/components/modal.js" defer></script>
<script src="js/components/navigation.js" defer></script>
```

### 2. Add the theme and font toggles (optional)

```html
<!-- Fixed position controls that float above other content -->
<div class="fixed-controls">
  <!-- Font typography toggle with enhanced UI -->
  <button id="font-toggle" class="font-toggle-btn" aria-label="Change typography">
    <svg id="font-icon" width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M10.5 4v2h-2v12h-2V6h-2V4h6zm5.05 4C16.86 8 18 9.09 18 11c0 1.91-1.14 3-2.45 3h-.44v4h-2V8h2.05zm0 4c.5 0 .95-.43.95-1s-.45-1-.95-1h-.05v2h.05z" fill="currentColor"/>
    </svg>
  </button>
  
  <!-- Theme toggle for dark/light mode -->
  <button id="theme-toggle" class="theme-toggle-btn" aria-label="Toggle dark mode">
    <svg id="theme-icon" width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M21 12.79A9 9 0 1111.21 3c-.1.01-.2.02-.3.03a7 7 0 009.79 9.76z" fill="currentColor"/>
    </svg>
  </button>
</div>

<!-- Font selector modal that appears when font toggle is clicked -->
<div id="font-selector-modal" class="font-selector-modal">
  <div class="font-selector-header">
    <h3>Choose Font Pairing</h3>
    <button id="font-selector-close" class="font-selector-close" aria-label="Close font selector">×</button>
  </div>
  <div class="font-selector-content">
    <div class="font-options-grid">
      <!-- Font options with live previews -->
      <div class="font-option" data-font-pair="EB Garamond|Plus Jakarta Sans">
        <div class="font-pair-heading" style="font-family: 'EB Garamond', serif; font-weight: 700;">EB Garamond</div>
        <div class="font-pair-body" style="font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 400;">Plus Jakarta Sans</div>
      </div>
      <!-- Additional font options... -->
    </div>
  </div>
</div>
```

### 3. Add modern header with navigation

```html
<header class="header" id="main-header">
  <div class="container header-container">
    <!-- Logo container -->
    <div class="logo-container">
      <a href="index.html" class="logo" aria-label="Syntax Home">
        <span class="logo-text">Syn<span class="logo-accent">tax</span></span>
      </a>
    </div>
    
    <!-- Main navigation -->
    <nav class="main-nav" aria-label="Main Navigation">
      <!-- Desktop Navigation -->
      <ul class="nav-list">
        <li class="nav-item">
          <a href="index.html" class="nav-link active">Home</a>
        </li>
        <li class="nav-item nav-dropdown">
          <button class="dropdown-toggle" aria-expanded="false" aria-controls="components-dropdown">
            Components
            <svg viewBox="0 0 24 24" aria-hidden="true" width="14" height="14">
              <path d="M12 15.5l-6-6 1.5-1.5L12 12.5l4.5-4.5L18 9.5l-6 6z" fill="currentColor"></path>
            </svg>
          </button>
          <div class="dropdown-content" id="components-dropdown">
            <!-- Dropdown menu items -->
          </div>
        </li>
        <!-- Additional nav items -->
      </ul>
      
      <!-- Mobile Menu Toggle -->
      <button type="button" class="menu-toggle" aria-expanded="false" aria-label="Toggle mobile menu" aria-controls="mobile-navigation">
        <span></span>
        <span></span>
        <span></span>
      </button>
    </nav>
  </div>
  
  <!-- Mobile Navigation Overlay -->
  <div class="mobile-nav" id="mobile-navigation" aria-hidden="true">
    <!-- Mobile nav content -->
  </div>
</header>
```

### 4. Explore the demo

- Open [`/demo/index.html`](https://stokewell.github.io/syntax/demo/) to preview all styles, tokens, and basic components

## 🧩 Web Components & UI Elements

This framework includes both custom elements and enhanced UI components:

```html
<!-- Responsive image with lazy loading -->
<responsive-image 
  src="image.jpg" 
  alt="Description" 
  aspect-ratio="16:9" 
  lazy>
  <span slot="caption">Caption text</span>
</responsive-image>

<!-- Card component -->
<custom-card 
  title="Card Title"
  image="image.jpg"
  shadow-level="2"
  clickable>
  <p>Card content here</p>
  <div slot="footer">
    <button class="btn-outline-sm">Action</button>
  </div>
</custom-card>

<!-- Toggle switch -->
<toggle-switch 
  label="Dark Mode" 
  checked>
</toggle-switch>

<!-- Enhanced Tabs with Animations -->
<div class="custom-tabs">
  <div class="custom-tabs-nav">
    <button class="custom-tab-button active" data-tab="tab1">First Tab</button>
    <button class="custom-tab-button" data-tab="tab2">Second Tab</button>
  </div>
  
  <div id="tab1" class="custom-tab-content active">
    <p class="tab-description">First tab content description</p>
    <!-- Tab content here -->
  </div>
  
  <div id="tab2" class="custom-tab-content">
    <p class="tab-description">Second tab content description</p>
    <!-- Tab content here -->
  </div>
</div>

<!-- Modal Component -->
<button data-modal-target="demo-modal">Open Modal</button>

<div id="demo-modal" class="modal" role="dialog" aria-labelledby="modal-title">
  <div class="modal-content">
    <button class="modal-close" data-modal-close aria-label="Close modal">&times;</button>
    <h2 id="modal-title">Modal Title</h2>
    <p>Modal content here...</p>
    <div class="modal-actions">
      <button class="btn-secondary" data-modal-close>Cancel</button>
      <button class="btn" data-modal-close>Confirm</button>
    </div>
  </div>
</div>
```

## 🎨 Layout Variants

Multiple layout patterns are available in `layouts.css`:

```html
<!-- Blog layout with sidebar -->
<div class="layout-blog">
  <div class="main-content">Main article content</div>
  <div class="sidebar">Sidebar content</div>
</div>

<!-- Portfolio grid layout -->
<div class="layout-portfolio portfolio-3col">
  <div>Portfolio item 1</div>
  <div>Portfolio item 2</div>
  <div>Portfolio item 3</div>
</div>

<!-- Magazine layout -->
<div class="layout-magazine">
  <div class="magazine-featured">Featured article</div>
  <div class="magazine-grid">
    <div>Article 1</div>
    <div>Article 2</div>
    <div>Article 3</div>
  </div>
</div>
```

## 🔄 Animation Framework

A comprehensive yet lightweight animation system with no dependencies:

```javascript
// Single animations with presets
animationFramework.presets.fadeIn(element, { duration: 500 });
animationFramework.presets.slideInRight(element, { easing: 'snappy' });
animationFramework.presets.luxuryReveal(element, { duration: 1000 });

// Advanced animation sequences
const sequence = animationFramework.createSequence()
  .add(animationFramework.presets.fadeIn(element1))
  .delay(300)
  .add(animationFramework.presets.slideInRight(element2))
  .play();

// Staggered animation groups
const staggered = animationFramework.stagger(elements, 'fadeIn', { 
  duration: 400, 
  staggerDelay: 100 
}).play();

// Declarative animations on scroll
<div data-animation="fadeIn" 
     data-animation-delay="200"
     data-animation-duration="800"
     data-animation-easing="smooth">
  This fades in when scrolled into view
</div>

// Generate static CSS-only animations
const animationCSS = animationFramework.generateCSS();
// <div class="ani-fadeIn ani-duration-slow">Pure CSS animation</div>
```

## 🧹 Customization Guide

### Performance Optimizations

The framework includes several performance optimizations:

- **Lazy-loaded fonts**: Only the selected font pairing is loaded, reducing initial page load time
- **Optimized font weights**: Only necessary font weights are fetched for each font
- **Font display swap**: Prevents "invisible text" during font loading
- **Intersection Observer**: Used for lazy loading images and animations
- **Font-switching animation**: Elegant "luxury zoom" animation when changing font pairings
- **Modular CSS structure**: Allows importing only what you need

### Modify Design Tokens

Edit `css/tokens.css` to change:

- Spacing scale
- Color scheme
- Font stack and sizing
- Z-index layers
- Transition timing

### Add Custom Components

1. Create a new file in `css/components/`
2. Use variables from `tokens.css` for alignment
3. Import your new component in `style.css`

### Create New Web Components

1. Extend the BaseComponent class in web-components.js
2. Follow the naming convention (lowercase with hyphens)
3. Ensure accessibility with ARIA attributes and keyboard support

### Customize Themes

1. Modify or extend `css/themes.css`
2. Add `[data-theme="your-theme-name"]` blocks
3. Control theme via JS or `prefers-color-scheme`

## ♿ Accessibility Features

- Semantic HTML throughout
- Keyboard-friendly navigation with anchor link support
- Focus styles for all interactives with refined visual feedback
- ARIA attributes where needed including dropdown menus
- Respects `prefers-reduced-motion`
- Meets or exceeds WCAG 2.1 AA contrast standards
- Smart scroll handling for fixed headers
- Widow prevention in critical UI text
- Custom focus indicators that maintain accessibility while looking refined
- Screen reader support with properly labeled controls

## 🌐 Browser Support

Tested in all modern evergreen browsers:

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📄 License

This project is licensed under the [MIT License](LICENSE).

## 🙏 Acknowledgments

This project uses resources from several open-source projects. See [CREDITS.md](CREDITS.md) for a complete list of acknowledgments and attributions.

## 🔮 Use as a Template

Want to start your next project with this foundation?

→ [Click here to generate your own copy](https://github.com/stokewell/syntax/generate)
