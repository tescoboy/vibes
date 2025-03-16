console.log("add-play.js is loading");

// Make sure we have access to the Supabase client
if (typeof supabase === 'undefined') {
    console.error('Supabase client not initialized');
}

function showAddPlayForm() {
    const playGrid = document.querySelector('.play-grid');
    const calendarContainer = document.querySelector('.calendar-container');
    
    // Hide other containers
    if (calendarContainer) calendarContainer.style.display = 'none';

    playGrid.innerHTML = `
        <div class="add-play-container">
            <h2>Add New Play</h2>
            <form id="addPlayForm" onsubmit="handleAddPlay(event); console.log('Form submitted via onsubmit')">
                <div class="form-group required">
                    <label for="playName">Play Name</label>
                    <input type="text" id="playName" name="playName" required>
                    <div class="required-indicator">*</div>
                </div>

                <div class="form-group required">
                    <label for="playDate">Date</label>
                    <input type="date" id="playDate" name="playDate" required>
                    <div class="required-indicator">*</div>
                </div>

                <div class="form-group">
                    <label for="playTheatre">Theatre</label>
                    <input type="text" id="playTheatre" name="playTheatre">
                </div>

                <div class="form-group">
                    <label for="playRating">Rating</label>
                    <select id="playRating" name="playRating">
                        <option value="">Select Rating</option>
                        <option value="1">1 ★</option>
                        <option value="1.5">1.5 ★</option>
                        <option value="2">2 ★</option>
                        <option value="2.5">2.5 ★</option>
                        <option value="3">3 ★</option>
                        <option value="3.5">3.5 ★</option>
                        <option value="4">4 ★</option>
                        <option value="4.5">4.5 ★</option>
                        <option value="5">5 ★</option>
                        <option value="6">Standing Ovation 🌟</option>
                    </select>
                </div>

                <button type="submit" class="submit-button">Add Play</button>
            </form>
        </div>
    `;

    // Add styles
    if (!document.getElementById('add-play-styles')) {
        const styles = document.createElement('style');
        styles.id = 'add-play-styles';
        styles.textContent = `
            .add-play-container {
                max-width: 600px;
                margin: 2rem auto;
                padding: 2rem;
                background: white;
                border-radius: 16px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.08);
            }

            .add-play-container h2 {
                color: #333;
                margin-bottom: 2rem;
                text-align: center;
            }

            .form-group {
                margin-bottom: 1.5rem;
                position: relative;
            }

            .form-group.required label {
                font-weight: 600;
            }

            .required-indicator {
                color: #e53935;
                position: absolute;
                top: 0;
                right: -10px;
            }

            .form-group label {
                display: block;
                margin-bottom: 0.5rem;
                color: #555;
            }

            .form-group input,
            .form-group select {
                width: 100%;
                padding: 0.75rem;
                border: 2px solid #e0e0e0;
                border-radius: 8px;
                font-size: 1rem;
                transition: border-color 0.3s;
            }

            .form-group input:focus,
            .form-group select:focus {
                border-color: #4285f4;
                outline: none;
            }

            .form-group.required input:invalid {
                border-color: #e53935;
            }

            .submit-button {
                width: 100%;
                padding: 1rem;
                background: #4285f4;
                color: white;
                border: none;
                border-radius: 8px;
                font-size: 1rem;
                font-weight: 600;
                cursor: pointer;
                transition: background-color 0.3s;
            }

            .submit-button:hover {
                background: #3367d6;
            }

            /* Date picker styling */
            input[type="date"] {
                appearance: none;
                -webkit-appearance: none;
                background: white;
                padding-right: 2rem;
                cursor: pointer;
            }

            input[type="date"]::-webkit-calendar-picker-indicator {
                color: #555;
                cursor: pointer;
            }

            /* Select styling */
            select {
                cursor: pointer;
                appearance: none;
                -webkit-appearance: none;
                background: white url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23555' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E") no-repeat right 0.75rem center;
                padding-right: 2.5rem;
            }
        `;
        document.head.appendChild(styles);
    }
}

