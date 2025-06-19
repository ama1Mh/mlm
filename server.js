// server.js

// 1. Load environment variables from .env file
require('dotenv').config();

// 2. Import necessary modules
const express = require('express');
const fetch = require('node-fetch'); // For making HTTP requests in Node.js
const path = require('path'); // For serving static files

// 3. Get your API key from environment variables
const apiKey = process.env.API_KEY;

// Ensure API key is loaded
if (!apiKey) {
    console.error("API_KEY not found in .env file. Please set it.");
    process.exit(1); // Exit the process if API key is missing
}

// 4. Initialize Express app
const app = express();
const port = process.env.PORT || 3000; // Use port from environment or default to 3000

// 5. Middleware for parsing JSON requests
app.use(express.json());

// 6. Serve static files from the 'public' directory
// This makes your index.html, app.js, style/chat.css, images/, and pages/ accessible
app.use(express.static(path.join(__dirname, 'public')));

// 7. Define a POST endpoint for chat completions
app.post('/api/chat', async (req, res) => {
    const userMessage = req.body.message; // Get the message from the frontend request

    if (!userMessage) {
        return res.status(400).json({ error: 'Message content is required.' });
    }

    try {
        // 8. Call OpenAI API from the backend
        const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}` // Use the securely loaded API key
            },
            body: JSON.stringify({
                model: "gpt-4o", // You can change the model here if needed
                messages: [{ role: "user", content: userMessage }],
                max_tokens: 2000
            })
        });

        const openaiData = await openaiResponse.json();

        // 9. Check for errors from OpenAI
        if (openaiData.error) {
            console.error("OpenAI API Error:", openaiData.error);
            return res.status(openaiResponse.status).json({
                error: openaiData.error.message || "Error from OpenAI API"
            });
        }

        const botReply = openaiData.choices[0].message.content;

        // 10. Send the bot's reply back to the frontend
        res.json({ reply: botReply });

    } catch (error) {
        console.error("Error processing chat request:", error);
        res.status(500).json({ error: "Internal server error. Please try again later." });
    }
});

// 11. Start the server
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
    console.log(`Open your browser to http://localhost:${port}/index.html`);
});