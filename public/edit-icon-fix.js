// Fix edit icons with SVG - targeting the correct class
document.addEventListener('DOMContentLoaded', function() {
  // Direct CSS approach for immediate effect
  const style = document.createElement('style');
  style.textContent = `
    /* Target the actual edit-icon class */
    .edit-icon {
      opacity: 0 !important;
      transition: opacity 0.2s ease !important;
    }
    
    /* Show on hover */
    .play-card:hover .edit-icon {
      opacity: 1 !important;
    }
    
    /* Different rule for touch devices */
    @media (hover: none) {
      .edit-icon {
        opacity: 0.6 !important;
      }
    }
  `;
  document.head.appendChild(style);
  
  // Implement direct DOM manipulation for more reliable control
  function setupEditIconHover() {
    // Get all edit icons
    const editIcons = document.querySelectorAll('.edit-icon');
    
    editIcons.forEach(icon => {
      // Force initial hidden state
      icon.style.opacity = '0';
      
      // Get parent card
      const card = icon.closest('.play-card');
      if (card) {
        // Add card hover events
        card.addEventListener('mouseenter', function() {
          icon.style.opacity = '1';
        });
        
        card.addEventListener('mouseleave', function() {
          icon.style.opacity = '0';
        });
      }
    });
  }
  
  // Run on page load
  setupEditIconHover();
  
  // Set up observer to detect when new cards are added
  const observer = new MutationObserver(function(mutations) {
    let shouldUpdate = false;
    
    mutations.forEach(function(mutation) {
      if (mutation.addedNodes.length) {
        // Check if any added nodes might contain our target elements
        mutation.addedNodes.forEach(function(node) {
          if (node.nodeType === 1 && (
              node.classList?.contains('play-card') ||
              node.querySelector?.('.edit-icon')
          )) {
            shouldUpdate = true;
          }
        });
      }
    });
    
    if (shouldUpdate) {
      setupEditIconHover();
    }
  });
  
  // Start observing with a more targeted approach
  observer.observe(document.querySelector('.play-grid') || document.body, {
    childList: true,
    subtree: true
  });
  
  // Also run when changing sections
  document.querySelectorAll('[onclick*="displayPlays"]').forEach(element => {
    element.addEventListener('click', function() {
      setTimeout(setupEditIconHover, 300);
    });
  });
}); 