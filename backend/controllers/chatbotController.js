const { sendToChatbot } = require("../services/chatbotService");

const handleChatbot = async (req, res) => {
    try {
        const { message, sessionId } = req.body;

        if (!message) {
            return res.status(400).json({ message: "Message required" });
        }

        const data = await sendToChatbot(message, sessionId);

        res.json(data);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Chatbot error" });
    }
};

module.exports = { handleChatbot };