import { createAccentPalette } from '../lib/color.mjs';

const directions = Object.freeze({
  editorial: Object.freeze({
    id: 'editorial',
    label: 'Editorial',
    description: 'Serif-led, spacious, restrained, and content-first.',
    variables: Object.freeze({
      headingFont: 'var(--font-heading)',
      bodyFont: 'var(--font-body)',
      maxWidth: '76rem',
      displaySize: 'clamp(3.5rem, 9vw, 7.5rem)',
      headingTracking: '-0.045em',
      sectionSpace: 'clamp(5rem, 10vw, 9rem)',
      cardRadius: '0.125rem',
      cardShadow: 'none',
      cardBackground: 'transparent',
      cardBorder: 'var(--color-border-strong)',
      cardPadding: 'clamp(1.25rem, 3vw, 2rem)',
      cardMinimum: '21rem',
      heroAlign: 'left',
      heroJustify: 'flex-start',
      labelTransform: 'uppercase',
      labelTracking: '0.14em',
      artRadius: '0',
    }),
  }),
  product: Object.freeze({
    id: 'product',
    label: 'Product',
    description: 'Sans-led, compact, polished, and interface-oriented.',
    variables: Object.freeze({
      headingFont: 'var(--font-body)',
      bodyFont: 'var(--font-body)',
      maxWidth: '80rem',
      displaySize: 'clamp(3.25rem, 8vw, 7rem)',
      headingTracking: '-0.06em',
      sectionSpace: 'clamp(4.5rem, 8vw, 7rem)',
      cardRadius: 'var(--radius-xl)',
      cardShadow: 'var(--shadow-md)',
      cardBackground: 'var(--color-surface-raised)',
      cardBorder: 'var(--color-border)',
      cardPadding: 'clamp(1.25rem, 3vw, 2rem)',
      cardMinimum: '18rem',
      heroAlign: 'center',
      heroJustify: 'center',
      labelTransform: 'none',
      labelTracking: '0.02em',
      artRadius: 'calc(var(--radius-xl) - 0.25rem)',
    }),
  }),
});

export const PUBLIC_VISUAL_DIRECTIONS = Object.freeze(Object.keys(directions));

export function getVisualDirection(id) {
  const direction = directions[id];
  if (!direction) throw new Error(`Unsupported public visual direction: ${String(id)}.`);
  return direction;
}

export function renderDirectionVariables({ visualDirection, accentColor }) {
  const direction = getVisualDirection(visualDirection);
  const palette = createAccentPalette(accentColor);
  const variables = direction.variables;

  return `:root {
  --color-primary: ${palette.light};
  --color-primary-rgb: ${palette.lightRgb};
  --color-on-primary: ${palette.onLight};
  --consumer-font-heading: ${variables.headingFont};
  --consumer-font-body: ${variables.bodyFont};
  --consumer-max-width: ${variables.maxWidth};
  --consumer-display-size: ${variables.displaySize};
  --consumer-heading-tracking: ${variables.headingTracking};
  --consumer-section-space: ${variables.sectionSpace};
  --consumer-card-radius: ${variables.cardRadius};
  --consumer-card-shadow: ${variables.cardShadow};
  --consumer-card-background: ${variables.cardBackground};
  --consumer-card-border: ${variables.cardBorder};
  --consumer-card-padding: ${variables.cardPadding};
  --consumer-card-minimum: ${variables.cardMinimum};
  --consumer-hero-align: ${variables.heroAlign};
  --consumer-hero-justify: ${variables.heroJustify};
  --consumer-label-transform: ${variables.labelTransform};
  --consumer-label-tracking: ${variables.labelTracking};
  --consumer-art-radius: ${variables.artRadius};
}

[data-theme='dark'] {
  --color-primary: ${palette.dark};
  --color-primary-rgb: ${palette.darkRgb};
  --color-on-primary: ${palette.onDark};
}`;
}
