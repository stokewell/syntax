/**
 * Modern Navigation System
 * Agency-grade navigation with mobile menu, dropdowns, and scroll behavior
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Menu Toggle
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  
  if (menuToggle && mobileNav) {
    menuToggle.addEventListener('click', () => {
      const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', !isExpanded);
      menuToggle.classList.toggle('open');
      mobileNav.classList.toggle('open');
      mobileNav.setAttribute('aria-hidden', isExpanded);
      
      // Prevent body scroll when menu is open
      document.body.style.overflow = isExpanded ? '' : 'hidden';
    });
    
    // Mobile navigation dropdown handling
    const mobileNavDropdowns = document.querySelectorAll('.mobile-nav-dropdown');
    
    mobileNavDropdowns.forEach(dropdownItem => {
      const dropdownLink = dropdownItem.querySelector('.mobile-dropdown-parent');
      const dropdownToggle = dropdownItem.querySelector('.mobile-dropdown-toggle');
      const mobileSubmenu = dropdownItem.querySelector('.mobile-submenu');
      
      // Show submenu by default
      if (mobileSubmenu) {
        mobileSubmenu.style.display = 'block';
        if (dropdownToggle) {
          dropdownToggle.classList.add('expanded');
        }
      }
      
      // Handle dropdown toggle click
      if (dropdownToggle) {
        dropdownToggle.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          
          dropdownToggle.classList.toggle('expanded');
          
          // Update display
          if (mobileSubmenu) {
            if (dropdownToggle.classList.contains('expanded')) {
              mobileSubmenu.style.display = 'block';
            } else {
              mobileSubmenu.style.display = 'none';
            }
          }
        });
      }
      
      // Let the main link work normally - it will navigate to the tab
    });
    
    // Close mobile menu on regular item click (not dropdowns)
    document.querySelectorAll('.mobile-nav-link:not(.mobile-nav-dropdown > .mobile-nav-link), .mobile-submenu-link').forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.classList.remove('open');
        mobileNav.classList.remove('open');
        mobileNav.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      });
    });
  }
  
  // 2. Dropdown Menu System
  const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
  
  dropdownToggles.forEach(toggle => {
    toggle.addEventListener('click', (e) => {
      e.preventDefault();
      
      const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
      const dropdownMenu = document.getElementById(toggle.getAttribute('aria-controls'));
      
      if (!dropdownMenu) return;
      
      // Close all other dropdowns first
      document.querySelectorAll('.dropdown-content.active').forEach(menu => {
        if (menu !== dropdownMenu) {
          menu.classList.remove('active');
          const otherToggle = document.querySelector(`[aria-controls="${menu.id}"]`);
          if (otherToggle) {
            otherToggle.setAttribute('aria-expanded', 'false');
            otherToggle.classList.remove('active');
          }
        }
      });
      
      // Toggle current dropdown
      toggle.setAttribute('aria-expanded', !isExpanded);
      toggle.classList.toggle('active');
      dropdownMenu.classList.toggle('active');
      
      // Add click outside listener to close dropdown
      if (!isExpanded) {
        setTimeout(() => {
          document.addEventListener('click', function closeDropdown(event) {
            const isClickInside = toggle.contains(event.target) || 
                               dropdownMenu.contains(event.target);
            
            if (!isClickInside) {
              toggle.setAttribute('aria-expanded', 'false');
              toggle.classList.remove('active');
              dropdownMenu.classList.remove('active');
              document.removeEventListener('click', closeDropdown);
            }
          });
        }, 0);
      }
    });
  });
  
  // 3. Sticky Header with Hide/Show on Scroll
  const header = document.getElementById('main-header');
  
  if (header) {
    let lastScrollY = window.scrollY;
    const scrollThreshold = 100; // Amount of scroll before header gets shadow
    const scrollDistance = 50; // How far to scroll before hiding nav
    
    window.addEventListener('scroll', () => {
      const currentScrollY = window.scrollY;
      
      // Add shadow when scrolled down
      if (currentScrollY > scrollThreshold) {
        header.classList.add('shadow');
      } else {
        header.classList.remove('shadow');
      }
      
      // Hide on scroll down, show on scroll up
      if (currentScrollY > lastScrollY && currentScrollY > 150) {
        // Scrolling down & past header
        if (!header.classList.contains('nav-hidden') && 
            (currentScrollY - lastScrollY) > scrollDistance) {
          header.classList.add('nav-hidden');
        }
      } else {
        // Scrolling up
        header.classList.remove('nav-hidden');
      }
      
      lastScrollY = currentScrollY;
    });
  }
  
  // 4. Set active nav item based on current section
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
  
  if (sections.length && navLinks.length) {
    window.addEventListener('scroll', () => {
      let current = '';
      const scrollY = window.scrollY;
      
      sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        
        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
          current = section.getAttribute('id');
        }
      });
      
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}` || 
            (current === '' && link.getAttribute('href') === 'index.html')) {
          link.classList.add('active');
        }
      });
    });
  }
  
  // 5. Smooth anchor scrolling with offset for fixed header
  document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        
        const headerHeight = document.querySelector('header').offsetHeight || 0;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
        
        window.scrollTo({
          top: targetPosition - headerHeight,
          behavior: 'smooth'
        });
      }
    });
  });
  
  // 6. Skip to content link for accessibility
  const skipLink = document.createElement('a');
  skipLink.href = '#main-content';
  skipLink.className = 'skip-to-content';
  skipLink.textContent = 'Skip to content';
  
  document.body.insertBefore(skipLink, document.body.firstChild);
  
  // Add main-content id to first main content area if not present
  const mainContent = document.querySelector('main') || document.querySelector('.hero-section');
  if (mainContent && !document.getElementById('main-content')) {
    mainContent.id = 'main-content';
    mainContent.setAttribute('tabindex', '-1');
  }
  
  // 7. Handle tab content navigation via hash
  const handleTabFromHash = () => {
    const hash = window.location.hash;
    if (hash) {
      const tabId = hash.substring(1);
      const tabContent = document.getElementById(tabId);
      
      if (tabContent && tabContent.classList.contains('custom-tab-content')) {
        // Find the corresponding tab button
        const tabButton = document.querySelector(`.custom-tab-button[data-tab="${tabId}"]`);
        
        if (tabButton) {
          // Activate the tab if we have tab functionality
          if (typeof window.activateTab === 'function') {
            window.activateTab(tabId);
          } else {
            // Manual activation if the tab system JS isn't fully loaded
            const allTabContents = document.querySelectorAll('.custom-tab-content');
            const allTabButtons = document.querySelectorAll('.custom-tab-button');
            
            // Deactivate all tabs
            allTabContents.forEach(content => {
              content.classList.remove('active');
              content.style.opacity = '0';
              content.style.transform = 'translateY(10px)';
            });
            
            allTabButtons.forEach(btn => btn.classList.remove('active'));
            
            // Activate the target tab
            tabContent.classList.add('active');
            tabButton.classList.add('active');
            
            // Animation
            setTimeout(() => {
              tabContent.style.opacity = '1';
              tabContent.style.transform = 'translateY(0)';
              
              // Scroll to tabs area with offset for fixed header
              const tabsContainer = document.querySelector('.custom-tabs');
              if (tabsContainer) {
                const headerHeight = document.querySelector('header').offsetHeight || 0;
                const tabsTop = tabsContainer.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
                
                window.scrollTo({
                  top: tabsTop,
                  behavior: 'smooth'
                });
              }
            }, 50);
          }
        }
      }
    }
  };
  
  // Check hash on page load and handle tab switching
  setTimeout(handleTabFromHash, 300);
  
  // Listen for hash changes
  window.addEventListener('hashchange', handleTabFromHash);
});