const express = require("express");
const cors = require("cors");
require("dotenv").config();

const chatRoutes = require("./routes/chatRoutes");

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Chatbot backend running 🚀");
});

app.use("/api/chat", chatRoutes);

const PORT = process.env.PORT || 5002;

app.listen(PORT, () => {
  console.log(`Chatbot server running on port ${PORT}`);
});
