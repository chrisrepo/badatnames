const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const utils = require('./websocket/utils');
//Port from environment variable or default - 4001
const port = process.env.PORT || 4001;

//Setting up express and adding socketIo middleware
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Server vars
var clientList = [];
var lobbyList = {};

//Setting up a socket with the namespace "connection" for new sockets
io.on('connection', (socket) => {
  clientList[socket.id] = { id: socket.id };

  socket.on('on-join-request', (data) => {
    // Need to clone object when using 'io' api directly, or it will reference the original unmodified clientList
    const list = Object.assign({}, clientList);
    io.to(socket.id).emit('emit-join', list);
  });

  socket.on('create-lobby', (data) => {
    // TODO: Maybe create something to handle collisions
    const lobbyId = utils.generateRoomId();
    const { game, username } = data;
    const roomId = game + '-' + lobbyId;
    const clientList = {};
    clientList[socket.id] = { id: socket.id, username };
    lobbyList[roomId] = {
      host: socket.id,
      clientList,
    };
    socket.join(roomId);
    const lobby = Object.assign({}, lobbyList[roomId]);
    console.log('create', lobby, lobbyList[roomId]);
    io.in(roomId).emit('emit-join-lobby', { lobby, lobbyId });
  });

  socket.on('join-lobby', (data) => {
    const { game, lobbyId, username } = data;
    const roomId = game + '-' + lobbyId;
    if (lobbyList[roomId]) {
      let newClientList = lobbyList[roomId].clientList;
      newClientList[socket.id] = {
        id: socket.id,
        username,
      };
      lobbyList[roomId].clientList = newClientList;
      socket.join(roomId);
      const lobby = Object.assign({}, lobbyList[roomId]);
      io.in(roomId).emit('emit-join-lobby', { lobby, lobbyId });
    } else {
      io.to(socket.id).emit('emit-join-lobby', {
        error: 'could not find room',
      });
    }
  });

  socket.on('on-paint', (data) => {
    const roomId = 'Paint-' + data.lobbyId;
    socket.to(roomId).emit('emit-paint', data);
  });

  //TODO: Join a dynamic room based on data passed in (insteand of join paint it would be join-room)
  socket.on('join-paint', (data) => {
    socket.join('paintRoom');
  });

  socket.on('on-clear-vote', (data) => {
    console.log('clear vote', data);
    const roomId = 'Paint-' + data.lobbyId;
    io.in(roomId).emit('emit-clear-canvas', data);
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

  socket.on('disconnecting', () => {
    // Emit leave room & reassign
    if (io.sockets.adapter.sids[socket.id] !== undefined) {
      const rooms = Object.keys(io.sockets.adapter.sids[socket.id]).filter(
        (item) => item !== socket.id
      );
      console.log('try migrating host', rooms);
      if (rooms.length > 0) {
        for (let i = 0; i < rooms.length; i++) {
          const room = lobbyList[rooms[i]];
          console.log('migrating from room', room, rooms[i], lobbyList);
          if (!room) return;
          const newClientList = utils.filterOutDisconnectedClient(
            room.clientList,
            socket.id
          );
          console.log(
            'new client list',
            room.host,
            socket.id,
            Object.keys(room.clientList).length
          );
          if (
            room.host === socket.id &&
            Object.keys(room.clientList).length > 1
          ) {
            const newHostKey = Object.keys(newClientList)[0];
            const newHost = newClientList[newHostKey].id;
            lobbyList[rooms[i]].host = newHost;
            console.log(
              'Host migration for room ',
              rooms[i],
              ' new host:',
              newHost
            );
            io.to(newHost).emit('host-migration');
          }
          // Emit to room that it's left
          lobbyList[rooms[i]].clientList = newClientList;
          const lobby = Object.assign({}, lobbyList[rooms[i]]);
          // TODO: Make it a new emit for leaving lobby, or change to emit-update-lobby
          socket.to(rooms[i]).emit('emit-join-lobby', { lobby });
        }
      }
    }
  });
  //A special namespace "disconnect" for when a client disconnects
  socket.on('disconnect', () => {
    delete clientList[socket.id];
    const list = Object.assign({}, clientList);
    socket.broadcast.emit('emit-join', list);
    console.log('Client disconnected - new list', list);
  });
});

server.listen(port, () => console.log(`Listening on port ${port}`));
