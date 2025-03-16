console.log("database.js is loading");

// Initialize Supabase client for database operations
const dbClient = supabase.createClient(
    'https://virgvvmipstwvnplagcf.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZpcmd2dm1pcHN0d3ZucGxhZ2NmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE5NzE4MDAsImV4cCI6MjA1NzU0NzgwMH0.neoOaD3gOloh6o0yYu-Yerqhg-2Tj_DTJan-fh45gQ0'
);

// Function to fetch all plays
async function fetchPlays() {
    try {
        const { data, error } = await dbClient
            .from('plays')
            .select('*')
            .order('date', { ascending: false });

        if (error) throw error;
        return data || [];

    } catch (error) {
        console.error('Error fetching plays:', error);
        return [];
    }
}

// Function to fetch upcoming plays
async function fetchUpcomingPlays() {
    try {
        const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
        
        const { data, error } = await dbClient
            .from('plays')
            .select('*')
            .gte('date', today) // Get plays with date greater than or equal to today
            .order('date', { ascending: true });

        if (error) throw error;
        return data || [];

    } catch (error) {
        console.error('Error fetching upcoming plays:', error);
        return [];
    }
}

// Function to fetch hall of fame plays
async function fetchHallOfFamePlays() {
    try {
        const { data, error } = await dbClient
            .from('plays')
            .select('*')
            .or('rating.eq.5,rating.eq.Standing Ovation')
            .order('date', { ascending: false });

        if (error) throw error;
        return data || [];

    } catch (error) {
        console.error('Error fetching hall of fame plays:', error);
        return [];
    }
}

// Function to fetch hall of shame plays
async function fetchHallOfShamePlays() {
    try {
        const { data, error } = await dbClient
            .from('plays')
            .select('*')
            .or('rating.eq.1,rating.eq.2')
            .order('date', { ascending: false });

        if (error) throw error;
        return data || [];

    } catch (error) {
        console.error('Error fetching hall of shame plays:', error);
        return [];
    }
}

// Function to fetch seen plays (plays in the past)
async function fetchSeenPlays() {
    try {
        const today = new Date().toISOString().split('T')[0];
        
        const { data, error } = await dbClient
            .from('plays')
            .select('*')
            .lt('date', today)  // Get plays with date less than today
            .order('date', { ascending: false });  // Most recent first

        if (error) throw error;
        return data || [];

    } catch (error) {
        console.error('Error fetching seen plays:', error);
        return [];
    }
}

// Replace simple toast with enhanced version
// After inserting the play and before returning the result,
// add this code where you have "Play added successfully: null"

// Format date for display
const formattedDate = new Date(formData.date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric', 
    month: 'long',
    day: 'numeric'
});

// Format rating for display
let displayRating = 'Not Rated';
if (formData.rating) {
    if (formData.rating === 'Standing Ovation' || formData.rating === 6) {
        displayRating = 'Standing Ovation';
    } else {
        const ratingValue = typeof formData.rating === 'string' ? 
            parseFloat(formData.rating) : formData.rating;
        
        if (!isNaN(ratingValue)) {
            displayRating = `${ratingValue} ${ratingValue === 1 ? 'Moon' : 'Moons'}`;
        }
    }
}

// Show enhanced toast with play details
showToast({
    title: 'Play Added Successfully',
    message: `"${formData.name}" has been added to your collection!`,
    type: 'success',
    duration: 5000,
    details: {
        'Play': formData.name,
        'Date': formattedDate,
        'Theatre': formData.theatre || 'Not specified',
        'Rating': displayRating,
        'Image': formData.image ? 'Yes' : 'No'
    }
});