const socket = io('http://localhost:8080');

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

socket.on('receivedMessage', (message) => renderMessage(message));
socket.on('previousMessages', (messages) => messages.forEach(message => renderMessage(message)));
document.addEventListener('keydown', handleKeydown);
document.querySelector('#btn-send').addEventListener('click', sendMessage);