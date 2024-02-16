// public/client.js
const socket = io();

let roomId;

document.getElementById('createRoomBtn').addEventListener('click', () => {
  socket.emit('createRoom');
});

document.getElementById('joinRoomBtn').addEventListener('click', () => {
  const roomId = prompt('Enter room ID:');
  socket.emit('joinRoom', roomId);
});

socket.on('roomCreated', roomId => {
  roomId = roomId;
  console.log('Room created:', roomId);
});

socket.on('gameStart', () => {
  console.log('Game started');
});

socket.on('roomFull', () => {
  console.log('Room is full');
});

// Handle game board update
socket.on('stateChange', board => {
  // Update game board UI
});
