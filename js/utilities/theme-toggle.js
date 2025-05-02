/**
 * Theme Toggle
 * Handles light/dark mode toggling with localStorage support,
 * respects prefers-color-scheme, and uses flat SVG icons.
 */

(function() {
  // DOM elements
  const htmlEl = document.documentElement;
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');

  // Theme options
  const THEME_LIGHT = 'light';
  const THEME_DARK = 'dark';
  const STORAGE_KEY = 'preferred-theme';

  // Get system preference
  const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

  // Get user preference from localStorage or use system preference
  const getUserPreference = () => {
    const userPref = localStorage.getItem(STORAGE_KEY);
    if (userPref) {
      return userPref;
    }
    return prefersDarkScheme.matches ? THEME_DARK : THEME_LIGHT;
  };

  // Update SVG icon based on theme with requestAnimationFrame
  const updateIcon = (theme) => {
  if (!themeIcon) return;

  // Use requestAnimationFrame for smoother animation
  requestAnimationFrame(() => {
    if (theme === THEME_DARK) {
      themeIcon.innerHTML = `
        <path d="M12 4V2m0 20v-2m8-8h2M2 12h2m14.95-7.05l-1.414 1.414M6.464 17.536l-1.414 1.414M17.536 17.536l1.414 1.414M6.464 6.464L5.05 5.05M12 8a4 4 0 100 8 4 4 0 000-8z" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      `;
    } else {
      themeIcon.innerHTML = `
        <path d="M21 12.79A9 9 0 1111.21 3c-.1.01-.2.02-.3.03a7 7 0 009.79 9.76z" fill="currentColor"/>
      `;
    }

    // Animate icon with double RAF for cross-browser smoothness
    themeIcon.classList.remove('theme-icon-animate');
    requestAnimationFrame(() => {
      void themeIcon.offsetWidth;
      themeIcon.classList.add('theme-icon-animate');
    });
  });
};


  // Apply theme
  const setTheme = (theme) => {
    htmlEl.setAttribute('data-theme', theme);
    updateIcon(theme);
    localStorage.setItem(STORAGE_KEY, theme);
  };

  // Toggle theme
  const toggleTheme = () => {
    const currentTheme = htmlEl.getAttribute('data-theme') || getUserPreference();
    const newTheme = currentTheme === THEME_DARK ? THEME_LIGHT : THEME_DARK;
    setTheme(newTheme);
  };

  // Initialize theme
  const initTheme = () => {
    const userPreference = getUserPreference();
    setTheme(userPreference);

    if (themeToggle) {
      themeToggle.addEventListener('click', toggleTheme);
    }

    // Listen for system preference changes
    prefersDarkScheme.addEventListener('change', (e) => {
      if (!localStorage.getItem(STORAGE_KEY)) {
        setTheme(e.matches ? THEME_DARK : THEME_LIGHT);
      }
    });
  };

  // Initialize when DOM is loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTheme);
  } else {
    initTheme();
  }

  // Expose theme API to window (for developer use)
  window.themeToggler = {
    setTheme,
    toggleTheme,
    getCurrentTheme: () => htmlEl.getAttribute('data-theme') || getUserPreference()
  };
})();
