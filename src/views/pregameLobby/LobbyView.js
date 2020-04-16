import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { setLobby } from '../../redux/actions';

import './LobbyView.css';
import SocketConnection from '../../common/websocket/SocketConnection';
class LobbyView extends React.Component {
  componentDidMount() {
    // Redirect to home if no lobby detected
    if (this.props.lobby.lobbyId.length === 0) {
      this.props.history.push('/');
    }
  }

  startButtonClicked = () => {
    this.props.history.push('/paint');
  };

  render() {
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
        <button onClick={this.startButtonClicked}>Start</button>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  connection: state.connection,
  lobby: state.lobby,
  user: state.user,
});
export default connect(mapStateToProps, { setLobby })(withRouter(LobbyView));
