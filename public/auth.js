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
        calendarToggle.style.display = 'none'; // Hide calendar toggle since we have a dedicated Calendar section
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

// Placeholder function for edit action
function editPlay(playId) {
    console.log(`Editing play with ID: ${playId}`);
    createModalOverlay(playId);
}

// Function to create modal overlay
async function createModalOverlay(playId) {
    // Fetch play data first
    const { data: play, error } = await supabaseClient
        .from('plays')
        .select('*')
        .eq('id', playId)
        .single();
    
    if (error) {
        console.error('Error fetching play:', error);
        return;
    }
    
    console.log("Play data for editing:", play); // Debug log to see what we're working with
    
    // Format the date properly - extract just the YYYY-MM-DD part
    let formattedDate = '';
    if (play.date) {
        // Handle both ISO string format and plain date format
        formattedDate = play.date.includes('T') ? 
            play.date.split('T')[0] : 
            play.date;
    }
    console.log("Formatted date for input:", formattedDate);
    
    // Create modal overlay
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal-overlay';
    
    // Create modal content
    modalOverlay.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>Edit Play</h2>
                <button class="modal-close-btn">×</button>
            </div>
            <div class="modal-body">
                <form id="editPlayForm">
                    <input type="hidden" id="editPlayId" value="${play.id}">
                    
                    <div class="form-group">
                        <label for="editPlayName">Play Name *</label>
                        <input type="text" id="editPlayName" name="editPlayName" value="${play.name || ''}" required>
                    </div>

                    <div class="form-group">
                        <label for="editPlayDate">Date *</label>
                        <input type="date" id="editPlayDate" name="editPlayDate" value="${formattedDate}" required>
                    </div>

                    <div class="form-group">
                        <label for="editPlayTheatre">Theatre</label>
                        <input type="text" id="editPlayTheatre" name="editPlayTheatre" value="${play.theatre || ''}">
                    </div>

                    <div class="form-group">
                        <label>Rating</label>
                        <div class="rating-container">
                            <div class="star-rating edit-rating">
                                <input type="radio" id="editRating5" name="editRating" value="5" ${play.rating == '5' || play.rating == 5 ? 'checked' : ''}>
                                <label for="editRating5">★</label>
                                
                                <input type="radio" id="editRating4.5" name="editRating" value="4.5" ${play.rating == '4.5' || play.rating == 4.5 ? 'checked' : ''}>
                                <label for="editRating4.5">★</label>
                                
                                <input type="radio" id="editRating4" name="editRating" value="4" ${play.rating == '4' || play.rating == 4 ? 'checked' : ''}>
                                <label for="editRating4">★</label>
                                
                                <input type="radio" id="editRating3.5" name="editRating" value="3.5" ${play.rating == '3.5' || play.rating == 3.5 ? 'checked' : ''}>
                                <label for="editRating3.5">★</label>
                                
                                <input type="radio" id="editRating3" name="editRating" value="3" ${play.rating == '3' || play.rating == 3 ? 'checked' : ''}>
                                <label for="editRating3">★</label>
                                
                                <input type="radio" id="editRating2.5" name="editRating" value="2.5" ${play.rating == '2.5' || play.rating == 2.5 ? 'checked' : ''}>
                                <label for="editRating2.5">★</label>
                                
                                <input type="radio" id="editRating2" name="editRating" value="2" ${play.rating == '2' || play.rating == 2 ? 'checked' : ''}>
                                <label for="editRating2">★</label>
                                
                                <input type="radio" id="editRating1.5" name="editRating" value="1.5" ${play.rating == '1.5' || play.rating == 1.5 ? 'checked' : ''}>
                                <label for="editRating1.5">★</label>
                                
                                <input type="radio" id="editRating1" name="editRating" value="1" ${play.rating == '1' || play.rating == 1 ? 'checked' : ''}>
                                <label for="editRating1">★</label>
                            </div>
                            <div id="editStandingOvation" class="standing-ovation-btn ${play.rating === 'Standing Ovation' ? 'active' : ''}">
                                Standing Ovation 👏
                            </div>
                            <button type="button" id="clearRating" class="clear-rating-btn">Clear Rating</button>
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="editPlayImage">Image URL</label>
                        <input type="url" id="editPlayImage" name="editPlayImage" value="${play.image || ''}" placeholder="https://...">
                        <div class="image-preview" style="${play.image ? `background-image: url(${play.image}); background-size: cover; background-position: center; color: transparent;` : ''}">${play.image ? '' : 'Image preview will appear here'}</div>
                    </div>

                    <div class="form-actions">
                        <button type="submit" class="save-btn">Save Changes</button>
                        <button type="button" class="delete-btn">Delete Play</button>
                        <button type="button" class="cancel-btn">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    // Add modal to body
    document.body.appendChild(modalOverlay);
    
    // Show modal with animation
    setTimeout(() => {
        modalOverlay.classList.add('active');
    }, 10);
    
    // Set the rating properly after DOM is attached
    setTimeout(() => {
        // Handle rating display
        if (play.rating) {
            if (play.rating === 'Standing Ovation') {
                const standingOvationBtn = document.getElementById('editStandingOvation');
                if (standingOvationBtn) {
                    standingOvationBtn.classList.add('active');
                    // Disable star ratings
                    modalOverlay.querySelectorAll('.edit-rating input').forEach(input => {
                        input.disabled = true;
                    });
                }
            } else {
                // Try to find and check the appropriate rating radio
                const ratingStr = String(play.rating).replace('.0', ''); // Handle cases like '4.0' -> '4'
                const ratingOptions = ['1', '1.5', '2', '2.5', '3', '3.5', '4', '4.5', '5'];
                
                if (ratingOptions.includes(ratingStr)) {
                    const ratingInput = document.getElementById(`editRating${ratingStr}`);
                    if (ratingInput) {
                        ratingInput.checked = true;
                    }
                }
            }
        }
    }, 50);
    
    // Close modal function
    function closeModal() {
        modalOverlay.classList.remove('active');
        setTimeout(() => {
            modalOverlay.remove();
        }, 300); // Match transition duration
    }
    
    // Setup event listeners
    const closeBtn = modalOverlay.querySelector('.modal-close-btn');
    const cancelBtn = modalOverlay.querySelector('.cancel-btn');
    const deleteBtn = modalOverlay.querySelector('.delete-btn');
    const clearRatingBtn = modalOverlay.querySelector('#clearRating');
    const editForm = modalOverlay.querySelector('#editPlayForm');
    const imageInput = modalOverlay.querySelector('#editPlayImage');
    const imagePreview = modalOverlay.querySelector('.image-preview');
    const standingOvationBtn = modalOverlay.querySelector('#editStandingOvation');
    
    // Close modal events
    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    
    // Close on outside click
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });
    
    // Image preview functionality
    imageInput.addEventListener('input', () => {
        const url = imageInput.value;
        if (url && isValidUrl(url)) {
            const img = new Image();
            img.onload = () => {
                imagePreview.style.backgroundImage = `url(${url})`;
                imagePreview.style.backgroundSize = 'cover';
                imagePreview.style.backgroundPosition = 'center';
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
    standingOvationBtn.addEventListener('click', () => {
        const isActive = standingOvationBtn.classList.toggle('active');
        modalOverlay.querySelectorAll('.edit-rating input').forEach(input => {
            input.checked = false;
            input.disabled = isActive;
        });
    });
    
    // Clear rating button
    clearRatingBtn.addEventListener('click', () => {
        standingOvationBtn.classList.remove('active');
        modalOverlay.querySelectorAll('.edit-rating input').forEach(input => {
            input.checked = false;
            input.disabled = false;
        });
    });
    
    // Delete play
    deleteBtn.addEventListener('click', async () => {
        if (confirm('Are you sure you want to delete this play? This action cannot be undone.')) {
            try {
                const { error } = await supabaseClient
                    .from('plays')
                    .delete()
                    .eq('id', play.id);
                    
                if (error) throw error;
                
                closeModal();
                displayPlays(document.querySelector('.nav-link.active').id.replace('PlaysLink', ''));
            } catch (error) {
                console.error('Error deleting play:', error);
                alert('Error deleting play: ' + error.message);
            }
        }
    });
    
    // Handle form submission
    editForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = modalOverlay.querySelector('.save-btn');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Saving...';
        
        try {
            const selectedRating = modalOverlay.querySelector('input[name="editRating"]:checked');
            let rating = null;
            
            if (standingOvationBtn.classList.contains('active')) {
                rating = 'Standing Ovation';
            } else if (selectedRating) {
                rating = parseFloat(selectedRating.value);
            }
            
            const updatedPlay = {
                name: modalOverlay.querySelector('#editPlayName').value,
                date: modalOverlay.querySelector('#editPlayDate').value,
                theatre: modalOverlay.querySelector('#editPlayTheatre').value || null,
                rating: rating,
                image: modalOverlay.querySelector('#editPlayImage').value || null
            };
            
            const { error } = await supabaseClient
                .from('plays')
                .update(updatedPlay)
                .eq('id', play.id);
                
            if (error) throw error;
            
            closeModal();
            displayPlays(document.querySelector('.nav-link.active').id.replace('PlaysLink', ''));
        } catch (error) {
            console.error('Error updating play:', error);
            alert('Error updating play: ' + error.message);
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Save Changes';
        }
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

// Add this function to display the dedicated calendar section
async function displayCalendarSection() {
    console.log("Displaying calendar section");
    const playGrid = document.querySelector('.play-grid');
    const calendarContainer = document.querySelector('.calendar-container');
    
    // Update active nav link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    document.getElementById('calendarLink').classList.add('active');
    
    // Hide play grid and show calendar
    if (playGrid) playGrid.style.display = 'none';
    if (calendarContainer) {
        calendarContainer.style.display = 'block';
        
        // Fetch all plays for the calendar
        try {
            const plays = await fetchPlays();
            if (plays && plays.length > 0) {
                renderUnifiedCalendar(plays);
            } else {
                calendarContainer.innerHTML = '<p class="no-plays-message">No plays available to display on calendar</p>';
            }
        } catch (error) {
            console.error('Error fetching plays for calendar:', error);
            calendarContainer.innerHTML = '<p class="error-message">Error loading calendar</p>';
        }
    }
}

// Make sure this function exists and is modified to accept plays as a parameter if needed
async function renderUnifiedCalendar(plays) {
    const calendarContainer = document.querySelector('.calendar-container');
    
    // If plays parameter is not provided, fetch them
    if (!plays) {
        try {
            plays = await fetchPlays();
            if (!plays || plays.length === 0) {
                calendarContainer.innerHTML = '<p>No plays available to display on calendar</p>';
                return;
            }
        } catch (error) {
            console.error('Error fetching plays for calendar:', error);
            calendarContainer.innerHTML = '<p>Error loading calendar</p>';
            return;
        }
    }
    
    // Calendar rendering code - using current implementation
    // ... 
    // Your existing calendar rendering code
    const currentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    
    // Generate calendar HTML
    calendarContainer.innerHTML = `
        <div class="calendar-header">
            <div class="calendar-nav">
                <button id="prevMonth">&lt; Previous</button>
                <div class="calendar-month">${currentMonth.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}</div>
                <button id="nextMonth">Next &gt;</button>
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
    
    // Get calendar grid for adding days
    const calendarGrid = calendarContainer.querySelector('.calendar-grid');
    
    // Add event listeners for navigation buttons
    document.getElementById('prevMonth').addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderUnifiedCalendar(plays);
    });
    
    document.getElementById('nextMonth').addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderUnifiedCalendar(plays);
    });
    
    // Add days from previous month to fill first row
    const firstDay = new Date(currentMonth).getDay();
    const prevMonthLastDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate();
    
    for (let i = 0; i < firstDay; i++) {
        const dayNum = prevMonthLastDay - firstDay + i + 1;
        const dayDiv = document.createElement('div');
        dayDiv.className = 'calendar-day other-month';
        dayDiv.innerHTML = `<div class="calendar-day-number">${dayNum}</div>`;
        calendarGrid.appendChild(dayDiv);
    }
    
    // Add days for current month
    const today = new Date();
    for (let day = 1; day <= lastDay.getDate(); day++) {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        const isToday = date.getDate() === today.getDate() && 
                       date.getMonth() === today.getMonth() && 
                       date.getFullYear() === today.getFullYear();
        
        // Find plays for this day
        const daysPlays = plays.filter(play => {
            const playDate = new Date(play.date);
            return playDate.getDate() === date.getDate() && 
                   playDate.getMonth() === date.getMonth() && 
                   playDate.getFullYear() === date.getFullYear();
        });
        
        const dayDiv = document.createElement('div');
        dayDiv.className = `calendar-day${isToday ? ' today' : ''}${daysPlays.length ? ' has-plays' : ''}`;
        dayDiv.innerHTML = `<div class="calendar-day-number">${day}</div>`;
        
        // Add plays for this day
        daysPlays.forEach(play => {
            const now = new Date();
            const playDate = new Date(play.date);
            const isPastPlay = playDate < now;
            
            const playDiv = document.createElement('div');
            playDiv.className = `calendar-play ${isPastPlay ? 'past-play' : 'upcoming-play'}`;
            playDiv.innerHTML = `
                <div class="play-title">${play.name}</div>
                ${play.theatre ? `<div class="play-theatre">${play.theatre}</div>` : ''}
                ${play.rating ? `<div class="play-rating">Rating: ${play.rating}</div>` : ''}
            `;
            
            // Make the play card clickable
            playDiv.addEventListener('click', () => {
                editPlay(play.id);
            });
            
            dayDiv.appendChild(playDiv);
        });
        
        calendarGrid.appendChild(dayDiv);
    }
    
    // Add days from next month to complete the grid
    const daysAdded = firstDay + lastDay.getDate();
    const remainingDays = 7 - (daysAdded % 7);
    if (remainingDays < 7) {
        for (let i = 1; i <= remainingDays; i++) {
            const dayDiv = document.createElement('div');
            dayDiv.className = 'calendar-day other-month';
            dayDiv.innerHTML = `<div class="calendar-day-number">${i}</div>`;
            calendarGrid.appendChild(dayDiv);
        }
    }
}

// Make sure the calendar styles are included
// If not already added, add them here