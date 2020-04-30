import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Container from 'react-bootstrap/Container';

import './LobbyView.css';

import { setLobby } from '../../redux/actions';
import { gamesMap } from '../../constants';
import UserList from '../../common/users/UserList';
import SocketConnection from '../../common/websocket/SocketConnection';
import PaintLobbyOptions from './PaintLobbyOptions';
class LobbyView extends React.Component {
  state = {
    gameSpecificOptions: {},
  };

  componentDidMount() {
    if (!this.props.lobby.lobbyId || this.props.lobby.lobbyId.length === 0) {
      this.props.history.push('/');
    }
    this.props.connection.websocket.on('emit-start-game', () => {
      const route = gamesMap[this.props.gameSelector.selectedGame];
      this.props.history.push(route);
    });
  }

  startButtonClicked = () => {
    const body = {
      lobbyId: this.props.lobby.lobbyId,
      gameType: this.props.gameSelector.selectedGame,
      gameOptions: this.state.gameSpecificOptions,
    };
    this.props.connection.websocket.emit('on-start-game', body);
  };

  setGameSpecificOptions = (options) => {
    this.setState({ gameSpecificOptions: options });
  };

  render() {
    const canStart = Object.keys(this.props.lobby.clientList).length > 1;
    const gameType = this.props.gameSelector.selectedGame;
    const showHostStartButton =
      this.props.lobby.host === this.props.connection.websocket.id;
    const buttonColor = canStart ? 'btn-primary' : 'btn-secondary';
    return (
      <Container className="lobbyViewContainer">
        <SocketConnection lobby={true}></SocketConnection>
        <h4>Lobby Code: {gameType + '-' + this.props.lobby.lobbyId}</h4>
        <UserList lobby={this.props.lobby} />
        {gameType === 'Paint' && showHostStartButton && (
          <PaintLobbyOptions setOptions={this.setGameSpecificOptions} />
        )}
        {showHostStartButton && (
          <button
            disabled={!canStart}
            className={`btn ${buttonColor}`}
            onClick={this.startButtonClicked}
          >
            Start
          </button>
        )}
      </Container>
    );
  }
}

const mapStateToProps = (state) => ({
  connection: state.connection,
  lobby: state.lobby,
  user: state.user,
  gameSelector: state.gameSelector,
});
export default connect(mapStateToProps, { setLobby })(withRouter(LobbyView));
