const utils = require('./utils');

module.exports = function (io, socket, lobbyList, clientList) {
  socket.on('create-lobby', (data) => {
    // TODO: Maybe create something to handle collisions
    const lobbyId = utils.generateRoomId();
    const { game, username } = data;
    const roomId = game + '-' + lobbyId;
    const clientList = {};
    clientList[socket.id] = { id: socket.id, username };
    lobbyList[roomId] = {
      host: socket.id,
      started: false,
      clientList,
    };
    socket.join(roomId);
    const lobby = Object.assign({}, lobbyList[roomId]);
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
        error: 'Could not find room with code: ' + lobbyId,
      });
    }
  });

  socket.on('on-join-request', (data) => {
    // Need to clone object when using 'io' api directly, or it will reference the original unmodified clientList
    const list = Object.assign({}, clientList);
    io.to(socket.id).emit('emit-join', list);
  });

  socket.on('on-start-game', (data) => {
    const roomId = data.gameType + '-' + data.lobbyId;
    lobbyList[roomId].started = true;
    io.to(roomId).emit('emit-start-game', { ballLaunch: true });
  });
};
