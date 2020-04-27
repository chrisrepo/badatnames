import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PaintCursor from './PaintCursor';
import PreGuessModal from './PreGuessModal';
import Canvas from './Canvas';
import { canvasContainerRef } from '../../constants';
import {
  setDrawingWord,
  setGuessingWord,
  setCurrentDrawer,
  setSubRoundStarted,
  setRound,
  setTimer,
} from '../../redux/actions';

class CanvasContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showPreGuessModal: false,
      preGuessOptions: [],
    };
  }

  componentDidMount() {
    this.props.connection.websocket.emit('paint-entered-game', {
      lobbyId: this.props.lobby.lobbyId,
    });
    this.props.connection.websocket.on('paint-pre-guess', (data) => {
      this.setState({
        showPreGuessModal: true,
        preGuessOptions: data.wordOptions,
      });
    });
    this.props.connection.websocket.on('emit-paint-word-picked', (data) => {
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
    return (
      <Fragment>
        <PreGuessModal
          show={this.state.showPreGuessModal}
          wordOptions={this.state.preGuessOptions}
          wordSelected={this.onWordOptionSelection}
        />
        <div id={canvasContainerRef} style={{ cursor: 'none' }}>
          <PaintCursor containerRef={canvasContainerRef} />
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
})(CanvasContainer);
