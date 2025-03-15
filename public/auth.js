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
            <p>Date: ${new Date(play.date).toLocaleDateString('en-GB') || 'TBA'}</p>
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
            <p>Date: ${new Date(play.date).toLocaleDateString('en-GB') || 'TBA'}</p>
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
    console.log("displayPlays called with section:", section);
    const playGrid = document.querySelector('.play-grid');
    const calendarContainer = document.querySelector('.calendar-container');
    
    if (section === 'dashboard') {
        if (calendarContainer) calendarContainer.style.display = 'none';
        if (playGrid) playGrid.style.display = 'block';
        await displayDashboard();
        return;
    }

    const now = new Date();

    try {
        const plays = await fetchPlays();
        if (!plays) return;

        document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
        document.getElementById(`${section}PlaysLink`)?.classList.add('active');

        let filteredPlays = plays;
        if (section === 'upcoming') {
            filteredPlays = plays
                .filter(play => new Date(play.date) >= now)
                .sort((a, b) => new Date(a.date) - new Date(b.date)); // Chronological for upcoming
        } else if (section === 'seen') {
            filteredPlays = plays
                .filter(play => new Date(play.date) < now)
                .sort((a, b) => new Date(b.date) - new Date(a.date)); // Most recent first
        } else if (section === 'hallOfFame') {
            filteredPlays = plays
                .filter(play => play.rating >= 4.5)
                .sort((a, b) => new Date(b.date) - new Date(a.date)); // Most recent first
        } else {
            // 'all' section - most recent first
            filteredPlays = plays.sort((a, b) => new Date(b.date) - new Date(a.date));
        }

        if (calendarContainer) calendarContainer.style.display = 'none';
        playGrid.innerHTML = '';
        playGrid.style.display = 'grid';

        filteredPlays.forEach(play => {
            const playDate = new Date(play.date);
            const isUpcoming = playDate >= now;
            
            const card = document.createElement('div');
            card.className = `play-card ${isUpcoming ? 'upcoming' : ''}`;
            card.innerHTML = `
                ${play.image ? `<img src="${play.image}" alt="${play.name}" class="play-image">` : ''}
                <div class="play-info">
                    <h3>${play.name}</h3>
                    <p class="date">${playDate.toLocaleDateString('en-GB')}</p>
                    ${play.theatre ? `<p class="theatre">${play.theatre}</p>` : ''}
                    ${play.rating ? `<p class="rating">Rating: ${play.rating}</p>` : ''}
                </div>
            `;
            playGrid.appendChild(card);
        });

    } catch (error) {
        console.error('Error displaying plays:', error);
    }
}

// Function to display dashboard
async function displayDashboard() {
    const playGrid = document.querySelector('.play-grid');
    if (!playGrid) return;

    playGrid.innerHTML = `
        <div class="dashboard-container">
            <div class="stats-grid">
                <div class="stat-card total-plays">
                    <h3>Total Plays Seen</h3>
                    <p class="stat-number">Loading...</p>
                </div>
                <div class="stat-card upcoming-plays">
                    <h3>Upcoming Plays</h3>
                    <p class="stat-number">Loading...</p>
                </div>
                <div class="stat-card this-year">
                    <h3>Plays This Year</h3>
                    <p class="stat-number">Loading...</p>
                </div>
                <div class="stat-card next-play">
                    <h3>Next Play</h3>
                    <p class="stat-text">Loading...</p>
                </div>
            </div>
        </div>
    `;

    try {
        const plays = await fetchPlays();
        if (!plays) return;

        const now = new Date();
        const startOfYear = new Date(now.getFullYear(), 0, 1);

        const stats = {
            totalSeen: plays.filter(play => new Date(play.date) < now).length,
            upcoming: plays.filter(play => new Date(play.date) >= now).length,
            thisYear: plays.filter(play => new Date(play.date) >= startOfYear && new Date(play.date) <= now).length,
            nextPlay: plays.find(play => new Date(play.date) >= now)
        };

        document.querySelector('.total-plays .stat-number').textContent = stats.totalSeen;
        document.querySelector('.upcoming-plays .stat-number').textContent = stats.upcoming;
        document.querySelector('.this-year .stat-number').textContent = stats.thisYear;
        document.querySelector('.next-play .stat-text').textContent = 
            stats.nextPlay ? `${stats.nextPlay.name} (${new Date(stats.nextPlay.date).toLocaleDateString('en-GB')})` : 'No upcoming plays';

    } catch (error) {
        console.error('Error displaying dashboard:', error);
    }
}

// Add dashboard styles
const dashboardStyles = document.createElement('style');
dashboardStyles.textContent = `
    .dashboard-container {
        max-width: 1400px;
        margin: 0 auto;
        padding: 1rem;
    }

    .stats-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 1.5rem;
        margin: 1rem 0;
    }

    .stat-card {
        background: white;
        border-radius: 8px;
        padding: 1.5rem;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        text-align: center;
        aspect-ratio: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        transition: transform 0.2s;
    }

    .stat-card:hover {
        transform: translateY(-5px);
    }

    .stat-card h3 {
        margin: 0 0 1rem 0;
        color: #333;
        font-size: 1.1rem;
    }

    .stat-number {
        font-size: 2.5rem;
        font-weight: bold;
        margin: 0;
        color: #1a73e8;
    }

    .stat-text {
        font-size: 1.2rem;
        margin: 0;
        color: #1a73e8;
    }

    @media (max-width: 1200px) {
        .stats-grid {
            grid-template-columns: repeat(2, 1fr);
        }
    }

    @media (max-width: 600px) {
        .stats-grid {
            grid-template-columns: 1fr;
        }
        
        .stat-card {
            aspect-ratio: auto;
            padding: 1rem;
        }
    }
`;
document.head.appendChild(dashboardStyles);

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

