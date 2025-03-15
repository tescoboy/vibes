console.log("toggles.js is loading");

// Toggle state variables
let isHallOfFame = true;
let calendarView = false;

// Toggle functions
function toggleHallOfFame() {
    isHallOfFame = !isHallOfFame;
    const link = document.getElementById('hallOfFamePlaysLink');
    if (link) {
        link.textContent = isHallOfFame ? 'Hall of Fame' : 'Hall of Shame';
    }
    displayPlays(isHallOfFame ? 'hallOfFame' : 'hallOfShame');
}

function toggleCalendarView() {
    calendarView = !calendarView;
    const button = document.querySelector('.calendar-toggle');
    if (button) {
        button.textContent = calendarView ? '📅 Grid View' : '📅 Calendar View';
    }
    displayPlays('upcoming');
}

// Calendar toggle button styles
const calendarStyles = document.createElement('style');
calendarStyles.textContent = `
    .calendar-toggle {
        background: #1a73e8;
        color: white;
        border: none;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        cursor: pointer;
        font-size: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        position: fixed;
        bottom: 20px;
        right: 20px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        transition: transform 0.2s;
    }

    .calendar-toggle:hover {
        transform: scale(1.1);
    }
`;
document.head.appendChild(calendarStyles);

// Export variables and functions
window.isHallOfFame = isHallOfFame;
window.calendarView = calendarView;
window.toggleHallOfFame = toggleHallOfFame;
window.toggleCalendarView = toggleCalendarView; 