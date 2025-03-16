// Comprehensive mobile optimizations across all app features
document.addEventListener('DOMContentLoaded', function() {
  // === 1. Detect mobile device ===
  const isMobile = window.innerWidth <= 576;
  
  if (isMobile) {
    document.body.classList.add('mobile-view');
    
    // === 2. Optimize Calendar View ===
    optimizeCalendar();
    
    // === 3. Improve form usability ===
    optimizeForms();
    
    // === 4. Enhance navigation experience ===
    optimizeNavigation();
    
    // === 5. Fix any scroll/overflow issues ===
    fixScrollIssues();
  }
  
  // =========== IMPLEMENTATION FUNCTIONS ===========
  
  function optimizeCalendar() {
    // Make calendar swipeable for month navigation
    const calendar = document.querySelector('.calendar-container');
    if (!calendar) return;
    
    // Add month name to small-screen calendar view
    const monthDisplay = document.createElement('div');
    monthDisplay.className = 'current-month-display';
    monthDisplay.style.cssText = 'text-align: center; font-weight: bold; margin: 10px 0;';
    calendar.parentNode.insertBefore(monthDisplay, calendar);
    
    // Update month display when calendar changes
    const updateMonthDisplay = function() {
      const currentMonthEl = document.querySelector('.calendar-header .current-month');
      if (currentMonthEl) {
        monthDisplay.textContent = currentMonthEl.textContent;
      }
    };
    
    // Observer for calendar changes
    const observer = new MutationObserver(updateMonthDisplay);
    observer.observe(calendar, { childList: true, subtree: true });
    
    // Initial update
    setTimeout(updateMonthDisplay, 500);
  }
  
  function optimizeForms() {
    // Prevent zoom on focus for iOS
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
      input.style.fontSize = '16px';
    });
    
    // Improve date inputs
    const dateInputs = document.querySelectorAll('input[type="date"]');
    dateInputs.forEach(input => {
      input.setAttribute('pattern', '[0-9]{4}-[0-9]{2}-[0-9]{2}');
      input.setAttribute('placeholder', 'YYYY-MM-DD');
    });
    
    // Ensure form labels are visible when typing
    const formGroups = document.querySelectorAll('.form-group');
    formGroups.forEach(group => {
      const input = group.querySelector('input, select, textarea');
      const label = group.querySelector('label');
      
      if (input && label) {
        input.addEventListener('focus', () => {
          label.style.color = 'var(--color-primary)';
        });
        
        input.addEventListener('blur', () => {
          label.style.color = '';
        });
      }
    });
  }
  
  function optimizeNavigation() {
    // Close menu when clicking a nav link
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        const navLinks = document.querySelector('.nav-links');
        if (navLinks && navLinks.classList.contains('active')) {
          navLinks.classList.remove('active');
          document.querySelector('.burger-menu')?.classList.remove('active');
        }
      });
    });
    
    // Make navigation sticky on scroll
    let lastScrollTop = 0;
    const nav = document.querySelector('nav');
    
    window.addEventListener('scroll', () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      if (scrollTop > lastScrollTop && scrollTop > 60) {
        // Scrolling down & past header
        nav.style.transform = 'translateY(-100%)';
      } else {
        // Scrolling up or at top
        nav.style.transform = 'translateY(0)';
      }
      
      lastScrollTop = scrollTop;
    });
  }
  
  function fixScrollIssues() {
    // Prevent body scroll when menu is open
    const burger = document.querySelector('.burger-menu');
    const html = document.documentElement;
    
    if (burger) {
      burger.addEventListener('click', () => {
        const navLinks = document.querySelector('.nav-links');
        if (navLinks.classList.contains('active')) {
          html.style.overflow = 'hidden';
        } else {
          html.style.overflow = '';
        }
      });
    }
    
    // Fix iOS momentum scroll issues
    document.querySelectorAll('.calendar-container, .play-grid').forEach(el => {
      el.style.webkitOverflowScrolling = 'touch';
    });
  }
}); 