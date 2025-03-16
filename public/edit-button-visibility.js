// Direct fix for edit button visibility across all devices
(function() {
  // Immediately run + set a timed execution to catch delayed rendering
  applyEditButtonFix();
  setTimeout(applyEditButtonFix, 1000);
  
  function applyEditButtonFix() {
    console.log("Applying edit button fix...");
    
    // STEP 1: Direct CSS injection with maximum specificity
    const styleElement = document.createElement('style');
    styleElement.id = 'edit-button-visibility-styles';
    
    // Remove any existing version first
    document.getElementById('edit-button-visibility-styles')?.remove();
    
    styleElement.textContent = `
      /* Hide edit buttons by default with maximum specificity */
      button.edit-icon, 
      .edit-icon,
      .edit-button,
      button[onclick*="edit"],
      [class*="edit"] > svg,
      [onclick*="edit"] {
        opacity: 0 !important;
        transition: opacity 0.3s ease !important;
        background-color: white !important;
        border-radius: 50% !important;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2) !important;
        z-index: 10 !important;
      }
      
      /* Show edit buttons on hover (desktop only) */
      .play-card:hover button.edit-icon,
      .play-card:hover .edit-icon,
      .play-card:hover .edit-button,
      .play-card:hover button[onclick*="edit"],
      .play-card:hover [class*="edit"] > svg,
      .play-card:hover [onclick*="edit"] {
        opacity: 1 !important;
      }
      
      /* Handle touch devices */
      @media (hover: none) {
        /* Partial visibility for mobile */
        button.edit-icon, 
        .edit-icon,
        .edit-button,
        button[onclick*="edit"],
        [class*="edit"] > svg,
        [onclick*="edit"] {
          opacity: 0.5 !important;
        }
      }
    `;
    
    document.head.appendChild(styleElement);
    
    // STEP 2: Direct DOM manipulation for even more control
    document.querySelectorAll('.play-card').forEach(card => {
      // Find edit buttons using multiple selectors
      const editButton = card.querySelector('.edit-icon, .edit-button, button[onclick*="edit"], [class*="edit"] > svg, [onclick*="edit"]');
      
      if (editButton) {
        // Remove any existing inline styles
        editButton.removeAttribute('style');
        
        // Apply our own inline styles
        editButton.style.cssText = 'opacity: 0 !important; transition: opacity 0.3s ease;';
        
        // Remove any existing event listeners (to avoid duplicates)
        card.removeEventListener('mouseenter', showEditButton);
        card.removeEventListener('mouseleave', hideEditButton);
        
        // Add new event listeners for desktop
        card.addEventListener('mouseenter', showEditButton);
        card.addEventListener('mouseleave', hideEditButton);
        
        // Handle touch devices
        if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
          editButton.style.opacity = '0.5';
          
          card.addEventListener('touchstart', function(e) {
            // Don't show edit button if touching the button itself (let the click go through)
            if (e.target !== editButton && !editButton.contains(e.target)) {
              editButton.style.opacity = '1';
              setTimeout(() => { editButton.style.opacity = '0.5'; }, 1500);
            }
          });
        }
      }
    });
  }
  
  // Event handler functions
  function showEditButton(e) {
    const card = this;
    const editButton = card.querySelector('.edit-icon, .edit-button, button[onclick*="edit"], [class*="edit"] > svg, [onclick*="edit"]');
    if (editButton) {
      editButton.style.opacity = '1';
    }
  }
  
  function hideEditButton(e) {
    const card = this;
    const editButton = card.querySelector('.edit-icon, .edit-button, button[onclick*="edit"], [class*="edit"] > svg, [onclick*="edit"]');
    if (editButton) {
      editButton.style.opacity = '0';
    }
  }
  
  // STEP 3: Set up a MutationObserver to catch dynamically added cards
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.addedNodes.length) {
        applyEditButtonFix();
      }
    });
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
  
  // STEP 4: Update on navigation events
  document.querySelectorAll('[onclick*="display"], .nav-link').forEach(el => {
    el.addEventListener('click', function() {
      setTimeout(applyEditButtonFix, 300);
    });
  });
})(); 