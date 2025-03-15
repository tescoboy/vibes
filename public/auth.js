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
    
    // Generate the moon rating HTML for display
    let ratingHtml = '';
    if (play.rating) {
        if (play.rating === 'Standing Ovation') {
            ratingHtml = '<span class="standing-ovation-display"><i class="fa-solid fa-person"></i> Standing Ovation</span>';
        } else {
            ratingHtml = '<div class="rating-display"><div class="moon-display">';
            const rating = parseFloat(play.rating);
            const fullMoons = Math.floor(rating);
            const hasHalfMoon = rating % 1 !== 0;
            
            // Add full moons
            for (let i = 0; i < fullMoons; i++) {
                ratingHtml += '<span class="moon moon-full"><i class="fa-solid fa-moon"></i></span>';
            }
            
            // Add half moon if needed
            if (hasHalfMoon) {
                ratingHtml += '<span class="moon moon-half"><i class="fa-regular fa-moon"></i></span>';
            }
            
            ratingHtml += '</div></div>';
        }
    } else {
        ratingHtml = 'Not Rated';
    }
    
    playCard.innerHTML = `
        <div class="play-card-content">
            <div class="image-container">
                <img src="${play.image || 'https://placehold.co/400x300?text=No+Image'}" 
                     alt="${play.name}" 
                     loading="lazy">
                <button class="edit-icon" onclick="editPlay('${play.id}')">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                    </svg>
                </button>
            </div>
            <h3>${play.name}</h3>
            <p>Theatre: ${play.theatre || 'TBA'}</p>
            <p>Rating: ${ratingHtml}</p>
            <p>Date: ${new Date(play.date).toLocaleDateString('en-GB') || 'TBA'}</p>
        </div>
    `;
    
    return playCard;
}

