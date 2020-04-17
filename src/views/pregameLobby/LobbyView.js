import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { setLobby } from '../../redux/actions';
import { gamesMap } from '../../constants';

import './LobbyView.css';
import SocketConnection from '../../common/websocket/SocketConnection';
class LobbyView extends React.Component {
  componentDidMount() {
    this.props.connection.websocket.on('emit-start-game', () => {
      const route = gamesMap[this.props.gameSelector.selectedGame];
      this.props.history.push(route);
    });
  }
  startButtonClicked = () => {
    const body = {
      lobbyId: this.props.lobby.lobbyId,
      gameType: this.props.gameSelector.selectedGame,
    };
    this.props.connection.websocket.emit('on-start-game', body);
  };

  render() {
    const showHostStartButton =
      this.props.lobby.host === this.props.connection.websocket.id;
    return (
      <div>
        <SocketConnection lobby={true}></SocketConnection>
        <h3>{this.props.lobby.lobbyId}</h3>
        {Object.keys(this.props.lobby.clientList).map((key, index) => {
          const client = this.props.lobby.clientList[key];
          const isHost = this.props.lobby.host === key ? 'host' : '';
          return (
            <div className={isHost} key={index}>
              {client.username}
            </div>
          );
        })}
        {showHostStartButton && (
          <button onClick={this.startButtonClicked}>Start</button>
        )}
      </div>
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
