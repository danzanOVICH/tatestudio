// TateStudio Configuration
// Change these credentials as needed

const CONFIG = {
    // Login credentials for accessing the portal
    USERS: [
        {
            username: "和田",
            email: "wada.j@dentsudigital.co.jp",
            password: "test123"
        },
        {
            username: "小坂",
            email: "kosaka.yu@dentsudigital.co.jp",
            password: "test123"
        },
        {
            username: "山田",
            email: "k.yamada@dentsudigital.co.jp",
            password: "test123"
        },
        {
            username: "川野",
            email: "kawano.yo@dentsudigital.co.jp",
            password: "test123"
        },
        {
            username: "藤本",
            email: "fujimoto.o@dentsudigital.co.jp",
            password: "test123"
        },
        {
            username: "鎌川",
            email: "ai.kamakawa@dc1.dentsu.co.jp",
            password: "test123"
        }
    ],
    
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