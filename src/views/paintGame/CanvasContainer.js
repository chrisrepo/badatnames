import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PaintCursor from './PaintCursor';
import PreGuessModal from './PreGuessModal';
import Canvas from './Canvas';
import ScoreDisplay from './ScoreDisplay';
import { canvasContainerRef } from '../../constants';
import {
  setDrawingWord,
  setGuessingWord,
  setCurrentDrawer,
  setSubRoundStarted,
  setRound,
  setTimer,
  showScore,
  setHostOptions,
} from '../../redux/actions';

class CanvasContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showPreGuessModal: false,
      preGuessOptions: [],
      displayWord: '',
    };
  }

  componentDidMount() {
    if (!this.props.lobby.lobbyId || this.props.lobby.lobbyId.length === 0) {
      this.props.history.push('/');
    }

    this.props.connection.websocket.emit('paint-entered-game', {
      lobbyId: this.props.lobby.lobbyId,
    });

    this.props.connection.websocket.on('emit-paint-end-game', (data) => {
      this.props.showScore({
        show: true,
        score: data.score,
        roundScore: data.roundScore,
        isGameOver: true,
      });
    });

    this.props.connection.websocket.on('emit-paint-end-sub-round', (data) => {
      this.setState({
        displayWord: data.word,
      });
      this.props.showScore({
        show: true,
        score: data.score,
        roundScore: data.roundScore,
        isGameOver: false,
        nextDrawer: data.currentDrawer,
      });
    });
    this.props.connection.websocket.on('paint-pre-guess', (data) => {
      this.setState({
        showPreGuessModal: true,
        preGuessOptions: data.wordOptions,
      });
    });
    this.props.connection.websocket.on('emit-paint-word-picked', (data) => {
      this.props.showScore({
        show: false,
        score: this.props.paint.score,
        roundScore: this.props.paint.roundScore,
        isGameOver: false,
      });
      // Should be an empty word (replaced by underscores);
      this.props.setGuessingWord(data.word);
      this.props.setSubRoundStarted(true);
    });
    this.props.connection.websocket.on(
      'emit-paint-update-guess-word',
      (data) => {
        this.props.setGuessingWord(data.word);
      }
    );
    this.props.connection.websocket.on('paint-start-game', (data) => {
      window.console.log('paint start game', data);
      this.props.setRound(data.round);
      this.props.setHostOptions({
        maxTime: data.maxTime,
        maxRounds: data.maxRounds,
      });
    });
    this.props.connection.websocket.on('emit-paint-start-timer', () => {
      this.props.setTimer(true);
    });
  }

  onWordOptionSelection = (word, index) => {
    this.setState({
      showPreGuessModal: false,
      preGuessOptions: [],
    });
    this.props.connection.websocket.emit('paint-word-picked', {
      word,
      index,
      lobbyId: this.props.lobby.lobbyId,
    });
    this.props.setDrawingWord(word);
    this.props.setCurrentDrawer(true);
  };

  render() {
    const scoreToShow = this.props.paint.gameOver
      ? this.props.paint.score
      : this.props.paint.roundScore;
    const drawerClient = this.props.lobby.clientList[
      this.props.paint.nextDrawer
    ];
    const nextDrawer = drawerClient ? drawerClient.username : '';
    return (
      <Fragment>
        <PreGuessModal
          show={this.state.showPreGuessModal}
          wordOptions={this.state.preGuessOptions}
          wordSelected={this.onWordOptionSelection}
        />
        <div id={canvasContainerRef} style={{ cursor: 'none' }}>
          <PaintCursor containerRef={canvasContainerRef} />
          <ScoreDisplay
            word={this.state.displayWord}
            scores={scoreToShow}
            show={this.props.paint.showScore}
            isEndGame={this.props.paint.gameOver}
            nextDrawer={nextDrawer}
          />
          <Canvas isCurrentDrawer={this.props.paint.isCurrentDrawer} />
        </div>
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  connection: state.connection,
  lobby: state.lobby,
  user: state.user,
  paint: state.paintGame,
});
export default connect(mapStateToProps, {
  setDrawingWord,
  setGuessingWord,
  setCurrentDrawer,
  setSubRoundStarted,
  setRound,
  setTimer,
  showScore,
  setHostOptions,
})(CanvasContainer);
