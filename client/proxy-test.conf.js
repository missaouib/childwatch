const PROXY_CONFIG = [
    {
        context: [
            "/api",
            "/rules",
            "/menu",
            "/user",
            "/mpr"
        ],
        target: "http://online.childwatch.com:8080",
        secure: false,
        changeOrigin: true
    }
]

module.exports = PROXY_CONFIG;