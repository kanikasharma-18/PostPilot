
const express = require("express");
const apiRoutes = require("./routes/apiRoutes");

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:5173");
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
app.listen(PORT, () => {
    console.log(`PostPilot API running on port ${PORT}`);
});
