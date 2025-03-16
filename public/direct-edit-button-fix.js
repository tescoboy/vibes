// Direct DOM manipulation to control edit button visibility
document.addEventListener('DOMContentLoaded', function() {
  // 1. First try to find and patch the function that creates play cards
  // Look for common function names that might create cards
  const originalFunctions = [
    'createPlayCard',
    'renderPlayCard',
    'displayPlayCard',
    'addPlayToGrid'
  ];
  
  // Try to patch each potential function
  originalFunctions.forEach(funcName => {
    if (typeof window[funcName] === 'function') {
      console.log(`Patching ${funcName} function to handle edit buttons`);
      const originalFunc = window[funcName];
      window[funcName] = function() {
        // Call original function
        const result = originalFunc.apply(this, arguments);
        
        // Find and modify edit buttons
        setTimeout(hideAllEditButtons, 10);
        return result;
      };
    }
  });
  
  // 2. Use a MutationObserver as a fallback to monitor for new edit buttons
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === 'childList' && mutation.addedNodes.length) {
        const editButtons = document.querySelectorAll('.edit-button');
        editButtons.forEach(configureEditButton);
      }
    }
  });
  
  // Start observing the DOM for changes
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
  
  // 3. Direct function to hide all edit buttons
  function hideAllEditButtons() {
    const editButtons = document.querySelectorAll('.edit-button');
    editButtons.forEach(configureEditButton);
  }
  
  // Configure a single edit button
  function configureEditButton(button) {
    // Remove any existing inline styles
    button.removeAttribute('style');
    
    // Add our own class that we fully control
    button.classList.add('edit-button-hidden');
    
    // Find the parent card
    const card = button.closest('.play-card');
    if (card) {
      // Remove existing listeners to prevent duplicates
      card.removeEventListener('mouseenter', showEditButton);
      card.removeEventListener('mouseleave', hideEditButton);
      
      // Add our own listeners
      card.addEventListener('mouseenter', showEditButton);
      card.addEventListener('mouseleave', hideEditButton);
    }
  }
  
  // Event handlers
  function showEditButton(e) {
    const card = e.currentTarget;
    const button = card.querySelector('.edit-button, .edit-button-hidden');
    if (button) {
      button.classList.remove('edit-button-hidden');
      button.classList.add('edit-button-visible');
    }
  }
  
  function hideEditButton(e) {
    const card = e.currentTarget;
    const button = card.querySelector('.edit-button, .edit-button-visible');
    if (button) {
      button.classList.remove('edit-button-visible');
      button.classList.add('edit-button-hidden');
    }
  }
  
  // 4. Create a style element with our controlled classes
  const style = document.createElement('style');
  style.textContent = `
    .edit-button-hidden {
      opacity: 0 !important;
      transition: opacity 0.2s ease !important;
    }
    
    .edit-button-visible {
      opacity: 1 !important;
      transition: opacity 0.2s ease !important;
    }
    
    @media (hover: none) {
      .edit-button-hidden {
        opacity: 0.7 !important;
      }
    }
  `;
  document.head.appendChild(style);
  
  // 5. Initial run to catch all existing buttons
  hideAllEditButtons();
  
  // 6. Also run when navigation events happen
  document.querySelectorAll('[onclick*="displayPlays"], [onclick*="showAdd"], a.nav-link').forEach(el => {
    el.addEventListener('click', () => {
      setTimeout(hideAllEditButtons, 300);
    });
  });
}); 