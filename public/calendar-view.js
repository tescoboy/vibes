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

// Calendar functionality
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

// Display calendar section
function displayCalendarSection() {
    console.log("Displaying calendar section");
    
    // Hide other sections
    const playGrid = document.querySelector('.play-grid');
    const addPlayForm = document.querySelector('.add-play-form');
    if (playGrid) playGrid.style.display = 'none';
    if (addPlayForm) addPlayForm.style.display = 'none';
    
    // Show calendar container
    const calendarContainer = document.querySelector('.calendar-container');
    if (calendarContainer) {
        calendarContainer.style.display = 'block';
        
        // Set active nav
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        document.getElementById('calendarLink').classList.add('active');
        
        // Fetch all plays and render calendar
        getAllPlays().then(plays => {
            renderCalendar(plays);
        });
    }
}

// Function to render the calendar
function renderCalendar(plays) {
    const calendarContainer = document.querySelector('.calendar-container');
    calendarContainer.innerHTML = '';
    
    // Check if we're on a small screen
    const isMobileView = window.innerWidth < 768;
    
    // Create calendar header with month navigation
    const calendarHeader = document.createElement('div');
    calendarHeader.className = 'calendar-header';
    
    // Previous month button
    const prevMonthBtn = document.createElement('button');
    prevMonthBtn.innerHTML = '&larr;';
    prevMonthBtn.className = 'month-nav prev-month';
    prevMonthBtn.addEventListener('click', () => {
        navigateMonth(-1);
    });
    
    // Month/year display
    const monthYearDisplay = document.createElement('h2');
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                       'July', 'August', 'September', 'October', 'November', 'December'];
    monthYearDisplay.textContent = `${monthNames[currentMonth]} ${currentYear}`;
    monthYearDisplay.className = 'month-display';
    
    // Next month button
    const nextMonthBtn = document.createElement('button');
    nextMonthBtn.innerHTML = '&rarr;';
    nextMonthBtn.className = 'month-nav next-month';
    nextMonthBtn.addEventListener('click', () => {
        navigateMonth(1);
    });
    
    // Append navigation elements
    calendarHeader.appendChild(prevMonthBtn);
    calendarHeader.appendChild(monthYearDisplay);
    calendarHeader.appendChild(nextMonthBtn);
    calendarContainer.appendChild(calendarHeader);
    
    // Filter plays for the current month
    const playsThisMonth = plays.filter(play => {
        const playDate = new Date(play.date);
        return playDate.getMonth() === currentMonth && 
               playDate.getFullYear() === currentYear;
    });
    
    // Sort plays by date
    playsThisMonth.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    // For mobile: Create compact list view
    if (isMobileView) {
        renderMobileCalendar(playsThisMonth, calendarContainer);
    }
    // For desktop: Create traditional grid view
    else {
        renderDesktopCalendar(playsThisMonth, calendarContainer);
    }
    
    // Add CSS for mobile optimization
    addCalendarStyles();
}

