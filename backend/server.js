const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

// ==================== MIDDLEWARE ====================

// Parse JSON body
app.use(express.json());

// ✅ CORS CONFIG (FIXED + PRODUCTION SAFE)
const rawAllowedOrigins =
    process.env.CLIENT_URL ||
    "http://localhost:5173,http://localhost:5174,http://localhost:5175";

const allowedOrigins = rawAllowedOrigins
    .split(",")
    .map((s) => s.trim().replace(/\/$/, ""))
    .filter(Boolean);

// 🔥 DEBUG (remove later if you want)
console.log("✅ Allowed Origins:", allowedOrigins);

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin) return callback(null, true); // allow curl/postman

        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        } else {
            console.error(
                `❌ CORS Blocked: Origin "${origin}" not allowed`,
                allowedOrigins
            );
            return callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
};

// Apply CORS
app.use(cors(corsOptions));

// ✅ HANDLE PREFLIGHT (VERY IMPORTANT)
app.options("*", cors(corsOptions));


// ==================== ROUTES ====================

// Health check
app.get("/api/health", (req, res) => {
    res.status(200).json({
        status: "ok",
        message: "EduSphere API is running 🚀",
        timestamp: new Date().toISOString(),
    });
});

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/student", require("./routes/studentRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/faculty", require("./routes/facultyRoutes"));
app.use("/api/warden", require("./routes/wardenRoutes"));
app.use("/api/parent", require("./routes/parentRoutes"));
app.use("/api/timetable", require("./routes/timetableRoutes"));
app.use("/api/feedback", require("./routes/feedbackRoutes"));
app.use("/api/common", require("./routes/commonRoutes"));
app.use("/api/chatbot", require("./routes/chatbotRoutes"));


// ==================== ERROR HANDLING ====================

// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error("🔥 Unhandled error:", err.message);

    // ⚠️ CORS error handling
    if (err.message === "Not allowed by CORS") {
        return res.status(403).json({ message: err.message });
    }

    res.status(500).json({
        message: "Internal server error",
        error:
            process.env.NODE_ENV === "development" ? err.message : undefined,
    });
});


// ================== START SERVER ==================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`\n🚀 EduSphere API running on port ${PORT}`);
    console.log(`🌐 Environment: ${process.env.NODE_ENV || "development"}\n`);
});