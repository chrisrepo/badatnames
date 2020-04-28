const wordArray = require('./paintGameWords');
const {
  isGuessClose,
  getGuessScore,
  getDrawScore,
  updateScores,
  createScoreObject,
  createEndGameScoreObject,
} = require('./paintGameUtils');
const maxRounds = 2; // TODO: don't hardcode, accept value from host

// Takes clientList map (socket id's are key) & returns the next socket id to
function getNextDrawer(lobby, currentId) {
  const clientArray = Object.keys(lobby.clientList);
  for (let i = 0; i < clientArray.length; i++) {
    if (currentId === null) {
      return clientArray[0];
    }
    if (currentId === clientArray[i]) {
      if (i === clientArray.length - 1) {
        if (maxRounds === lobby.game.round) {
          //END GAME
          return undefined;
        } else {
          lobby.game.round++;
          return clientArray[0];
        }
      } else {
        return clientArray[i + 1];
      }
    }
  }
}

function createHintOrder(word) {
  const hintOrder = [];
  let hintWord = word;
  for (let i = 0; i < word.length; i++) {
    const hintInd = hintOrderHelper(hintWord);
    hintWord = replaceCharAtIndex(hintWord, hintInd, '_');
    hintOrder.push(hintInd);
  }
  return hintOrder;
}

function hintOrderHelper(str) {
  let randomIndex = Math.floor(Math.random() * Math.floor(str.length));
  if (str.charAt(randomIndex) === '_') {
    // if we don't get it randomly, just try the first we find instead of spamming randoms (saves us trouble when only a few hints left)
    for (let i = 0; i < str.length; i++) {
      if (str.charAt(i) !== '_') {
        return i;
      }
    }
  }
  return randomIndex;
}

let hintInterval;
function initiateHintInterval(io, lobby, roomId, roundTime) {
  const hintCount = lobby.game.currentWord.length - 1;
  const hintIntervalSeconds = Math.floor(roundTime / hintCount) * 1000;
  const hintOrder = createHintOrder(lobby.game.currentWord);

  let hintsGiven = 0;
  hintInterval = setInterval(() => {
    // TODO: maybe give less hints? or dynamically choose how many hints to give base on  word length
    // i.e. leave two blanks on 5 letter word, but 3 blanks on 8 letter word.
    if (
      lobby.game.currentWord === null ||
      hintsGiven === lobby.game.currentWord.length - 2
    ) {
      clearInterval(hintInterval);
    }
    const index = hintOrder[hintsGiven];
    lobby.game.guessWord = replaceCharAtIndex(
      lobby.game.guessWord,
      index,
      lobby.game.currentWord.charAt(index)
    );
    io.in(roomId).emit('emit-paint-update-guess-word', {
      word: lobby.game.guessWord,
    });
    hintsGiven++;
  }, hintIntervalSeconds);
}

function replaceCharAtIndex(str, index, replaceChar) {
  let strArr = str.split('');
  strArr[index] = replaceChar;
  return strArr.join('');
}

function endSubRound(io, lobby, roomId) {
  // Clear timeouts/intervals
  clearInterval(hintInterval);
  clearInterval(remainingTimeInterval);
  clearTimeout(guessTimeout);
  //TODO: Show points (just send points out and show small animation on user list (where points are displayed))
  // Get points for the drawer (based on how many people guessed it)
  const rightGuessAmt = Object.keys(lobby.game.correctAnswers).length;
  lobby.game.roundScore[lobby.game.currentDrawer] = getDrawScore(rightGuessAmt);
  // Add points from 'roundScore' to 'score'
  updateScores(lobby);
  // get next word & drawer
  const nextDrawer = getNextDrawer(lobby, lobby.game.currentDrawer);
  const gameScore = createEndGameScoreObject(lobby);
  const roundScore = createScoreObject(lobby);
  if (nextDrawer === undefined) {
    io.in(roomId).emit('emit-paint-end-game', {
      score: gameScore,
      roundScore: roundScore,
    });
  } else {
    lobby.game.currentDrawer = nextDrawer;
    // End round (send word for end round display, since only currentDrawer has the word)
    io.in(roomId).emit('emit-paint-end-sub-round', {
      word: lobby.game.currentWord,
      currentDrawer: lobby.game.currentDrawer,
      round: lobby.game.round,
      score: gameScore,
      roundScore: roundScore,
    });
    // Wipe out some round specific variables
    lobby.game.currentWord = null;
    lobby.game.correctAnswers = {};
    lobby.game.roundScore = {};
    // clear canvas
    io.in(roomId).emit('emit-clear-canvas');
    setTimeout(() => {
      // start pre guess
      startPreGuess(io, lobby);
    }, 5000); // TODO: make post/pre round delay a config
  }
}

function initiateTimeLeftInterval(roundTime) {
  remainingTime = roundTime;
  remainingTimeInterval = setInterval(() => {
    if (remainingTime === 0) {
      clearInterval(remainingTimeInterval);
    }
    remainingTime--;
  }, 1000);
}

let guessTimeout; // Use to watch timeout. If everyone guesses first, we want to clearTimeout()
let remainingTimeInterval;
let remainingTime = 0;
function startGuessTimer(io, lobby, roomId) {
  io.in(roomId).emit('emit-paint-start-timer');
  initiateHintInterval(io, lobby, roomId, lobby.game.maxTime);
  initiateTimeLeftInterval(lobby.game.maxTime);
  guessTimeout = setTimeout(() => {
    endSubRound(io, lobby, roomId);
  }, lobby.game.maxTime * 1000);
}

