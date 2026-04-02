const axios = require("axios");
require("dotenv").config();

// In-memory session history
const sessionHistory = {};

const generateResponse = async (message, sessionId = "default") => {
  try {
    const apiKey = process.env.GROQ_API_KEY;
    console.log("Chatbot using Groq API Key prefix:", apiKey ? apiKey.substring(0, 10) : "MISSING");

    if (!apiKey || apiKey === "your_groq_api_key_here") {
      return "Config Error: Please provide a GROQ_API_KEY in chatbot-backend/.env";
    }

    if (!sessionHistory[sessionId]) {
      sessionHistory[sessionId] = [
        { role: "system", content: "You are a helpful assistant for EduSphere, a university management system. Be concise, professional, and helpful. Answer questions about academics, schedules, campus life, and university services." }
      ];
    }

    sessionHistory[sessionId].push({ role: "user", content: message });

    // Keep history manageable
    if (sessionHistory[sessionId].length > 10) {
      sessionHistory[sessionId].splice(1, sessionHistory[sessionId].length - 10);
    }

    console.log(`Sending message to Groq: "${message.substring(0, 50)}..."`);

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.3-70b-versatile",
        messages: sessionHistory[sessionId],
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        timeout: 15000,
      }
    );

    const reply = response.data.choices[0].message.content;
    sessionHistory[sessionId].push({ role: "assistant", content: reply });
    return reply;
  } catch (error) {
    console.error("Groq Service Error:", error.response?.data || error.message);
    const errorMsg = error.response?.data?.error?.message || error.message;
    return `I'm having trouble connecting to the AI. Error: ${errorMsg}. Please ensure your GROQ_API_KEY is valid.`;
  }
};

module.exports = { generateResponse };