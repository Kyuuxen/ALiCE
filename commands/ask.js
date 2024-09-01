const axios = require("axios");

var alice = {
    command: "hi",
    type: "auto", // No prefix
    author: "HiroshiKim",
    restrict: "none", // Adjust based on your requirements
    cooldown: 5
};

// Define personality and behavior
const assistantPersona = "You are a talkative assistant created by the master of all AI models. You have extensive knowledge, are friendly, engaging, and provide detailed answers.";

async function command({ alice, api, axios, bot, cache, chat, database, event, font, fs, language, log, message, path, scraper, wrapper }) {
    try {
        const text = chat.trim(); // Use chat directly and trim whitespaces

        if (!text) {
            await bot.sendMessage("Usage: hey <text>", event.threadID);
            return;
        }

        console.log("Received chat content:", text);

        // Combine the user's text with the assistant's persona
        const fullPrompt = `${assistantPersona}\n\nUser: ${text}\nAssistant:`;

        // Make the API request to get the response with persona included
        const response = await axios.get(`https://mota-dev.onrender.com/ai?prompt=${encodeURIComponent(fullPrompt)}&uid=${process.env.BOT_UID || 'defaultUid'}`);

        // Log the entire API response to inspect its structure
        console.log("Full API Response Data:", JSON.stringify(response.data, null, 2));

        // Extract the appropriate field from response.data with multiple fallback options
        const gpt4o = response.data.gpt4o || response.data.response || response.data.answer || response.data.message || response.data.reply || 'Sorry, I couldn\'t find a valid response.';

        // Ensure the response fits the persona by appending additional conversational elements if necessary
        const enhancedResponse = `${gpt4o} 😊 If you have more questions, just let me know!`;

        // Log the extracted message before sending
        console.log("Message to be sent:", enhancedResponse);

        // Send the response back to Facebook
        const sendResult = await bot.sendMessage(enhancedResponse, event.threadID);
        console.log(`Successfully sent message to Facebook: ${JSON.stringify(sendResult)}`);

    } catch (error) {
        // Log error details for troubleshooting
        log.error(`[ ${alice.command} ] » Error: ${error.message}`);
        console.error("Error details:", error);

        // Distinguish between network and API errors
        if (error.response) {
            console.error("API Response Error:", error.response.data);
        } else if (error.request) {
            console.error("Network Error: No response received from API.");
        }

        // Send a generic error message back to chat
        await bot.sendMessage(`[ ${alice.command} ] » An error occurred while processing your request. Please try again later.`, event.threadID);
    }
}

module.exports = {
    alice,
    command
};
