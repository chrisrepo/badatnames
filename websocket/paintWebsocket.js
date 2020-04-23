const wordArray = require('./paintGameWords');
const maxRounds = 2;

function pickWord(wordsToUse) {
  if (wordsToUse.length === 0) {
    wordsToUse = Object.assign([], wordArray);
  }
  const randomWordIndex = Math.floor(Math.random() * wordArray.length);
  const nextWord = wordsToUse[randomWordIndex];
  let newWordsToUse = wordsToUse.splice(randomWordIndex, 1);
  return { nextWord, wordsToUser: newWordsToUse };
}

// Takes clientList map (socket id's are key) & returns the next socket id to
function getNextDrawer(lobby, currentId, clientList) {
  const clientArray = Object.keys(clientList);
  const next = clientArray.forEach((key, index) => {
    if (currentId === key) {
      if (index === clientArray.length - 1) {
        if (maxRounds === lobby.round) {
          //TODO: END GAME
        } else {
          lobby.round++;
          return clientArray[0];
        }
      } else {
        return clientArray[index + 1];
      }
    }
  });
  return next;
}

function setNextTimer() {
  setTimeout(() => {
    // End round
    // Show points
    // get next word & drawer
    // start round & set next timer
  }, 5000); // TODO: Change to a real time or make configurable
}

// TODO: Inital start game function, will call 'setNextTimer' and let that handle all the logic from there
function startGame(io) {}

module.exports = function (io, socket, lobbyList) {
  socket.on('paint-on-clear', (data) => {
    const roomId = 'Paint-' + data.lobbyId;
    if (lobbyList[roomId] && socket.id === lobbyList[roomId].host) {
      io.in(roomId).emit('emit-clear-canvas', data);
    }
  });

  socket.on('paint-entered-game', (data) => {
    const roomId = 'Paint-' + data.lobbyId;
    if (lobbyList[roomId] && lobbyList[roomId].clientList[socket.id]) {
      // Set user as entered game, check if all users have entered
      lobbyList[roomId].clientList[socket.id].enteredGame = true;
      const clients = Object.keys(lobbyList[roomId].clientList);
      const allEntered = true;
      for (let i = 0; i < clients.length; i++) {
        if (!lobbyList[roomId].clientList[clients[i]].enteredGame) {
          allEntered = false;
        }
      }
      if (allEntered) {
        //TODO: start game logic
        let wordsToUse = Object.assign([], wordArray);
        lobbyList[roomId].round = 0; // Track round, end at 2
        //io.in(roomId).emit('paint-game-start');
      }
    }
  });

  socket.on('on-paint', (data) => {
    const roomId = 'Paint-' + data.lobbyId;
    socket.to(roomId).emit('emit-paint', data);
  });
};
