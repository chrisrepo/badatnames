// Helper function that does different checks based on
function closeHelper(guess, correct, type) {
  switch (type) {
    case 'missing': {
      const result = [true];
      let errorsFound = 0;
      let missingI = 0;
      if (guess.charAt(0) !== correct.charAt(0)) {
        errorsFound++;
      } else {
        missingI++;
      }
      for (let i = 1; i < correct.length; i++) {
        if (i >= guess.length) {
          break;
        }
        const correctChar = correct.charAt(i);
        const missChar = guess.charAt(missingI);
        result.push(
          (missChar === correctChar && errorsFound < 2) ||
            (result[missingI - 1] && errorsFound < 1)
        );
        if (missChar === correctChar) {
          missingI++;
        } else {
          errorsFound++;
        }
      }
      return result[result.length - 1];
    }
    case 'added': {
      const result = [true];
      let errorsFound = 0;
      let addedI = 1;
      if (guess.charAt(0) !== correct.charAt(0)) {
        errorsFound++;
      }
      for (let i = 1; i < guess.length; i++) {
        if (i >= correct.length) {
          break;
        }
        const correctChar = correct.charAt(addedI);
        const addChar = guess.charAt(i);
        result.push(
          (addChar === correctChar && errorsFound < 2) ||
            (result[addedI - 1] && errorsFound < 1)
        );
        if (addChar === correctChar) {
          addedI++;
        } else {
          errorsFound++;
        }
      }
      return result[result.length - 1];
    }
    default: {
      const result = [true];
      let errorsFound = 0;
      if (guess.charAt(0) !== correct.charAt(0)) {
        errorsFound++;
      }
      for (let i = 1; i < correct.length; i++) {
        if (i >= guess.length) {
          break;
        }
        const correctChar = correct.charAt(i);
        const swapChar = guess.charAt(i);
        result.push(
          (swapChar === correctChar && errorsFound < 2) ||
            (result[i - 1] && errorsFound < 1)
        );
        if (swapChar !== correctChar) {
          errorsFound++;
        }
      }
      return result[result.length - 1];
    }
  }
}

// Constant values to hold base modifiers for points (easier tweaking)
const GUESS_SCORE_MOD = 100;
const DRAW_SCORE_MOD = 50;
module.exports = {
  isGuessClose(guess, correctWord) {
    if (
      guess.length - 1 > correctWord.length ||
      correctWord.length - 1 > guess.length
    ) {
      // Greater than 1 letter difference, cannot be close
      return false;
    }
    const missingResult = closeHelper(guess, correctWord, 'missing');
    const swapResult = closeHelper(guess, correctWord, 'swap');
    const addedResult = closeHelper(guess, correctWord, 'added');
    return swapResult || addedResult || missingResult;
  },
  getGuessScore(remainingTime, maxTime, totalPlayers) {
    const maxPoints = totalPlayers * GUESS_SCORE_MOD;
    return maxPoints * (remainingTime / maxTime);
  },
  getDrawScore(rightGuesses) {
    return DRAW_SCORE_MOD * rightGuesses;
  },
  updateScores(lobby) {
    Object.keys(lobby.clientList).forEach((key) => {
      let gameScore = lobby.game.scores[key] || 0;
      let roundScore = lobby.game.roundScore[key] || 0;
      lobby.game.scores[key] = Math.ceil(gameScore + roundScore);
    });
  },
  createScoreObject(lobby) {
    const output = [];
    Object.keys(lobby.clientList).forEach((key) => {
      const user = lobby.clientList[key].username;
      const score = lobby.game.roundScore[key] || 0;
      output.push({ user, score: Math.ceil(score) });
    });
    //TODO: sort by most to least
    return output;
  },
  createEndGameScoreObject(lobby) {
    const output = {};
    Object.keys(lobby.clientList).forEach((key) => {
      const user = lobby.clientList[key].username;
      const score = lobby.game.scores[key] || 0;
      output[key] = { user, score: Math.ceil(score) };
    });
    //TODO: sort by most to least
    return output;
  },
};
