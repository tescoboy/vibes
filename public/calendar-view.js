console.log("calendar-view.js is loading");

// Calendar view styling
const calendarStyle = document.createElement('style');
calendarStyle.textContent = `
    .calendar-toggle {
        margin-bottom: 1rem;
        padding: 0.5rem 1rem;
        background: #f1f3f4;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-weight: 500;
    }

    .calendar-toggle.active {
        background: #4285f4;
        color: white;
    }

    .calendar-container {
        display: none;
        max-width: 1200px;
        margin: 0 auto;
        padding: 2rem;
    }

    .calendar-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
    }

    .calendar-nav {
        display: flex;
        gap: 1rem;
        align-items: center;
    }

    .calendar-nav button {
        padding: 0.5rem 1rem;
        border: none;
        border-radius: 4px;
        background: #f1f3f4;
        cursor: pointer;
    }

    .calendar-nav button:hover {
        background: #e8eaed;
    }

    .calendar-month {
        font-size: 1.5rem;
        font-weight: bold;
    }

    .calendar-grid {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        gap: 1rem;
    }

    .calendar-day {
        padding: 1rem;
        border: 1px solid #ddd;
        border-radius: 4px;
        min-height: 100px;
    }

    .calendar-day.other-month {
        background: #f9f9f9;
        color: #999;
    }

    .calendar-day-header {
        font-weight: bold;
        margin-bottom: 0.5rem;
    }

    .calendar-play {
        background: #e3f2fd;
        padding: 0.5rem;
        border-radius: 4px;
        margin-bottom: 0.5rem;
        font-size: 0.9rem;
    }
`;
document.head.appendChild(calendarStyle);

// Calendar view functions
let currentDate = new Date();
let isCalendarView = false;

function toggleCalendarView() {
    isCalendarView = !isCalendarView;
    const calendarContainer = document.querySelector('.calendar-container');
    const playGrid = document.querySelector('.play-grid');
    const toggleButton = document.querySelector('.calendar-toggle');

    if (isCalendarView) {
        calendarContainer.style.display = 'block';
        playGrid.style.display = 'none';
        toggleButton.classList.add('active');
        renderCalendar();
    } else {
        calendarContainer.style.display = 'none';
        playGrid.style.display = 'grid';
        toggleButton.classList.remove('active');
    }
}

function renderCalendar() {
    const calendarContainer = document.querySelector('.calendar-container');
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                       'July', 'August', 'September', 'October', 'November', 'December'];

    // Update calendar header
    calendarContainer.innerHTML = `
        <div class="calendar-header">
            <div class="calendar-nav">
                <button onclick="previousMonth()">&lt; Previous</button>
                <div class="calendar-month">${monthNames[month]} ${year}</div>
                <button onclick="nextMonth()">Next &gt;</button>
            </div>
        </div>
        <div class="calendar-grid">
            <div class="calendar-day-header">Sun</div>
            <div class="calendar-day-header">Mon</div>
            <div class="calendar-day-header">Tue</div>
            <div class="calendar-day-header">Wed</div>
            <div class="calendar-day-header">Thu</div>
            <div class="calendar-day-header">Fri</div>
            <div class="calendar-day-header">Sat</div>
        </div>
    `;

    const calendarGrid = calendarContainer.querySelector('.calendar-grid');
    
    // Add padding days from previous month
    const paddingDays = firstDay.getDay();
    for (let i = 0; i < paddingDays; i++) {
        const previousDate = new Date(year, month, -i);
        const dayDiv = document.createElement('div');
        dayDiv.className = 'calendar-day other-month';
        dayDiv.innerHTML = `<div class="calendar-day-header">${previousDate.getDate()}</div>`;
        calendarGrid.appendChild(dayDiv);
    }

    // Add days of current month
    for (let day = 1; day <= lastDay.getDate(); day++) {
        const dayDiv = document.createElement('div');
        dayDiv.className = 'calendar-day';
        dayDiv.innerHTML = `<div class="calendar-day-header">${day}</div>`;
        calendarGrid.appendChild(dayDiv);
    }

    // Add padding days from next month
    const remainingDays = 42 - (paddingDays + lastDay.getDate()); // 42 = 6 rows × 7 days
    for (let i = 1; i <= remainingDays; i++) {
        const dayDiv = document.createElement('div');
        dayDiv.className = 'calendar-day other-month';
        dayDiv.innerHTML = `<div class="calendar-day-header">${i}</div>`;
        calendarGrid.appendChild(dayDiv);
    }

    // Add plays to calendar
    displayPlaysInCalendar();
}

async function displayPlaysInCalendar() {
    const plays = await fetchUpcomingPlays();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    plays.forEach(play => {
        const playDate = new Date(play.date);
        if (playDate.getMonth() === month && playDate.getFullYear() === year) {
            const dayElement = document.querySelectorAll('.calendar-day:not(.other-month)')[playDate.getDate() - 1];
            if (dayElement) {
                const playDiv = document.createElement('div');
                playDiv.className = 'calendar-play';
                playDiv.textContent = play.name;
                dayElement.appendChild(playDiv);
            }
        }
    });
}

function previousMonth() {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
}

function nextMonth() {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
} 