// Add form styles after existing styles
const formStyles = document.createElement('style');
formStyles.textContent = `
    .add-play-form {
        max-width: 600px;
        margin: 2rem auto;
        padding: 2rem;
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .add-play-form h2 {
        margin-bottom: 2rem;
        color: #333;
        text-align: center;
    }

    .form-group {
        margin-bottom: 1.5rem;
    }

    .form-group label {
        display: block;
        margin-bottom: 0.5rem;
        color: #555;
        font-weight: 500;
    }

    .form-group input[type="text"],
    .form-group input[type="date"],
    .form-group input[type="url"] {
        width: 100%;
        padding: 0.75rem;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 1rem;
    }

    .rating-container {
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    .star-rating {
        display: inline-flex;
        flex-direction: row-reverse;
        gap: 0.25rem;
    }

    .star-rating input {
        display: none;
    }

    .star-rating label {
        cursor: pointer;
        font-size: 1.5rem;
        color: #ddd;
        transition: color 0.2s;
    }

    .star-rating label:hover,
    .star-rating label:hover ~ label,
    .star-rating input:checked ~ label {
        color: #ffd700;
    }

    .standing-ovation-btn {
        padding: 0.5rem 1rem;
        background: #f8f9fa;
        border: 1px solid #ddd;
        border-radius: 4px;
        cursor: pointer;
        transition: all 0.2s;
    }

    .standing-ovation-btn.active {
        background: #ffd700;
        border-color: #ffd700;
    }

    .image-preview {
        margin-top: 1rem;
        max-width: 100%;
        height: 200px;
        border: 1px dashed #ddd;
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #666;
        background-size: cover;
        background-position: center;
    }

    .form-actions {
        display: flex;
        gap: 1rem;
        margin-top: 2rem;
    }

    .submit-btn,
    .cancel-btn {
        flex: 1;
        padding: 0.75rem;
        border: none;
        border-radius: 4px;
        font-size: 1rem;
        cursor: pointer;
        transition: all 0.2s;
    }

    .submit-btn {
        background: #1a73e8;
        color: white;
    }

    .submit-btn:hover {
        background: #1557b0;
    }

    .cancel-btn {
        background: #f1f3f4;
        color: #333;
    }

    .cancel-btn:hover {
        background: #ddd;
    }

    @media (max-width: 600px) {
        .add-play-form {
            margin: 1rem;
            padding: 1rem;
        }

        .rating-container {
            flex-direction: column;
            align-items: flex-start;
        }

        .form-actions {
            flex-direction: column;
        }
    }
`;
document.head.appendChild(formStyles);

// Add form handling functions
function showAddPlayForm() {
    document.querySelector('.play-grid').style.display = 'none';
    document.querySelector('.calendar-container').style.display = 'none';
    document.querySelector('.add-play-form').style.display = 'block';
    setupFormHandlers();
}

function hideAddPlayForm() {
    document.querySelector('.add-play-form').style.display = 'none';
    document.querySelector('.play-grid').style.display = 'grid';
    displayPlays('all');
}

function setupFormHandlers() {
    const form = document.getElementById('addPlayForm');
    const imageInput = document.getElementById('playImage');
    const imagePreview = document.querySelector('.image-preview');
    const standingOvationBtn = document.getElementById('standingOvation');

    // Image URL validation and preview
    imageInput.addEventListener('input', () => {
        const url = imageInput.value;
        if (url && isValidUrl(url)) {
            imagePreview.style.backgroundImage = `url(${url})`;
            imagePreview.textContent = '';
        } else {
            imagePreview.style.backgroundImage = 'none';
            imagePreview.textContent = 'Image preview will appear here';
        }
    });

    // Standing ovation toggle
    standingOvationBtn.addEventListener('click', () => {
        const isActive = standingOvationBtn.classList.toggle('active');
        document.querySelectorAll('.star-rating input').forEach(input => {
            input.checked = false;
            input.disabled = isActive;
        });
    });

    // Form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Disable submit button to prevent double submission
        const submitButton = form.querySelector('.submit-btn');
        submitButton.disabled = true;
        submitButton.textContent = 'Adding...';
        
        try {
            // Get the selected rating
            const selectedRating = form.querySelector('input[name="rating"]:checked');
            const rating = standingOvationBtn.classList.contains('active') ? 5 : 
                          (selectedRating ? parseFloat(selectedRating.value) : null);

            const formData = {
                name: form.playName.value,
                date: form.playDate.value,
                theatre: form.playTheatre.value || null,
                rating: rating,
                image: form.playImage.value && isValidUrl(form.playImage.value) ? form.playImage.value : null
            };

            await addPlay(formData);
            console.log('Play added successfully');
            form.reset();
            hideAddPlayForm();
            displayPlays('all');
        } catch (error) {
            console.error('Error adding play:', error);
            if (error.message.includes('Must be logged in')) {
                alert('Please sign in to add plays');
            } else {
                alert('Error adding play: ' + error.message);
            }
        } finally {
            // Re-enable submit button
            submitButton.disabled = false;
            submitButton.textContent = 'Add Play';
        }
    });
}

function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

// Load all plays when the page loads
document.addEventListener('DOMContentLoaded', () => {
    displayPlays(false);
});