// New function to render mobile-friendly calendar
function renderMobileCalendar(plays, container) {
    // Create mobile optimized view
    const mobileView = document.createElement('div');
    mobileView.className = 'mobile-calendar';
    
    // Group plays by date
    const playsByDate = {};
    
    plays.forEach(play => {
        const playDate = new Date(play.date);
        const dateStr = playDate.toISOString().split('T')[0]; // YYYY-MM-DD
        
        if (!playsByDate[dateStr]) {
            playsByDate[dateStr] = [];
        }
        
        playsByDate[dateStr].push(play);
    });
    
    // Create calendar days in order
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    
    for (let day = 1; day <= daysInMonth; day++) {
        const dateObj = new Date(currentYear, currentMonth, day);
        const dateStr = dateObj.toISOString().split('T')[0];
        
        // Only show days that have plays
        if (!playsByDate[dateStr]) continue;
        
        const dayCard = document.createElement('div');
        dayCard.className = 'mobile-day-card';
        
        // Add today indicator
        const today = new Date();
        if (day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear()) {
            dayCard.classList.add('today');
        }
        
        // Add day header
        const dayHeader = document.createElement('div');
        dayHeader.className = 'mobile-day-header';
        
        // Format the date nicely
        const options = { weekday: 'short', month: 'short', day: 'numeric' };
        const formattedDate = dateObj.toLocaleDateString('en-US', options);
        
        dayHeader.innerHTML = `
            <div class="mobile-day-number">${formattedDate}</div>
        `;
        
        dayCard.appendChild(dayHeader);
        
        // Add plays for this day
        const playsForDay = playsByDate[dateStr];
        
        playsForDay.forEach(play => {
            const playEvent = document.createElement('div');
            playEvent.className = 'mobile-play-event';
            
            // Style based on whether it's in the past or future
            const now = new Date();
            const playDate = new Date(play.date);
            
            if (playDate < now) {
                playEvent.classList.add('past-play');
            } else {
                playEvent.classList.add('upcoming-play');
            }
            
            // Add rating indicators if available
            if (play.rating) {
                playEvent.classList.add('rated');
                if (play.rating === 'Standing Ovation') {
                    playEvent.classList.add('standing-ovation');
                }
            }
            
            // Play details
            playEvent.innerHTML = `
                <div class="mobile-play-title">
                    <i class="fas fa-theater-masks play-icon"></i> ${play.name}
                </div>
                <div class="mobile-play-details">
                    ${play.theatre ? `<span class="mobile-play-venue"><i class="fas fa-landmark theatre-icon"></i> ${play.theatre}</span>` : ''}
                    ${play.rating ? `<span class="mobile-play-rating">${getRatingIcon(play.rating)}</span>` : ''}
                </div>
            `;
            
            // Add click handler
            playEvent.addEventListener('click', () => {
                console.log('Play clicked:', play);
            });
            
            dayCard.appendChild(playEvent);
        });
        
        mobileView.appendChild(dayCard);
    }
    
    // If no plays this month
    if (Object.keys(playsByDate).length === 0) {
        const noPlays = document.createElement('div');
        noPlays.className = 'no-plays-message';
        noPlays.textContent = 'No plays scheduled this month';
        mobileView.appendChild(noPlays);
    }
    
    container.appendChild(mobileView);
}

// New function to render desktop calendar
function renderDesktopCalendar(plays, container) {
    // Create calendar grid
    const calendarGrid = document.createElement('div');
    calendarGrid.className = 'calendar-grid';
    
    // Add day headers
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    dayNames.forEach(day => {
        const dayHeader = document.createElement('div');
        dayHeader.className = 'day-header';
        dayHeader.textContent = day;
        calendarGrid.appendChild(dayHeader);
    });
    
    // Calculate first day of month and total days
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    
    // Create blank cells for days before first of month
    for (let i = 0; i < firstDay; i++) {
        const blankDay = document.createElement('div');
        blankDay.className = 'day empty';
        calendarGrid.appendChild(blankDay);
    }
    
    // Create day cells
    for (let day = 1; day <= daysInMonth; day++) {
        const dayCell = document.createElement('div');
        dayCell.className = 'day';
        
        // Check if today
        const today = new Date();
        if (day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear()) {
            dayCell.classList.add('today');
        }
        
        // Add day number
        const dayNumber = document.createElement('div');
        dayNumber.className = 'day-number';
        dayNumber.textContent = day;
        dayCell.appendChild(dayNumber);
        
        // Find plays for this day
        const playsContainer = document.createElement('div');
        playsContainer.className = 'day-plays';
        
        // Get plays for this date
        const currentDate = new Date(currentYear, currentMonth, day);
        const playsForDay = plays.filter(play => {
            const playDate = new Date(play.date);
            return playDate.getDate() === day && 
                   playDate.getMonth() === currentMonth && 
                   playDate.getFullYear() === currentYear;
        });
        
        // Add plays to the day cell
        playsForDay.forEach(play => {
            const playEvent = document.createElement('div');
            playEvent.className = 'play-event';
            
            // Style based on whether it's in the past or future
            const now = new Date();
            const playDate = new Date(play.date);
            
            if (playDate < now) {
                playEvent.classList.add('past-play');
            } else {
                playEvent.classList.add('upcoming-play');
            }
            
            // Add rating indicators if available
            if (play.rating) {
                playEvent.classList.add('rated');
                if (play.rating === 'Standing Ovation') {
                    playEvent.classList.add('standing-ovation');
                }
            }
            
            // Play title and venue with icons
            playEvent.innerHTML = `
                <div class="play-event-title">
                    <i class="fas fa-theater-masks play-icon"></i> ${play.name}
                </div>
                ${play.theatre ? `
                <div class="play-event-venue">
                    <i class="fas fa-landmark theatre-icon"></i> ${play.theatre}
                </div>` : ''}
                ${play.rating ? `
                <div class="play-event-rating">
                    ${getRatingIcon(play.rating)}
                </div>` : ''}
            `;
            
            // Add click handler to view details
            playEvent.addEventListener('click', () => {
                console.log('Play clicked:', play);
            });
            
            playsContainer.appendChild(playEvent);
        });
        
        dayCell.appendChild(playsContainer);
        calendarGrid.appendChild(dayCell);
    }
    
    container.appendChild(calendarGrid);
}

