console.log("auth.js is loading");

// Initialize Supabase client with your correct project URL and anon key
const supabaseClient = supabase.createClient(
    'https://virgvvmipstwvnplagcf.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZpcmd2dm1pcHN0d3ZucGxhZ2NmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE5NzE4MDAsImV4cCI6MjA1NzU0NzgwMH0.neoOaD3gOloh6o0yYu-Yerqhg-2Tj_DTJan-fh45gQ0'
);

// Auth functions
async function signInWithGoogle() {
    try {
        const { data, error } = await supabaseClient.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.origin
            }
        });
        if (error) throw error;
    } catch (error) {
        console.error('Error signing in with Google:', error.message);
    }
}

async function signOut() {
    try {
        const { error } = await supabaseClient.auth.signOut();
        if (error) throw error;
        
        document.getElementById('signOutBtn').style.display = 'none';
        document.getElementById('userInfo').style.display = 'none';
        document.getElementById('signInBtn').style.display = 'block';
        
    } catch (error) {
        console.error('Error signing out:', error.message);
    }
}

function showLoggedInState(user) {
    document.getElementById('signInBtn').style.display = 'none';
    document.getElementById('signOutBtn').style.display = 'block';
    document.getElementById('userInfo').style.display = 'block';
    document.getElementById('userInfo').textContent = `Welcome, ${user.email}!`;
}

function showLoggedOutState() {
    document.getElementById('signInBtn').style.display = 'block';
    document.getElementById('signOutBtn').style.display = 'none';
    document.getElementById('userInfo').style.display = 'none';
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', async () => {
    console.log('Page loaded, checking auth state...');
    
    try {
        const { data: { session }, error } = await supabaseClient.auth.getSession();
        if (error) throw error;
        
        if (session) {
            console.log('User is already signed in:', session);
            showLoggedInState(session.user);
        } else {
            console.log('No active session');
            showLoggedOutState();
        }

        // Listen for auth state changes
        supabaseClient.auth.onAuthStateChange((event, session) => {
            if (session) {
                showLoggedInState(session.user);
            } else {
                showLoggedOutState();
            }
        });

    } catch (error) {
        console.error('Error during initialization:', error);
        showLoggedOutState();
    }
});

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

// Function to display plays
async function displayPlays(section = 'all') {
    console.log("displayPlays called with section:", section); // Debug log
    const playGrid = document.querySelector('.play-grid');
    const calendarContainer = document.querySelector('.calendar-container');
    
    // Handle dashboard separately
    if (section === 'dashboard') {
        console.log("Displaying dashboard"); // Debug log
        // Update active nav link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        document.getElementById('dashboardLink').classList.add('active');
        
        // Hide other containers
        if (calendarContainer) calendarContainer.style.display = 'none';
        if (playGrid) playGrid.style.display = 'grid'; // Changed to ensure grid is visible
        
        // Display dashboard
        await displayDashboard(); // Added await
        return;
    }

    // Clear existing content for non-dashboard sections
    if (playGrid) playGrid.innerHTML = '';
    if (calendarContainer) calendarContainer.style.display = 'none';

    // Update active nav link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // Set active nav and show/hide toggles
    if (section === 'hallOfShame') {
        document.getElementById('hallOfFamePlaysLink').classList.add('active');
    } else {
        document.getElementById(`${section}PlaysLink`).classList.add('active');
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

// Function to display dashboard
async function displayDashboard() {
    console.log("displayDashboard function called"); // Debug log
    const playGrid = document.querySelector('.play-grid');
    
    // Ensure playGrid exists
    if (!playGrid) {
        console.error("Play grid element not found");
        return;
    }

    console.log("Setting dashboard HTML"); // Debug log
    playGrid.innerHTML = `
        <div class="dashboard-container">
            <div class="stats-grid">
                <div class="stat-card" id="total-seen">
                    <div class="stat-icon">👁️</div>
                    <div class="stat-label">Total Plays Seen</div>
                    <div class="stat-number">...</div>
                </div>
                <div class="stat-card" id="upcoming">
                    <div class="stat-icon">📅</div>
                    <div class="stat-label">Upcoming Shows</div>
                    <div class="stat-number">...</div>
                </div>
                <div class="stat-card" id="this-year">
                    <div class="stat-icon">📊</div>
                    <div class="stat-label">This Year's Shows</div>
                    <div class="stat-number">...</div>
                </div>
                <div class="stat-card next-play-card" id="next-play">
                    <div class="stat-icon">🎭</div>
                    <div class="stat-label">Next Play</div>
                    <div class="next-play-info">Loading...</div>
                </div>
            </div>
        </div>
    `;

    // Add dashboard styles
    if (!document.getElementById('dashboard-styles')) {
        const styles = document.createElement('style');
        styles.id = 'dashboard-styles';
        styles.textContent = `
            .dashboard-container {
                max-width: 1400px;
                margin: 0 auto;
                padding: 2rem;
            }

            .stats-grid {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 2rem;
                margin: 2rem auto;
                padding: 0 2rem;
                max-width: 1600px;
            }

            .stat-card {
                background: white;
                border-radius: 16px;
                padding: 2rem;
                text-align: center;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
                transition: all 0.3s ease;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                aspect-ratio: 1;
                width: 100%;
                max-width: 300px;
                margin: 0 auto;
                position: relative;
                overflow: hidden;
            }

            .stat-card::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 4px;
                background: linear-gradient(90deg, #4285f4, #34a853);
                opacity: 0;
                transition: opacity 0.3s ease;
            }

            .stat-card:hover {
                transform: translateY(-5px);
                box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
            }

            .stat-card:hover::before {
                opacity: 1;
            }

            .stat-icon {
                font-size: 2.5rem;
                margin-bottom: 1rem;
            }

            .stat-number {
                font-size: 3.5rem;
                font-weight: bold;
                margin: 0.5rem 0;
                background: linear-gradient(45deg, #4285f4, #34a853);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                line-height: 1.2;
            }

            .stat-label {
                font-size: 1.2rem;
                color: #666;
                margin-bottom: 0.5rem;
                font-weight: 500;
            }

            .next-play-card {
                background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
            }

            .next-play-info {
                display: flex;
                flex-direction: column;
                gap: 0.5rem;
                align-items: center;
                width: 100%;
            }

            .next-play-name {
                font-size: 1.4rem;
                font-weight: 600;
                color: #333;
                line-height: 1.3;
            }

            .next-play-date {
                color: #4285f4;
                font-weight: 600;
                font-size: 1.1rem;
            }

            .next-play-theatre {
                color: #666;
                font-size: 1rem;
            }

            @media (max-width: 1200px) {
                .stats-grid {
                    grid-template-columns: repeat(2, 1fr);
                    gap: 2rem;
                    padding: 0 1rem;
                }
            }

            @media (max-width: 600px) {
                .stats-grid {
                    grid-template-columns: 1fr;
                    max-width: 300px;
                    margin: 2rem auto;
                }
            }
        `;
        document.head.appendChild(styles);
    }

    // Fetch and update stats
    try {
        console.log("Fetching dashboard stats"); // Debug log
        const stats = await fetchDashboardStats();
        console.log("Received stats:", stats); // Debug log

        document.querySelector('#total-seen .stat-number').textContent = stats.totalSeen;
        document.querySelector('#upcoming .stat-number').textContent = stats.upcoming;
        document.querySelector('#this-year .stat-number').textContent = stats.thisYear;
        
        const nextPlayElement = document.querySelector('#next-play .next-play-info');
        if (stats.nextPlay) {
            const date = new Date(stats.nextPlay.date).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });
            nextPlayElement.innerHTML = `
                <div class="next-play-name">${stats.nextPlay.name}</div>
                <div class="next-play-date">${date}</div>
                ${stats.nextPlay.theatre ? `<div class="next-play-theatre">at ${stats.nextPlay.theatre}</div>` : ''}
            `;
        } else {
            nextPlayElement.textContent = 'No upcoming plays';
        }
    } catch (error) {
        console.error('Error displaying dashboard:', error);
        document.querySelector('.dashboard-container').innerHTML = '<p>Error loading dashboard</p>';
    }
}

