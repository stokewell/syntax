/**
 * Modal
 * A lightweight, accessible modal implementation
 * Handles modal opening, closing, and keyboard interactions
 */

(function() {
  // DOM selectors
  const MODAL_SELECTOR = '.modal';
  const MODAL_TRIGGER_SELECTOR = '[data-modal-target]';
  const MODAL_CLOSE_SELECTOR = '[data-modal-close]';
  const ACTIVE_CLASS = 'is-active';
  
  // Keyboard keys
  const ESCAPE_KEY = 'Escape';
  const TAB_KEY = 'Tab';
  
  // Get all modals on the page
  const modals = document.querySelectorAll(MODAL_SELECTOR);
  
  // Open modal
  const openModal = (modalId) => {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    
    // Show modal
    modal.classList.add(ACTIVE_CLASS);
    document.body.style.overflow = 'hidden'; // Prevent scrolling
    
    // Set focus to first focusable element
    const focusableElements = modal.querySelectorAll('a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])');
    if (focusableElements.length) {
      focusableElements[0].focus();
    }
    
    // Remember which element had focus before opening modal
    modal.dataset.previousFocus = document.activeElement.id || '';
  };
  
  // Close modal
  const closeModal = (modal) => {
    if (!modal) return;
    
    modal.classList.remove(ACTIVE_CLASS);
    document.body.style.overflow = '';
    
    // Return focus to triggering element
    if (modal.dataset.previousFocus) {
      const previousElement = document.getElementById(modal.dataset.previousFocus);
      if (previousElement) {
        previousElement.focus();
      }
    }
  };
  
  // Close all modals
  const closeAllModals = () => {
    modals.forEach(modal => {
      closeModal(modal);
    });
  };
  
  // Handle keyboard events
  const handleKeydown = (event) => {
    // Find active modal
    const activeModal = document.querySelector(`${MODAL_SELECTOR}.${ACTIVE_CLASS}`);
    if (!activeModal) return;
    
    if (event.key === ESCAPE_KEY) {
      event.preventDefault();
      closeModal(activeModal);
    } else if (event.key === TAB_KEY) {
      // Trap focus in modal
      const focusableElements = activeModal.querySelectorAll('a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])');
      if (!focusableElements.length) return;
      
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      
      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  };
  
  // Initialize modals
  const initModals = () => {
    // Handle modal triggers
    document.addEventListener('click', (event) => {
      // Open modal when trigger is clicked
      if (event.target.matches(MODAL_TRIGGER_SELECTOR) || event.target.closest(MODAL_TRIGGER_SELECTOR)) {
        event.preventDefault();
        const trigger = event.target.matches(MODAL_TRIGGER_SELECTOR) 
          ? event.target 
          : event.target.closest(MODAL_TRIGGER_SELECTOR);
        const modalId = trigger.dataset.modalTarget;
        if (modalId) {
          openModal(modalId);
        }
      }
      
      // Close modal when close button is clicked
      if (event.target.matches(MODAL_CLOSE_SELECTOR) || event.target.closest(MODAL_CLOSE_SELECTOR)) {
        event.preventDefault();
        const modal = event.target.closest(MODAL_SELECTOR);
        closeModal(modal);
      }
      
      // Close modal when clicking outside content
      if (event.target.matches(MODAL_SELECTOR)) {
        closeModal(event.target);
      }
    });
    
    // Handle keyboard events
    document.addEventListener('keydown', handleKeydown);
  };
  
  // Initialize when DOM is loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initModals);
  } else {
    initModals();
  }
  
  // Expose modal API to window (for developer use)
  window.modalController = {
    open: openModal,
    close: closeModal,
    closeAll: closeAllModals
  };
})();