console.log("nav-styles.js is loading");

const navStyle = document.createElement('style');
navStyle.textContent = `
    nav {
        background-color: #ffffff;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        padding: 1rem 2rem;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 1000;
    }

    .nav-content {
        max-width: 1200px;
        margin: 0 auto;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .site-title {
        font-size: 1.5rem;
        font-weight: bold;
        color: #333;
    }

    .nav-links {
        display: flex;
        gap: 1.5rem;
        align-items: center;
    }

    .nav-link {
        color: #666;
        text-decoration: none;
        padding: 0.5rem 1rem;
        border-radius: 4px;
        transition: all 0.2s;
        cursor: pointer;
    }

    .nav-link:hover {
        background-color: #f0f0f0;
        color: #333;
    }

    .nav-link.active {
        background-color: #f0f0f0;
        color: #333;
        font-weight: 500;
    }

    .auth-buttons {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-left: 2rem;
    }

    #signInBtn, #signOutBtn {
        padding: 0.5rem 1rem;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-weight: 500;
        transition: background-color 0.2s;
    }

    #signInBtn {
        background-color: #4285f4;
        color: white;
    }

    #signInBtn:hover {
        background-color: #3574e2;
    }

    #signOutBtn {
        background-color: #f1f3f4;
        color: #333;
    }

    #signOutBtn:hover {
        background-color: #e8eaed;
    }

    #userInfo {
        color: #333;
    }

    /* Add padding to main content to account for fixed nav */
    .main-content {
        padding-top: 80px;
    }
`;

document.head.appendChild(navStyle); 