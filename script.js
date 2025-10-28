// Function to open tools in new tabs
function openTool(url) {
    window.open(url, '_blank', 'noopener,noreferrer');
}

// Favorites management
let favorites = JSON.parse(localStorage.getItem('tateStudioFavorites')) || [];
let showingFavoritesOnly = false;

// Search functionality
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.querySelector('.search-input');
    const toolCards = document.querySelectorAll('.tool-card');
    const categories = document.querySelectorAll('.category');

    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase().trim();
        
        if (searchTerm === '') {
            // Show all tools and categories
            toolCards.forEach(card => {
                card.style.display = 'block';
            });
            categories.forEach(category => {
                category.style.display = 'block';
            });
            return;
        }

        // Filter tools
        categories.forEach(category => {
            const categoryTools = category.querySelectorAll('.tool-card');
            let hasVisibleTools = false;

            categoryTools.forEach(card => {
                const toolName = card.querySelector('h3').textContent.toLowerCase();
                const toolDescription = card.querySelector('p').textContent.toLowerCase();
                
                if (toolName.includes(searchTerm) || toolDescription.includes(searchTerm)) {
                    card.style.display = 'block';
                    hasVisibleTools = true;
                } else {
                    card.style.display = 'none';
                }
            });

            // Hide category if no tools are visible
            category.style.display = hasVisibleTools ? 'block' : 'none';
        });
    });

    // Initialize favorites
    initializeFavorites();
    
    // Favorite functionality
    const favoriteButtons = document.querySelectorAll('.favorite-btn');
    
    favoriteButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const toolCard = this.closest('.tool-card');
            const toolName = toolCard.querySelector('h3').textContent;
            
            toggleFavorite(toolName, this);
        });
    });

    // Add click tracking for analytics (optional)
    const loginButtons = document.querySelectorAll('.login-btn');
    
    loginButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const toolName = this.closest('.tool-card').querySelector('h3').textContent;
            console.log(`Opening tool: ${toolName}`);
            
            // You can add analytics tracking here
            // Example: gtag('event', 'tool_click', { tool_name: toolName });
        });
    });
});

// Add some interactive animations
document.addEventListener('DOMContentLoaded', function() {
    const toolCards = document.querySelectorAll('.tool-card');
    
    toolCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-4px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
});

// Favorites functionality
function initializeFavorites() {
    const favoriteButtons = document.querySelectorAll('.favorite-btn');
    
    favoriteButtons.forEach(btn => {
        const toolCard = btn.closest('.tool-card');
        const toolName = toolCard.querySelector('h3').textContent;
        
        if (favorites.includes(toolName)) {
            btn.innerHTML = '♥';
            btn.style.color = '#ef4444';
            btn.classList.add('favorited');
            toolCard.classList.add('favorited');
        } else {
            btn.innerHTML = '♡';
            btn.style.color = '#d1d5db';
            btn.classList.remove('favorited');
        }
    });
}

function toggleFavorite(toolName, button) {
    const toolCard = button.closest('.tool-card');
    
    if (favorites.includes(toolName)) {
        // Remove from favorites
        favorites = favorites.filter(fav => fav !== toolName);
        button.innerHTML = '♡';
        button.style.color = '#d1d5db';
        button.classList.remove('favorited');
        toolCard.classList.remove('favorited');
    } else {
        // Add to favorites
        favorites.push(toolName);
        button.innerHTML = '♥';
        button.style.color = '#ef4444';
        button.classList.add('favorited');
        toolCard.classList.add('favorited');
    }
    
    // Save to localStorage
    localStorage.setItem('tateStudioFavorites', JSON.stringify(favorites));
    
    // Update filter if currently showing favorites only
    if (showingFavoritesOnly) {
        filterFavorites();
    }
}

function toggleFavoritesFilter() {
    const filterBtn = document.getElementById('favoritesFilter');
    
    showingFavoritesOnly = !showingFavoritesOnly;
    
    if (showingFavoritesOnly) {
        filterBtn.classList.add('active');
        filterBtn.textContent = '⭐ お気に入り表示中';
        filterFavorites();
    } else {
        filterBtn.classList.remove('active');
        filterBtn.textContent = '⭐ お気に入りのみ表示';
        showAllTools();
    }
}

function filterFavorites() {
    const toolCards = document.querySelectorAll('.tool-card');
    const categories = document.querySelectorAll('.category');
    
    categories.forEach(category => {
        const categoryTools = category.querySelectorAll('.tool-card');
        let hasVisibleTools = false;
        
        categoryTools.forEach(card => {
            const toolName = card.querySelector('h3').textContent;
            
            if (favorites.includes(toolName)) {
                card.style.display = 'block';
                hasVisibleTools = true;
            } else {
                card.style.display = 'none';
            }
        });
        
        // Hide category if no favorite tools are visible
        category.style.display = hasVisibleTools ? 'block' : 'none';
    });
    
    // Show message if no favorites
    if (favorites.length === 0) {
        showNoFavoritesMessage();
    }
}

function showAllTools() {
    const toolCards = document.querySelectorAll('.tool-card');
    const categories = document.querySelectorAll('.category');
    
    toolCards.forEach(card => {
        card.style.display = 'block';
    });
    
    categories.forEach(category => {
        category.style.display = 'block';
    });
    
    hideNoFavoritesMessage();
}



function showNoFavoritesMessage() {
    let message = document.getElementById('noFavoritesMessage');
    if (!message) {
        message = document.createElement('div');
        message.id = 'noFavoritesMessage';
        message.className = 'no-favorites-message';
        message.innerHTML = `
            <div class="message-content">
                <span style="font-size: 48px;">⭐</span>
                <h3>お気に入りがありません</h3>
                <p>ツールの♡ボタンをクリックしてお気に入りに追加してください</p>
            </div>
        `;
        document.querySelector('.main').appendChild(message);
    }
    message.style.display = 'block';
}

function hideNoFavoritesMessage() {
    const message = document.getElementById('noFavoritesMessage');
    if (message) {
        message.style.display = 'none';
    }
}