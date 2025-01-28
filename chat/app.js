// Replace with your OpenAI API key
const apiKey = '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';

document.getElementById('Form').addEventListener('submit', async function(event) {
    event.preventDefault();

    // Get user input
    const userMessage = document.getElementById('info').value.trim();
    if (!userMessage) return;

    // Append user's message to chat
    appendMessage('user', userMessage);

    // Clear input field
    document.getElementById('info').value = '';

    try {
        // Call OpenAI API
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "gpt-4o",
                messages: [{ role: "user", content: userMessage }],
                max_tokens: 2000
            })
        });

        const result = await response.json();
        const botReply = result.choices[0].message.content;

        // Append bot's response to chat
        appendMessage('bot', botReply);

    } catch (error) {
        console.error("Error fetching response:", error);
        appendMessage('bot', "حدث خطأ، حاول مرة أخرى لاحقًا.");
    }
});

// Function to append messages to chatbox
function appendMessage(role, text) {
    const chatBox = document.getElementById('result');
    const messageElement = document.createElement('div');
    messageElement.classList.add(role === 'user' ? 'user-message' : 'bot-message');
    messageElement.innerText = text;
    chatBox.appendChild(messageElement);
    
    // Scroll to bottom to show latest message
    chatBox.scrollTop = chatBox.scrollHeight;
}
