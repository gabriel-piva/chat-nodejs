// --------------------------------------------------------------------------

const express = require('express');
const app = express();
const path = require('path');
const server = require('http').createServer(app);
const io = require('socket.io')(server);

// --------------------------------------------------------------------------

// Definindo a página do chat

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use('/', (req, res) => {
    const sala = req.query.sala;
    res.render('index.html', { sala });
});

// --------------------------------------------------------------------------

const rooms = {};

io.on('connection', socket => {
    console.log(`Socket Conectado: ${socket.id}`);

    socket.on('joinRoom', sala => {
        socket.join(sala);

        if (!rooms[sala]) {
            rooms[sala] = [];
        }
        socket.emit('previousMessages', rooms[sala]);
    });

    socket.on('sendMessage', data => {
        const sala = data.room;
        rooms[sala].push(data);
        io.to(sala).emit('receivedMessage', data);
    });

});

// --------------------------------------------------------------------------

// Inicia o Server

server.listen(8080, () => console.log('Servidor em execução.'));

// --------------------------------------------------------------------------
