const express = require("express");
const router = express.Router();
const { handleChatbot } = require("../controllers/chatbotController");

router.post("/", handleChatbot);

module.exports = router;