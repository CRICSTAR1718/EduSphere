const axios = require("axios");
require("dotenv").config();

// In-memory session history
const sessionHistory = {};

const generateResponse = async (message, sessionId = "default") => {
  try {
    const apiKey = process.env.OPENROUTER_API_KEY;
    console.log("Chatbot using API Key prefix:", apiKey ? apiKey.substring(0, 10) : "MISSING");

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

    const models = [
      "google/gemini-2.0-flash-exp:free",
      "deepseek/deepseek-r1:free",
      "google/gemini-flash-1.5-exp:free",
      "mistralai/mistral-7b-instruct:free"
    ];

    let lastError = null;
    for (const model of models) {
      try {
        console.log(`Trying OpenRouter model: ${model}`);
        const response = await axios.post(
          "https://openrouter.ai/api/v1/chat/completions",
          {
            model: model,
            messages: sessionHistory[sessionId],
          },
          {
            headers: {
              Authorization: `Bearer ${apiKey}`,
              "Content-Type": "application/json",
            },
            timeout: 10000 // 10 second timeout per model
          }
        );

        const reply = response.data.choices[0].message.content;
        sessionHistory[sessionId].push({ role: "assistant", content: reply });
        return reply;
      } catch (error) {
        lastError = error.response?.data?.error?.message || error.message;
        console.error(`Error with model ${model}:`, lastError);
        // Continue to next model
      }
    }

    throw new Error(`All models failed. Last error: ${lastError}`);
  } catch (error) {
    console.error("Chatbot Service Error:", error.message);
    return `I'm having trouble connecting to the AI. All fallback models failed. Last error: ${error.message}. Please ensure your OPENROUTER_API_KEY is valid.`;
  }
};

module.exports = { generateResponse };