// Navigate to previous/next month
function navigateMonth(direction) {
    currentMonth += direction;
    
    // Handle year change
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    } else if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    
    // Re-render the calendar
    getAllPlays().then(plays => {
        renderCalendar(plays);
    });
}

// Add styles for the calendar
function addCalendarStyles() {
    if (document.getElementById('calendar-styles')) return;
    
    const styles = document.createElement('style');
    styles.id = 'calendar-styles';
    styles.textContent = `
        .calendar-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        
        .calendar-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
        }
        
        .month-nav {
            background: #f5f5f5;
            border: none;
            padding: 10px 15px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
        }
        
        .month-display {
            margin: 0;
            font-size: 1.5rem;
        }
        
        .calendar-grid {
            display: grid;
            grid-template-columns: repeat(7, 1fr);
            gap: 10px;
        }
        
        .day-header {
            text-align: center;
            font-weight: bold;
            padding: 10px;
            background: #f5f5f5;
        }
        
        .day {
            border: 1px solid #e0e0e0;
            min-height: 100px;
            padding: 5px;
            position: relative;
        }
        
        .day.empty {
            background: #f9f9f9;
        }
        
        .day.today {
            background: #f0f8ff;
            border-color: #1a73e8;
        }
        
        .day-number {
            position: absolute;
            top: 5px;
            left: 5px;
            font-weight: bold;
        }
        
        .day-plays {
            margin-top: 25px;
        }
        
        .play-event {
            background: #f1f1f1;
            padding: 5px;
            margin-bottom: 5px;
            border-radius: 3px;
            font-size: 0.85rem;
            cursor: pointer;
        }
        
        .play-event.past-play {
            background: #f0f0f0;
            color: #777;
        }
        
        .play-event.upcoming-play {
            background: #e6f7ff;
            color: #0066cc;
        }
        
        .play-event.standing-ovation {
            background-color: #fff8e1;
            border-left: 3px solid #ffc107;
        }
        
        /* Icon styling */
        .play-icon {
            color: #6c757d;
            margin-right: 3px;
        }
        
        .theatre-icon {
            color: #6c757d;
            margin-right: 3px;
            font-size: 0.8em;
        }
        
        .rating-icon {
            color: #6c757d;
            margin-right: 3px;
        }
        
        .standing-ovation-icon {
            color: #ffc107;
            margin-right: 3px;
        }
        
        .play-event-title {
            font-weight: bold;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            display: flex;
            align-items: center;
        }
        
        .play-event-venue {
            font-size: 0.8rem;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            display: flex;
            align-items: center;
            margin-top: 2px;
        }
        
        .play-event-rating {
            font-size: 0.75rem;
            margin-top: 2px;
            display: flex;
            align-items: center;
        }
        
        /* Mobile styles */
        @media (max-width: 768px) {
            .calendar-grid {
                gap: 5px;
            }
            
            .day {
                min-height: 80px;
                padding: 3px;
            }
            
            .play-event {
                padding: 3px;
                font-size: 0.75rem;
            }
            
            .day-header {
                padding: 5px;
                font-size: 0.85rem;
            }
        }
        
        /* Mobile calendar specific styles */
        .mobile-calendar {
            display: flex;
            flex-direction: column;
            gap: 15px;
            padding: 10px 0;
        }
        
        .mobile-day-card {
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .mobile-day-card.today {
            border-color: #1a73e8;
            box-shadow: 0 0 0 1px #1a73e8;
        }
        
        .mobile-day-header {
            background: #f5f5f5;
            padding: 10px;
            font-weight: bold;
            border-bottom: 1px solid #e0e0e0;
        }
        
        .mobile-day-card.today .mobile-day-header {
            background: #e8f0fe;
            color: #1a73e8;
        }
        
        .mobile-play-event {
            padding: 12px;
            border-bottom: 1px solid #eee;
            position: relative;
        }
        
        .mobile-play-event:last-child {
            border-bottom: none;
        }
        
        .mobile-play-event.past-play {
            background: #f9f9f9;
            color: #777;
        }
        
        .mobile-play-event.upcoming-play {
            background: #fff;
            color: #333;
        }
        
        .mobile-play-event.standing-ovation {
            border-left: 3px solid #ffc107;
        }
        
        .mobile-play-title {
            font-weight: bold;
            font-size: 1rem;
            margin-bottom: 5px;
            display: flex;
            align-items: center;
        }
        
        .mobile-play-details {
            display: flex;
            justify-content: space-between;
            font-size: 0.85rem;
            flex-wrap: wrap;
            gap: 8px;
        }
        
        .mobile-play-venue, 
        .mobile-play-rating {
            display: flex;
            align-items: center;
        }
        
        .no-plays-message {
            text-align: center;
            padding: 20px;
            color: #666;
            font-style: italic;
        }
        
        /* Responsive adjustments */
        @media (max-width: 768px) {
            .calendar-header {
                padding: 0 10px;
            }
            
            .month-display {
                font-size: 1.2rem;
            }
            
            .month-nav {
                padding: 8px 12px;
            }
        }
    `;
    
    document.head.appendChild(styles);
}

