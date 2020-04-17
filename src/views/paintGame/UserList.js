import React from 'react';
import { connect } from 'react-redux';
import { setLobby } from '../../redux/actions';
import SocketConnection from '../../common/websocket/SocketConnection';
class UserList extends React.Component {
  render() {
    return (
      <div>
        <SocketConnection lobby={true} />
        <h3>Lobby Id: {this.props.lobby.lobbyId}</h3>
        {Object.keys(this.props.lobby.clientList).map((key, index) => {
          const client = this.props.lobby.clientList[key];
          return <div key={index}>{client.username}</div>;
        })}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  connection: state.connection,
  lobby: state.lobby,
});
export default connect(mapStateToProps, { setLobby })(UserList);
