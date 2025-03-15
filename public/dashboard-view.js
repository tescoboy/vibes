console.log("dashboard-view.js is loading");

// Function to display dashboard
async function displayDashboard() {
    const mainContent = document.querySelector('.main-content');
    
    // Clear existing content
    mainContent.innerHTML = `
        <div class="dashboard-container">
            <div class="dashboard-header">
                <h1>Theatre Dashboard</h1>
                <p>Your theatrical journey at a glance</p>
            </div>
            <div class="stats-grid">
                <div class="stat-card" id="total-seen">
                    <div class="stat-icon">👁️</div>
                    <div class="stat-label">Total Plays Seen</div>
                    <div class="stat-number">...</div>
                </div>
                <div class="stat-card" id="upcoming">
                    <div class="stat-icon">📅</div>
                    <div class="stat-label">Upcoming Shows</div>
                    <div class="stat-number">...</div>
                </div>
                <div class="stat-card" id="this-year">
                    <div class="stat-icon">📊</div>
                    <div class="stat-label">This Year's Shows</div>
                    <div class="stat-number">...</div>
                </div>
                <div class="stat-card" id="hall-of-fame">
                    <div class="stat-icon">⭐</div>
                    <div class="stat-label">Hall of Fame Shows</div>
                    <div class="stat-number">...</div>
                </div>
            </div>
        </div>
    `;

    // Add dashboard styles
    if (!document.getElementById('dashboard-styles')) {
        const styles = document.createElement('style');
        styles.id = 'dashboard-styles';
        styles.textContent = `
            .dashboard-container {
                max-width: 1200px;
                margin: 0 auto;
                padding: 2rem;
            }

            .dashboard-header {
                text-align: center;
                margin-bottom: 3rem;
            }

            .dashboard-header h1 {
                font-size: 2.5rem;
                color: #333;
                margin-bottom: 1rem;
            }

            .dashboard-header p {
                color: #666;
                font-size: 1.1rem;
            }

            .stats-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
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

            .stat-icon {
                font-size: 2.5rem;
                margin-bottom: 1rem;
            }

            .stat-number {
                font-size: 3rem;
                font-weight: bold;
                margin: 1rem 0;
                background: linear-gradient(45deg, #4285f4, #34a853);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
            }

            .stat-label {
                font-size: 1.2rem;
                color: #666;
            }
        `;
        document.head.appendChild(styles);
    }

    // Fetch and update stats
    try {
        const stats = await fetchDashboardStats();
        document.querySelector('#total-seen .stat-number').textContent = stats.totalSeen;
        document.querySelector('#upcoming .stat-number').textContent = stats.upcoming;
        document.querySelector('#this-year .stat-number').textContent = stats.thisYear;
        document.querySelector('#hall-of-fame .stat-number').textContent = stats.hallOfFame;
    } catch (error) {
        console.error('Error displaying dashboard:', error);
    }
} 