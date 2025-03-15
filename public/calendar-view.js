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
        renderUnifiedCalendar();
    } else {
        calendarContainer.style.display = 'none';
        playGrid.style.display = 'grid';
        toggleButton.classList.remove('active');
        // Re-fetch and render plays based on current section
        const currentSection = document.querySelector('.nav-link.active').id.replace('PlaysLink', '');
        displayPlays(currentSection);
    }
}

async function renderUnifiedCalendar() {
    const calendarContainer = document.querySelector('.calendar-container');
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // Fetch all plays
    const allPlays = await fetchPlays();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                       'July', 'August', 'September', 'October', 'November', 'December'];

    // Create calendar header
    calendarContainer.innerHTML = `
        <div class="calendar-header">
            <div class="calendar-nav">
                <button onclick="previousMonth()">← Past Shows</button>
                <div class="calendar-month">${monthNames[month]} ${year}</div>
                <button onclick="nextMonth()">Upcoming Shows →</button>
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
        dayDiv.innerHTML = `<div class="calendar-day-number">${previousDate.getDate()}</div>`;
        calendarGrid.appendChild(dayDiv);
    }

    // Add days of current month
    for (let day = 1; day <= lastDay.getDate(); day++) {
        const dayDiv = document.createElement('div');
        dayDiv.className = 'calendar-day';
        dayDiv.innerHTML = `<div class="calendar-day-number">${day}</div>`;

        // Add plays for this day
        const currentDate = new Date(year, month, day);
        const playsForDay = allPlays.filter(play => {
            const playDate = new Date(play.date);
            return playDate.getDate() === day && 
                   playDate.getMonth() === month && 
                   playDate.getFullYear() === year;
        });

        if (playsForDay.length > 0) {
            playsForDay.forEach(play => {
                const playDiv = document.createElement('div');
                const today = new Date();
                const isPast = currentDate < today;
                
                playDiv.className = `calendar-play ${isPast ? 'past-play' : 'upcoming-play'}`;
                playDiv.innerHTML = `
                    <div class="play-title">${play.name}</div>
                    <div class="play-theatre">${play.theatre || 'TBA'}</div>
                    ${play.rating ? `<div class="play-rating">Rating: ${play.rating}★</div>` : ''}
                `;
                dayDiv.appendChild(playDiv);
            });
            dayDiv.classList.add('has-plays');
        }

        // Highlight today
        const today = new Date();
        if (day === today.getDate() && 
            month === today.getMonth() && 
            year === today.getFullYear()) {
            dayDiv.classList.add('today');
        }

        calendarGrid.appendChild(dayDiv);
    }

    // Add padding days from next month
    const remainingDays = 42 - (paddingDays + lastDay.getDate());
    for (let i = 1; i <= remainingDays; i++) {
        const dayDiv = document.createElement('div');
        dayDiv.className = 'calendar-day other-month';
        dayDiv.innerHTML = `<div class="calendar-day-number">${i}</div>`;
        calendarGrid.appendChild(dayDiv);
    }

    // Add calendar styles if not already added
    if (!document.getElementById('calendar-styles')) {
        const styles = document.createElement('style');
        styles.id = 'calendar-styles';
        styles.textContent = `
            .calendar-container {
                max-width: 1200px;
                margin: 2rem auto;
                padding: 1rem;
            }

            .calendar-header {
                margin-bottom: 1rem;
            }

            .calendar-nav {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 1rem;
            }

            .calendar-month {
                font-size: 1.5rem;
                font-weight: bold;
            }

            .calendar-grid {
                display: grid;
                grid-template-columns: repeat(7, 1fr);
                gap: 0.5rem;
                border: 1px solid #eee;
                padding: 0.5rem;
            }

            .calendar-day-header {
                text-align: center;
                font-weight: bold;
                padding: 0.5rem;
            }

            .calendar-day {
                min-height: 100px;
                border: 1px solid #eee;
                padding: 0.5rem;
                position: relative;
            }

            .calendar-day.other-month {
                background-color: #f9f9f9;
                color: #999;
            }

            .calendar-day.has-plays {
                background-color: #f0f7ff;
            }

            .calendar-day.today {
                border: 2px solid #4285f4;
            }

            .calendar-day-number {
                position: absolute;
                top: 0.25rem;
                right: 0.25rem;
                font-size: 0.9rem;
                color: #666;
            }

            .calendar-play {
                margin-top: 1.5rem;
                padding: 0.25rem;
                border-radius: 4px;
                font-size: 0.8rem;
                cursor: pointer;
                transition: background-color 0.2s;
            }

            .calendar-play.past-play {
                background-color: #e8f5e9;
            }

            .calendar-play.upcoming-play {
                background-color: #e3f2fd;
            }

            .calendar-play:hover {
                filter: brightness(95%);
            }

            .play-title {
                font-weight: bold;
                margin-bottom: 0.25rem;
            }

            .play-theatre {
                color: #666;
                font-size: 0.75rem;
            }

            .play-rating {
                color: #f4b400;
                font-size: 0.75rem;
                margin-top: 0.25rem;
            }

            .calendar-toggle.active {
                background-color: #bbdefb;
            }
        `;
        document.head.appendChild(styles);
    }
}

function previousMonth() {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderUnifiedCalendar();
}

function nextMonth() {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderUnifiedCalendar();
} 