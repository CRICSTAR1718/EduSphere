const axios = require("axios");

const CHATBOT_URL = process.env.CHATBOT_URL || "http://localhost:5002";

const sendToChatbot = async (message, sessionId) => {
    const res = await axios.post(`${CHATBOT_URL}/api/chat`, {
        message,
        sessionId
    });

    return res.data;
};

module.exports = { sendToChatbot };