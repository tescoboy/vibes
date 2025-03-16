// Mobile card optimization for portrait mode
document.addEventListener('DOMContentLoaded', function() {
  // Create a style element
  const style = document.createElement('style');
  
  // Define the styles for cards on mobile
  style.textContent = `
    /* Make cards full width on mobile portrait mode */
    @media screen and (max-width: 576px) {
      .play-grid {
        display: grid !important;
        grid-template-columns: 1fr !important; /* Force single column */
        gap: 15px !important;
        padding: 0 10px !important;
        width: 100% !important;
        box-sizing: border-box !important;
      }
      
      .play-card {
        width: 100% !important;
        max-width: none !important;
        margin-bottom: 15px !important;
        box-sizing: border-box !important;
        position: relative !important;
      }
      
      .play-card-image {
        height: 200px !important; /* Taller images for better visibility */
        width: 100% !important;
      }
      
      .play-card-content {
        padding: 15px !important;
      }
      
      /* Ensure proper spacing */
      .play-title {
        font-size: 1.2rem !important;
        margin-top: 5px !important;
      }
      
      .play-date, .play-theatre {
        font-size: 0.9rem !important;
      }
    }
    
    /* Even smaller devices */
    @media screen and (max-width: 375px) {
      .play-card-image {
        height: 180px !important;
      }
      
      .play-grid {
        padding: 0 5px !important;
      }
    }

    /* Base styles for edit button */
    .edit-icon {
      opacity: 0;
      transition: opacity 0.2s ease;
      position: absolute;
      top: 10px;
      right: 10px;
    }
    
    /* Desktop hover effect - hide by default, show on hover */
    @media (hover: hover) {
      .edit-icon {
        opacity: 0 !important;
      }
      
      .play-card:hover .edit-icon {
        opacity: 1 !important;
      }
    }
    
    /* Mobile specific - show with reduced opacity by default */
    @media (hover: none) {
      .edit-icon {
        opacity: 0.6 !important;
      }
    }
  `;
  
  // Add the styles to the document
  document.head.appendChild(style);
  
  // Detect if we're on a mobile device
  const isMobileDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  
  // Set up edit buttons based on device
  function setupEditButtons() {
    const editButtons = document.querySelectorAll('.edit-icon:not([data-setup])');
    
    editButtons.forEach(button => {
      button.setAttribute('data-setup', 'true');
      const card = button.closest('.play-card');
      if (!card) return;
      
      if (isMobileDevice) {
        // On mobile, make slightly visible by default
        button.style.opacity = '0.6';
        
        // Make fully visible on tap
        card.addEventListener('touchstart', () => {
          const allButtons = document.querySelectorAll('.edit-icon');
          allButtons.forEach(btn => {
            if (btn !== button) btn.style.opacity = '0.6';
          });
          button.style.opacity = '1';
        });
      } else {
        // Desktop behavior
        button.style.opacity = '0';
        
        card.addEventListener('mouseenter', () => {
          button.style.opacity = '1';
        });
        
        card.addEventListener('mouseleave', () => {
          button.style.opacity = '0';
        });
      }
    });
  }
  
  // Initial setup
  setTimeout(setupEditButtons, 500);
  
  // Set up for dynamically added content
  const observer = new MutationObserver((mutations) => {
    let shouldUpdate = false;
    
    for (const mutation of mutations) {
      if (mutation.type === 'childList' && mutation.addedNodes.length) {
        shouldUpdate = true;
        break;
      }
    }
    
    if (shouldUpdate) {
      setupEditButtons();
    }
  });
  
  // Observe the play grid for changes
  const playGrid = document.querySelector('.play-grid');
  if (playGrid) {
    observer.observe(playGrid, {
      childList: true,
      subtree: true
    });
  }
  
  // Also run when display functions are called
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      setTimeout(setupEditButtons, 500);
    });
  });
}); 