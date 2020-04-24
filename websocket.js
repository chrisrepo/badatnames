const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const jsdom = require('jsdom');
const Datauri = require('datauri');

const utils = require('./websocket/utils');

// Headless server vars
const datauri = new Datauri();
const { JSDOM } = jsdom;

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
  console.log('main websocket user connected', socket.id);
  clientList[socket.id] = { id: socket.id };

  socket.on('disconnecting', () => {
    // Emit leave room & reassign
    if (io.sockets.adapter.sids[socket.id] !== undefined) {
      const rooms = Object.keys(io.sockets.adapter.sids[socket.id]).filter(
        (item) => item !== socket.id
      );
      if (rooms.length > 0) {
        for (let i = 0; i < rooms.length; i++) {
          const room = lobbyList[rooms[i]];
          if (!room) return;
          const newClientList = utils.filterOutDisconnectedClient(
            room.clientList,
            socket.id
          );
          if (
            room.host === socket.id &&
            Object.keys(room.clientList).length > 1
          ) {
            const newHostKey = Object.keys(newClientList)[0];
            const newHost = newClientList[newHostKey].id;
            lobbyList[rooms[i]].host = newHost;
            io.to(newHost).emit('host-migration');
          }
          if (Object.keys(newClientList).length === 0) {
            // Close room
            delete lobbyList[rooms[i]];
          } else {
            // Emit to room that it's left
            lobbyList[rooms[i]].clientList = newClientList;
            const lobby = Object.assign({}, lobbyList[rooms[i]]);
            // TODO: Make it a new emit for leaving lobby, or change to emit-update-lobby
            socket.to(rooms[i]).emit('emit-join-lobby', { lobby });
          }
        }
      }
    }
  });
  //A special namespace "disconnect" for when a client disconnects
  socket.on('disconnect', () => {
    delete clientList[socket.id];
    const list = Object.assign({}, clientList);
    socket.broadcast.emit('emit-join', list);
  });

  // Game logic
  require('./websocket/lobbyWebsocket.js')(io, socket, lobbyList, clientList);
  require('./websocket/paintWebsocket.js')(io, socket, lobbyList);
});
function setupAuthoritativePhaser() {
  JSDOM.fromFile(path.join(__dirname, 'gameServers/pongServer/index.html'), {
    runScripts: 'dangerously', // To run the scripts in the html file
    resources: 'usable', // Also load supported external resources
    pretendToBeVisual: true, // So requestAnimatinFrame events fire
  })
    .then((dom) => {
      dom.window.URL.createObjectURL = (blob) => {
        if (blob) {
          return datauri.format(
            blob.type,
            blob[Object.getOwnPropertySymbols(blob)[0]]._buffer
          ).content;
        }
      };
      dom.window.URL.revokeObjectURL = (objectURL) => {};
      dom.window.gameLoaded = () => {
        console.log('Serverside Pong Game Loaded');
      };
      dom.window.io = io;
    })
    .catch((error) => {
      console.log(error.message);
    });
}
//setupAuthoritativePhaser(); Dont do pong stuff rn
server.listen(port, () => console.log(`Listening on port ${port}`));