function shuffleWordOptions(wordsToUse) {
  for (let i = wordsToUse.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * i);
    const temp = wordsToUse[i];
    wordsToUse[i] = wordsToUse[j];
    wordsToUse[j] = temp;
  }
  return wordsToUse;
}

function startPreGuess(io, lobby) {
  // Shuffle & get first 6 words as options
  shuffleWordOptions(lobby.game.wordsToUse);
  const wordOptions = [];
  for (let i = 0; i < 6; i++) {
    wordOptions.push(lobby.game.wordsToUse[i]);
  }
  // Notify current drawer
  io.to(lobby.game.currentDrawer).emit('paint-pre-guess', { wordOptions });
}

function startGame(io, socket, lobby, roomId) {
  // Set lobby object with initial round, drawer, & word list
  let wordsToUse = Object.assign([], wordArray);
  const game = {
    round: 1,
    currentDrawer: getNextDrawer(lobby, null),
    wordsToUse,
    currentWord: null,
    correctAnswers: {}, // Tracks users who have answered correctly
    hasBegun: true,
    maxTime: 15,
    scores: {}, // key: socket id value: score for the user
    roundScore: {}, // same as above but gets cleared each round & added to 'scores' as total
  };
  lobby.game = game;
  // emit current drawer to all in lobby (so they can show the card of that user)
  io.in(roomId).emit('paint-start-game', {
    currentDrawer: game.currentDrawer,
    round: game.round,
  });
  // start pre guess
  startPreGuess(io, lobby, roomId);
}

module.exports = function (io, socket, lobbyList) {
  socket.on('paint-on-clear', (data) => {
    const roomId = 'Paint-' + data.lobbyId;
    io.in(roomId).emit('emit-clear-canvas', data);
  });

  socket.on('paint-entered-game', (data) => {
    const roomId = 'Paint-' + data.lobbyId;
    if (lobbyList[roomId] && lobbyList[roomId].clientList[socket.id]) {
      // Set user as entered game, check if all users have entered
      lobbyList[roomId].clientList[socket.id].enteredGame = true;
      const clients = Object.keys(lobbyList[roomId].clientList);
      let allEntered = true;
      for (let i = 0; i < clients.length; i++) {
        if (!lobbyList[roomId].clientList[clients[i]].enteredGame) {
          allEntered = false;
        }
      }
      if (
        allEntered &&
        (!lobbyList[roomId].game || !lobbyList[roomId].game.hasBegun)
      ) {
        console.log('paint all entered - START GAME');
        //start game logic
        startGame(io, socket, lobbyList[roomId], roomId);
      } else if (
        allEntered &&
        lobbyList[roomId].game &&
        lobbyList[roomId].game.hasBegun
      ) {
        //TODO: User joined late: Notify them of the word
      }
    }
  });

  socket.on('paint-word-picked', (data) => {
    const { word, index, lobbyId } = data;
    const roomId = 'Paint-' + lobbyId;
    let blankWord = '';
    for (let i = 0; i < word.length; i++) {
      if (word.charAt(i) === ' ') {
        blankWord = blankWord + ' ';
      } else {
        blankWord = blankWord + '_';
      }
    }
    // Remove picked word from words available
    lobbyList[roomId].game.wordsToUse.splice(index, 1);
    // Set currentWord in game
    lobbyList[roomId].game.currentWord = word.toLowerCase();
    lobbyList[roomId].game.guessWord = blankWord;
    // Word picked: emit word to guess & start round
    io.in(roomId).emit('emit-paint-word-picked', { word: blankWord });
    startGuessTimer(io, lobbyList[roomId], roomId);
  });

  socket.on('on-paint', (data) => {
    const roomId = 'Paint-' + data.lobbyId;
    socket.to(roomId).emit('emit-paint', data);
  });

  socket.on('paint-guess-word', (data) => {
    const { word, lobbyId, userId } = data;
    const roomId = 'Paint-' + lobbyId;
    const lobby = lobbyList[roomId];
    if (lobby.game.correctAnswers.hasOwnProperty(socket.id)) {
      // If already guess correctly, only emit answer chat
      io.in(roomId).emit('emit-paint-answer-chat', { word, userId });
    } else if (word.toLowerCase() === lobby.game.currentWord) {
      // User has guessed word: Add to correctAnswers
      lobby.game.correctAnswers[socket.id] = true;
      lobby.game.roundScore[socket.id] = getGuessScore(
        remainingTime,
        lobby.game.maxTime,
        Object.keys(lobby.clientList).length
      );
      // Tell everyone this socket got it right (emit user id for putting in chat)
      io.in(roomId).emit('emit-paint-guess-correct', {
        userId,
        socketId: socket.id,
      });
      const correctAnswerLength = Object.keys(lobby.game.correctAnswers).length;
      const lobbyLength = Object.keys(lobby.clientList).length;
      if (correctAnswerLength === lobbyLength - 1) {
        //TODO: Everyone has guessed (but drawer)
        endSubRound(io, lobby, roomId);
      }
    } else if (isGuessClose(word.toLowerCase(), lobby.game.currentWord)) {
      io.in(roomId).emit('emit-paint-guess-close', {
        userId,
        socketId: socket.id,
      });
    } else {
      // Tell everyone this guess was incorrect
      io.in(roomId).emit('emit-paint-guess-chat', { word, userId });
    }
  });
};