// Function to create a hall of fame play card
function createHallOfFameCard(play, isShame = false) {
    const playCard = document.createElement('div');
    playCard.className = `play-card ${isShame ? 'hall-of-shame' : 'hall-of-fame'}`;
    
    // Generate the moon rating HTML with Font Awesome
    let ratingHtml = '';
    if (play.rating) {
        if (play.rating === 'Standing Ovation') {
            ratingHtml = '<span class="standing-ovation-display"><i class="fa-solid fa-person"></i> Standing Ovation</span>';
        } else {
            ratingHtml = '<div class="rating-display">';
            const rating = parseFloat(play.rating);
            const fullMoons = Math.floor(rating);
            const hasHalfMoon = rating % 1 !== 0;
            
            // Add full moons
            for (let i = 0; i < fullMoons; i++) {
                ratingHtml += '<span class="moon moon-full"><i class="fa-solid fa-moon"></i></span>';
            }
            
            // Add half moon if needed
            if (hasHalfMoon) {
                ratingHtml += '<span class="moon moon-half"><i class="fa-regular fa-moon"></i></span>';
            }
            
            ratingHtml += '</div>';
        }
    } else {
        ratingHtml = 'Not Rated';
    }
    
    playCard.innerHTML = `
        <div class="play-card-content">
            <div class="${isShame ? 'hall-of-shame-badge' : 'hall-of-fame-badge'}">
                ${isShame ? '👎 Hall of Shame' : '⭐ Hall of Fame'}
            </div>
            <div class="image-container">
                <img src="${play.image || 'https://placehold.co/400x300?text=No+Image'}" 
                     alt="${play.name}" 
                     loading="lazy">
                <button class="edit-icon" onclick="editPlay('${play.id}')">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                    </svg>
                </button>
            </div>
            <h3>${play.name}</h3>
            <p>Theatre: ${play.theatre || 'TBA'}</p>
            <p class="rating">Rating: ${ratingHtml}</p>
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

// Function to display plays - make it globally accessible
async function displayPlays(section = 'all') {
    console.log("displayPlays called with section:", section);
    const playGrid = document.querySelector('.play-grid');
    const calendarContainer = document.querySelector('.calendar-container');
    const addPlayForm = document.querySelector('.add-play-form');
    
    // Hide the add play form
    if (addPlayForm) addPlayForm.style.display = 'none';
    
    // Special case for dashboard
    if (section === 'dashboard') {
        if (playGrid) playGrid.innerHTML = ''; // Clear existing content
        if (calendarContainer) calendarContainer.style.display = 'none';
        
        // Update active nav - set dashboard link active
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        const dashboardLink = document.getElementById('dashboardLink');
        if (dashboardLink) dashboardLink.classList.add('active');
        
        // Directly call the dashboard function
        await displayDashboard();
        return; // Exit early - dashboard rendering is complete
    }
    
    // Special case for calendar section
    if (section === 'calendar') {
        if (playGrid) playGrid.style.display = 'none';
        if (calendarContainer) calendarContainer.style.display = 'block';
        
        // Update nav links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        const calendarLink = document.getElementById('calendarLink');
        if (calendarLink) calendarLink.classList.add('active');
        
        // Display the calendar content (handled by separate calendar.js)
        return;
    }
    
    // Rest of the displayPlays function proceeds as normal for regular sections
    // Update active nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    try {
        // Set active nav
        if (section === 'hallOfShame') {
            const hallOfFameLink = document.getElementById('hallOfFamePlaysLink');
            if (hallOfFameLink) hallOfFameLink.classList.add('active');
        } else {
            const navLink = document.getElementById(`${section}PlaysLink`);
            if (navLink) navLink.classList.add('active');
        }
    } catch (e) {
        console.error("Error updating navigation:", e);
    }

    // Show/hide hall toggle if needed
    const hallToggle = document.querySelector('.hall-toggle');
    if (hallToggle) {
        hallToggle.style.display = (section === 'hallOfFame' || section === 'hallOfShame') ? 'block' : 'none';
    }

    // Ensure play grid is visible and calendar is hidden
    if (playGrid) playGrid.style.display = 'grid';
    if (calendarContainer) calendarContainer.style.display = 'none';

    try {
        // Empty the play grid before adding new content
        if (playGrid) playGrid.innerHTML = '';
        
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

        // Always use grid view for regular sections
        plays.forEach(play => {
            const playCard = (section === 'hallOfFame' || section === 'hallOfShame') ? 
                createHallOfFameCard(play, section === 'hallOfShame') : 
                createPlayCard(play);
            playGrid.appendChild(playCard);
        });

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
    // Update active nav link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    document.getElementById('addPlayLink').classList.add('active');
    
    // Hide other containers
    const playGrid = document.querySelector('.play-grid');
    const calendarContainer = document.querySelector('.calendar-container');
    
    if (playGrid) playGrid.style.display = 'none';
    if (calendarContainer) calendarContainer.style.display = 'none';
    
    // Show the add play form
    const addPlayForm = document.querySelector('.add-play-form');
    if (addPlayForm) addPlayForm.style.display = 'block';
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

// Add these styles after the existing play card styles
const editIconStyles = document.createElement('style');
editIconStyles.textContent = `
    .play-card .image-container {
        position: relative;
        width: 100%;
        height: 200px;
        overflow: hidden;
    }
    
    .play-card .image-container img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
    
    .play-card .edit-icon {
        position: absolute;
        top: 8px;
        right: 8px;
        background-color: white;
        border: none;
        border-radius: 50%;
        width: 32px;
        height: 32px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        opacity: 0.8;
        transition: all 0.2s;
    }
    
    .play-card .edit-icon:hover {
        opacity: 1;
        transform: scale(1.1);
    }
    
    .play-card .edit-icon svg {
        color: #333;
    }
`;
document.head.appendChild(editIconStyles);

// Function to edit a play - completely new approach with iframe
function editPlay(playId) {
    console.log('Editing play with ID:', playId);
    
    // Remove any existing modals
    const existingModals = document.querySelectorAll('.modal-overlay, .edit-modal-iframe-container');
    existingModals.forEach(modal => {
        if (modal && modal.parentNode) {
            document.body.removeChild(modal);
        }
    });
    
    // Create a modal container that's positioned absolutely
    const modalContainer = document.createElement('div');
    modalContainer.className = 'edit-modal-iframe-container';
    modalContainer.style.cssText = `
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        width: 100% !important;
        height: 100% !important;
        background-color: rgba(0, 0, 0, 0.8) !important;
        z-index: 99999 !important;
        display: flex !important;
        justify-content: center !important;
        align-items: center !important;
    `;
    
    // Create a simple editor with loading state
    modalContainer.innerHTML = `
        <div class="editor-popup" style="
            background-color: white;
            padding: 20px;
            border-radius: 8px;
            width: 90%;
            max-width: 500px;
            box-shadow: 0 4px 10px rgba(0,0,0,0.3);
        ">
            <h2 style="margin-top: 0;">Edit Play</h2>
            <p>Loading play information...</p>
            <div class="editor-controls" style="text-align: center;">
                <button id="closeEditorBtn" style="
                    background-color: #f44336;
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 4px;
                    cursor: pointer;
                ">Close</button>
            </div>
        </div>
    `;
    
    // Add the container to the page
    document.body.appendChild(modalContainer);
    
    // Setup close button
    document.getElementById('closeEditorBtn').addEventListener('click', () => {
        document.body.removeChild(modalContainer);
    });
    
    // Close on click outside the popup
    modalContainer.addEventListener('click', (e) => {
        if (e.target === modalContainer) {
            document.body.removeChild(modalContainer);
        }
    });
    
    // Fetch the play data
    dbClient
        .from('plays')
        .select('*')
        .eq('id', playId)
        .single()
        .then(({ data, error }) => {
            if (error) {
                console.error('Error fetching play:', error);
                modalContainer.querySelector('.editor-popup').innerHTML = `
                    <h2 style="margin-top: 0;">Error</h2>
                    <p>Failed to load play data: ${error.message}</p>
                    <div class="editor-controls" style="text-align: center;">
                        <button id="closeEditorBtn" style="
                            background-color: #f44336;
                            color: white;
                            border: none;
                            padding: 10px 20px;
                            border-radius: 4px;
                            cursor: pointer;
                        ">Close</button>
                    </div>
                `;
                
                // Reattach close button event
                document.getElementById('closeEditorBtn').addEventListener('click', () => {
                    document.body.removeChild(modalContainer);
                });
                return;
            }
            
            if (!data) {
                console.error('Play not found');
                modalContainer.querySelector('.editor-popup').innerHTML = `
                    <h2 style="margin-top: 0;">Error</h2>
                    <p>Play not found</p>
                    <div class="editor-controls" style="text-align: center;">
                        <button id="closeEditorBtn" style="
                            background-color: #f44336;
                            color: white;
                            border: none;
                            padding: 10px 20px;
                            border-radius: 4px;
                            cursor: pointer;
                        ">Close</button>
                    </div>
                `;
                
                // Reattach close button event
                document.getElementById('closeEditorBtn').addEventListener('click', () => {
                    document.body.removeChild(modalContainer);
                });
                return;
            }
            
            console.log('Play data fetched:', data);
            
            // Format date for input
            const formattedDate = data.date ? data.date.split('T')[0] : '';
            
            // Update the popup with the form now that we have data
            modalContainer.querySelector('.editor-popup').innerHTML = `
                <h2 style="margin-top: 0;">Edit: ${data.name}</h2>
                <form id="simpleEditForm" style="margin-bottom: 20px;">
                    <div style="margin-bottom: 15px;">
                        <label style="display: block; margin-bottom: 5px;">Name:</label>
                        <input type="text" id="editName" value="${data.name || ''}" style="width: 100%; padding: 8px; box-sizing: border-box;">
                    </div>
                    <div style="margin-bottom: 15px;">
                        <label style="display: block; margin-bottom: 5px;">Date:</label>
                        <input type="date" id="editDate" value="${formattedDate}" style="width: 100%; padding: 8px; box-sizing: border-box;">
                    </div>
                    <div style="margin-bottom: 15px;">
                        <label style="display: block; margin-bottom: 5px;">Theatre:</label>
                        <input type="text" id="editTheatre" value="${data.theatre || ''}" style="width: 100%; padding: 8px; box-sizing: border-box;">
                    </div>
                    <div style="margin-bottom: 15px;">
                        <label style="display: block; margin-bottom: 5px;">Rating:</label>
                        <div class="edit-rating-container" style="margin-bottom: 10px;"></div>
                    </div>
                    <div style="margin-bottom: 15px;">
                        <label style="display: block; margin-bottom: 5px;">Image URL:</label>
                        <input type="url" id="editImage" value="${data.image || ''}" style="width: 100%; padding: 8px; box-sizing: border-box;">
                    </div>
                </form>
                <div class="editor-controls" style="display: flex; justify-content: space-between; flex-wrap: wrap; gap: 10px;">
                    <button id="saveEditBtn" style="
                        background-color: #4CAF50;
                        color: white;
                        border: none;
                        padding: 10px 20px;
                        border-radius: 4px;
                        cursor: pointer;
                    ">Save</button>
                    <button id="clearRatingBtn" style="
                        background-color: #888;
                        color: white;
                        border: none;
                        padding: 10px 20px;
                        border-radius: 4px;
                        cursor: pointer;
                    ">Remove Rating</button>
                    <button id="deleteEditBtn" style="
                        background-color: #f44336;
                        color: white;
                        border: none;
                        padding: 10px 20px;
                        border-radius: 4px;
                        cursor: pointer;
                    ">Delete</button>
                    <button id="closeEditorBtn" style="
                        background-color: #ccc;
                        color: black;
                        border: none;
                        padding: 10px 20px;
                        border-radius: 4px;
                        cursor: pointer;
                    ">Cancel</button>
                </div>
            `;
            
            // Setup moon rating system
            const ratingContainer = document.querySelector('.edit-rating-container');
            const ratingControl = createEditMoonRating(ratingContainer, data.rating);
            
            // Add event handler for the clear rating button
            document.getElementById('clearRatingBtn').addEventListener('click', () => {
                console.log('Clearing rating');
                if (ratingControl && typeof ratingControl.reset === 'function') {
                    ratingControl.reset();
                }
            });
            
            // Set up the image preview
            const imageInput = document.getElementById('editImage');
            if (imageInput) {
                const imagePreviewDiv = document.createElement('div');
                imagePreviewDiv.style.cssText = `
                    margin-top: 10px;
                    max-width: 100%;
                    text-align: center;
                `;
                imagePreviewDiv.innerHTML = `
                    <img src="${data.image || 'https://placehold.co/400x300?text=No+Image'}" 
                         alt="Preview" 
                         style="max-width: 100%; max-height: 200px; object-fit: contain;">
                `;
                imageInput.parentNode.appendChild(imagePreviewDiv);
                
                imageInput.addEventListener('input', () => {
                    const img = imagePreviewDiv.querySelector('img');
                    if (img) {
                        img.src = imageInput.value || 'https://placehold.co/400x300?text=No+Image';
                    }
                });
            }
            
            // Reattach close button event
            document.getElementById('closeEditorBtn').addEventListener('click', () => {
                document.body.removeChild(modalContainer);
            });
            
            // Handle save button
            document.getElementById('saveEditBtn').addEventListener('click', async () => {
                try {
                    let ratingValue = null;
                    if (ratingControl && typeof ratingControl.getValue === 'function') {
                        ratingValue = ratingControl.getValue();
                    }
                    
                    const updatedPlay = {
                        name: document.getElementById('editName').value,
                        date: document.getElementById('editDate').value,
                        theatre: document.getElementById('editTheatre').value || null,
                        rating: ratingValue || null,
                        image: document.getElementById('editImage').value || null
                    };
                    
                    console.log('Saving updated play:', updatedPlay);
                    
                    const { error } = await dbClient
                        .from('plays')
                        .update(updatedPlay)
                        .eq('id', data.id);
                        
                    if (error) throw error;
                    
                    console.log('Play updated successfully');
                    document.body.removeChild(modalContainer);
                    
                    // Force clear the current play grid before refreshing the display
                    const playGrid = document.querySelector('.play-grid');
                    if (playGrid) {
                        playGrid.innerHTML = '';
                    }
                    
                    // Refresh with a slight delay to ensure the modal is fully removed
                    setTimeout(() => {
                        console.log('Refreshing display after update');
                        displayPlays('all');
                    }, 100);
                    
                } catch (error) {
                    console.error('Error updating play:', error);
                    alert('Failed to update play: ' + error.message);
                }
            });
            
            // Enhanced delete button handler with proper refresh
            document.getElementById('deleteEditBtn').addEventListener('click', async () => {
                if (confirm('Are you sure you want to delete this play?')) {
                    try {
                        console.log('Deleting play with ID:', data.id);
                        
                        const { error } = await dbClient
                            .from('plays')
                            .delete()
                            .eq('id', data.id);
                            
                        if (error) throw error;
                        
                        console.log('Play deleted successfully');
                        
                        // Remove the modal first
                        document.body.removeChild(modalContainer);
                        
                        // Force clear the current play grid before refreshing the display
                        const playGrid = document.querySelector('.play-grid');
                        if (playGrid) {
                            playGrid.innerHTML = '';
                        }
                        
                        // Call displayPlays with a slight delay to ensure DOM updates have processed
                        setTimeout(() => {
                            console.log('Refreshing display after delete');
                            displayPlays('all');
                        }, 100);
                        
                    } catch (error) {
                        console.error('Error deleting play:', error);
                        alert('Failed to delete play: ' + error.message);
                    }
                }
            });
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred');
        });
}

// Add modal styles
const modalStyles = document.createElement('style');
modalStyles.textContent = `
    .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.3s ease, visibility 0.3s ease;
        padding: 20px;
    }
    
    .modal-overlay.active {
        opacity: 1;
        visibility: visible;
    }
    
    .modal-content {
        background-color: white;
        border-radius: 8px;
        max-width: 600px;
        width: 100%;
        max-height: 90vh;
        overflow-y: auto;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
        transform: translateY(20px);
        transition: transform 0.3s ease;
    }
    
    .modal-overlay.active .modal-content {
        transform: translateY(0);
    }
    
    .modal-header {
        padding: 1rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #eee;
        position: sticky;
        top: 0;
        background: white;
        z-index: 1;
    }
    
    .modal-header h2 {
        margin: 0;
        color: #333;
        font-size: 1.5rem;
    }
    
    .modal-close-btn {
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: #666;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: all 0.2s;
    }
    
    .modal-close-btn:hover {
        background-color: #f0f0f0;
        color: #333;
    }
    
    .modal-body {
        padding: 1rem;
    }
    
    /* Edit form specific styles */
    .save-btn {
        background-color: #1a73e8;
        color: white;
    }
    
    .save-btn:hover {
        background-color: #1557b0;
    }
    
    .delete-btn {
        background-color: #dc3545;
        color: white;
    }
    
    .delete-btn:hover {
        background-color: #c82333;
    }
    
    .clear-rating-btn {
        padding: 0.5rem 1rem;
        background: #f8f9fa;
        border: 1px solid #ddd;
        border-radius: 4px;
        cursor: pointer;
        transition: all 0.2s;
    }
    
    .clear-rating-btn:hover {
        background-color: #e9ecef;
    }
    
    /* Responsive adjustments */
    @media (max-width: 640px) {
        .modal-content {
            border-radius: 0;
            max-height: 100vh;
        }
        
        .form-actions {
            flex-direction: column;
        }
        
        .form-actions button {
            margin-bottom: 0.5rem;
        }
    }
