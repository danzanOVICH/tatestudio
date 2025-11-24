// Load configuration
const API_BASE_URL = CONFIG.API_BASE_URL;
const SESSION_DURATION = CONFIG.SESSION_DURATION_HOURS * 60 * 60 * 1000;

document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('errorMessage');

    // Check if user is already logged in
    checkExistingSession();

    loginForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            await loginUser(email, password);
        } catch (error) {
            console.error('Login error:', error);
            showError(error.message || 'ログインに失敗しました');
        }
    });
});

async function loginUser(email, password) {
    // Call the login API
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'ログインに失敗しました');
    }

    const data = await response.json();
    const accessToken = data.access_token;

    // Store the access token
    localStorage.setItem('tateStudioToken', accessToken);

    // Fetch user info
    const userResponse = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });

    if (!userResponse.ok) {
        throw new Error('ユーザー情報の取得に失敗しました');
    }

    const userData = await userResponse.json();

    // Store session data
    const sessionData = {
        loggedIn: true,
        timestamp: Date.now(),
        email: userData.email,
        username: userData.full_name,
        userId: userData.user_id,
        isAdmin: userData.is_admin
    };

    localStorage.setItem('tateStudioSession', JSON.stringify(sessionData));

    // Redirect to main portal
    window.location.href = 'index.html';
}

function checkExistingSession() {
    const token = localStorage.getItem('tateStudioToken');
    const sessionData = localStorage.getItem('tateStudioSession');

    if (token && sessionData) {
        const session = JSON.parse(sessionData);
        const currentTime = Date.now();

        // Check if session is still valid (within 24 hours)
        if (session.loggedIn && (currentTime - session.timestamp) < SESSION_DURATION) {
            // Session is valid, redirect to main portal
            window.location.href = 'index.html';
        } else {
            // Session expired, clear it
            localStorage.removeItem('tateStudioToken');
            localStorage.removeItem('tateStudioSession');
        }
    }
}

function showError(message = 'メールアドレスまたはパスワードが正しくありません') {
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';

    // Hide error after 5 seconds
    setTimeout(() => {
        errorMessage.style.display = 'none';
    }, 5000);

    // Clear form
    document.getElementById('password').value = '';
}