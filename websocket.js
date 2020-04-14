const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

//Port from environment variable or default - 4001
const port = process.env.PORT || 4001;

//Setting up express and adding socketIo middleware
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Server vars
var clientList = [];

//Setting up a socket with the namespace "connection" for new sockets
io.on('connection', (socket) => {
  clientList[socket.id] = { id: socket.id };

  socket.on('on-join-request', (data) => {
    // Need to clone object when using 'io' api directly, or it will reference the original unmodified clientList
    const list = Object.assign({}, clientList);
    io.to(socket.id).emit('emit-join', list);
  });

  socket.on('on-paint', (data) => {
    socket.to('paintRoom').emit('emit-paint', data);
  });

  //TODO: Join a dynamic room based on data passed in (insteand of join paint it would be join-room)
  socket.on('join-paint', (data) => {
    socket.join('paintRoom');
  });

  socket.on('on-clear-vote', (data) => {
    console.log('clear vote', data);
    io.in('paintRoom').emit('emit-clear-canvas', data);
  });

  socket.on('on-join', (data) => {
    onJoinRejoin(data);
  });

  socket.on('update-user', (data) => {
    onJoinRejoin(data);
  });

  const onJoinRejoin = (data) => {
    clientList[socket.id].username = data.username;
    const list = Object.assign({}, clientList);
    socket.broadcast.emit('emit-join', list);
  };

  //A special namespace "disconnect" for when a client disconnects
  socket.on('disconnect', () => {
    delete clientList[socket.id];
    const list = Object.assign({}, clientList);
    socket.broadcast.emit('emit-join', list);
    console.log('Client disconnected - new list', list);
  });
});

server.listen(port, () => console.log(`Listening on port ${port}`));
