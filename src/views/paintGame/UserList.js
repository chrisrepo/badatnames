import React from 'react';
import { connect } from 'react-redux';
import { setLobby } from '../../redux/actions';
import SocketConnection from '../../common/websocket/SocketConnection';

import './UserList.css';

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
          <div id="round-counter">
            Round {this.props.paint.round} of {this.props.paint.maxRounds}
          </div>
        </div>
        <div id="user-container">
          <div className="user-header-wrapper">
            <span className="username-header">Username</span>
            <span className="score-header">Points</span>
          </div>
          {Object.keys(this.props.lobby.clientList).map((key, index) => {
            const isUserStyle =
              key === this.props.websocket.id ? ' is-user' : '';
            const client = this.props.lobby.clientList[key];
            const scoreObj = this.props.paint.score[key];
            return (
              <div className="user-wrapper" key={index}>
                <span className={`username${isUserStyle}`}>
                  {client.username}
                </span>
                <span className="score">{scoreObj ? scoreObj.score : 0}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  websocket: state.connection.websocket,
  lobby: state.lobby,
  paint: state.paintGame,
});
export default connect(mapStateToProps, { setLobby })(UserList);