async function handleAddPlay(event) {
    console.log('🔍 handleAddPlay triggered');
    event.preventDefault();
    
    const formData = {
        name: document.getElementById('playName').value,
        date: document.getElementById('playDate').value,
        theatre: document.getElementById('playTheatre').value || null,
        rating: document.getElementById('ratingValue').value ? parseFloat(document.getElementById('ratingValue').value) : null
    };
    
    console.log('📋 Form data collected:', formData);

    try {
        console.log('🔄 Attempting to insert play into database...');
        const { data, error } = await supabase
            .from('plays')
            .insert([formData]);

        if (error) {
            console.error('❌ Supabase error:', error);
            throw error;
        }

        console.log('✅ Play added successfully to database!');
        
        // Format date for display
        const formattedDate = new Date(formData.date).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        console.log('📅 Formatted date:', formattedDate);

        // Format rating for display
        let displayRating = 'Not Rated';
        if (formData.rating && formData.rating !== '') {
            displayRating = formData.rating === 'Standing Ovation' 
                ? 'Standing Ovation' 
                : `${formData.rating} ${formData.rating === '1' ? 'Moon' : 'Moons'}`;
        }
        console.log('⭐ Formatted rating:', displayRating);

        // Show success toast
        console.log('🍞 Attempting to show toast notification...');
        console.log('🧪 Testing if showToast exists:', typeof showToast);
        
        try {
            showToast({
                title: 'Play Added',
                message: `${formData.name} has been added to your collection!`,
                type: 'success',
                duration: 6000,
                details: {
                    'Play': formData.name,
                    'Date': formattedDate,
                    'Theatre': formData.theatre || 'Not specified',
                    'Rating': displayRating
                }
            });
            console.log('🎉 Toast notification successfully triggered!');
        } catch (toastError) {
            console.error('❌ Error showing toast:', toastError);
        }

        // Show traditional alert as fallback
        alert('Play added successfully!');
        
        // Reset and close form
        console.log('🧹 Resetting form and redirecting...');
        document.getElementById('addPlayForm').reset();
        document.getElementById('ratingValue').value = '';
        hideAddPlayForm();
        displayPlays('all');
        
    } catch (error) {
        console.error('❌ Error in handleAddPlay:', error);
        alert(`Error adding play: ${error.message}`);
    }
}

// Make sure this event handler isn't causing conflict
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔍 DOM Content Loaded - Setting up form handlers');
    
    // Create a simple test function in global scope
    window.testToastFunction = function() {
        console.log('🧪 Test toast function called');
        
        if (typeof showToast === 'function') {
            console.log('✅ showToast is a function');
            showToast({
                title: 'Test Toast',
                message: 'This is a test notification',
                type: 'info',
                duration: 3000
            });
        } else {
            console.error('❌ showToast is not a function. Type:', typeof showToast);
            alert('Toast function not available');
        }
    };
    
    // Add a global test button on the page
    const globalTestBtn = document.createElement('button');
    globalTestBtn.textContent = 'Test Global Toast';
    globalTestBtn.style.position = 'fixed';
    globalTestBtn.style.bottom = '10px';
    globalTestBtn.style.left = '10px';
    globalTestBtn.style.zIndex = '9999';
    globalTestBtn.style.padding = '10px';
    globalTestBtn.style.background = '#ff9800';
    globalTestBtn.style.color = 'white';
    globalTestBtn.style.border = 'none';
    globalTestBtn.style.borderRadius = '4px';
    globalTestBtn.onclick = window.testToastFunction;
    document.body.appendChild(globalTestBtn);
    
    // Get the form element and check if it exists
    const addPlayForm = document.getElementById('addPlayForm');
    console.log('📝 Add Play Form found?', !!addPlayForm);
    
    if (addPlayForm) {
        console.log('🔄 Adding submit event listener to form');
        
        // Verify current handlers
        const existingHandlers = addPlayForm.getAttribute('onsubmit');
        console.log('ℹ️ Existing form onsubmit:', existingHandlers);
        
        // Add submit event listener
        addPlayForm.addEventListener('submit', function(event) {
            console.log('📢 Form submit event triggered');
            handleAddPlay(event);
        });
    }
}); 