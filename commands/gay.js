const axios = require('axios');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// Your bot command function
async function handleMessage(req, res) {
    const text = req.body.message; // Adjust based on how you receive messages

    if (!text) {
        res.send("Please provide a message.");
        return;
    }

    try {
        const response = await axios.get(`https://mota-dev.onrender.com/ai?prompt=${encodeURIComponent(text)}&uid=changeMe`);
        const gpt4o = response.data.gpt4o || response.data.response || response.data.answer || response.data.message || response.data.reply || 'No valid response field found.';
        
        res.send(gpt4o);
    } catch (error) {
        res.send(`Error: ${error.message}`);
    }
}

// Endpoint to handle incoming messages
app.post('/webhook', handleMessage);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
