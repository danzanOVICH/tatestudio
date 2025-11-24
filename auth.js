// Authentication check for main portal
const SESSION_DURATION = CONFIG.SESSION_DURATION_HOURS * 60 * 60 * 1000;

document.addEventListener('DOMContentLoaded', function () {
    // Add a small delay to ensure DOM is fully loaded
    setTimeout(() => {
        checkAuthentication();
    }, 100);
});

function checkAuthentication() {
    const token = localStorage.getItem('tateStudioToken');
    const sessionData = localStorage.getItem('tateStudioSession');

    if (!token || !sessionData) {
        redirectToLogin();
        return;
    }

    const session = JSON.parse(sessionData);
    const currentTime = Date.now();

    // Check if session is still valid
    if (!session.loggedIn || (currentTime - session.timestamp) > SESSION_DURATION) {
        // Session expired
        localStorage.removeItem('tateStudioToken');
        localStorage.removeItem('tateStudioSession');
        redirectToLogin();
        return;
    }

    // Session is valid, update user info in header
    updateUserInfo(session.username, session.email);
}

// Helper function to get authorization headers
function getAuthHeaders() {
    const token = localStorage.getItem('tateStudioToken');
    return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };
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

function logout() {
    if (confirm('ログアウトしますか？')) {
        localStorage.removeItem('tateStudioToken');
        localStorage.removeItem('tateStudioSession');
        window.location.href = 'login.html';
    }
}

// Global logout function for testing (can be called from browser console)
window.forceLogout = function () {
    localStorage.removeItem('tateStudioToken');
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