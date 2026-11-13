
const express = require("express");
const apiRoutes = require("./routes/apiRoutes");

const app = express();
const PORT = process.env.PORT || 5001;
const allowedOrigins = new Set(["http://localhost:5173", "null"]);

// Middleware
app.use((req, res, next) => {
    const requestOrigin = req.headers.origin;
    if (allowedOrigins.has(requestOrigin)) {
        res.header("Access-Control-Allow-Origin", requestOrigin);
        res.header("Vary", "Origin");
    }
    res.header("Access-Control-Allow-Headers", "Content-Type");
    res.header("Access-Control-Allow-Methods", "GET,POST,PUT,OPTIONS");
    if (req.method === "OPTIONS") return res.sendStatus(204);
    next();
});
app.use(express.json());
app.use("/api", apiRoutes);

// Home route
app.get("/", (req, res) => {
    res.json({
        message: "Welcome to PostPilot API!"
    });
});

// Health check route
app.get("/health", (req, res) => {
    res.status(200).json({
        status: "healthy"
    });
});

// Start server
app.listen(PORT, "127.0.0.1", () => {
    console.log(`PostPilot API running on port ${PORT}`);
});
