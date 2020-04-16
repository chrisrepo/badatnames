function generateRoomId() {
  return Math.random().toString(32).toUpperCase().slice(2, 6);
}

function getRoomsForSocketId(io, socketId) {
  return Object.keys(io.sockets.adapter.sids[socketId]).filter(
    (item) => item !== socketId
  );
}

function filterOutDisconnectedClient(clientList, id) {
  return Object.keys(clientList)
    .filter((socketId) => socketId !== id)
    .reduce((obj, key) => {
      obj[key] = clientList[key];
      return obj;
    }, {});
}

module.exports = {
  generateRoomId,
  filterOutDisconnectedClient,
};
