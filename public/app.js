
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
        // Call your backend API endpoint
        // The fetch request now goes to your server at /api/chat
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: userMessage // Send the user's message to your backend
            })
        });

        // Check if the response was successful (HTTP status 2xx)
        if (!response.ok) {
            // Attempt to parse error message from server if available
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        const botReply = result.reply; // Access the 'reply' property from your backend response

        // Append bot's response to chat
        appendMessage('bot', botReply);

    } catch (error) {
        console.error("Error fetching response from backend:", error);
        // Display a user-friendly error message
        appendMessage('bot', "حدث خطأ، حاول مرة أخرى لاحقًا."); // Arabic for "An error occurred, try again later."
    }
});

// Function to append messages to chatbox
function appendMessage(role, text) {
    const chatBox = document.getElementById('result');
    const messageElement = document.createElement('div');
    // Add a general 'message' class for common styling and role-specific classes
    messageElement.classList.add('message', role === 'user' ? 'user-message' : 'bot-message');
    messageElement.innerText = text;
    chatBox.appendChild(messageElement);

    // Scroll to bottom to show latest message
    chatBox.scrollTop = chatBox.scrollHeight;
}