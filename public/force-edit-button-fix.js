// ULTRA-AGGRESSIVE edit button fix - will force the edit buttons to work correctly
(function() {
  console.log("🔧 Starting ultra-aggressive edit button fix");
  
  // Continue to check for edit buttons every 500ms to catch any that might appear later
  const fixInterval = setInterval(forceFixEditButtons, 500);
  
  // Also run immediately
  forceFixEditButtons();
  
  // Run after short timeout to catch any initial renders
  setTimeout(forceFixEditButtons, 100);
  setTimeout(forceFixEditButtons, 1000);
  
  function forceFixEditButtons() {
    console.log("🔍 Scanning for edit buttons...");
    
    // Super specific force-override CSS
    if (!document.getElementById('force-edit-button-styles')) {
      const css = document.createElement('style');
      css.id = 'force-edit-button-styles';
      css.innerHTML = `
        /* Super-aggressive desktop styles */
        .edit-icon,
        [class*="edit"],
        button[onclick*="edit"],
        .play-card [class*="edit"] {
          opacity: 0 !important;
          visibility: visible !important;
          position: absolute !important;
          top: 10px !important;
          right: 10px !important;
          z-index: 100 !important;
          background: white !important;
          border-radius: 50% !important;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2) !important;
          transition: opacity 0.3s ease !important;
          pointer-events: auto !important;
        }
        
        /* Direct hover state */
        .play-card:hover .edit-icon,
        .play-card:hover [class*="edit"],
        .play-card:hover button[onclick*="edit"] {
          opacity: 1 !important;
          visibility: visible !important;
          display: block !important;
        }
        
        /* Mobile specific styles */
        @media (max-width: 768px) {
          .edit-icon,
          [class*="edit"],
          button[onclick*="edit"],
          .play-card [class*="edit"] {
            opacity: 0.6 !important;
          }
        }
      `;
      document.head.appendChild(css);
      console.log("💉 Injected force CSS");
    }
    
    // Find ALL possible edit buttons with a very broad selector
    const editButtons = document.querySelectorAll('.edit-icon, [class*="edit"], button[onclick*="editPlay"], .play-card button');
    
    if (editButtons.length > 0) {
      console.log(`✅ Found ${editButtons.length} potential edit buttons`);
      
      editButtons.forEach((button, index) => {
        // Skip if it's clearly not an edit button (based on role or visible text)
        if (button.innerText && 
            !button.innerText.toLowerCase().includes('edit') && 
            button.innerText.length > 10) {
          return;
        }
        
        // Find parent card
        const card = button.closest('.play-card');
        if (!card) return;
        
        // Check if this is likely an edit button
        const isLikelyEditButton = 
          button.classList.contains('edit-icon') || 
          (button.getAttribute('onclick') && button.getAttribute('onclick').includes('edit')) ||
          button.querySelector('i.fa-edit, i.fa-pen, svg[class*="edit"]');
        
        if (!isLikelyEditButton) return;
        
        // Tag it so we don't reprocess
        if (button.hasAttribute('data-edit-fixed')) return;
        button.setAttribute('data-edit-fixed', 'true');
        
        // Super aggressive direct styling
        button.style.cssText = `
          opacity: 0 !important;
          visibility: visible !important;
          position: absolute !important;
          top: 10px !important;
          right: 10px !important; 
          z-index: 100 !important;
          background: white !important;
          border-radius: 50% !important;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2) !important;
          transition: opacity 0.3s ease !important;
        `;
        
        console.log(`🔧 Fixed edit button ${index + 1}`);
        
        // Direct event handlers for the card
        if (!card.hasAttribute('data-hover-fixed')) {
          card.setAttribute('data-hover-fixed', 'true');
          
          // Desktop hover
          card.addEventListener('mouseenter', function() {
            button.style.opacity = '1';
          });
          
          card.addEventListener('mouseleave', function() {
            button.style.opacity = '0';
          });
          
          // Mobile touch
          const isMobile = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
          if (isMobile) {
            button.style.opacity = '0.6';
            
            // Tap card = full visibility for a moment
            card.addEventListener('touchstart', function(e) {
              // Skip if touching the button itself
              if (e.target === button || button.contains(e.target)) return;
              
              // Make fully visible briefly
              button.style.opacity = '1';
              
              // Then fade back
              setTimeout(() => {
                button.style.opacity = '0.6';
              }, 1500);
            });
          }
        }
      });
    } else {
      console.log("❌ No edit buttons found in this scan");
    }
  }
  
  // Catch display changes
  document.addEventListener('click', function(e) {
    // If clicking nav or something that changes displays
    if (e.target.closest('.nav-link') || e.target.closest('[onclick*="display"]')) {
      console.log("🔄 Navigation detected - will rescan for edit buttons");
      setTimeout(forceFixEditButtons, 300);
    }
  });
  
  // Stop checking after 30 seconds to avoid unnecessary processing
  setTimeout(() => {
    clearInterval(fixInterval);
    console.log("⏱️ Edit button fix interval stopped after 30 seconds");
  }, 30000);
})(); 