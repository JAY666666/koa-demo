const handleCors = {
        origin: "http://localhost:3000",
        exposeHeaders: ["WWW-Authenticate", "Server-Authorization"],
        maxAge: 5,
        credentials: true,
        allowMethods: ["GET", "POST", "DELETE"],
        allowHeaders: ["Content-Type", "Authorization", "Accept"],
}

module.exports = { handleCors };