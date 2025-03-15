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
    // Main card container with rounded corners
    const card = document.createElement('div');
    card.className = 'play-card';
    card.style.cssText = `
        background: white;
        border-radius: 8px;
        overflow: hidden;
        position: relative;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    `;

    // Image container
    const imageContainer = document.createElement('div');
    imageContainer.style.cssText = `
        width: 100%;
        height: 200px;
        background-size: cover;
        background-position: center;
    `;
    if (play.image) {
        imageContainer.style.backgroundImage = `url(${play.image})`;
    }
    card.appendChild(imageContainer);

    // Content container (white background)
    const content = document.createElement('div');
    content.style.cssText = `
        padding: 16px;
        background: white;
    `;

    // Play name
    const name = document.createElement('h3');
    name.textContent = play.name;
    name.style.margin = '0 0 8px 0';
    content.appendChild(name);

    // Date
    const date = document.createElement('p');
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    date.textContent = new Date(play.date).toLocaleDateString('en-GB', options);
    date.style.margin = '0 0 8px 0';
    content.appendChild(date);

    // Theatre
    if (play.theatre) {
        const theatre = document.createElement('p');
        theatre.textContent = play.theatre;
        theatre.style.margin = '0 0 8px 0';
        content.appendChild(theatre);
    }

    // Rating
    if (play.rating) {
        const rating = document.createElement('p');
        rating.className = 'rating';
        rating.textContent = play.rating === 'Standing Ovation' ? '👏 Standing Ovation' : '★'.repeat(Math.floor(play.rating));
        if (play.rating % 1 === 0.5) {
            rating.textContent += '½';
        }
        rating.style.margin = '0';
        content.appendChild(rating);
    }

    card.appendChild(content);

    // Edit button
    const editButton = document.createElement('button');
    editButton.innerHTML = '✏️';
    editButton.style.cssText = `
        position: absolute;
        top: 8px;
        right: 8px;
        background: white;
        border: none;
        border-radius: 50%;
        width: 24px;
        height: 24px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        opacity: 0;
        transition: opacity 0.2s;
        z-index: 2;
    `;
    
    // Show/hide button on hover
    card.addEventListener('mouseenter', () => editButton.style.opacity = '1');
    card.addEventListener('mouseleave', () => editButton.style.opacity = '0');
    
    // Create overlay (hidden by default)
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        display: none;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    `;

    // Create edit form
    const form = document.createElement('div');
    form.style.cssText = `
        background: white;
        padding: 20px;
        border-radius: 8px;
        width: 80%;
        max-width: 500px;
    `;
    form.innerHTML = `
        <h2>Edit Play</h2>
        <input type="text" value="${play.name}" style="width: 100%; margin-bottom: 10px; padding: 8px;">
        <input type="text" value="${play.theatre || ''}" style="width: 100%; margin-bottom: 10px; padding: 8px;">
        <input type="date" value="${new Date(play.date).toISOString().split('T')[0]}" style="width: 100%; margin-bottom: 10px; padding: 8px;">
        <div style="margin-bottom: 10px;">
            <input type="number" value="${play.rating || ''}" style="width: calc(100% - 100px); padding: 8px;">
            <button style="padding: 8px; margin-left: 8px; background: #6c757d; color: white; border: none; border-radius: 4px; cursor: pointer;">Unrate</button>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center;">
            <div>
                <button style="padding: 8px 16px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">Save</button>
                <button style="padding: 8px 16px; margin-left: 8px; background: #6c757d; color: white; border: none; border-radius: 4px; cursor: pointer;">Cancel</button>
            </div>
            <button style="padding: 8px 16px; background: #dc3545; color: white; border: none; border-radius: 4px; cursor: pointer;">Delete Play</button>
        </div>
    `;

    overlay.appendChild(form);
    document.body.appendChild(overlay);

    // Show overlay when edit button is clicked
    editButton.addEventListener('click', () => {
        overlay.style.display = 'flex';
    });

    // Hide overlay when clicking outside form
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            overlay.style.display = 'none';
        }
    });

    // Get all form buttons and inputs
    const buttons = form.querySelectorAll('button');
    const saveButton = buttons[1];     // Save button
    const cancelButton = buttons[2];    // Cancel button
    const deleteButton = buttons[3];    // Delete button
    const unrateButton = buttons[0];    // Unrate button

    const nameInput = form.querySelector('input[type="text"]:nth-child(2)');
    const theatreInput = form.querySelector('input[type="text"]:nth-child(3)');
    const dateInput = form.querySelector('input[type="date"]');
    const ratingInput = form.querySelector('input[type="number"]');

    // Handle unrate
    unrateButton.addEventListener('click', async () => {
        ratingInput.value = '';
        try {
            await supabaseClient
                .from('plays')
                .update({ rating: null })
                .eq('id', play.id);
            
            // Update the rating display
            const ratingElement = card.querySelector('.rating');
            if (ratingElement) ratingElement.textContent = '';
            
            overlay.style.display = 'none';
        } catch (error) {
            console.error('Error updating rating:', error);
            alert('Failed to update rating');
        }
    });

    // Handle delete
    deleteButton.addEventListener('click', async () => {
        console.log('Attempting to delete play:', play.id); // Debug log
        
        if (confirm('Are you sure you want to delete this play?')) {
            try {
                const { error } = await supabaseClient
                    .from('plays')
                    .delete()
                    .eq('id', play.id);

                if (error) throw error;
                
                // Remove the card and overlay
                card.remove();
                overlay.remove();
                
                console.log('Play deleted successfully'); // Debug log
            } catch (error) {
                console.error('Error deleting play:', error);
                alert('Failed to delete play: ' + error.message);
            }
        }
    });

    // Handle save
    saveButton.addEventListener('click', async () => {
        try {
            const updatedPlay = {
                name: nameInput.value,
                theatre: theatreInput.value || null,
                date: dateInput.value,
                rating: ratingInput.value ? Number(ratingInput.value) : null
            };

            await supabaseClient
                .from('plays')
                .update(updatedPlay)
                .eq('id', play.id);
            
            // Update the card display
            const nameElement = card.querySelector('h3');
            const dateElement = card.querySelector('p');
            const theatreElement = card.querySelector('p:nth-child(3)');
            const ratingElement = card.querySelector('.rating');

            nameElement.textContent = updatedPlay.name;
            dateElement.textContent = new Date(updatedPlay.date).toLocaleDateString('en-GB', options);
            if (theatreElement) theatreElement.textContent = updatedPlay.theatre || '';
            if (ratingElement) {
                ratingElement.textContent = updatedPlay.rating ? 
                    (updatedPlay.rating === 'Standing Ovation' ? '👏 Standing Ovation' : '★'.repeat(Math.floor(updatedPlay.rating))) : '';
                if (updatedPlay.rating % 1 === 0.5) {
                    ratingElement.textContent += '½';
                }
            }

            overlay.style.display = 'none';
        } catch (error) {
            console.error('Error updating play:', error);
            alert('Failed to update play');
        }
    });

    // Handle cancel
    cancelButton.addEventListener('click', () => {
        overlay.style.display = 'none';
    });
    
    card.appendChild(editButton);

    return card;
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
        display: none;
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
`;
document.head.appendChild(formStyles);

