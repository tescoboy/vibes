// Edit Button Inspector & Fixer
(function() {
  console.log("🔎 Edit Button Inspector starting...");
  
  // Run immediately and after a delay
  analyzeDOM();
  setTimeout(analyzeDOM, 1500); // Allow for dynamic content to load
  
  function analyzeDOM() {
    console.log("📊 Analyzing DOM structure...");
    
    // Find all play cards
    const playCards = document.querySelectorAll('.play-card');
    console.log(`Found ${playCards.length} play cards`);
    
    if (playCards.length === 0) {
      console.log("❌ No play cards found, waiting for content to load...");
      return;
    }
    
    // Examine a sample card in detail
    const sampleCard = playCards[0];
    console.log("Sample card structure:", sampleCard.outerHTML);
    
    // Find all potential edit buttons across the page
    const potentialEditButtons = document.querySelectorAll(
      'button[class*="edit"], .edit-icon, button[onclick*="edit"], [class*="edit-icon"], .fa-edit, .fa-pen, .fa-pencil'
    );
    
    console.log(`Found ${potentialEditButtons.length} potential edit buttons`);
    
    if (potentialEditButtons.length > 0) {
      console.log("Sample edit button:", potentialEditButtons[0].outerHTML);
      console.log("Edit button parent:", potentialEditButtons[0].parentElement.outerHTML);
    }
    
    // Apply the fix based on our findings
    applyFixBasedOnFindings();
  }
  
  function applyFixBasedOnFindings() {
    console.log("🔧 Applying targeted fix based on findings");
    
    // 1. Fix via direct DOM manipulation when cards are created
    monitorCardCreation();
    
    // 2. Add a style element that covers all possible edit button scenarios
    const style = document.createElement('style');
    style.textContent = `
      /* Target ALL possible edit button implementations */
      .edit-icon, 
      button.edit-icon,
      [class*="edit-icon"],
      button[onclick*="edit"],
      [class*="edit"],
      .fa-edit,
      .fa-pen,
      .fa-pencil,
      button i.fa-edit,
      button i.fa-pen,
      button i.fa-pencil {
        opacity: 0 !important;
        transition: opacity 0.3s ease !important;
      }
      
      /* Show on hover for desktop */
      .play-card:hover .edit-icon,
      .play-card:hover button.edit-icon,
      .play-card:hover [class*="edit-icon"],
      .play-card:hover button[onclick*="edit"],
      .play-card:hover [class*="edit"],
      .play-card:hover .fa-edit,
      .play-card:hover .fa-pen,
      .play-card:hover .fa-pencil {
        opacity: 1 !important;
      }
      
      /* Mobile devices */
      @media (max-width: 768px) {
        .edit-icon, 
        button.edit-icon,
        [class*="edit-icon"],
        button[onclick*="edit"],
        [class*="edit"],
        .fa-edit,
        .fa-pen,
        .fa-pencil {
          opacity: 0.5 !important;
        }
      }
    `;
    document.head.appendChild(style);
    
    // 3. Check for dynamically generated content
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.type === 'childList' && mutation.addedNodes.length) {
          const addedCards = Array.from(mutation.addedNodes)
            .filter(node => node.nodeType === 1)
            .filter(node => node.classList?.contains('play-card') || node.querySelector?.('.play-card'));
          
          if (addedCards.length) {
            console.log("👀 New cards detected, applying fix");
            fixEditButtonsOnCards();
          }
        }
      });
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    
    // Apply fixes to any existing buttons
    fixEditButtonsOnCards();
  }
  
  function fixEditButtonsOnCards() {
    // Get all cards
    const cards = document.querySelectorAll('.play-card');
    
    cards.forEach(card => {
      // Try multiple selectors to find edit buttons
      const editButton = card.querySelector(
        '.edit-icon, button.edit-icon, [class*="edit-icon"], button[onclick*="edit"], [class*="edit"], .fa-edit, .fa-pen, .fa-pencil'
      );
      
      if (editButton && !editButton.hasAttribute('data-inspector-fixed')) {
        console.log("🔧 Fixed edit button on card:", card);
        editButton.setAttribute('data-inspector-fixed', 'true');
        
        // Set initial state
        editButton.style.opacity = '0';
        
        // Add hover event specifically to this card
        card.addEventListener('mouseenter', () => {
          editButton.style.opacity = '1';
        });
        
        card.addEventListener('mouseleave', () => {
          editButton.style.opacity = '0';
        });
        
        // For mobile
        if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
          editButton.style.opacity = '0.5';
        }
      }
    });
  }
  
  function monitorCardCreation() {
    // Look for the function that creates play cards
    console.log("🔍 Looking for card creation function...");
    
    // If we can find the database.js or display-functions.js content
    if (typeof displayPlays === 'function') {
      console.log("✅ Found displayPlays function, attempting to monitor");
      
      // Monitor calls to the display function
      const originalDisplayPlays = displayPlays;
      window.displayPlays = function(...args) {
        const result = originalDisplayPlays.apply(this, args);
        console.log("🔄 displayPlays was called, fixing buttons after delay");
        setTimeout(fixEditButtonsOnCards, 200);
        return result;
      };
    }
    
    // Other potential functions to monitor
    ['addPlay', 'renderPlays', 'createPlayCard'].forEach(funcName => {
      if (typeof window[funcName] === 'function') {
        console.log(`✅ Found ${funcName} function, attempting to monitor`);
        const original = window[funcName];
        window[funcName] = function(...args) {
          const result = original.apply(this, args);
          console.log(`🔄 ${funcName} was called, fixing buttons after delay`);
          setTimeout(fixEditButtonsOnCards, 200);
          return result;
        };
      }
    });
  }
})(); 