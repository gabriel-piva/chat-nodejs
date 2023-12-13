// --------------------------------------------------------------------------

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const sala = urlParams.get('sala');

const socket = io('http://localhost:8080', {
    query: { sala }
});

socket.emit('joinRoom', sala);

// --------------------------------------------------------------------------

// Chat Box Functions

const chatBox = document.querySelector('#chatBox');
const sendMessage = () => {
    const username = document.querySelector('#username').value;
    const newMessage = document.querySelector('#new-message').value;
    if(username.length && newMessage.length) {
        let messageObj = {
            username: username,
            message: newMessage
        }
        renderMessage(messageObj);
        socket.emit('sendMessage', messageObj);
        document.querySelector('#new-message').value = "";
    }
}
const renderMessage = (message) => {
    chatBox.innerHTML +=`
        <div class="message">
            <span class="username">${message.username}</span>
            ${message.message}
        </div>
    `;
    chatBox.scrollTop = chatBox.scrollHeight
}
const handleKeydown = (e) => {
    if(e.key == 'Enter') {
        sendMessage();
    }   
}

// --------------------------------------------------------------------------

// Socket Events

socket.on('receivedMessage', (message) => {
    const username = document.querySelector('#username').value;
    if (message.username !== username) {
        renderMessage(message);
    }
});
socket.on('previousMessages', (messages) => messages.forEach(message => renderMessage(message)));

// --------------------------------------------------------------------------

// Page Events

document.addEventListener('keydown', handleKeydown);
document.querySelector('#btn-send').addEventListener('click', sendMessage);

// --------------------------------------------------------------------------