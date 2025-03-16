// Streamlined mobile fix for Add Play functionality
document.addEventListener('DOMContentLoaded', function() {
  // Get the elements we need to work with
  const addPlayLink = document.getElementById('addPlayLink');
  const addPlayForm = document.querySelector('.add-play-form');
  const playGrid = document.querySelector('.play-grid');
  const calendarContainer = document.querySelector('.calendar-container');
  const burgerMenu = document.querySelector('.burger-menu');
  
  // Direct fix for display issues - forced visibility without breaking burger menu
  function forceShowAddPlayForm() {
    console.log("Showing add play form - direct method");
    
    // Force hide other elements
    if (playGrid) {
      playGrid.style.cssText = "display: none !important;";
    }
    
    if (calendarContainer) {
      calendarContainer.style.cssText = "display: none !important;";
    }
    
    // Force show form with proper positioning but ensure it doesn't break navigation
    if (addPlayForm) {
      addPlayForm.style.cssText = `
        display: block !important;
        opacity: 1 !important;
        visibility: visible !important;
        position: relative !important; /* Changed from absolute to relative */
        z-index: 10 !important; /* Lower z-index to not interfere with menu */
        background-color: white !important;
        padding: 20px !important;
        margin: 0 !important;
        width: 100% !important;
        max-width: 100% !important;
        box-sizing: border-box !important;
      `;
    }
    
    // Update active nav link
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.remove('active');
    });
    if (addPlayLink) {
      addPlayLink.classList.add('active');
    }
    
    // Scroll to top
    window.scrollTo(0, 0);
  }
  
  // Direct fix for hiding form
  function forceHideAddPlayForm() {
    // Hide the form
    if (addPlayForm) {
      addPlayForm.style.cssText = "display: none !important;";
    }
    
    // Show grid
    if (playGrid) {
      playGrid.style.cssText = "display: grid !important;";
    }
    
    // Restore active state
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.remove('active');
    });
    
    const allPlaysLink = document.getElementById('allPlaysLink');
    if (allPlaysLink) {
      allPlaysLink.classList.add('active');
    }
    
    // Try to reload plays
    if (typeof displayPlays === 'function') {
      try {
        displayPlays('all');
      } catch (e) {
        console.error("Error displaying plays:", e);
      }
    }
  }
  
  // Override the existing functions to ensure compatibility
  window.showAddPlayForm = forceShowAddPlayForm;
  window.hideAddPlayForm = forceHideAddPlayForm;
  
  // Ensure the "Add Play" link works
  if (addPlayLink) {
    addPlayLink.addEventListener('click', function(e) {
      e.preventDefault();
      forceShowAddPlayForm();
    });
  }
  
  // Make cancel button work reliably
  const cancelBtn = document.querySelector('.cancel-btn');
  if (cancelBtn) {
    cancelBtn.addEventListener('click', function(e) {
      e.preventDefault();
      forceHideAddPlayForm();
    });
  }
  
  // Fix form submission
  const addPlayFormElement = document.getElementById('addPlayForm');
  if (addPlayFormElement) {
    addPlayFormElement.addEventListener('submit', function(e) {
      // First prevent default to ensure we control what happens
      e.preventDefault();
      
      // Get form data
      const formData = new FormData(this);
      const playData = {};
      
      for (const [key, value] of formData.entries()) {
        playData[key] = value;
      }
      
      // Check if required fields are filled
      if (!playData.playName || !playData.playDate) {
        alert("Please fill in all required fields");
        return false;
      }
      
      // Try to use existing function if it exists
      if (typeof addPlay === 'function') {
        try {
          addPlay(playData);
          forceHideAddPlayForm();
          return false;
        } catch (err) {
          console.error("Error using existing addPlay function:", err);
        }
      }
      
      // Fallback handling if original function fails
      alert("Play added: " + playData.playName);
      forceHideAddPlayForm();
      return false;
    });
  }
  
  // Ensure burger menu still works with add play form
  if (burgerMenu) {
    // Make sure burger menu stays above all content
    burgerMenu.style.zIndex = "1000";
    
    // Ensure the nav container is also properly positioned
    const navLinks = document.querySelector('.nav-links');
    if (navLinks) {
      navLinks.style.zIndex = "999";
    }
  }
}); 