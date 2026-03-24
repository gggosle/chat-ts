import {FakeServer} from './FakeServer';
import {ChatMessage} from './types';

const messagesContainer = document.getElementById('messages') as HTMLDivElement;
const chatInput = document.getElementById('chat-input') as HTMLInputElement;
const chatForm = document.getElementById('chat-form') as HTMLFormElement;
const typingIndicator = document.getElementById('typing-indicator') as HTMLDivElement;

const server = new FakeServer();

function createMessageElement(msg: ChatMessage): HTMLDivElement {
    const div = document.createElement('div');
    div.classList.add('message', `message-${msg.type}`);

    switch (msg.type) {
        case 'text':
            div.innerHTML = `<strong>${msg.sender}:</strong> ${msg.content}`;
            if (msg.sender === 'Me') div.classList.add('message-mine');
            break;

        case 'system':
            div.innerHTML = `<em>*** ${msg.user} has ${msg.action} the chat ***</em>`;
            break;

        case 'error':
            div.innerHTML = `<span style="color: red;">⚠ Error ${msg.code}: ${msg.reason}</span>`;
            break;

        default:
            return msg;
    }

    const time = new Date(msg.timestamp).toLocaleTimeString();
    div.innerHTML += ` <span class="time" style="font-size: 0.7em; color: gray;">${time}</span>`;

    return div;
}

server.on('message:receive', (msg) => {
    const el = createMessageElement(msg);
    messagesContainer.appendChild(el);

    messagesContainer.scrollTop = messagesContainer.scrollHeight;
});

server.on('user:typing', ({ user, isTyping }) => {
    if (isTyping) {
        typingIndicator.textContent = `${user} is typing...`;
        typingIndicator.style.display = 'block';
    } else {
        typingIndicator.style.display = 'none';
    }
});

server.on('status:change', ({ status }) => {
    console.log(`[Network] Server is currently: ${status}`);
});

chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = chatInput.value.trim();
    if (!text) return;

    server.sendMessage(text);
    chatInput.value = '';
});

server.connect();