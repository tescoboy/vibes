console.log("stats-view.js is loading");

// Stats styling
const statsStyle = document.createElement('style');
statsStyle.textContent = `
    .stats-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 2rem;
    }

    .stats-header {
        text-align: center;
        margin-bottom: 3rem;
    }

    .stats-header h1 {
        font-size: 2.5rem;
        color: #333;
        margin-bottom: 1rem;
    }

    .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 2rem;
        margin-bottom: 3rem;
    }

    .stat-card {
        background: white;
        border-radius: 12px;
        padding: 2rem;
        text-align: center;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        transition: transform 0.3s ease;
    }

    .stat-card:hover {
        transform: translateY(-5px);
    }

    .stat-number {
        font-size: 3.5rem;
        font-weight: bold;
        margin: 1rem 0;
        background: linear-gradient(45deg, #4285f4, #34a853);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }

    .stat-label {
        font-size: 1.2rem;
        color: #666;
        margin-bottom: 1rem;
    }

    .stat-description {
        font-size: 0.9rem;
        color: #888;
        line-height: 1.4;
    }

    .stats-footer {
        text-align: center;
        color: #666;
        font-size: 0.9rem;
        margin-top: 2rem;
    }
`;

document.head.appendChild(statsStyle);

// Function to display stats
async function displayStats() {
    const mainContent = document.querySelector('.main-content');
    mainContent.innerHTML = `
        <div class="stats-container">
            <div class="stats-header">
                <h1>Theatre Statistics</h1>
                <p>Your theatrical journey in numbers</p>
            </div>
            <div class="stats-grid">
                <div class="stat-card" id="total-seen">
                    <div class="stat-label">Total Plays Seen</div>
                    <div class="stat-number">...</div>
                    <div class="stat-description">The total number of theatrical performances you've experienced</div>
                </div>
                <div class="stat-card" id="upcoming">
                    <div class="stat-label">Upcoming Plays</div>
                    <div class="stat-number">...</div>
                    <div class="stat-description">Exciting performances waiting in your future</div>
                </div>
                <div class="stat-card" id="this-year">
                    <div class="stat-label">This Year's Plays</div>
                    <div class="stat-number">...</div>
                    <div class="stat-description">Your theatrical adventures in ${new Date().getFullYear()}</div>
                </div>
            </div>
            <div class="stats-footer">
                Click on the navigation links above to explore your plays
            </div>
        </div>
    `;

    // Fetch and update stats
    try {
        const stats = await fetchStats();
        document.querySelector('#total-seen .stat-number').textContent = stats.totalSeen;
        document.querySelector('#upcoming .stat-number').textContent = stats.upcoming;
        document.querySelector('#this-year .stat-number').textContent = stats.thisYear;
    } catch (error) {
        console.error('Error displaying stats:', error);
    }
} 