// Add some basic styling
const style = document.createElement('style');
style.textContent = `
    .play-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 2rem;
        padding: 2rem;
    }

    .play-card {
        border: 1px solid #ddd;
        border-radius: 8px;
        overflow: hidden;
        transition: transform 0.2s;
    }

    .play-card:hover {
        transform: translateY(-5px);
    }

    .play-card-content {
        padding: 1rem;
    }

    .play-card img {
        width: 100%;
        height: 200px;
        object-fit: cover;
    }

    .play-card h3 {
        margin: 0.5rem 0;
    }

    .play-card p {
        margin: 0.25rem 0;
        color: #666;
    }
`;
document.head.appendChild(style);

// Add hall of fame/shame styling
const hallStyle = document.createElement('style');
hallStyle.textContent = `
    .play-card.hall-of-fame {
        border: 2px solid #ffd700;
        box-shadow: 0 4px 12px rgba(255, 215, 0, 0.2);
    }

    .play-card.hall-of-shame {
        border: 2px solid #ff4444;
        box-shadow: 0 4px 12px rgba(255, 68, 68, 0.2);
    }

    .hall-of-fame-badge {
        background: linear-gradient(45deg, #ffd700, #ffa500);
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 4px;
        position: absolute;
        top: 1rem;
        right: 1rem;
        font-weight: bold;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .hall-of-shame-badge {
        background: linear-gradient(45deg, #ff4444, #cc0000);
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 4px;
        position: absolute;
        top: 1rem;
        right: 1rem;
        font-weight: bold;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .play-card.hall-of-fame .rating {
        color: #ffd700;
        font-weight: bold;
    }

    .play-card.hall-of-shame .rating {
        color: #ff4444;
        font-weight: bold;
    }

    .hall-toggle {
        margin-bottom: 1rem;
        padding: 0.5rem 1rem;
        background: #f1f3f4;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-weight: 500;
        transition: all 0.3s ease;
    }

    .hall-toggle.active {
        background: #ff4444;
        color: white;
    }

    .hall-toggle:not(.active) {
        background: #ffd700;
        color: black;
    }
`;
document.head.appendChild(hallStyle);

// Load all plays when the page loads
document.addEventListener('DOMContentLoaded', () => {
    displayPlays(false);
});