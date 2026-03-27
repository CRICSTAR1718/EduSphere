const axios = require("axios");

const CHATBOT_URL = "https://edusphere-chatbot.onrender.com";

const sendToChatbot = async (message, sessionId) => {
    const res = await axios.post(`${CHATBOT_URL}/api/chat`, {
        message,
        sessionId
    });

    return res.data;
};

module.exports = { sendToChatbot };