const axios = require("axios");
require("dotenv").config();

// In-memory session history
const sessionHistory = {};

const generateResponse = async (message, sessionId = "default") => {
  try {
    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey || apiKey === "your_openrouter_api_key_here") {
      return "Config Error: Please provide an OPENROUTER_API_KEY in chatbot-backend/.env";
    }

    if (!sessionHistory[sessionId]) {
      sessionHistory[sessionId] = [
        { role: "system", content: "You are a helpful assistant for EduSphere. Be concise and professional." }
      ];
    }

    sessionHistory[sessionId].push({ role: "user", content: message });

    // Keep history manageable
    if (sessionHistory[sessionId].length > 10) {
      sessionHistory[sessionId].splice(1, sessionHistory[sessionId].length - 10);
    }

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "stepfun/step-3.5-flash:free",
        messages: sessionHistory[sessionId],
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    const reply = response.data.choices[0].message.content;
    sessionHistory[sessionId].push({ role: "assistant", content: reply });

    return reply;
  } catch (error) {
    console.error("OpenRouter Error:", error.response?.data || error.message);
    return "I'm having trouble connecting to the AI. Please check your API key in the backend .env file.";
  }
};

module.exports = { generateResponse };