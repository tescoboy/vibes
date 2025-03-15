let currentDate = new Date();

// Add event listener when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const calendarLink = document.getElementById('calendarLink');
    if (calendarLink) {
        calendarLink.addEventListener('click', function(e) {
            e.preventDefault();
            showCalendarView();
        });
    }
});

// Make the function globally available
window.showCalendarView = function() {
    // Update navigation active state
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.remove('active');
    });
    document.getElementById('calendarLink').classList.add('active');

    // Clear main content and show calendar
    const mainContent = document.querySelector('.main-content');
    mainContent.innerHTML = `
        <div class="calendar-view">
            <div class="calendar-header">
                <button class="calendar-nav-btn" onclick="prevMonth()">
                    <span class="material-icons">chevron_left</span>
                </button>
                <h2 id="currentMonth"></h2>
                <button class="calendar-nav-btn" onclick="nextMonth()">
                    <span class="material-icons">chevron_right</span>
                </button>
            </div>
            <div id="calendar" class="calendar-grid"></div>
        </div>
    `;

    renderCalendar();
}

async function renderCalendar() {
    const monthDisplay = document.getElementById('currentMonth');
    const calendar = document.getElementById('calendar');
    
    // Set month display
    monthDisplay.textContent = currentDate.toLocaleString('default', { 
        month: 'long', 
        year: 'numeric' 
    });

    // Get plays for current month
    const { data: plays } = await supabaseClient
        .from('plays')
        .select('*')
        .gte('date', new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toISOString())
        .lte('date', new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).toISOString());

    // Create calendar grid
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    
    let calendarHTML = `
        <div class="weekdays">
            <div>Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
        </div>
        <div class="days">
    `;

    // Add padding for start of month
    for (let i = 0; i < firstDay.getDay(); i++) {
        calendarHTML += `<div class="day empty"></div>`;
    }

    // Add days
    for (let day = 1; day <= lastDay.getDate(); day++) {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        const isToday = isSameDay(date, new Date());
        
        // Find plays for this day
        const todaysPlays = plays?.filter(play => isSameDay(new Date(play.date), date)) || [];
        
        calendarHTML += `
            <div class="day ${isToday ? 'today' : ''} ${todaysPlays.length ? 'has-plays' : ''}">
                <span class="day-number">${day}</span>
                ${todaysPlays.map(play => `
                    <div class="play-event" onclick="showPlayDetails(${play.id})">
                        ${play.name}
                    </div>
                `).join('')}
            </div>
        `;
    }

    calendarHTML += '</div>';
    calendar.innerHTML = calendarHTML;
}

function prevMonth() {
    currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    renderCalendar();
}

function nextMonth() {
    currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
    renderCalendar();
}

function isSameDay(date1, date2) {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
}

function showPlayDetails(playId) {
    // Implement play details view
    console.log('Show play details for:', playId);
}

// Add this script to your index.html 