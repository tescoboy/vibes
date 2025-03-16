console.log("display-functions.js is loading");

// Global variables for table view
let currentPlays = []; // Holds the current set of plays
let filteredPlays = []; // Holds filtered plays after search
let currentPage = 1;
let pageSize = 10;
let sortColumn = 1; // Default sort by date
let sortDirection = 'desc'; // Default sort direction

// Function to display plays
async function displayPlays(section = 'all') {
    const playGrid = document.querySelector('.play-grid');
    const calendarContainer = document.querySelector('.calendar-container');
    const statsContainer = document.querySelector('.stats-container');
    
    // Clear/hide all containers
    if (playGrid) playGrid.innerHTML = '';
    if (calendarContainer) calendarContainer.style.display = 'none';
    if (statsContainer) statsContainer.remove();

    // Update active nav link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // Set active nav and show/hide toggles
    const navLink = document.getElementById(`${section}PlaysLink`);
    if (navLink) {
        if (section === 'hallOfShame') {
            document.getElementById('hallOfFamePlaysLink').classList.add('active');
        } else {
            navLink.classList.add('active');
        }
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

// Function to switch between grid and table views
function switchViewMode(mode) {
  // Update buttons
  document.querySelectorAll('.view-mode-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  document.querySelector(`.view-mode-btn[data-mode="${mode}"]`).classList.add('active');
  
  // Show/hide relevant containers
  if (mode === 'table') {
    document.querySelector('.plays-table-container').style.display = 'block';
    document.querySelector('.play-grid').style.display = 'none';
    
    // If we're switching to table view, make sure the table is populated
    renderTableView();
  } else {
    document.querySelector('.plays-table-container').style.display = 'none';
    document.querySelector('.play-grid').style.display = 'grid';
  }
}

// Function to populate the table with plays
function renderTableView() {
  // Get the table body
  const tableBody = document.getElementById('plays-table-body');
  tableBody.innerHTML = ''; // Clear existing rows
  
  // Apply current sort
  sortFilteredPlays();
  
  // Calculate pagination
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, filteredPlays.length);
  
  // Update pagination display
  document.getElementById('startEntry').textContent = filteredPlays.length > 0 ? startIndex + 1 : 0;
  document.getElementById('endEntry').textContent = endIndex;
  document.getElementById('totalEntries').textContent = filteredPlays.length;
  
  // Enable/disable pagination buttons
  document.getElementById('prevPageBtn').disabled = currentPage === 1;
  document.getElementById('nextPageBtn').disabled = endIndex >= filteredPlays.length;
  
  // Render pagination numbers
  renderPaginationNumbers();
  
  // Render the visible plays for this page
  for (let i = startIndex; i < endIndex; i++) {
    const play = filteredPlays[i];
    
    // Create table row
    const row = document.createElement('tr');
    
    // Format date
    const playDate = new Date(play.date);
    const formattedDate = playDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
    
    // Format rating
    let ratingDisplay = 'Not Rated';
    if (play.rating) {
      if (play.rating === 'Standing Ovation' || play.rating === 6) {
        ratingDisplay = '<span class="standing-ovation-display"><i class="fa-solid fa-person"></i> Standing Ovation</span>';
      } else {
        ratingDisplay = `<div class="table-rating">`;
        const rating = parseFloat(play.rating);
        const fullMoons = Math.floor(rating);
        const hasHalfMoon = rating % 1 !== 0;
        
        // Add full moons
        for (let i = 0; i < fullMoons; i++) {
          ratingDisplay += '<span class="moon moon-full"><i class="fa-solid fa-moon"></i></span>';
        }
        
        // Add half moon if needed
        if (hasHalfMoon) {
          ratingDisplay += '<span class="moon moon-half"><i class="fa-regular fa-moon"></i></span>';
        }
        
        ratingDisplay += `</div>`;
      }
    }
    
    // Create row content
    row.innerHTML = `
      <td>${play.name}</td>
      <td>${formattedDate}</td>
      <td>${play.theatre || 'N/A'}</td>
      <td>${ratingDisplay}</td>
      <td>
        <div class="table-actions">
          <button class="table-edit-btn" onclick="editPlay('${play.id}')">
            <i class="fa-solid fa-edit"></i> Edit
          </button>
        </div>
      </td>
    `;
    
    tableBody.appendChild(row);
  }
}

// Function to sort the table
function sortTable(columnIndex) {
  // If clicking the same column, toggle direction
  if (sortColumn === columnIndex) {
    sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
  } else {
    // New column, default to ascending
    sortColumn = columnIndex;
    sortDirection = 'asc';
  }
  
  // Update sort indicators in UI
  updateSortIndicators();
  
  // Re-render the table
  renderTableView();
}

// Update sort indicators
function updateSortIndicators() {
  // Reset all icons
  document.querySelectorAll('.plays-table th i').forEach(icon => {
    icon.className = 'fa-solid fa-sort';
  });
  
  // Set the active sort column icon
  const headerIcons = document.querySelectorAll('.plays-table th i');
  if (headerIcons[sortColumn]) {
    headerIcons[sortColumn].className = sortDirection === 'asc' 
      ? 'fa-solid fa-sort-up' 
      : 'fa-solid fa-sort-down';
  }
}

// Sort the filtered plays array
function sortFilteredPlays() {
  filteredPlays.sort((a, b) => {
    let valueA, valueB;
    
    // Determine which values to compare based on column
    switch(sortColumn) {
      case 0: // Play Name
        valueA = a.name.toLowerCase();
        valueB = b.name.toLowerCase();
        break;
      case 1: // Date
        valueA = new Date(a.date);
        valueB = new Date(b.date);
        break;
      case 2: // Theatre
        valueA = (a.theatre || '').toLowerCase();
        valueB = (b.theatre || '').toLowerCase();
        break;
      case 3: // Rating
        valueA = parseFloat(a.rating) || 0;
        valueB = parseFloat(b.rating) || 0;
        
        // Handle "Standing Ovation" as highest rating
        if (a.rating === 'Standing Ovation') valueA = 6;
        if (b.rating === 'Standing Ovation') valueB = 6;
        break;
      default:
        return 0;
    }
    
    // Compare the values
    if (valueA < valueB) {
      return sortDirection === 'asc' ? -1 : 1;
    }
    if (valueA > valueB) {
      return sortDirection === 'asc' ? 1 : -1;
    }
    return 0;
  });
}

// Filter plays based on search input
function filterPlays() {
  const searchTerm = document.getElementById('playSearchInput').value.toLowerCase();
  
  if (searchTerm === '') {
    filteredPlays = [...currentPlays];
  } else {
    filteredPlays = currentPlays.filter(play => {
      return (
        play.name.toLowerCase().includes(searchTerm) || 
        (play.theatre && play.theatre.toLowerCase().includes(searchTerm))
      );
    });
  }
  
  // Reset to first page when filtering
  currentPage = 1;
  
  // Re-render the table
  renderTableView();
}

// Change number of entries per page
function changePageSize() {
  pageSize = parseInt(document.getElementById('entriesPerPage').value);
  currentPage = 1; // Reset to first page
  renderTableView();
}

// Pagination functions
function previousPage() {
  if (currentPage > 1) {
    currentPage--;
    renderTableView();
  }
}

function nextPage() {
  const maxPage = Math.ceil(filteredPlays.length / pageSize);
  if (currentPage < maxPage) {
    currentPage++;
    renderTableView();
  }
}

function goToPage(page) {
  currentPage = page;
  renderTableView();
}

// Render pagination number buttons
function renderPaginationNumbers() {
  const container = document.getElementById('paginationNumbers');
  container.innerHTML = '';
  
  const maxPage = Math.ceil(filteredPlays.length / pageSize);
  const maxVisiblePages = 5;
  
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(maxPage, startPage + maxVisiblePages - 1);
  
  // Adjust if we're near the end
  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }
  
  // First page
  if (startPage > 1) {
    const firstPage = document.createElement('div');
    firstPage.className = 'page-number';
    firstPage.textContent = '1';
    firstPage.onclick = () => goToPage(1);
    container.appendChild(firstPage);
    
    if (startPage > 2) {
      const ellipsis = document.createElement('div');
      ellipsis.className = 'page-ellipsis';
      ellipsis.textContent = '...';
      container.appendChild(ellipsis);
    }
  }
  
  // Page numbers
  for (let i = startPage; i <= endPage; i++) {
    const pageNumber = document.createElement('div');
    pageNumber.className = 'page-number' + (i === currentPage ? ' active' : '');
    pageNumber.textContent = i;
    pageNumber.onclick = () => goToPage(i);
    container.appendChild(pageNumber);
  }
  
  // Last page
  if (endPage < maxPage) {
    if (endPage < maxPage - 1) {
      const ellipsis = document.createElement('div');
      ellipsis.className = 'page-ellipsis';
      ellipsis.textContent = '...';
      container.appendChild(ellipsis);
    }
    
    const lastPage = document.createElement('div');
    lastPage.className = 'page-number';
    lastPage.textContent = maxPage;
    lastPage.onclick = () => goToPage(maxPage);
    container.appendChild(lastPage);
  }
}

// Modify the existing displayPlays function to handle table view
const originalDisplayPlays = window.displayPlays || function(){};

window.displayPlays = function(displayMode) {
  // Call the original function first
  originalDisplayPlays(displayMode);
  
  // If we're showing all plays and table view is active
  if (displayMode === 'all' && document.querySelector('.view-mode-btn.active').dataset.mode === 'table') {
    // Store the plays in our global variable
    fetchPlays().then(plays => {
      currentPlays = plays;
      filteredPlays = [...plays];
      renderTableView();
    });
  }
};

// Initialize table view when page loads
document.addEventListener('DOMContentLoaded', function() {
  // Set default view mode to table for 'all' section
  const viewModeButtons = document.querySelectorAll('.view-mode-btn');
  
  if (viewModeButtons.length > 0) {
    // Initially, check URL to see what section we're on
    const currentUrl = window.location.href;
    if (currentUrl.includes('all') || !currentUrl.includes('upcoming') && !currentUrl.includes('seen') && !currentUrl.includes('hallOfFame')) {
      switchViewMode('table');
    }
    
    // Add event listeners to view mode toggle buttons
    viewModeButtons.forEach(btn => {
      btn.addEventListener('click', function() {
        switchViewMode(this.dataset.mode);
      });
    });
  }
}); 