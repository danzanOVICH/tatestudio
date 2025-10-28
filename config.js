// TateStudio Configuration
// Change these credentials as needed

const CONFIG = {
    // Login credentials for accessing the portal
    LOGIN: {
        email: "test@test.com",
        password: "test123",
        username: "田中太郎",
        teamName: "無料チーム"
    },
    
    // Session settings
    SESSION_DURATION_HOURS: 24,
    
    // Site settings
    SITE_NAME: "タテスタ",
    SITE_DESCRIPTION: "AI ツールポータル"
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}