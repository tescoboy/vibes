// Script to handle edit button hover behavior
document.addEventListener('DOMContentLoaded', function() {
  // Function to set up hover behavior for all edit buttons
  function setupEditButtonHover() {
    // Get all play cards
    const playCards = document.querySelectorAll('.play-card');
    
    // Add hover listeners to each card
    playCards.forEach(card => {
      const editButton = card.querySelector('.edit-button');
      if (!editButton) return;
      
      // Force initial state - hide button
      editButton.style.opacity = '0';
      
      // Show on mouse enter
      card.addEventListener('mouseenter', () => {
        editButton.style.opacity = '1';
      });
      
      // Hide on mouse leave
      card.addEventListener('mouseleave', () => {
        editButton.style.opacity = '0';
      });
    });
    
    // For touch devices, set a medium opacity
    if (window.matchMedia('(hover: none)').matches) {
      document.querySelectorAll('.edit-button').forEach(button => {
        button.style.opacity = '0.7';
      });
    }
  }
  
  // Run when page loads
  setupEditButtonHover();
  
  // Handle dynamically loaded cards - run after displaying plays
  // We need to hook into when plays are displayed
  const displayFunctions = document.querySelectorAll('[onclick*="displayPlays"]');
  displayFunctions.forEach(element => {
    const originalOnClick = element.onclick;
    element.onclick = function(e) {
      // Call the original onclick function
      if (originalOnClick) originalOnClick.call(this, e);
      
      // Wait for DOM to update then setup edit button hover
      setTimeout(setupEditButtonHover, 300);
    };
  });
}); 