`;
document.head.appendChild(modalStyles);

// Initialize the moon rating system
function initMoonRating() {
    // For the Add Play form
    setupMoonRating(
        document.querySelector('.add-play-form .moon-rating-new'), 
        document.querySelector('.add-play-form #ratingValue')
    );
}

// Setup function for the moon rating system - updated for horizontal layout
function setupMoonRating(container, hiddenInput) {
    console.log("Setting up moon rating", container, hiddenInput);
    
    // Make the moon wrapper horizontal
    const moonWrapper = container.querySelector('.moon-rating-wrapper');
    if (moonWrapper) {
        moonWrapper.style.display = 'flex';
        moonWrapper.style.flexDirection = 'row';
        moonWrapper.style.gap = '10px';
        moonWrapper.style.marginBottom = '15px';
    }
    
    // Convert standing ovation button to icon if it exists
    const standingOvationBtn = container.querySelector('.standing-ovation-btn');
    if (standingOvationBtn) {
        // Create a new icon element
        const standingOvationIcon = document.createElement('div');
        standingOvationIcon.className = 'standing-ovation-icon';
        standingOvationIcon.setAttribute('data-value', 'Standing Ovation');
        standingOvationIcon.style.cssText = `
            font-size: 28px;
            cursor: pointer;
            transition: all 0.2s ease;
            margin-left: 10px;
            color: #ccc;
        `;
        standingOvationIcon.innerHTML = '<i class="fa-solid fa-person"></i>';
        
        // Replace the button with the icon
        if (standingOvationBtn.parentNode) {
            standingOvationBtn.parentNode.replaceChild(standingOvationIcon, standingOvationBtn);
        }
        
        // Now update our reference to use the icon
        var standingOvation = standingOvationIcon;
    } else {
        // Try to find if it's already been converted to an icon
        var standingOvation = container.querySelector('.standing-ovation-icon');
    }
    
    const moonItems = container.querySelectorAll('.moon-item');
    let selectedRating = '';
    
    console.log("Found moon items:", moonItems.length);
    
    // Reset all moons to default state (ensure they start grey)
    moonItems.forEach(moon => {
        moon.classList.remove('selected', 'half-selected');
        moon.querySelector('i').style.color = '#ccc'; // Force grey color
    });
    
    // Reset the standing ovation icon
    if (standingOvation) {
        standingOvation.style.color = '#ccc';
        standingOvation.classList.remove('selected');
    }
    
    // Reset the rating display
    function resetRating() {
        moonItems.forEach(item => {
            item.classList.remove('selected', 'half-selected');
            const icon = item.querySelector('i');
            icon.classList.remove('fa-regular');
            icon.classList.add('fa-solid');
            icon.style.color = '#ccc';
        });
        if (standingOvation) {
            standingOvation.style.color = '#ccc';
            standingOvation.classList.remove('selected');
        }
        hiddenInput.value = '';
        selectedRating = '';
    }
    
    // Update the visual display based on the selected rating
    function updateDisplay(rating) {
        resetRating();
        
        if (rating === 'Standing Ovation') {
            if (standingOvation) {
                standingOvation.style.color = '#FFD700'; // Gold color
                standingOvation.classList.add('selected');
            }
            hiddenInput.value = rating;
            selectedRating = rating;
            return;
        }
        
        if (!rating) return;
        
        const ratingValue = parseFloat(rating);
        const fullValue = Math.floor(ratingValue);
        const hasHalf = ratingValue % 1 !== 0;
        
        // Update full moons
        for (let i = 0; i < fullValue; i++) {
            moonItems[i].classList.add('selected');
            moonItems[i].querySelector('i').style.color = '#FFD700'; // Gold color
        }
        
        // Update half moon if needed
        if (hasHalf && fullValue < moonItems.length) {
            // Clear the original moon icon and replace with half moon
            const halfMoonItem = moonItems[fullValue];
            halfMoonItem.classList.add('half-selected');
            
            // Replace the solid moon with regular moon for half rating
            const icon = halfMoonItem.querySelector('i');
            icon.classList.remove('fa-solid');
            icon.classList.add('fa-regular');
            icon.style.color = '#FFD700'; // Gold color
        }
        
        hiddenInput.value = rating;
        selectedRating = rating;
    }
    
    // Handle moon clicks - directly attach click handlers
    moonItems.forEach((moon, index) => {
        console.log("Attaching handlers to moon", index + 1);
        
        moon.addEventListener('click', function() {
            console.log("Moon clicked:", index + 1);
            const value = index + 1;
            
            // If already selected as full value, change to half value
            if (selectedRating === value.toString()) {
                // If clicked the first moon, can't go below 1
                if (value === 1) {
                    resetRating(); // Just clear the rating
                } else {
                    updateDisplay((value - 0.5).toString());
                }
            } 
            // If already selected as half value, clear the rating
            else if (selectedRating === (value - 0.5).toString()) {
                resetRating();
            }
            // Otherwise, select the full value
            else {
                updateDisplay(value.toString());
            }
        });
    });
    
    // Handle standing ovation selection
    if (standingOvation) {
        standingOvation.addEventListener('click', function() {
            console.log("Standing ovation clicked");
            if (selectedRating === 'Standing Ovation') {
                resetRating();
            } else {
                updateDisplay('Standing Ovation');
            }
        });
    }
    
    // Initialize in grey state
    resetRating();
    
    return {
        getValue: () => selectedRating,
        setValue: (rating) => updateDisplay(rating),
        reset: resetRating
    };
}

// Function to create a similar moon rating for the edit modal
function createEditMoonRating(container, initialValue) {
    // Very similar to setupMoonRating, but for the edit modal
    const editMoonHTML = `
        <div class="moon-rating-new">
            <div class="moon-rating-wrapper" style="display: flex; flex-direction: row; gap: 10px; margin-bottom: 15px;">
                <div class="moon-item" data-value="1">
                    <i class="fa-solid fa-moon"></i>
                </div>
                <div class="moon-item" data-value="2">
                    <i class="fa-solid fa-moon"></i>
                </div>
                <div class="moon-item" data-value="3">
                    <i class="fa-solid fa-moon"></i>
                </div>
                <div class="moon-item" data-value="4">
                    <i class="fa-solid fa-moon"></i>
                </div>
                <div class="moon-item" data-value="5">
                    <i class="fa-solid fa-moon"></i>
                </div>
                <div class="standing-ovation-icon" data-value="Standing Ovation" style="
                    font-size: 28px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    margin-left: 10px;
                    color: #ccc;
                ">
                    <i class="fa-solid fa-person"></i>
                </div>
            </div>
        </div>
        <input type="hidden" id="editRatingValue" name="editRating" value="${initialValue || ''}">
    `;
    
    container.innerHTML = editMoonHTML;
    
    const moonItems = container.querySelectorAll('.moon-item');
    const standingOvation = container.querySelector('.standing-ovation-icon');
    const hiddenInput = container.querySelector('#editRatingValue');
    let selectedRating = '';
    
    console.log("Found moon items:", moonItems.length);
    
    // Reset all moons to default state (ensure they start grey)
    moonItems.forEach(moon => {
        moon.classList.remove('selected', 'half-selected');
        moon.querySelector('i').style.color = '#ccc'; // Force grey color
    });
    
    // Reset the standing ovation icon
    if (standingOvation) {
        standingOvation.style.color = '#ccc';
        standingOvation.classList.remove('selected');
    }
    
    // Reset the rating display
    function resetRating() {
        moonItems.forEach(item => {
            item.classList.remove('selected', 'half-selected');
            const icon = item.querySelector('i');
            icon.classList.remove('fa-regular');
            icon.classList.add('fa-solid');
            icon.style.color = '#ccc';
        });
        if (standingOvation) {
            standingOvation.style.color = '#ccc';
            standingOvation.classList.remove('selected');
        }
        hiddenInput.value = '';
        selectedRating = '';
    }
    
    // Update the visual display based on the selected rating
    function updateDisplay(rating) {
        resetRating();
        
        if (rating === 'Standing Ovation') {
            if (standingOvation) {
                standingOvation.style.color = '#FFD700'; // Gold color
                standingOvation.classList.add('selected');
            }
            hiddenInput.value = rating;
            selectedRating = rating;
            return;
        }
        
        if (!rating) return;
        
        const ratingValue = parseFloat(rating);
        const fullValue = Math.floor(ratingValue);
        const hasHalf = ratingValue % 1 !== 0;
        
        // Update full moons
        for (let i = 0; i < fullValue; i++) {
            moonItems[i].classList.add('selected');
            moonItems[i].querySelector('i').style.color = '#FFD700'; // Gold color
        }
        
        // Update half moon if needed
        if (hasHalf && fullValue < moonItems.length) {
            // Clear the original moon icon and replace with half moon
            const halfMoonItem = moonItems[fullValue];
            halfMoonItem.classList.add('half-selected');
            
            // Replace the solid moon with regular moon for half rating
            const icon = halfMoonItem.querySelector('i');
            icon.classList.remove('fa-solid');
            icon.classList.add('fa-regular');
            icon.style.color = '#FFD700'; // Gold color
        }
        
        hiddenInput.value = rating;
        selectedRating = rating;
    }
    
    // Handle moon clicks - directly attach click handlers
    moonItems.forEach((moon, index) => {
        console.log("Attaching handlers to moon", index + 1);
        
        moon.addEventListener('click', function() {
            console.log("Moon clicked:", index + 1);
            const value = index + 1;
            
            // If already selected as full value, change to half value
            if (selectedRating === value.toString()) {
                // If clicked the first moon, can't go below 1
                if (value === 1) {
                    resetRating(); // Just clear the rating
                } else {
                    updateDisplay((value - 0.5).toString());
                }
            } 
            // If already selected as half value, clear the rating
            else if (selectedRating === (value - 0.5).toString()) {
                resetRating();
            }
            // Otherwise, select the full value
            else {
                updateDisplay(value.toString());
            }
        });
    });
    
    // Handle standing ovation selection
    if (standingOvation) {
        standingOvation.addEventListener('click', function() {
            console.log("Standing ovation clicked");
            if (selectedRating === 'Standing Ovation') {
                resetRating();
            } else {
                updateDisplay('Standing Ovation');
            }
        });
    }
    
    // Initialize with initial value or reset
    if (initialValue) {
        updateDisplay(initialValue);
    } else {
        resetRating();
    }
    
    return {
        getValue: () => selectedRating,
        setValue: (rating) => updateDisplay(rating),
        reset: resetRating
    };
}

// Initialize the moon rating when document is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM loaded, initializing moon rating");
    // Initialize the moon rating for the add play form
    const moonRatingContainer = document.querySelector('.moon-rating-new');
    const hiddenInput = document.getElementById('ratingValue');
    
    // Debug
    console.log("Moon container:", moonRatingContainer);
    console.log("Hidden input:", hiddenInput);
    
    if (moonRatingContainer && hiddenInput) {
        // Setup moon rating system
        setupMoonRating(moonRatingContainer, hiddenInput);
    } else {
        console.error("Could not find moon rating elements");
    }
    
    // Add this - Make sure the form submission includes the rating
    const addPlayForm = document.getElementById('addPlayForm');
    if (addPlayForm) {
        addPlayForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            try {
                // Get the rating value
                const ratingValue = document.getElementById('ratingValue').value;
                console.log("Submitting form with rating:", ratingValue);
                
                // Get date and ensure it's in the correct format (YYYY-MM-DD)
                const dateInput = document.getElementById('playDate').value;
                // Format the date to ensure it's in YYYY-MM-DD format without time component
                const formattedDate = dateInput.split('T')[0]; // Remove any time component
                
                // Create play object with properly formatted date
                const play = {
                    name: document.getElementById('playName').value,
                    date: formattedDate,
                    theatre: document.getElementById('playTheatre').value || null,
                    rating: ratingValue || null,
                    image: document.getElementById('playImage').value || null
                };
                
                console.log("Submitting play:", play);
                
                // Use the dbClient from database.js, which is the correctly initialized Supabase client
                if (typeof dbClient !== 'undefined') {
                    console.log("Using dbClient from database.js");
                    const { data, error } = await dbClient
                        .from('plays')
                        .insert([play]);
                    
                    if (error) {
                        console.error("Database insert error:", error);
                        throw new Error(`Database insert error: ${error.message}`);
                    }
                    
                    console.log("Play added successfully:", data);
                } else {
                    throw new Error("Database client (dbClient) not available in global scope");
                }
                
                // Reset form and hide
                addPlayForm.reset();
                hideAddPlayForm();
                
                // Refresh plays
                displayPlays('all');
                
            } catch (error) {
                console.error('Error adding play:', error);
                alert(`Failed to add play: ${error.message}`);
            }
        });
    }
});

// Fix the fetchUpcomingPlays function
async function fetchUpcomingPlays() {
    console.log("Fetching upcoming plays");
    try {
        // Get today's date at the start of the day
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayStr = today.toISOString();
        
        console.log("Fetching plays after:", todayStr);
        
        // Fetch plays with dates after today
        const { data, error } = await dbClient
            .from('plays')
            .select('*')
            .gte('date', todayStr)
            .order('date', { ascending: true });
        
        if (error) {
            console.error("Error fetching upcoming plays:", error);
            throw error;
        }
        
        console.log("Fetched upcoming plays:", data ? data.length : 0);
        
        return data || [];
    } catch (error) {
        console.error('Error in fetchUpcomingPlays:', error);
        return [];
    }
}

// Make displayPlays available in the global scope
window.displayPlays = displayPlays;

// Also make editPlay available globally since it's used in onclick handlers
window.editPlay = editPlay;

// Make any other functions that are called from HTML onClick handlers global
window.toggleHallView = toggleHallView;

// Add this line to expose the signInWithGoogle function if it exists
if (typeof signInWithGoogle === 'function') {
    window.signInWithGoogle = signInWithGoogle;
}

console.log("Auth.js loaded, exposing functions to global scope");
// Verify the functions are available globally
console.log("displayPlays global:", typeof window.displayPlays === 'function');
console.log("editPlay global:", typeof window.editPlay === 'function');
console.log("toggleHallView global:", typeof window.toggleHallView === 'function');

// Add the missing displayCalendarSection function
function displayCalendarSection() {
    console.log("Displaying calendar section");
    
    // Get containers
    const playGrid = document.querySelector('.play-grid');
    const calendarContainer = document.querySelector('.calendar-container');
    const addPlayForm = document.querySelector('.add-play-form');
    
    // Hide other elements
    if (playGrid) playGrid.style.display = 'none';
    if (addPlayForm) addPlayForm.style.display = 'none';
    
    // Show calendar container
    if (calendarContainer) {
        calendarContainer.style.display = 'block';
        
        // If calendar container is empty, initialize it
        if (!calendarContainer.innerHTML.trim()) {
            calendarContainer.innerHTML = '<h2>Loading Calendar...</h2>';
            
            // Fetch upcoming plays for the calendar
            fetchUpcomingPlays()
                .then(plays => {
                    if (!plays || plays.length === 0) {
                        calendarContainer.innerHTML = '<h2>Calendar</h2><p>No upcoming plays scheduled.</p>';
                        return;
                    }
                    
                    // If calendar-view.js has a renderCalendar function, use it
                    if (typeof renderCalendar === 'function') {
                        renderCalendar(plays);
                    } else {
                        // Basic calendar rendering
                        renderBasicCalendar(plays, calendarContainer);
                    }
                })
                .catch(error => {
                    console.error("Error loading calendar:", error);
                    calendarContainer.innerHTML = '<h2>Calendar</h2><p>Error loading calendar data.</p>';
                });
        }
    }
    
    // Update navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    const calendarLink = document.getElementById('calendarLink');
    if (calendarLink) calendarLink.classList.add('active');
}

// Basic calendar rendering function for a traditional calendar view
function renderBasicCalendar(plays, container) {
    // Sort plays by date
    plays.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    // Group plays by date for quick lookup
    const playsByDate = {};
    plays.forEach(play => {
        const date = new Date(play.date);
        const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD format
        
        if (!playsByDate[dateStr]) {
            playsByDate[dateStr] = [];
        }
        playsByDate[dateStr].push(play);
    });
    
    // Get the range of months to display
    let startDate = new Date();
    let endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 6); // Show 6 months ahead
    
    if (plays.length > 0) {
        // If we have plays, adjust the range to include the earliest and latest plays
        const playDates = plays.map(play => new Date(play.date));
        const earliestPlay = new Date(Math.min(...playDates));
        const latestPlay = new Date(Math.max(...playDates));
        
        if (earliestPlay < startDate) startDate = earliestPlay;
        if (latestPlay > endDate) endDate = latestPlay;
    }
    
    // Create HTML
    let html = '<div class="calendar-view">';
    html += '<h2>Calendar View</h2>';
    
    // Generate calendar for each month in the range
    let currentMonth = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
    
    while (currentMonth <= endDate) {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        
        // Get month name
        const monthName = currentMonth.toLocaleString('default', { month: 'long' });
        
        html += `
            <div class="calendar-month">
                <h3>${monthName} ${year}</h3>
                <div class="calendar-grid">
                    <div class="calendar-weekday">Sun</div>
                    <div class="calendar-weekday">Mon</div>
                    <div class="calendar-weekday">Tue</div>
                    <div class="calendar-weekday">Wed</div>
                    <div class="calendar-weekday">Thu</div>
                    <div class="calendar-weekday">Fri</div>
                    <div class="calendar-weekday">Sat</div>
        `;
        
        // Get first day of month and total days in month
        const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 = Sunday, 1 = Monday, etc.
        const lastDateOfMonth = new Date(year, month + 1, 0).getDate();
        
        // Add empty cells for days before the first day of the month
        for (let i = 0; i < firstDayOfMonth; i++) {
            html += '<div class="calendar-day empty"></div>';
        }
        
        // Add cells for each day of the month
        for (let day = 1; day <= lastDateOfMonth; day++) {
            const date = new Date(year, month, day);
            const dateStr = date.toISOString().split('T')[0];
            const isToday = new Date().toISOString().split('T')[0] === dateStr;
            
            // Check if this date has any plays
            const daysPlays = playsByDate[dateStr] || [];
            
            html += `<div class="calendar-day${isToday ? ' today' : ''}">
                <div class="calendar-date-number">${day}</div>`;
            
            // Add plays for this day
            if (daysPlays.length > 0) {
                daysPlays.forEach(play => {
                    html += `
                        <div class="calendar-play-entry">
                            <div class="calendar-play-title">${play.name}</div>
                            <div class="calendar-play-venue">${play.theatre || 'TBA'}</div>
                            <button class="mini-edit-btn" onclick="editPlay('${play.id}')">Edit</button>
                        </div>
                    `;
                });
            }
            
            html += '</div>';
        }
        
        html += '</div></div>';
        
        // Move to next month
        currentMonth.setMonth(currentMonth.getMonth() + 1);
    }
    
    html += '</div>';
    container.innerHTML = html;
    
    // Add calendar styles
    const styles = document.createElement('style');
    styles.textContent = `
        .calendar-view {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        .calendar-month {
            margin-bottom: 40px;
        }
        .calendar-month h3 {
            text-align: center;
            margin-bottom: 15px;
            font-size: 24px;
        }
        .calendar-grid {
            display: grid;
            grid-template-columns: repeat(7, 1fr);
            gap: 1px;
            background-color: #e0e0e0;
            border: 1px solid #e0e0e0;
        }
        .calendar-weekday {
            background-color: #f8f8f8;
            padding: 10px;
            text-align: center;
            font-weight: bold;
            border-bottom: 1px solid #ddd;
        }
        .calendar-day {
            background-color: white;
            min-height: 100px;
            padding: 5px;
            position: relative;
        }
        .calendar-day.empty {
            background-color: #f5f5f5;
        }
        .calendar-day.today {
            background-color: #fffde7;
        }
        .calendar-date-number {
            position: absolute;
            top: 5px;
            right: 5px;
            width: 25px;
            height: 25px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
        }
        .calendar-day.today .calendar-date-number {
            background-color: #3498db;
            color: white;
            border-radius: 50%;
        }
        .calendar-play-entry {
            margin-top: 25px;
            padding: 5px;
            background-color: #e3f2fd;
            border-radius: 4px;
            font-size: 12px;
            margin-bottom: 5px;
        }
        .calendar-play-title {
            font-weight: bold;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .calendar-play-venue {
            font-size: 11px;
            color: #666;
            margin: 2px 0;
        }
        .mini-edit-btn {
            background-color: #4CAF50;
            color: white;
            border: none;
            padding: 2px 5px;
            border-radius: 3px;
            cursor: pointer;
            font-size: 10px;
            margin-top: 3px;
        }
        
        /* Make calendar responsive */
        @media (max-width: 768px) {
            .calendar-day {
                min-height: 80px;
                font-size: 12px;
            }
            .calendar-play-entry {
                margin-top: 20px;
                padding: 3px;
            }
        }
        @media (max-width: 576px) {
            .calendar-day {
                min-height: 60px;
            }
            .calendar-play-venue {
                display: none;
            }
        }
    `;
    document.head.appendChild(styles);
}

// Expose the calendar function globally
window.displayCalendarSection = displayCalendarSection;

// Update console logs to check for this function too
console.log("displayCalendarSection global:", typeof window.displayCalendarSection === 'function');