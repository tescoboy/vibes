console.log("google-auth.js is loading");

// Use the global supabaseClient
if (window.supabaseClient) {
    window.supabaseClient.auth.onAuthStateChange((event, session) => {
        console.log('Auth state changed:', event, session);
    });
}

// Initialize Firebase Auth
async function initializeAuth() {
    try {
        // Check if user is already signed in
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        if (session) {
            console.log("User is already signed in:", session);
            updateAuthUI(session);
        }
        
        console.log("Auth initialized");
    } catch (error) {
        console.error("Error initializing auth:", error);
    }
}

// Helper function to update UI
function updateAuthUI(session) {
    const signInBtn = document.getElementById('signInBtn');
    const signOutBtn = document.getElementById('signOutBtn');
    const userInfo = document.getElementById('userInfo');
    
    if (session) {
        signInBtn.style.display = 'none';
        signOutBtn.style.display = 'block';
        userInfo.style.display = 'block';
        userInfo.textContent = session.user.email;
    } else {
        signInBtn.style.display = 'block';
        signOutBtn.style.display = 'none';
        userInfo.style.display = 'none';
    }
}

// Sign in with Google
async function handleSignInWithGoogle(response) {
    try {
        const { data, error } = await supabaseClient.auth.signInWithIdToken({
            provider: 'google',
            token: response.credential,
        });

        if (error) throw error;
        
        // Update UI after successful sign in
        const signInBtn = document.getElementById('signInBtn');
        const signOutBtn = document.getElementById('signOutBtn');
        const userInfo = document.getElementById('userInfo');

        if (data.user) {
            if (signInBtn) signInBtn.style.display = 'none';
            if (signOutBtn) signOutBtn.style.display = 'block';
            if (userInfo) {
                userInfo.style.display = 'block';
                userInfo.textContent = `Welcome, ${data.user.email}!`;
            }
        }
    } catch (error) {
        console.error('Error signing in with Google:', error);
    }
}

// Sign out
async function signOut() {
    try {
        const { error } = await supabaseClient.auth.signOut();
        if (error) throw error;

        // Update UI after sign out
        const signInBtn = document.getElementById('signInBtn');
        const signOutBtn = document.getElementById('signOutBtn');
        const userInfo = document.getElementById('userInfo');

        if (signInBtn) signInBtn.style.display = 'block';
        if (signOutBtn) signOutBtn.style.display = 'none';
        if (userInfo) userInfo.style.display = 'none';
    } catch (error) {
        console.error('Error signing out:', error);
    }
}

// Initialize auth when the page loads
document.addEventListener('DOMContentLoaded', initializeAuth); 