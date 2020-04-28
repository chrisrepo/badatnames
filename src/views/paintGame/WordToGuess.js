import React from 'react';
import { connect } from 'react-redux';
import Timer from './Timer';

const WordToGuess = (props) => {
  const header = props.paint.isCurrentDrawer ? 'Drawing:' : 'Word:';
  const displayWord = props.paint.isCurrentDrawer
    ? props.paint.drawingWord
    : props.paint.guessingWord;
  return (
    <div className="word-to-guess-wrapper">
      <div className="word-to-guess">
        {props.paint.isTimerRunning && <Timer maxTime={props.paint.maxTime} />}
        <div className="word-to-guess-header">{header}</div>
        <div className="word-to-guess-text">{displayWord}</div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  paint: state.paintGame,
});
export default connect(mapStateToProps, {})(WordToGuess);
