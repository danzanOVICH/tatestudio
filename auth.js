// Authentication check for main portal
const SESSION_DURATION = CONFIG.SESSION_DURATION_HOURS * 60 * 60 * 1000;

document.addEventListener('DOMContentLoaded', function () {
    // Add a small delay to ensure DOM is fully loaded
    setTimeout(() => {
        checkAuthentication();
        addLogoutButton();
    }, 100);
});

function checkAuthentication() {
    const sessionData = localStorage.getItem('tateStudioSession');

    if (!sessionData) {
        redirectToLogin();
        return;
    }

    const session = JSON.parse(sessionData);
    const currentTime = Date.now();

    // Check if session is still valid
    if (!session.loggedIn || (currentTime - session.timestamp) > SESSION_DURATION) {
        // Session expired
        localStorage.removeItem('tateStudioSession');
        redirectToLogin();
        return;
    }

    // Session is valid, update user info in header
    updateUserInfo(session.username, session.email);
}

function redirectToLogin() {
    window.location.href = 'login.html';
}

function updateUserInfo(username, email) {
    // Update username and email if provided
    const usernameEl = document.getElementById('username');
    const teamnameEl = document.getElementById('teamname');

    if (usernameEl && username) {
        usernameEl.textContent = username;
    }

    if (teamnameEl && email) {
        teamnameEl.textContent = email;
    }

    console.log('Updated user info:', username, teamName);
}

function addLogoutButton() {
    // Add logout button styles
    const style = document.createElement('style');
    style.textContent = `
        .logout-btn {
            background: #ef4444;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 6px;
            font-size: 13px;
            font-weight: 500;
            cursor: pointer;
            margin-top: 6px;
            transition: all 0.2s ease;
            box-shadow: 0 2px 4px rgba(239, 68, 68, 0.2);
        }
        
        .logout-btn:hover {
            background: #dc2626;
            transform: translateY(-1px);
            box-shadow: 0 4px 8px rgba(239, 68, 68, 0.3);
        }
        
        .user-info {
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            font-size: 14px;
            color: #6b7280;
            gap: 2px;
        }
    `;
    document.head.appendChild(style);
}

function logout() {
    if (confirm('ログアウトしますか？')) {
        localStorage.removeItem('tateStudioSession');
        window.location.href = 'login.html';
    }
}

// Global logout function for testing (can be called from browser console)
window.forceLogout = function () {
    localStorage.removeItem('tateStudioSession');
    window.location.href = 'login.html';
};

// Manual function to add logout button (for testing)
window.addLogoutBtn = function () {
    const userInfo = document.querySelector('.user-info');
    if (userInfo) {
        userInfo.innerHTML = `
            <span>田中太郎</span>
            <span>無料チーム</span>
            <button class="logout-btn" onclick="logout()">ログアウト</button>
        `;
        console.log('Logout button added manually');
    } else {
        console.log('User info element not found');
    }
};