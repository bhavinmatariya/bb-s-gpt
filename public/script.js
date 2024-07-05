document.getElementById('chat-input').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
});

async function sendMessage() {
    const inputElement = document.getElementById('chat-input');
    const message = inputElement.value.trim();
    if (message === '') return;

    addMessageToChat('user', message);
    inputElement.value = '';

    const loaderId = addLoaderToChat();

    try {
        const response = await fetch('/ask', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ question: message })
        });

        await response.json().then((data) => {
            removeLoaderFromChat(loaderId);
            if (data) {
                addMessageToChat('bot', data.response);
            }
        });
    } catch (error) {
        console.error('Error:', error);
        removeLoaderFromChat(loaderId);
        addMessageToChat('bot', 'Sorry, something went wrong. Please try again later.');
    }
}

function addMessageToChat(sender, message) {
    const chatMessages = document.getElementById('chat-messages');
    const messageElement = document.createElement('div');
    messageElement.className = `chat-message ${sender}-message`;
    messageElement.textContent = message;
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function addLoaderToChat() {
    const chatMessages = document.getElementById('chat-messages');
    const loaderElement = document.createElement('div');
    loaderElement.className = 'chat-message bot-message';
    loaderElement.id = `loader-${Date.now()}`;
    loaderElement.innerHTML = `
        <div class="loader">
            <span></span><span></span><span></span>
        </div>
    `;
    chatMessages.appendChild(loaderElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return loaderElement.id;
}

function removeLoaderFromChat(loaderId) {
    const loaderElement = document.getElementById(loaderId);
    if (loaderElement) {
        loaderElement.remove();
    }
}
