// server.js
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static(__dirname + '/public'));

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const rooms = {};

io.on('connection', socket => {
  socket.on('createRoom', () => {
    const roomId = generateRoomId();
    rooms[roomId] = { players: [socket.id], board: ['', '', '', '', '', '', '', '', ''] };
    socket.join(roomId);
    socket.emit('roomCreated', roomId);
  });

  socket.on('joinRoom', roomId => {
    if (rooms[roomId] && rooms[roomId].players.length < 2) {
      rooms[roomId].players.push(socket.id);
      socket.join(roomId);
      io.to(roomId).emit('gameStart');
    } else {
      socket.emit('roomFull');
    }
  });

  socket.on('move', ({ roomId, cellIndex }) => {
    const room = rooms[roomId];
    const currentPlayer = room.players.indexOf(socket.id) === 0 ? 'X' : 'O';

    if (room && room.board[cellIndex] === '') {
      room.board[cellIndex] = currentPlayer;
      io.to(roomId).emit('stateChange', room.board);
      // Add logic to check for a winner and handle game over
    }
  });
});

function generateRoomId() {
  return Math.random().toString(36).substr(2, 6);
}
