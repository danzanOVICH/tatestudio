// TateStudio Configuration
// Change these credentials as needed

const CONFIG = {
    // API Configuration
    // API_BASE_URL: "http://localhost:8000",
    API_BASE_URL: "https://hctwjxjkea6ul247hwho5uh6540nraly.lambda-url.ap-northeast-1.on.aws",

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