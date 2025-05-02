/**
 * Native Web Component System
 * A simple set of reusable custom elements with minimal dependencies
 */

(function() {
  /**
   * Utility functions for component development
   */
  const utils = {
    /**
     * Create a shadow DOM with styles
     * @param {HTMLElement} host - The component to attach shadow DOM to
     * @param {String} cssText - CSS styles to include
     * @param {Boolean} mode - Shadow DOM mode (open or closed)
     * @returns {ShadowRoot} The shadow root
     */
    createShadowDOM(host, cssText, mode = 'open') {
      const shadow = host.attachShadow({ mode });
      if (cssText) {
        const style = document.createElement('style');
        style.textContent = cssText;
        shadow.appendChild(style);
      }
      return shadow;
    },

    /**
     * Convert kebab-case to camelCase
     * @param {String} str - String to convert
     * @returns {String} Converted string
     */
    kebabToCamel(str) {
      return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
    },

    /**
     * Convert camelCase to kebab-case
     * @param {String} str - String to convert
     * @returns {String} Converted string
     */
    camelToKebab(str) {
      return str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
    },

    /**
     * Debounce function calls
     * @param {Function} fn - Function to debounce
     * @param {Number} delay - Delay in milliseconds
     * @returns {Function} Debounced function
     */
    debounce(fn, delay = 250) {
      let timeoutId;
      return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn.apply(this, args), delay);
      };
    }
  };

  /**
   * Base Component Class that all components will extend
   */
  class BaseComponent extends HTMLElement {
    constructor() {
      super();
      this._initialized = false;
    }

    /**
     * Component attributes to observe for changes
     * @returns {String[]} List of attribute names
     */
    static get observedAttributes() {
      return [];
    }

    /**
     * Called when component is added to the document
     */
    connectedCallback() {
      if (this._initialized) return;
      this.initialize();
      this._initialized = true;
      this.render();
      
      // Dispatch connected event
      this.dispatchEvent(new CustomEvent('component-connected', {
        bubbles: true,
        composed: true
      }));
    }

    /**
     * Called when component is removed from the document
     */
    disconnectedCallback() {
      this.cleanup();
      
      // Dispatch disconnected event
      this.dispatchEvent(new CustomEvent('component-disconnected', {
        bubbles: true,
        composed: true
      }));
    }

    /**
     * Called when attributes are changed
     * @param {String} name - Attribute name
     * @param {*} oldValue - Old attribute value
     * @param {*} newValue - New attribute value
     */
    attributeChangedCallback(name, oldValue, newValue) {
      if (oldValue === newValue) return;
      
      // Convert attribute name to property name
      const propName = utils.kebabToCamel(name);
      
      // Update property value
      this[propName] = newValue;
      
      // Re-render if initialized
      if (this._initialized) {
        this.render();
      }
    }

    /**
     * Initialize component (to be overridden by subclasses)
     */
    initialize() {
      // Override in subclass
    }

    /**
     * Render component (to be overridden by subclasses)
     */
    render() {
      // Override in subclass
    }

    /**
     * Clean up resources (to be overridden by subclasses)
     */
    cleanup() {
      // Override in subclass
    }
  }

  /**
   * Responsive Image Component
   * Handles lazy loading and responsive image sizes
   */
  class ResponsiveImage extends BaseComponent {
    static get observedAttributes() {
      return ['src', 'alt', 'lazy', 'sizes', 'aspect-ratio'];
    }

    constructor() {
      super();
      this.shadow = utils.createShadowDOM(this, `
        :host {
          display: block;
          width: 100%;
          position: relative;
          overflow: hidden;
        }
        
        .image-container {
          width: 100%;
          position: relative;
          overflow: hidden;
        }
        
        img {
          width: 100%;
          height: auto;
          display: block;
          transition: opacity 0.3s ease;
        }
        
        .placeholder {
          background-color: var(--color-subtle, rgba(0, 0, 0, 0.05));
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          color: var(--color-text);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .lazy {
          opacity: 0;
        }
        
        .loaded {
          opacity: 1;
        }
        
        .aspect-ratio-container {
          position: relative;
          width: 100%;
        }
        
        slot[name="caption"] {
          display: block;
          margin-top: 8px;
          font-size: 0.85em;
          color: #666;
          text-align: center;
        }
      `);
      
      this.container = document.createElement('div');
      this.container.className = 'image-container';
      this.shadow.appendChild(this.container);
      
      // Add slot for caption
      const captionSlot = document.createElement('slot');
      captionSlot.name = 'caption';
      this.shadow.appendChild(captionSlot);
    }

    initialize() {
      this.img = document.createElement('img');
      this.container.appendChild(this.img);
      
      this.placeholder = document.createElement('div');
      this.placeholder.className = 'placeholder';
      this.container.appendChild(this.placeholder);
      
      // Set alt text if provided
      if (this.hasAttribute('alt')) {
        this.img.alt = this.getAttribute('alt');
      }
      
      // Set aspect ratio if provided
      if (this.hasAttribute('aspect-ratio')) {
        this.setAspectRatio(this.getAttribute('aspect-ratio'));
      }
      
      // Handle lazy loading
      if (this.hasAttribute('lazy') && this.getAttribute('lazy') !== 'false') {
        this.setupLazyLoading();
      } else {
        this.loadImage();
      }
    }
    
    setAspectRatio(ratio) {
      const [width, height] = ratio.split(':').map(Number);
      if (width && height) {
        this.container.style.paddingBottom = `${(height / width) * 100}%`;
        this.container.style.height = '0';
        this.img.style.position = 'absolute';
        this.img.style.top = '0';
        this.img.style.left = '0';
        this.img.style.width = '100%';
        this.img.style.height = '100%';
        this.img.style.objectFit = 'cover';
      }
    }
    
    setupLazyLoading() {
      this.img.classList.add('lazy');
      
      // Style placeholder to match current theme
      if (document.documentElement.getAttribute('data-theme') === 'dark') {
        this.placeholder.style.backgroundColor = 'rgba(0, 0, 0, 0.2)';
      }
      
      // Listen for theme changes
      const themeObserver = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
          if (mutation.attributeName === 'data-theme') {
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            this.placeholder.style.backgroundColor = isDark ? 'rgba(0, 0, 0, 0.2)' : 'var(--color-subtle, rgba(0, 0, 0, 0.05))';
          }
        });
      });
      
      themeObserver.observe(document.documentElement, { attributes: true });
      
      // Use Intersection Observer if available
      if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              this.loadImage();
              observer.unobserve(this);
              
              // Disconnect theme observer once image is loaded
              setTimeout(() => {
                themeObserver.disconnect();
              }, 500);
            }
          });
        }, {
          rootMargin: '200px 0px',
          threshold: 0.01
        });
        
        observer.observe(this);
      } else {
        // Fallback to immediate loading
        this.loadImage();
        
        // Disconnect theme observer once image is loaded
        setTimeout(() => {
          themeObserver.disconnect();
        }, 500);
      }
    }
    
    loadImage() {
      // Set image source and srcset if available
      if (this.hasAttribute('src')) {
        this.img.src = this.getAttribute('src');
      }
      
      if (this.hasAttribute('srcset')) {
        this.img.srcset = this.getAttribute('srcset');
      }
      
      if (this.hasAttribute('sizes')) {
        this.img.sizes = this.getAttribute('sizes');
      }
      
      // Handle image load event
      this.img.addEventListener('load', () => {
        this.img.classList.add('loaded');
        this.placeholder.style.display = 'none';
      });
      
      // Handle image error
      this.img.addEventListener('error', () => {
        this.placeholder.textContent = 'Image failed to load';
        this.placeholder.style.display = 'flex';
        this.placeholder.style.alignItems = 'center';
        this.placeholder.style.justifyContent = 'center';
      });
    }
    
    render() {
      // Update alt text
      if (this.hasAttribute('alt')) {
        this.img.alt = this.getAttribute('alt');
      }
      
      // Update aspect ratio
      if (this.hasAttribute('aspect-ratio')) {
        this.setAspectRatio(this.getAttribute('aspect-ratio'));
      }
    }
  }

  /**
   * Card Component
   * A versatile card component with optional image, title, and content
   */
  class CardComponent extends BaseComponent {
    static get observedAttributes() {
      return ['title', 'image', 'shadow-level', 'clickable'];
    }

    constructor() {
      super();
      this.shadow = utils.createShadowDOM(this, `
        :host {
          display: block;
          margin: 0;
          --card-padding: 16px;
          --card-radius: 8px;
          --card-shadow-level: 1;
        }
        
        .card {
          background-color: var(--color-bg, #ffffff);
          border-radius: var(--card-radius);
          overflow: hidden;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        
        .shadow-0 {
          border: 1px solid var(--color-subtle, #e0e0e0);
        }
        
        .shadow-1 {
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        .shadow-2 {
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        
        .shadow-3 {
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
        }
        
        .clickable {
          cursor: pointer;
        }
        
        .clickable:hover {
          transform: translateY(-2px);
        }
        
        .shadow-1.clickable:hover {
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
        }
        
        .shadow-2.clickable:hover {
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
        }
        
        .shadow-3.clickable:hover {
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
        }
        
        .card-image {
          width: 100%;
          display: block;
        }
        
        .card-content {
          padding: var(--card-padding);
        }
        
        .card-title {
          margin-top: 0;
          margin-bottom: 8px;
          font-family: var(--font-heading, inherit);
          font-weight: 600;
        }
        
        .card-body {
          margin: 0;
        }
        
        .card-footer {
          padding: 0 var(--card-padding) var(--card-padding);
          display: flex;
          justify-content: flex-end;
        }
      `);
    }

    initialize() {
      this.card = document.createElement('div');
      this.card.className = 'card';
      this.shadow.appendChild(this.card);
      
      // Apply shadow level
      const shadowLevel = this.getAttribute('shadow-level') || '1';
      this.card.classList.add(`shadow-${shadowLevel}`);
      
      // Create image if specified
      if (this.hasAttribute('image')) {
        const img = document.createElement('img');
        img.src = this.getAttribute('image');
        img.alt = this.getAttribute('title') || 'Card image';
        img.className = 'card-image';
        this.card.appendChild(img);
      }
      
      // Create content container
      this.contentContainer = document.createElement('div');
      this.contentContainer.className = 'card-content';
      this.card.appendChild(this.contentContainer);
      
      // Create title if specified
      if (this.hasAttribute('title')) {
        const title = document.createElement('h3');
        title.className = 'card-title';
        title.textContent = this.getAttribute('title');
        this.contentContainer.appendChild(title);
      }
      
      // Create slot for content
      const contentSlot = document.createElement('slot');
      contentSlot.className = 'card-body';
      this.contentContainer.appendChild(contentSlot);
      
      // Create footer slot
      this.footerContainer = document.createElement('div');
      this.footerContainer.className = 'card-footer';
      const footerSlot = document.createElement('slot');
      footerSlot.name = 'footer';
      this.footerContainer.appendChild(footerSlot);
      this.card.appendChild(this.footerContainer);
      
      // Make clickable if specified
      if (this.hasAttribute('clickable') && this.getAttribute('clickable') !== 'false') {
        this.card.classList.add('clickable');
        this.card.addEventListener('click', this.handleClick.bind(this));
      }
    }
    
    handleClick(event) {
      this.dispatchEvent(new CustomEvent('card-click', {
        bubbles: true,
        composed: true,
        detail: { originalEvent: event }
      }));
    }
    
    render() {
      // Update shadow level
      const shadowLevels = ['shadow-0', 'shadow-1', 'shadow-2', 'shadow-3'];
      shadowLevels.forEach(level => this.card.classList.remove(level));
      
      const shadowLevel = this.getAttribute('shadow-level') || '1';
      this.card.classList.add(`shadow-${shadowLevel}`);
      
      // Update clickable state
      if (this.hasAttribute('clickable') && this.getAttribute('clickable') !== 'false') {
        this.card.classList.add('clickable');
      } else {
        this.card.classList.remove('clickable');
      }
      
      // Update title if it exists
      const titleElement = this.shadow.querySelector('.card-title');
      if (titleElement && this.hasAttribute('title')) {
        titleElement.textContent = this.getAttribute('title');
      }
    }
  }
  
  /**
   * Toggle Switch Component
   * A customizable toggle switch with label
   */
  class ToggleSwitch extends BaseComponent {
    static get observedAttributes() {
      return ['checked', 'disabled', 'label', 'name'];
    }

    constructor() {
      super();
      this.shadow = utils.createShadowDOM(this, `
        :host {
          display: inline-block;
          --toggle-width: 44px;
          --toggle-height: 24px;
          --toggle-padding: 2px;
          --toggle-color: var(--color-primary, #0eaaaa);
          --toggle-bg: var(--color-subtle, #e0e0e0);
        }
        
        .toggle-container {
          display: flex;
          align-items: center;
        }
        
        .toggle {
          position: relative;
          width: var(--toggle-width);
          height: var(--toggle-height);
          border-radius: calc(var(--toggle-height) / 2);
          background-color: var(--toggle-bg);
          transition: background-color 0.2s ease;
          cursor: pointer;
          flex-shrink: 0;
        }
        
        .toggle.checked {
          background-color: var(--toggle-color);
        }
        
        .toggle.disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .toggle-slider {
          position: absolute;
          top: var(--toggle-padding);
          left: var(--toggle-padding);
          width: calc(var(--toggle-height) - var(--toggle-padding) * 2);
          height: calc(var(--toggle-height) - var(--toggle-padding) * 2);
          border-radius: 50%;
          background-color: #fff;
          transition: transform 0.2s ease;
          cursor: pointer;
          z-index: 2; /* Ensure slider is on top for clicks */
        }
        
        .toggle.checked .toggle-slider {
          transform: translateX(calc(var(--toggle-width) - var(--toggle-height)));
        }
        
        .toggle-label {
          margin-left: 8px;
          cursor: pointer;
        }
        
        input {
          position: absolute;
          opacity: 0;
          width: 0;
          height: 0;
        }
        
        .toggle:focus-within {
          outline: 2px solid var(--color-primary);
          outline-offset: 2px;
        }
      `);
    }

    initialize() {
      // Create toggle container
      this.container = document.createElement('div');
      this.container.className = 'toggle-container';
      this.shadow.appendChild(this.container);
      
      // Create hidden input
      this.input = document.createElement('input');
      this.input.type = 'checkbox';
      if (this.hasAttribute('name')) {
        this.input.name = this.getAttribute('name');
      }
      this.container.appendChild(this.input);
      
      // Create toggle visual as a separate clickable element (not inside a label)
      this.toggle = document.createElement('div');
      this.toggle.className = 'toggle';
      this.toggle.setAttribute('role', 'switch'); // For accessibility
      this.toggle.setAttribute('tabindex', '0'); // Make it focusable
      this.container.appendChild(this.toggle);
      
      // Create toggle slider
      this.slider = document.createElement('div');
      this.slider.className = 'toggle-slider';
      this.toggle.appendChild(this.slider);
      
      // Create label if specified
      if (this.hasAttribute('label')) {
        this.labelElement = document.createElement('label');
        this.labelElement.className = 'toggle-label';
        this.labelElement.textContent = this.getAttribute('label');
        this.container.appendChild(this.labelElement);
        
        // Connect label to input
        const id = 'toggle-' + Math.random().toString(36).substring(2, 10);
        this.input.id = id;
        this.labelElement.htmlFor = id;
      }
      
      // Set initial state
      if (this.hasAttribute('checked') && this.getAttribute('checked') !== 'false') {
        this.input.checked = true;
        this.toggle.classList.add('checked');
        this.toggle.setAttribute('aria-checked', 'true');
      } else {
        this.toggle.setAttribute('aria-checked', 'false');
      }
      
      if (this.hasAttribute('disabled') && this.getAttribute('disabled') !== 'false') {
        this.input.disabled = true;
        this.toggle.classList.add('disabled');
        this.toggle.setAttribute('aria-disabled', 'true');
      }
      
      // Add event listeners
      this.input.addEventListener('change', this.handleChange.bind(this));
      
      // Make toggle itself clickable
      this.toggle.addEventListener('click', this.handleClick.bind(this));
      
      // Add keyboard support
      this.toggle.addEventListener('keydown', (e) => {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          this.handleClick(e);
        }
      });
    }
    
    handleClick(e) {
      e.stopPropagation();
      e.preventDefault();
      
      if (this.input.disabled) return;
      
      this.input.checked = !this.input.checked;
      const changeEvent = new Event('change');
      this.input.dispatchEvent(changeEvent);
    }
    
    handleChange() {
      if (this.input.checked) {
        this.toggle.classList.add('checked');
        this.toggle.setAttribute('aria-checked', 'true');
      } else {
        this.toggle.classList.remove('checked');
        this.toggle.setAttribute('aria-checked', 'false');
      }
      
      this.dispatchEvent(new CustomEvent('change', {
        bubbles: true,
        composed: true,
        detail: { checked: this.input.checked }
      }));
    }
    
    render() {
      // Update checked state
      if (this.hasAttribute('checked') && this.getAttribute('checked') !== 'false') {
        this.input.checked = true;
        this.toggle.classList.add('checked');
        this.toggle.setAttribute('aria-checked', 'true');
      } else {
        this.input.checked = false;
        this.toggle.classList.remove('checked');
        this.toggle.setAttribute('aria-checked', 'false');
      }
      
      // Update disabled state
      if (this.hasAttribute('disabled') && this.getAttribute('disabled') !== 'false') {
        this.input.disabled = true;
        this.toggle.classList.add('disabled');
        this.toggle.setAttribute('aria-disabled', 'true');
      } else {
        this.input.disabled = false;
        this.toggle.classList.remove('disabled');
        this.toggle.setAttribute('aria-disabled', 'false');
      }
      
      // Update label
      if (this.labelElement && this.hasAttribute('label')) {
        this.labelElement.textContent = this.getAttribute('label');
      }
      
      // Update name
      if (this.hasAttribute('name')) {
        this.input.name = this.getAttribute('name');
      }
    }
    
    get checked() {
      return this.input ? this.input.checked : false;
    }
    
    set checked(value) {
      if (!this.input) return;
      
      this.input.checked = Boolean(value);
      if (this.input.checked) {
        this.toggle.classList.add('checked');
        this.toggle.setAttribute('aria-checked', 'true');
      } else {
        this.toggle.classList.remove('checked');
        this.toggle.setAttribute('aria-checked', 'false');
      }
      
      // Update attribute to match property
      if (this.input.checked) {
        this.setAttribute('checked', '');
      } else {
        this.removeAttribute('checked');
      }
    }
  }
  
  /**
   * Tabs Component
   * Accessible tabbed interface component
   */
  class TabsComponent extends BaseComponent {
    constructor() {
      super();
      this.shadow = utils.createShadowDOM(this, `
        :host {
          display: block;
        }
        
        .tabs-container {
          display: flex;
          flex-direction: column;
        }
        
        .tabs-nav {
          display: flex;
          border-bottom: 1px solid var(--color-subtle, #e0e0e0);
          overflow-x: auto;
          scrollbar-width: thin;
        }
        
        .tabs-nav::-webkit-scrollbar {
          height: 4px;
        }
        
        .tabs-nav::-webkit-scrollbar-thumb {
          background-color: var(--color-subtle, #e0e0e0);
          border-radius: 4px;
        }
        
        .tab-button {
          padding: 8px 16px;
          border: none;
          background: none;
          cursor: pointer;
          font-family: inherit;
          font-size: inherit;
          color: inherit;
          border-bottom: 2px solid transparent;
          margin-bottom: -1px;
          white-space: nowrap;
          transition: all 0.2s ease;
        }
        
        .tab-button:hover {
          background-color: rgba(0, 0, 0, 0.05);
        }
        
        .tab-button[aria-selected="true"] {
          border-bottom-color: var(--color-primary, #0eaaaa);
          font-weight: 500;
        }
        
        .tab-button:focus {
          outline: 2px solid var(--color-primary, #0eaaaa);
          outline-offset: -2px;
        }
        
        .tab-content {
          padding: 16px 0;
        }
        
        .tab-panel {
          display: none;
        }
        
        .tab-panel[aria-hidden="false"] {
          display: block;
        }
      `);
    }

    initialize() {
      // Create container
      this.container = document.createElement('div');
      this.container.className = 'tabs-container';
      this.shadow.appendChild(this.container);
      
      // Create tabs navigation
      this.tabsNav = document.createElement('div');
      this.tabsNav.className = 'tabs-nav';
      this.tabsNav.setAttribute('role', 'tablist');
      this.container.appendChild(this.tabsNav);
      
      // Create content container
      this.contentContainer = document.createElement('div');
      this.contentContainer.className = 'tab-content';
      this.container.appendChild(this.contentContainer);
      
      // Get all tab elements
      this.tabs = Array.from(this.querySelectorAll('tab-item'));
      
      // Generate tabs
      this.setupTabs();
      
      // Handle mutation observer to detect when tabs are added/removed
      this.observer = new MutationObserver((mutations) => {
        let needsUpdate = false;
        
        for (const mutation of mutations) {
          if (mutation.type === 'childList') {
            needsUpdate = true;
            break;
          }
        }
        
        if (needsUpdate) {
          this.tabs = Array.from(this.querySelectorAll('tab-item'));
          this.setupTabs();
        }
      });
      
      this.observer.observe(this, { childList: true });
    }
    
    setupTabs() {
      // Clear existing tabs
      this.tabsNav.innerHTML = '';
      this.contentContainer.innerHTML = '';
      
      if (!this.tabs.length) return;
      
      // Create buttons and panels
      this.tabs.forEach((tab, index) => {
        const id = tab.id || `tab-${this._generateId()}-${index}`;
        const panelId = `${id}-panel`;
        const label = tab.getAttribute('label') || `Tab ${index + 1}`;
        const selected = tab.hasAttribute('selected') && tab.getAttribute('selected') !== 'false';
        
        // Create tab button
        const button = document.createElement('button');
        button.className = 'tab-button';
        button.textContent = label;
        button.setAttribute('role', 'tab');
        button.setAttribute('id', id);
        button.setAttribute('aria-selected', selected);
        button.setAttribute('aria-controls', panelId);
        button.setAttribute('tabindex', selected ? '0' : '-1');
        this.tabsNav.appendChild(button);
        
        // Create panel
        const panel = document.createElement('div');
        panel.className = 'tab-panel';
        panel.setAttribute('role', 'tabpanel');
        panel.setAttribute('id', panelId);
        panel.setAttribute('aria-labelledby', id);
        panel.setAttribute('aria-hidden', !selected);
        panel.setAttribute('tabindex', '0');
        
        // Move tab content to panel
        while (tab.firstChild) {
          panel.appendChild(tab.firstChild);
        }
        
        this.contentContainer.appendChild(panel);
        
        // Add event listener
        button.addEventListener('click', () => this.selectTab(index));
      });
      
      // Add keyboard navigation
      this.tabsNav.addEventListener('keydown', this.handleKeyDown.bind(this));
      
      // Select first tab if none is selected
      if (!this.tabs.find(tab => tab.hasAttribute('selected'))) {
        this.selectTab(0);
      }
    }
    
    selectTab(index) {
      const buttons = Array.from(this.tabsNav.querySelectorAll('.tab-button'));
      const panels = Array.from(this.contentContainer.querySelectorAll('.tab-panel'));
      
      if (index < 0 || index >= buttons.length) return;
      
      // Update buttons
      buttons.forEach((button, i) => {
        button.setAttribute('aria-selected', i === index);
        button.setAttribute('tabindex', i === index ? '0' : '-1');
      });
      
      // Update panels
      panels.forEach((panel, i) => {
        panel.setAttribute('aria-hidden', i !== index);
      });
      
      // Focus the selected button
      buttons[index].focus();
      
      // Update selected attribute on tab-item elements
      this.tabs.forEach((tab, i) => {
        if (i === index) {
          tab.setAttribute('selected', '');
        } else {
          tab.removeAttribute('selected');
        }
      });
      
      // Dispatch event
      this.dispatchEvent(new CustomEvent('tab-change', {
        bubbles: true,
        composed: true,
        detail: { index, tabId: buttons[index].id }
      }));
    }
    
    handleKeyDown(event) {
      const buttons = Array.from(this.tabsNav.querySelectorAll('.tab-button'));
      const currentIndex = buttons.findIndex(button => button.getAttribute('aria-selected') === 'true');
      
      let newIndex;
      
      switch (event.key) {
        case 'ArrowRight':
          newIndex = (currentIndex + 1) % buttons.length;
          event.preventDefault();
          this.selectTab(newIndex);
          break;
        case 'ArrowLeft':
          newIndex = (currentIndex - 1 + buttons.length) % buttons.length;
          event.preventDefault();
          this.selectTab(newIndex);
          break;
        case 'Home':
          event.preventDefault();
          this.selectTab(0);
          break;
        case 'End':
          event.preventDefault();
          this.selectTab(buttons.length - 1);
          break;
      }
    }
    
    cleanup() {
      if (this.observer) {
        this.observer.disconnect();
      }
    }
    
    _generateId() {
      return Math.random().toString(36).substring(2, 10);
    }
  }
  
  /**
   * Tab Item Component
   * Individual tab for the Tabs component
   */
  class TabItem extends HTMLElement {
    static get observedAttributes() {
      return ['label', 'selected'];
    }
    
    constructor() {
      super();
    }
    
    connectedCallback() {
      // This is mostly a container element,
      // actual functionality is handled by the parent TabsComponent
    }
    
    attributeChangedCallback(name, oldValue, newValue) {
      if (name === 'selected' && this.parentElement) {
        // Notify parent tabs component about selection change
        const event = new CustomEvent('tab-item-selected', {
          bubbles: true,
          detail: { tabItem: this }
        });
        this.dispatchEvent(event);
      }
    }
  }

  // Register all components
  customElements.define('responsive-image', ResponsiveImage);
  customElements.define('custom-card', CardComponent);
  customElements.define('toggle-switch', ToggleSwitch);
  customElements.define('tabs-container', TabsComponent);
  customElements.define('tab-item', TabItem);
  
  // Expose the component system API
  window.webComponents = {
    utils,
    BaseComponent
  };
})();