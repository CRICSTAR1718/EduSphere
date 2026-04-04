const express = require("express");
const cors = require("cors");
require("dotenv").config();

const chatRoutes = require("./routes/chatRoutes");
const mongoose = require("mongoose");

const app = express();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Chatbot-Backend connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// CORS Configuration - Robust for Production
const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:5173",
  "https://edu-sphere-nu-two.vercel.app/", // Common fallback
  "https://edusphere.netlify.app"       // Common fallback
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== "production") {
      return callback(null, true);
    } else {
      console.warn(`⚠️ CORS Blocked: Origin ${origin} not in allowed list:`, allowedOrigins);
      return callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));

// Request Logger (Helpful for debugging Render connections)
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url} - Origin: ${req.headers.origin || "No Origin"}`);
  next();
});
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Chatbot backend running 🚀");
});

// Health Check
app.get("/api/health", (req, res) => res.json({ status: "ok", version: "hybrid-v1-local" }));

app.use("/api/chat", chatRoutes);

const PORT = process.env.PORT || 5002;

app.listen(PORT, () => {
  console.log(`Chatbot server running on port ${PORT}`);
});
