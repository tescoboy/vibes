// Mobile Edit Button Solution - Direct Approach
(function() {
  console.log("📱 Mobile Edit Button Fix Starting");
  
  // Wait for content to load
  setTimeout(applyMobileButtonFix, 800);
  
  // Also apply on navigation changes
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      setTimeout(applyMobileButtonFix, 800);
    });
  });
  
  function applyMobileButtonFix() {
    console.log("Applying mobile edit button fix");
    
    // Target only what we need - clean approach
    const style = document.createElement('style');
    style.id = 'mobile-edit-button-fix';
    
    // Remove any previous styles
    document.getElementById('mobile-edit-button-fix')?.remove();
    
    style.textContent = `
      /* Clean, direct approach for edit buttons */
      .play-card {
        position: relative !important;
      }
      
      /* For desktop: hidden by default, visible on hover */
      @media (hover: hover) {
        .edit-icon {
          opacity: 0 !important;
          transition: opacity 0.2s ease !important;
        }
        
        .play-card:hover .edit-icon {
          opacity: 1 !important;
        }
      }
      
      /* For touch screens: always semi-visible */
      @media (hover: none) {
        .edit-icon {
          opacity: 0.7 !important; 
          background-color: rgba(255, 255, 255, 0.9) !important;
          border-radius: 50% !important;
          padding: 8px !important;
          position: absolute !important;
          top: 10px !important;
          right: 10px !important;
          z-index: 100 !important;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2) !important;
        }
      }
    `;
    
    document.head.appendChild(style);
    
    // Clear any previously applied inline styles
    document.querySelectorAll('.edit-icon').forEach(button => {
      // Remove all conflicting inline styles
      button.removeAttribute('style');
    });
    
    console.log("Mobile edit button fix applied!");
  }
  
  // Set up a MutationObserver to monitor for any new content
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList' && mutation.addedNodes.length) {
        const hasNewCards = Array.from(mutation.addedNodes).some(node => 
          node.nodeType === 1 && (
            node.classList?.contains('play-card') || 
            node.querySelector?.('.play-card')
          )
        );
        
        if (hasNewCards) {
          applyMobileButtonFix();
        }
      }
    });
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
})(); 