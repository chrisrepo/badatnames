import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import GameSelector from './GameSelector';
import { setUser, setLobby } from '../../redux/actions';
import { gamesMap } from '../../constants';

// Local Imports
import './Login.css';
import JoinSelector from './JoinSelector';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = { username: '', lobbyId: '', error: undefined };
  }

  componentDidMount() {
    this.props.connection.websocket
      .off('emit-join-lobby')
      .on('emit-join-lobby', (data) => {
        if (data.error) {
          this.setState({
            error: data.error,
          });
          return;
        } else {
          const lobbyId = data.lobbyId;
          const lobby = data.lobby;
          const setLobbyObj = {
            ...lobby,
          };
          if (lobbyId) {
            setLobbyObj.lobbyId = lobbyId;
          }
          this.props.setLobby({
            ...setLobbyObj,
          });
          // Join game or join lobby
          if (lobby.started) {
            const route = gamesMap[this.props.gameSelector.selectedGame];
            this.props.history.push(route);
          } else {
            this.props.history.push('/lobby');
          }
        }
      });
  }

  handleUsernameChange = (event) => {
    this.setState({ username: event.target.value });
  };
  handleLobbyIdChange = (event) => {
    this.setState({ lobbyId: event.target.value });
  };

  goButtonClicked = () => {
    const type = this.props.gameSelector.connectionType;
    let body = {};
    if (type === 'join') {
      body = {
        game: this.props.gameSelector.selectedGame,
        username: this.state.username,
        lobbyId: this.state.lobbyId,
      };
    } else {
      body = {
        game: this.props.gameSelector.selectedGame,
        username: this.state.username,
      };
    }
    window.console.log('go clicked', type, `${type}-lobby`, body);
    this.props.connection.websocket.emit(`${type}-lobby`, body);
  };

  render() {
    return (
      <div className="main-page-wrapper">
        <div id="gameSelectorContainer">
          <GameSelector />
        </div>
        <JoinSelector />
        <div className="log-in">
          <div className="form__group field">
            <input
              type="text"
              value={this.state.username}
              onChange={this.handleUsernameChange}
              className="form__field"
              placeholder="Username"
            />
            <label className="form__label">Username</label>
          </div>
          {this.props.gameSelector.connectionType === 'join' && (
            <div className="form__group field">
              <input
                type="text"
                value={this.state.lobbyId}
                onChange={this.handleLobbyIdChange}
                className="form__field"
                placeholder="Lobby Code"
              />
              <label className="form__label">Lobby Code</label>
            </div>
          )}
          <div>
            <button onClick={() => this.goButtonClicked()}>Go</button>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  connection: state.connection,
  gameSelector: state.gameSelector,
});
export default connect(mapStateToProps, { setUser, setLobby })(
  withRouter(Login)
);
