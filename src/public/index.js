// --------------------------------------------------------------------------

// Socket Connection

let socket = null;

const connectToSocket = (room) => {
    socket = io('http://localhost:8080', {
        query: { sala: room }
    });
    socket.on('receivedMessage', (message) => {
        if (message.username !== currentUsername) {
            renderMessage(message);
        }
    });
    socket.on('previousMessages', (messages) => messages.forEach(message => renderMessage(message)));
    return socket;
};

// --------------------------------------------------------------------------

// Connect to a Room 

let currentUsername = '';
let currentRoom = '';
const connectRoom = () => {
    let room = document.querySelector('#room').value;
    room = room.length ? room : 'Global';
    currentRoom = room;
    const username = document.querySelector('#username').value;

    if (username.length) {
        const queryParams = `?sala=${room}`;
        window.history.pushState(null, null, queryParams);
        if (socket) {
            chatBox.innerHTML = '';
            socket.disconnect();
        }
        socket = connectToSocket(room);
        socket.emit('joinRoom', room);
        document.querySelector('#room-id').innerHTML = room;
        currentUsername = username;
        closeModal();
    }
};

// --------------------------------------------------------------------------

// Chat Box Functions

const chatBox = document.querySelector('#chatBox');
const sendMessage = () => {
    const newMessage = document.querySelector('#new-message').value;
    if(newMessage.length) {
        let messageObj = {
            username: currentUsername,
            message: newMessage,
            room: currentRoom
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

// Modals

const modal = document.querySelector('#modal');
const overlay = document.querySelector('#overlay');

const openModal = () => {
    modal.showModal();
    overlay.style.display = 'block';
}
const closeModal = () => {
    modal.close();
    overlay.style.display = 'none';
}

document.querySelector('#btn-modal').addEventListener('click', openModal);
document.querySelector('#btn-connect').addEventListener('click', connectRoom);

// --------------------------------------------------------------------------

// Page Events

window.onload = openModal;
document.addEventListener('keydown', handleKeydown);
document.querySelector('#btn-send').addEventListener('click', sendMessage);

// --------------------------------------------------------------------------