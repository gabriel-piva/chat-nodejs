// --------------------------------------------------------------------------

// Socket Connection

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
let sala = urlParams.get('sala');
const username = urlParams.get('username')

const socket = io('http://localhost:8080', {
    query: { sala, username }
});

// --------------------------------------------------------------------------

// Connect to a Room 

const changeRoom = () => {
    let room = document.querySelector('#room').value;
    room = room.length ? room : 'Global';
    const username = document.querySelector('#username').value;
    if (username.length) {
        window.location.href = `/?sala=${room}&username=${username}`;
    }
};

// --------------------------------------------------------------------------

// Chat Box Functions

const chatBox = document.querySelector('#chatBox');
const sendMessage = () => {
    const newMessage = document.querySelector('#new-message').value;
    if(newMessage.length) {
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

// Modals

const modal = document.querySelector('#modal');
const overlay = document.querySelector('#overlay');

const openModal = () => {
    modal.showModal();
    overlay.style.display = 'block';
    if(username) {
        document.querySelector('#username').value = username;
    }
    if(sala) {
        document.querySelector('#room').value = sala;
    }

}
const closeModal = () => {
    modal.close();
    overlay.style.display = 'none';
}

document.querySelector('#btn-modal').addEventListener('click', openModal);
document.querySelector('#btn-connect').addEventListener('click', changeRoom);

// --------------------------------------------------------------------------

// Socket Events

socket.on('receivedMessage', (message) => {
    if (message.username !== username) {
        renderMessage(message);
    }
});
socket.on('previousMessages', (messages) => messages.forEach(message => renderMessage(message)));

// --------------------------------------------------------------------------

// Page Events

window.onload = () => {
    if(!sala) {
        sala = 'Global';
    }
    if(!username) {
        openModal()
    } else {
        socket.emit('joinRoom', sala);
        document.querySelector('#room-id').innerHTML = sala;
    }
};
document.addEventListener('keydown', handleKeydown);
document.querySelector('#btn-send').addEventListener('click', sendMessage);

// --------------------------------------------------------------------------