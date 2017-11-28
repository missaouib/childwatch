const PROXY_CONFIG = [
    {
        context: [
            "/api",
            "/rules",
            "/menu",
            "/user"
        ],
        target: "http://localhost:8080",
        secure: false,
        changeOrigin: true
    }
]

module.exports = PROXY_CONFIG;