// Load configuration
const VALID_USERS = CONFIG.USERS;
const SESSION_DURATION = CONFIG.SESSION_DURATION_HOURS * 60 * 60 * 1000;

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('errorMessage');
    
    // Check if user is already logged in
    checkExistingSession();
    
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        const user = validateCredentials(email, password);
        
        if (user) {
            // Store login session with user info
            const sessionData = {
                loggedIn: true,
                timestamp: Date.now(),
                email: user.email,
                username: user.username
            };
            
            localStorage.setItem('tateStudioSession', JSON.stringify(sessionData));
            
            // Redirect to main portal
            window.location.href = 'index.html';
        } else {
            showError();
        }
    });
});

function validateCredentials(email, password) {
    // Find user in the VALID_USERS array that matches email and password
    return VALID_USERS.find(user => 
        user.email === email && user.password === password
    );
}

function checkExistingSession() {
    const sessionData = localStorage.getItem('tateStudioSession');
    
    if (sessionData) {
        const session = JSON.parse(sessionData);
        const currentTime = Date.now();
        
        // Check if session is still valid (within 24 hours)
        if (session.loggedIn && (currentTime - session.timestamp) < SESSION_DURATION) {
            // Session is valid, redirect to main portal
            window.location.href = 'index.html';
        } else {
            // Session expired, clear it
            localStorage.removeItem('tateStudioSession');
        }
    }
}

function showError() {
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.style.display = 'block';
    
    // Hide error after 5 seconds
    setTimeout(() => {
        errorMessage.style.display = 'none';
    }, 5000);
    
    // Clear form
    document.getElementById('password').value = '';
}