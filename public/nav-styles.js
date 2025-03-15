console.log("nav-styles.js is loading");

const styles = document.createElement('style');
styles.textContent = `
    nav {
        background-color: #fff;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        position: sticky;
        top: 0;
        z-index: 1000;
    }

    .nav-content {
        max-width: 1200px;
        margin: 0 auto;
        padding: 1rem;
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
        padding: 0.5rem;
        border-radius: 4px;
        cursor: pointer;
        transition: all 0.2s;
    }

    .nav-link:hover {
        color: #333;
        background-color: #f5f5f5;
    }

    .nav-link.active {
        color: #1a73e8;
        font-weight: 500;
    }

    .auth-buttons {
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    .burger-menu {
        display: none;
        flex-direction: column;
        justify-content: space-between;
        width: 30px;
        height: 21px;
        background: transparent;
        border: none;
        cursor: pointer;
        padding: 0;
        z-index: 1001;
    }

    .burger-menu span {
        width: 100%;
        height: 3px;
        background-color: #333;
        transition: all 0.3s;
        border-radius: 3px;
    }

    .burger-menu.active span:nth-child(1) {
        transform: translateY(9px) rotate(45deg);
    }

    .burger-menu.active span:nth-child(2) {
        opacity: 0;
    }

    .burger-menu.active span:nth-child(3) {
        transform: translateY(-9px) rotate(-45deg);
    }

    @media (max-width: 768px) {
        .burger-menu {
            display: flex;
        }

        .nav-links {
            position: fixed;
            top: 0;
            right: -100%;
            width: 80%;
            max-width: 300px;
            height: 100vh;
            background-color: white;
            flex-direction: column;
            padding: 5rem 2rem 2rem;
            transition: right 0.3s ease;
            box-shadow: -2px 0 5px rgba(0,0,0,0.1);
        }

        .nav-links.active {
            right: 0;
        }

        .auth-buttons {
            flex-direction: column;
            width: 100%;
        }

        .auth-buttons button {
            width: 100%;
        }

        #userInfo {
            text-align: center;
            width: 100%;
        }
    }
`;

document.head.appendChild(styles); 