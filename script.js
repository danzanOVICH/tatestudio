// Function to open tools in new tabs
function openTool(url) {
    window.open(url, '_blank', 'noopener,noreferrer');
}

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

    // Favorite functionality
    const favoriteButtons = document.querySelectorAll('.favorite-btn');
    
    favoriteButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            if (this.textContent === '♡') {
                this.textContent = '♥';
                this.style.color = '#ef4444';
            } else {
                this.textContent = '♡';
                this.style.color = '#d1d5db';
            }
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