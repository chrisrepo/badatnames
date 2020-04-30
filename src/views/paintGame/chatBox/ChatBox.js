import React from 'react';
import { connect } from 'react-redux';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import {
  endCurrentSubRound,
  setRound,
  setCurrentDrawer,
  setTimer,
} from '../../../redux/actions';
import './ChatBox.css';
class ChatBox extends React.Component {
  state = {
    guessText: '',
    guessedCorrect: false,
    chat: [], //Simple array that will hold chat message objects (to be cleared each subround)
  };

  componentDidMount() {
    this.props.websocket.on('emit-paint-end-sub-round', (data) => {
      this.setState({ chat: [], guessedCorrect: false, guessText: '' });
      this.props.endCurrentSubRound();
      this.props.setRound(data.round);
      this.props.setCurrentDrawer(false);
      this.props.setTimer(false);
    });

    this.props.websocket.on('emit-paint-end-game', () => {
      this.setState({ chat: [], guessedCorrect: false, guessText: '' });
      this.props.endCurrentSubRound();
      this.props.setCurrentDrawer(false);
      this.props.setTimer(false);
    });

    this.props.websocket.on('emit-paint-guess-chat', (data) => {
      const { word, userId } = data;
      // Post in chat with the user id
      const chatObj = {
        type: 'guess',
        userId,
        text: `: ${word}`,
      };
      this.setState({ chat: [...this.state.chat, chatObj] });
    });

    this.props.websocket.on('emit-paint-answer-chat', (data) => {
      if (this.state.guessedCorrect || this.props.paint.isCurrentDrawer) {
        const { word, userId } = data;
        // Post in chat with the user id
        const chatObj = {
          type: 'answer',
          userId,
          text: `: ${word}`,
        };
        this.setState({ chat: [...this.state.chat, chatObj] });
      }
    });

    this.props.websocket.on('emit-paint-guess-correct', (data) => {
      const { socketId, userId } = data;
      if (socketId === this.props.websocket.id) {
        this.setState({ guessedCorrect: true });
      }
      // Post in chat with the user id
      const chatObj = {
        type: 'correct',
        userId,
        text: ' guessed the correct answer!',
      };
      this.setState({ chat: [...this.state.chat, chatObj] });
    });

    this.props.websocket.on('emit-paint-guess-close', (data) => {
      const { userId } = data;
      // Post in chat with the user id
      const chatObj = {
        type: 'close',
        userId,
        text: ' is close!',
      };
      this.setState({ chat: [...this.state.chat, chatObj] });
    });
  }
  guessTextOnChange = (e) => {
    this.setState({ guessText: e.target.value });
  };

  submitGuess = () => {
    if (this.state.guessText && this.state.guessText.length > 0) {
      const body = {
        lobbyId: this.props.lobby.lobbyId,
        userId: this.props.user.username,
        word: this.state.guessText,
      };
      // Emit guess then clear input
      this.props.websocket.emit('paint-guess-word', body);
      this.setState({ guessText: '' });
    }
  };

  renderGuessChat = () => {
    return (
      <React.Fragment>
        {this.state.chat.map((chatObj, id) => {
          let classVal = 'chat-message';
          switch (chatObj.type) {
            case 'answer': {
              classVal += ' text-info';
              break;
            }
            case 'correct': {
              classVal += ' text-success';
              break;
            }
            case 'close': {
              classVal += ' text-warning';
              break;
            }
            default: {
              //case 'guess'
              classVal += ' guess';
              break;
            }
          }
          return (
            <p key={id} className={classVal}>
              <span className="chat-user">{chatObj.userId}</span>
              {chatObj.text}
            </p>
          );
        })}
      </React.Fragment>
    );
  };

  render() {
    return (
      <div id="chat-box-container">
        <div id="chat-messages-container">{this.renderGuessChat()}</div>
        <InputGroup size="md" className="mb-1 mt-1">
          <InputGroup.Prepend>
            <InputGroup.Text>Guess: </InputGroup.Text>
          </InputGroup.Prepend>
          <FormControl
            onChange={this.guessTextOnChange}
            value={this.state.guessText}
            onKeyPress={(event) => {
              if (event.key === 'Enter') {
                this.submitGuess();
              }
            }}
            disabled={
              !this.props.paint.subRoundStarted ||
              this.props.paint.isCurrentDrawer
            }
          />
        </InputGroup>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  websocket: state.connection.websocket,
  lobby: state.lobby,
  user: state.user,
  paint: state.paintGame,
});
export default connect(mapStateToProps, {
  endCurrentSubRound,
  setRound,
  setCurrentDrawer,
  setTimer,
})(ChatBox);
