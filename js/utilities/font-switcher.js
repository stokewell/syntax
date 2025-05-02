/**
 * Font Switcher
 * Live Google Fonts pairing selector with localStorage support
 */

(function () {
  const htmlEl = document.documentElement;
  const STORAGE_KEY = 'preferred-font-pairing';
  const LINK_ID = 'dynamic-fonts-live';

  // Helper function to animate font changes with a subtle bounce effect
  const animateFontZoom = (elements) => {
    elements.forEach(el => {
      el.classList.add('font-bounce');
      setTimeout(() => {
        el.classList.remove('font-bounce');
      }, 500); // Reduced time to match animation duration
    });
  };

  // Load fonts from Google and apply CSS vars with optimal weights
  const applyFontPairing = (heading, body) => {
    let link = document.getElementById(LINK_ID);
    if (!link) {
      link = document.createElement('link');
      link.id = LINK_ID;
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    }

    // Map of fonts to their optimal weights
    const fontWeights = {
      'Outfit': 'wght@300;400;500;700;900',
      'Inter': 'wght@300;400;500;700',
      'Work Sans': 'wght@300;400;500;700',
      'EB Garamond': 'ital,wght@0,400;0,700;1,400',
      'Montserrat': 'wght@400;500;600;700',
      'Roboto': 'wght@300;400;500;700',
      'DM Serif Display': 'ital,wght@0,400',
      'Playfair Display': 'ital,wght@0,400;0,700;1,400',
      'Plus Jakarta Sans': 'wght@300;400;500;700',
      'Merriweather': 'wght@300;400;700',
      'Cormorant Garamond': 'wght@400;500;700',
      'Raleway': 'wght@400;500;700',
      'Lora': 'wght@400;500;700',
      'Source Sans Pro': 'wght@300;400;600',
      'Vollkorn': 'wght@400;500;700',
      'Noto Sans': 'wght@400;500;700'
    };
    
    // Get weights for selected fonts or use defaults
    const headingWeights = fontWeights[heading] || 'wght@400;700';
    const bodyWeights = fontWeights[body] || 'wght@400';
    
    // Format the URL with appropriate weights
    const headingFamily = heading.trim().replace(/ /g, '+');
    const bodyFamily = body.trim().replace(/ /g, '+');
    
    link.href = `https://fonts.googleapis.com/css2?family=${headingFamily}:${headingWeights}&family=${bodyFamily}:${bodyWeights}&display=swap`;

    // Determine the correct font family fallbacks based on the font
    const isSansSerifHeading = heading === 'Outfit' || heading === 'Syne' || heading === 'Poppins' || heading === 'Archivo' || heading === 'Montserrat';
    const headingFallback = isSansSerifHeading ? 'sans-serif' : 'serif';
    
    // Most body fonts are sans-serif, but some are serif
    const isSerifBody = body === 'EB Garamond' || body === 'Vollkorn' || body === 'Merriweather' || body === 'Lora' || body === 'Cormorant Garamond';
    const bodyFallback = isSerifBody ? 'serif' : 'sans-serif';
    
    htmlEl.style.setProperty('--font-heading', `'${heading}', ${headingFallback}`);
    htmlEl.style.setProperty('--font-body', `'${body}', ${bodyFallback}`);

    // Add animation to headings and paragraphs with a more logical staggered approach
    setTimeout(() => {
      // Collect all animated elements
      const animatedElements = document.querySelectorAll('h1, h2, h3, h4, p, li, blockquote');
      
      // Group elements by importance and animate with staggered timing
      const groups = [
        { elements: Array.from(animatedElements).filter(el => el.tagName === 'H1' || el.tagName === 'H2'), delay: 0 },
        { elements: Array.from(animatedElements).filter(el => el.tagName === 'H3' || el.tagName === 'H4'), delay: 30 },
        { elements: Array.from(animatedElements).filter(el => !['H1', 'H2', 'H3', 'H4'].includes(el.tagName)), delay: 60 }
      ];
      
      // Apply animations with appropriate delays
      groups.forEach(group => {
        setTimeout(() => {
          animateFontZoom(group.elements);
        }, group.delay);
      });
    }, 50); // Short delay to ensure font has started loading
  };

  // Extract fonts from selector value
  const parsePair = (value) => {
    return value.split('|').map(f => f.trim());
  };

  // Save selected value to localStorage
  const storeFontSelection = (value) => {
    localStorage.setItem(STORAGE_KEY, value);
  };

  // Map font pairs to their CSS variable names
  const fontPairMap = {
    'EB Garamond|Plus Jakarta Sans': { heading: '--font-heading-quinary', body: '--font-body-quinary' },
    'DM Serif Display|Inter': { heading: '--font-heading-secondary', body: '--font-body-tertiary' },
    'Merriweather|Work Sans': { heading: '--font-heading-denary', body: '--font-body-secondary' },
    'Cormorant Garamond|Raleway': { heading: '--font-heading-senary', body: '--font-body-septenary' },
    'Lora|Source Sans Pro': { heading: '--font-heading-denary', body: '--font-body-senary' },
    'Vollkorn|Noto Sans': { heading: '--font-heading-septenary', body: '--font-body-septenary' },
    'Outfit|Inter': { heading: '--font-heading-tredenary', body: '--font-body-tredenary' },
    'Montserrat|Roboto': { heading: '--font-heading-quattuordenary', body: '--font-body-quattuordenary' }
  };

  // Load saved pairing from localStorage
  const getStoredPairing = () => {
    return localStorage.getItem(STORAGE_KEY) || 'EB Garamond|Plus Jakarta Sans';
  };
  
  // Set data-font attributes on the html element
  const setFontAttributes = (fontPairKey) => {
    const pairInfo = fontPairMap[fontPairKey];
    if (pairInfo) {
      // Extract the CSS var key and remove the prefix
      const headingKey = pairInfo.heading.replace('--font-heading-', '');
      htmlEl.setAttribute('data-font', headingKey);
    }
  };

  // Initialize logic after DOM is ready
  const initFontSwitcher = () => {
    const fontSwitcher = document.getElementById('font-pairing-select');
    const fontPreview = document.getElementById('font-pairing-preview');
    const toggleFontPreview = document.getElementById('toggle-font-preview');

    const savedValue = getStoredPairing();

    if (fontSwitcher) {
      fontSwitcher.value = savedValue;

      const [heading, body] = parsePair(savedValue);
      applyFontPairing(heading, body);
      setFontAttributes(savedValue);

      fontSwitcher.addEventListener('change', (e) => {
        const value = e.target.value;
        if (value === 'custom') {
          alert('Custom font selection coming soon!');
          return;
        }

        storeFontSelection(value);
        const [h, b] = parsePair(value);
        applyFontPairing(h, b);
        setFontAttributes(value);
      });
    }

    // Add sliding animation to font preview panel
    if (toggleFontPreview && fontPreview) {
      // Initialize styles
      fontPreview.style.maxHeight = '0';
      fontPreview.style.overflow = 'hidden';
      fontPreview.style.transition = 'max-height 0.3s var(--ease-in-out), opacity 0.3s var(--ease-in-out)';
      fontPreview.style.opacity = '0';
      fontPreview.style.padding = '0';
      fontPreview.style.width = '100%';
      fontPreview.style.margin = '0 auto';

      // Remove hidden attribute - we'll control visibility with CSS
      if (fontPreview.hasAttribute('hidden')) {
        fontPreview.removeAttribute('hidden');
      }

      toggleFontPreview.addEventListener('click', () => {
        const isVisible = fontPreview.style.maxHeight !== '0px' && fontPreview.style.maxHeight !== '0';
        
        if (isVisible) {
          // Hide preview
          fontPreview.style.maxHeight = '0';
          fontPreview.style.opacity = '0';
          fontPreview.style.padding = '0';
          toggleFontPreview.textContent = 'Customize Fonts';
        } else {
          // Show preview
          fontPreview.style.padding = 'var(--space-2)';
          fontPreview.style.maxHeight = fontPreview.scrollHeight + 'px';
          fontPreview.style.opacity = '1';
          toggleFontPreview.textContent = 'Hide Font Preview';
          
          // Update maxHeight after transition to accommodate content changes
          setTimeout(() => {
            fontPreview.style.maxHeight = 'none';
          }, 300);
        }
      });
      
      // Handle responsive behavior
      const handleResize = () => {
        if (fontPreview.style.maxHeight !== '0px' && fontPreview.style.maxHeight !== '0') {
          // Recalculate height if panel is open
          fontPreview.style.maxHeight = 'none';
        }
      };
      
      window.addEventListener('resize', handleResize);
    }

    // If pairing exists but no switcher rendered, still apply font
    if (!fontSwitcher && savedValue) {
      const [heading, body] = parsePair(savedValue);
      applyFontPairing(heading, body);
      setFontAttributes(savedValue);
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFontSwitcher);
  } else {
    initFontSwitcher();
  }

  // Public API
  window.fontSwitcher = {
    apply: applyFontPairing,
    getSelected: () => localStorage.getItem(STORAGE_KEY)
  };
})();
