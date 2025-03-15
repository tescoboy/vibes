// Simple view state
const VIEW = {
    GRID: 'grid',
    CALENDAR: 'calendar'
};

function toggleView(view) {
    // Update buttons
    document.querySelectorAll('.view-toggle').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.view === view);
    });

    // Update view
    const playGrid = document.querySelector('.play-grid');
    const calendarContainer = document.querySelector('.calendar-container');

    if (view === VIEW.GRID) {
        playGrid.style.display = 'grid';
        calendarContainer.style.display = 'none';
    } else {
        playGrid.style.display = 'none';
        calendarContainer.style.display = 'block';
        if (!calendarContainer.children.length) {
            renderUnifiedCalendar();
        }
    }

    // Save preference
    localStorage.setItem('viewMode', view);
}

// Initialize view on page load
document.addEventListener('DOMContentLoaded', () => {
    const savedView = localStorage.getItem('viewMode') || VIEW.GRID;
    toggleView(savedView);
});

// Call this after any content updates
function onContentUpdate() {
    const savedView = localStorage.getItem('viewMode') || VIEW.GRID;
    toggleView(savedView);
} 