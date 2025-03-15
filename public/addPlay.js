console.log("addPlay.js is loading");

function setupFormHandlers() {
    console.log('Setting up form handlers');
    const form = document.getElementById('addPlayForm');
    
    // First, remove the form and replace it with a fresh copy to clear all event listeners
    const newForm = form.cloneNode(true);
    form.parentNode.replaceChild(newForm, form);
    
    const imageInput = newForm.querySelector('#playImage');
    const imagePreview = newForm.querySelector('.image-preview');
    const standingOvationBtn = newForm.querySelector('#standingOvation');

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
        newForm.querySelectorAll('.star-rating input').forEach(input => {
            input.checked = false;
            input.disabled = isActive;
        });
    });

    // Form submission - using the newForm reference
    let isSubmitting = false;
    
    newForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (isSubmitting) return;
        isSubmitting = true;
        
        const submitButton = newForm.querySelector('.submit-btn');
        submitButton.disabled = true;
        submitButton.textContent = 'Adding...';
        
        try {
            const selectedRating = newForm.querySelector('input[name="rating"]:checked');
            const rating = standingOvationBtn.classList.contains('active') ? 5 : 
                          (selectedRating ? parseFloat(selectedRating.value) : null);

            const formData = {
                name: newForm.playName.value,
                date: newForm.playDate.value,
                theatre: newForm.playTheatre.value || null,
                rating: rating,
                image: newForm.playImage.value && isValidUrl(newForm.playImage.value) ? newForm.playImage.value : null
            };

            await addPlay(formData);
            console.log('Play added successfully');
            newForm.reset();
            hideAddPlayForm();
            displayPlays('all');
        } catch (error) {
            console.error('Error adding play:', error);
            alert('Error adding play: ' + error.message);
        } finally {
            isSubmitting = false;
            submitButton.disabled = false;
            submitButton.textContent = 'Add Play';
        }
    });
}

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
    if (addPlayForm) addPlayForm.style.display = 'none';
    displayPlays('all');
}

function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

// Add form styles
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

// Export functions
window.showAddPlayForm = showAddPlayForm;
window.hideAddPlayForm = hideAddPlayForm;
window.setupFormHandlers = setupFormHandlers; 