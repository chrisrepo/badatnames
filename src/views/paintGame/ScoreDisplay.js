import React from 'react';
import './ScoreDisplay.css';
const ScoreDisplay = ({ scores, word, show, isEndGame, nextDrawer }) => {
  const style = show
    ? 'score-display-container show'
    : 'score-display-container';
  return (
    <div className={style}>
      {isEndGame && getEndGameScore(orderScores(scores))}
      {!isEndGame && getScores(orderScores(scores), word, nextDrawer)}
    </div>
  );
};

const getScores = (scores, word, nextDrawer) => {
  return (
    <React.Fragment>
      <div className="score-display-header">Word: {word}</div>
      {scores.map((scoreObj, i) => {
        return (
          <div key={i} className="sub-round-score">
            <span className="user">{scoreObj.user}</span>:
            <span className="score text-success">+{scoreObj.score}</span>
          </div>
        );
      })}
      <div className="score-display-drawer">Picking Word: {nextDrawer}</div>
    </React.Fragment>
  );
};

const orderScores = (scores) => {
  const scoreArr = Object.keys(scores).map((key) => {
    const scoreObj = scores[key];
    return { key, user: scoreObj.user, score: scoreObj.score };
  });

  scoreArr.sort(function (a, b) {
    return b.score - a.score;
  });

  return scoreArr;
};

const getEndGameScore = (scores) => {
  return (
    <React.Fragment>
      <div className="score-display-header">Game Over</div>
      {scores.map((scoreObj, index) => {
        return (
          <div
            id={index}
            className={`end-game-score ${getRankClass(index + 1)}`}
          >
            <span className="rank">#{index + 1}</span>
            <span className="user">{scoreObj.user}</span>
            <span className="score">{scoreObj.score}</span>
          </div>
        );
      })}
    </React.Fragment>
  );
};

const getRankClass = (rank) => {
  if (rank === 1) {
    return 'first-place';
  } else if (rank === 2) {
    return 'second-place';
  } else if (rank === 3) {
    return 'third-place';
  }
  return 'no-place';
};
export default ScoreDisplay;
