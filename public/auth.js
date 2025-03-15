// Wait for Supabase to be available
document.addEventListener('DOMContentLoaded', () => {
    console.log('Page loaded, initializing Supabase...');
    
    // Initialize Supabase client
    try {
        const { createClient } = supabase;
        const supabaseClient = createClient(
            'https://virgvvmipstwvnplagcf.supabase.co',
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZpcmd2dm1pcHN0d3ZucGxhZ2NmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE5NzE4MDAsImV4cCI6MjA1NzU0NzgwMH0.neoOaD3gOloh6o0yYu-Yerqhg-2Tj_DTJan-fh45gQ0'
        );

        // Test the connection first
        async function testConnection() {
            try {
                const { data, error } = await supabaseClient
                    .from('plays')
                    .select('count');
                
                console.log('Connection test:', { data, error });
                return !error;
            } catch (e) {
                console.error('Connection test failed:', e);
                return false;
            }
        }

        // Fetch plays from Supabase
        async function fetchPlays() {
            try {
                console.log('Testing connection first...');
                const isConnected = await testConnection();
                
                if (!isConnected) {
                    console.error('Failed to connect to Supabase');
                    return;
                }

                console.log('Fetching plays...');
                const { data: plays, error } = await supabaseClient
                    .from('plays')
                    .select('*');

                // Log everything about the response
                console.log('Full Supabase Response:', {
                    plays,
                    error,
                    hasData: Boolean(plays),
                    dataLength: plays ? plays.length : 0,
                    typeof: typeof plays
                });

                if (error) {
                    console.error('Supabase error:', error);
                    throw error;
                }

                if (!plays) {
                    console.error('No data returned from Supabase');
                    return;
                }

                if (plays.length === 0) {
                    console.log('Query successful but no plays found in the database');
                    return;
                }

                console.log('Successfully fetched plays:', plays);
                displayPlays(plays);
            } catch (error) {
                console.error('Error fetching plays:', error.message);
                console.error('Full error:', error);
            }
        }

        // Display plays in the grid
        function displayPlays(plays) {
            console.log('Displaying plays...');
            const playGrid = document.querySelector('.play-grid');
            if (!playGrid) {
                console.error('Could not find .play-grid element');
                return;
            }

            playGrid.innerHTML = plays.map(play => {
                // Handle missing or null values
                const name = play.name || 'Untitled Play';
                const theatre = play.theatre || 'Theatre TBA';
                const rating = play.rating || 'Not Rated';
                const imageUrl = play.image || 'https://placehold.co/400x300?text=No+Image';
                const formattedDate = play.date ? 
                    new Date(play.date).toLocaleDateString() : 
                    'Date TBA';

                console.log('Processing play:', { name, theatre, rating, imageUrl, date: formattedDate });

                return `
                    <div class="play-card">
                        <img src="${imageUrl}" 
                             alt="${name}" 
                             class="play-image" 
                             onerror="this.src='https://placehold.co/400x300?text=Error+Loading+Image'">
                        <div class="play-content">
                            <h2 class="play-title">${name}</h2>
                            <p class="play-theatre">${theatre}</p>
                            <p class="play-date">${formattedDate}</p>
                            <p class="play-rating">Rating: ${rating}</p>
                        </div>
                    </div>
                `;
            }).join('');
        }

        // Call fetchPlays
        console.log('Initialized, fetching plays...');
        fetchPlays();

        // Auth functions
        window.signInWithGoogle = async function() {
            try {
                const { data, error } = await supabaseClient.auth.signInWithOAuth({
                    provider: 'google'
                });
                
                if (error) throw error;
            } catch (error) {
                console.error('Error signing in:', error.message);
            }
        }

        window.signOut = async function() {
            try {
                const { error } = await supabaseClient.auth.signOut();
                if (error) throw error;
            } catch (error) {
                console.error('Error signing out:', error.message);
            }
        }

    } catch (error) {
        console.error('Error initializing Supabase:', error);
    }
});

function showLoggedInState(user) {
    const userInfo = document.getElementById('userInfo');
    userInfo.innerHTML = `Welcome, ${user.email}!`;
    userInfo.style.display = 'block';
    
    document.getElementById('signInBtn').style.display = 'none';
    document.getElementById('signOutBtn').style.display = 'block';
}

function showLoggedOutState() {
    document.getElementById('userInfo').style.display = 'none';
    document.getElementById('signOutBtn').style.display = 'none';
    document.getElementById('signInBtn').style.display = 'block';
}

function processImageUrl(imageUrl, base64Data) {
  const MAX_BASE64_LENGTH = 1000000; // Adjust as needed

  if (base64Data && base64Data.length > MAX_BASE64_LENGTH) {
    console.warn('Base64 image data too long');
    return fallbackImageUrl;
  }

  try {
    if (!isValidImageUrl(imageUrl)) {
      return fallbackImageUrl;
    }
    return imageUrl;
  } catch (err) {
    console.error('Error processing image:', err);
    return 'https://placehold.co/400x300?text=Error+Loading+Image';
  }
}

function isValidImageUrl(url) {
  return url && (
    url.startsWith('http') || 
    url.startsWith('data:image')
  );
} 