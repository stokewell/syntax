# Typography-First Template Style Guide

This document outlines the design principles, component styling guidelines, and best practices for maintaining and extending the Typography-First Template.

## Design Philosophy

The Typography-First Template follows these core principles:

1. **Typography as Foundation**: Clear typographic hierarchy is the backbone of good design
2. **Visual Clarity**: Prioritize readability and user experience over decorative elements
3. **Progressive Enhancement**: Start with solid HTML structure, enhance with modern CSS
4. **Performance First**: No dependencies, minimal JavaScript, optimized assets
5. **Accessibility**: WCAG-compliant color contrast, keyboard navigation, and proper semantics

## Color System

Our color system uses CSS variables to maintain consistency and enable theming:

```css
/* Light theme (default) */
:root {
  --color-primary: #3366cc;
  --color-primary-rgb: 51, 102, 204;
  --color-success: #2ecc71;
  --color-success-rgb: 46, 204, 113;
  --color-text: #333333;
  --color-text-rgb: 51, 51, 51;
  --color-bg: #ffffff;
  --color-bg-rgb: 255, 255, 255;
  --color-subtle: rgba(0, 0, 0, 0.1);
}

/* Dark theme */
[data-theme="dark"] {
  --color-primary: #5f8ee4;
  --color-primary-rgb: 95, 142, 228;
  --color-success: #43d180;
  --color-success-rgb: 67, 209, 128;
  --color-text: #e0e0e0;
  --color-text-rgb: 224, 224, 224;
  --color-bg: #121212;
  --color-bg-rgb: 18, 18, 18;
  --color-subtle: rgba(255, 255, 255, 0.1);
}
```

## Typography System

We implement a modular type scale for consistent sizing throughout the application:

```css
h1 {
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.03em;
}

h2 {
  font-size: clamp(1.5rem, 4vw, 2.25rem);
  font-weight: 700;
  line-height: 1.3;
  letter-spacing: -0.02em;
}

h3 {
  font-size: clamp(1.25rem, 3vw, 1.75rem);
  font-weight: 600;
  line-height: 1.4;
  letter-spacing: -0.01em;
}

h4 {
  font-size: clamp(1.125rem, 2vw, 1.35rem);
  font-weight: 600;
  line-height: 1.4;
}

p.lead {
  font-size: clamp(1.125rem, 2.5vw, 1.35rem);
  line-height: 1.6;
  color: var(--color-text-secondary, var(--color-text));
  opacity: 0.9;
}
```

## Grid System

The template uses a 12-column grid system for layouts:

```css
.container {
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  padding-inline: clamp(1rem, 4vw, 2rem);
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: clamp(1rem, 3vw, 1.5rem);
}

.grid-col-full {
  grid-column: span 12;
}

.grid-col-8 {
  grid-column: span 12;
}

@media (min-width: 768px) {
  .grid-col-8 {
    grid-column: span 8;
  }
}
```

## Component Guidelines

### Cards

We use subtle shadows and border accents instead of full borders for a more polished look:

```css
.card {
  background-color: var(--color-bg);
  border-radius: 12px;
  padding: clamp(1.5rem, 5vw, 2.5rem);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
  position: relative;
  overflow: hidden;
  border: none;
}

.card::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 60px;
  background-color: var(--color-primary);
  border-radius: 0 0 4px 0;
}
```

### Tabs

For tabs, we use a clean horizontal style with clear active states:

```css
.custom-tabs-nav {
  display: flex;
  flex-wrap: wrap;
  background: linear-gradient(to bottom, 
    rgba(var(--color-primary-rgb), 0.06), 
    rgba(var(--color-primary-rgb), 0.02));
  justify-content: center;
  position: relative;
  padding: 0 0.75rem;
}

.custom-tab-button.active {
  opacity: 1;
  font-weight: 700;
  color: var(--color-primary);
  background-color: var(--color-bg);
  border-top: 3px solid var(--color-primary);
  border-left: 1px solid rgba(var(--color-text-rgb), 0.06);
  border-right: 1px solid rgba(var(--color-text-rgb), 0.06);
  border-bottom: 1px solid var(--color-bg);
  margin-bottom: -1px;
}
```

### Gradient Text

For emphasis, we use gradient text effects:

```css
.gradient-text {
  background: linear-gradient(90deg, var(--color-primary), var(--color-success));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  text-fill-color: transparent;
}
```

## Animation Guidelines

Animations should be subtle and purposeful, enhancing user experience without being distracting:

- Use CSS transitions for hover/active states
- Keep durations between 200-400ms
- Use timing functions like ease-out for natural movement
- Implement reduced motion support

```css
.element {
  transition: transform 0.3s ease-out, opacity 0.3s ease-out;
}

@media (prefers-reduced-motion: reduce) {
  .element {
    transition: none;
  }
}
```

## Accessibility Guidelines

- Maintain WCAG AA contrast ratios (minimum 4.5:1 for normal text, 3:1 for large text)
- Ensure keyboard navigation works for all interactive elements
- Use proper semantic HTML elements
- Implement proper focus states for keyboard users

## Responsive Design

We follow a mobile-first approach with these breakpoints:

- Small: 0-576px (default)
- Medium: 577-768px
- Large: 769-992px
- X-Large: 993px+

Use fluid values with clamp() for smooth transitions between breakpoints:

```css
.element {
  padding: clamp(1rem, 4vw, 2rem);
  font-size: clamp(1rem, 2vw, 1.25rem);
}
```