// Add form functions after existing functions
function showAddPlayForm() {
    const playGrid = document.querySelector('.play-grid');
    const calendarContainer = document.querySelector('.calendar-container');
    const addPlayForm = document.querySelector('.add-play-form');
    
    if (playGrid) playGrid.style.display = 'none';
    if (calendarContainer) calendarContainer.style.display = 'none';
    if (addPlayForm) addPlayForm.style.display = 'block';
    
    setupFormHandlers();
}

function hideAddPlayForm() {
    const addPlayForm = document.querySelector('.add-play-form');
    if (addPlayForm) {
        addPlayForm.style.display = 'none';
        displayPlays('all');
    }
}

function setupFormHandlers() {
    console.log('Setting up form handlers - start');
    const form = document.getElementById('addPlayForm');
    
    if (form.dataset.initialized) {
        console.log('Form already initialized, skipping setup');
        return;
    }
    
    const imageInput = document.getElementById('playImage');
    const imagePreview = document.querySelector('.image-preview');
    const standingOvationBtn = document.getElementById('standingOvation');

    form.dataset.initialized = 'true';

    // Reset form state completely
    function resetForm() {
        form.reset();
        imagePreview.style.backgroundImage = 'none';
        imagePreview.textContent = 'Image preview will appear here';
        standingOvationBtn.classList.remove('active');
        form.querySelectorAll('.star-rating input').forEach(input => {
            input.checked = false;
            input.disabled = false;
        });
    }

    // Image URL validation and preview
    imageInput.addEventListener('input', () => {
        const url = imageInput.value;
        if (url && isValidUrl(url)) {
            // Test if image loads successfully
            const img = new Image();
            img.onload = () => {
                imagePreview.style.backgroundImage = `url(${url})`;
                imagePreview.textContent = '';
            };
            img.onerror = () => {
                imagePreview.style.backgroundImage = 'none';
                imagePreview.textContent = 'Invalid image URL';
            };
            img.src = url;
        } else {
            imagePreview.style.backgroundImage = 'none';
            imagePreview.textContent = 'Image preview will appear here';
        }
    });

    // Standing ovation toggle
    standingOvationBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const isActive = standingOvationBtn.classList.toggle('active');
        form.querySelectorAll('.star-rating input').forEach(input => {
            input.checked = false;
            input.disabled = isActive;
        });
    });

    // Form submission with submit lock
    let isSubmitting = false;
    form.addEventListener('submit', async (e) => {
        console.log('Form submit triggered, isSubmitting:', isSubmitting);
        e.preventDefault();
        
        if (isSubmitting) {
            console.log('Already submitting, ignoring');
            return;
        }
        
        isSubmitting = true;
        console.log('Starting submission');

        const submitButton = form.querySelector('.submit-btn');
        submitButton.disabled = true;
        submitButton.textContent = 'Adding...';
        
        try {
            const selectedRating = form.querySelector('input[name="rating"]:checked');
            const rating = standingOvationBtn.classList.contains('active') ? 'Standing Ovation' : 
                          (selectedRating ? parseFloat(selectedRating.value) : null);

            const formData = {
                name: form.playName.value,
                date: form.playDate.value,
                theatre: form.playTheatre.value || null,
                rating: rating,
                image: form.playImage.value && isValidUrl(form.playImage.value) ? form.playImage.value : null
            };

            console.log('Submitting form data:', formData);
            await addPlay(formData);
            console.log('Play added successfully');
            resetForm();  // Use new reset function
            hideAddPlayForm();
            displayPlays('all');
        } catch (error) {
            console.error('Error adding play:', error);
            alert('Error adding play: ' + error.message);
        } finally {
            console.log('Submission complete');
            isSubmitting = false;
            submitButton.disabled = false;
            submitButton.textContent = 'Add Play';
        }
    });

    // Reset form when showing
    showAddPlayForm = () => {
        const playGrid = document.querySelector('.play-grid');
        const calendarContainer = document.querySelector('.calendar-container');
        const addPlayForm = document.querySelector('.add-play-form');
        
        if (playGrid) playGrid.style.display = 'none';
        if (calendarContainer) calendarContainer.style.display = 'none';
        if (addPlayForm) {
            addPlayForm.style.display = 'block';
            resetForm();  // Reset form when showing
        }
        
        setupFormHandlers();
    };

    console.log('Form handlers setup complete');
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

// Add this function
async function addPlay(formData) {
    if (!supabaseClient.auth.getSession()) {
        throw new Error('Must be logged in to add plays');
    }

    const { data, error } = await supabaseClient
        .from('plays')
        .insert([formData])
        .select();

    if (error) throw error;
    return data;
}