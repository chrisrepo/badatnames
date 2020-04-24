import React from 'react';
import { connect } from 'react-redux';
import { setLobby } from '../../redux/actions';
import SocketConnection from '../../common/websocket/SocketConnection';
class UserList extends React.Component {
  render() {
    return (
      <div id="user-list-container">
        <SocketConnection lobby={true} />
        <div id="lobby-id-container">
          <div id="lobby-id">
            <span id="lobby-id-name">Paint-</span>
            <span id="lobby-id-value">{this.props.lobby.lobbyId}</span>
          </div>
        </div>
        <div id="round-container">
          <div id="round-counter">Round {this.props.paint.round} of X</div>
        </div>
        <div id="user-container">
          {Object.keys(this.props.lobby.clientList).map((key, index) => {
            const client = this.props.lobby.clientList[key];
            return <div key={index}>{client.username}</div>;
          })}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  connection: state.connection,
  lobby: state.lobby,
  paint: state.paintGame,
});
export default connect(mapStateToProps, { setLobby })(UserList);
