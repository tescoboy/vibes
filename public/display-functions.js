console.log("display-functions.js is loading");

// Function to display plays
async function displayPlays(section = 'all') {
    const playGrid = document.querySelector('.play-grid');
    const calendarContainer = document.querySelector('.calendar-container');
    const statsContainer = document.querySelector('.stats-container');
    
    // Clear/hide all containers
    if (playGrid) playGrid.innerHTML = '';
    if (calendarContainer) calendarContainer.style.display = 'none';
    if (statsContainer) statsContainer.remove();

    // Update active nav link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // Set active nav and show/hide toggles
    const navLink = document.getElementById(`${section}PlaysLink`);
    if (navLink) {
        if (section === 'hallOfShame') {
            document.getElementById('hallOfFamePlaysLink').classList.add('active');
        } else {
            navLink.classList.add('active');
        }
    }

    // Show/hide relevant toggles
    const calendarToggle = document.querySelector('.calendar-toggle');
    const hallToggle = document.querySelector('.hall-toggle');
    if (calendarToggle) {
        calendarToggle.style.display = (section === 'upcoming' || section === 'seen') ? 'block' : 'none';
    }
    if (hallToggle) {
        hallToggle.style.display = (section === 'hallOfFame' || section === 'hallOfShame') ? 'block' : 'none';
    }

    // Ensure play grid is visible
    if (playGrid) playGrid.style.display = 'grid';

    try {
        let plays;
        switch(section) {
            case 'upcoming':
                plays = await fetchUpcomingPlays();
                break;
            case 'seen':
                plays = await fetchSeenPlays();
                break;
            case 'hallOfFame':
                plays = await fetchHallOfFamePlays();
                break;
            case 'hallOfShame':
                plays = await fetchHallOfShamePlays();
                break;
            default:
                plays = await fetchPlays();
        }
        
        if (!plays || plays.length === 0) {
            if (playGrid) playGrid.innerHTML = `<p>No ${section.replace(/([A-Z])/g, ' $1').toLowerCase()} plays available</p>`;
            return;
        }

        if ((section === 'upcoming' || section === 'seen') && isCalendarView) {
            if (playGrid) playGrid.style.display = 'none';
            if (calendarContainer) {
                calendarContainer.style.display = 'block';
                renderCalendar(plays);
            }
        } else {
            if (playGrid) {
                playGrid.style.display = 'grid';
                plays.forEach(play => {
                    const playCard = (section === 'hallOfFame' || section === 'hallOfShame') ? 
                        createHallOfFameCard(play, section === 'hallOfShame') : 
                        createPlayCard(play);
                    playGrid.appendChild(playCard);
                });
            }
            if (calendarContainer) calendarContainer.style.display = 'none';
        }

    } catch (error) {
        console.error('Error displaying plays:', error);
        if (playGrid) playGrid.innerHTML = '<p>Error loading plays</p>';
    }
}

// Function to create a play card
function createPlayCard(play) {
    const playCard = document.createElement('div');
    playCard.className = 'play-card';
    
    playCard.innerHTML = `
        <div class="play-card-content">
            <img src="${play.image || 'https://placehold.co/400x300?text=No+Image'}" 
                 alt="${play.name}" 
                 loading="lazy">
            <h3>${play.name}</h3>
            <p>Theatre: ${play.theatre || 'TBA'}</p>
            <p>Rating: ${play.rating || 'Not Rated'}</p>
            <p>Date: ${play.date || 'TBA'}</p>
        </div>
    `;
    
    return playCard;
}

// Function to create a hall of fame play card
function createHallOfFameCard(play, isShame = false) {
    const playCard = document.createElement('div');
    playCard.className = `play-card ${isShame ? 'hall-of-shame' : 'hall-of-fame'}`;
    
    playCard.innerHTML = `
        <div class="play-card-content">
            <div class="${isShame ? 'hall-of-shame-badge' : 'hall-of-fame-badge'}">
                ${isShame ? '👎 Hall of Shame' : '⭐ Hall of Fame'}
            </div>
            <img src="${play.image || 'https://placehold.co/400x300?text=No+Image'}" 
                 alt="${play.name}" 
                 loading="lazy">
            <h3>${play.name}</h3>
            <p>Theatre: ${play.theatre || 'TBA'}</p>
            <p class="rating">Rating: ${play.rating || 'Not Rated'}</p>
            <p>Date: ${play.date || 'TBA'}</p>
        </div>
    `;
    
    return playCard;
}

// Function to toggle between Hall of Fame and Shame
function toggleHallView() {
    const isShameView = document.querySelector('.hall-toggle').classList.contains('active');
    document.querySelector('.hall-toggle').classList.toggle('active');
    displayPlays(isShameView ? 'hallOfFame' : 'hallOfShame');
} 