// Helper function to get all plays (both past and upcoming)
function getAllPlays() {
    return new Promise((resolve, reject) => {
        // If your database.js already has this function, use it
        if (typeof fetchAllPlays === 'function') {
            fetchAllPlays().then(resolve).catch(reject);
        } 
        // Otherwise combine upcoming and seen plays
        else if (typeof fetchUpcomingPlays === 'function' && typeof fetchSeenPlays === 'function') {
            Promise.all([fetchUpcomingPlays(), fetchSeenPlays()])
                .then(([upcoming, seen]) => {
                    resolve([...upcoming, ...seen]);
                })
                .catch(reject);
        }
        // Fallback to just upcoming plays if that's all we have
        else if (typeof fetchUpcomingPlays === 'function') {
            fetchUpcomingPlays().then(resolve).catch(reject);
        }
        else {
            reject(new Error('No method available to fetch plays'));
        }
    });
}

// Helper function to get the appropriate rating icon
function getRatingIcon(rating) {
    if (rating === 'Standing Ovation') {
        return '<i class="fas fa-person-booth standing-ovation-icon"></i> Standing Ovation';
    } else if (rating && rating.includes('.5')) {
        // Handle half-moon ratings
        const numMoons = parseInt(rating);
        return `<i class="fas fa-moon rating-icon"></i> ${numMoons}.5`;
    } else if (!isNaN(rating)) {
        // Handle full moon ratings
        return `<i class="fas fa-moon rating-icon"></i> ${rating}`;
    }
    return '<i class="fas fa-question-circle rating-icon"></i> Not Rated';
} 