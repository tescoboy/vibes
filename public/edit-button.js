function addEditButtonsToCards() {
    // Find all play cards
    const cards = document.querySelectorAll('.play-card');
    
    // Add edit button to each card
    cards.forEach(card => {
        const editButton = document.createElement('button');
        editButton.innerHTML = '✏️';
        editButton.style.cssText = `
            position: absolute;
            top: 8px;
            right: 8px;
            background: rgba(255,255,255,0.8);
            border: none;
            border-radius: 50%;
            width: 24px;
            height: 24px;
            cursor: pointer;
            z-index: 1000;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
        `;
        
        // Make sure card can position absolute children
        if (window.getComputedStyle(card).position === 'static') {
            card.style.position = 'relative';
        }
        
        card.appendChild(editButton);
        
        // Log to verify buttons are being added
        console.log('Edit button added to card:', card);
    });
}

// Run when DOM is loaded
document.addEventListener('DOMContentLoaded', addEditButtonsToCards);

// Run when plays are displayed
document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit for plays to load
    setTimeout(addEditButtonsToCards, 1000);
});

// Also run when new plays might be loaded
const observer = new MutationObserver(() => {
    addEditButtonsToCards();
});

// Start observing the play grid for changes
document.addEventListener('DOMContentLoaded', () => {
    const playGrid = document.querySelector('.play-grid');
    if (playGrid) {
        observer.observe(playGrid, { childList: true, subtree: true });
    }
}); 