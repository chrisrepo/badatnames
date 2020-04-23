import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { setLobby } from '../../redux/actions';
import { withRouter } from 'react-router-dom';

// Empty Component that can be used for socket connections to prevent duplicat on listener code
class SocketConnection extends React.Component {
  componentDidMount() {
    if (this.props.connection.websocket !== null) {
      if (this.props.lobby) {
        // Redirect to home if no lobby detected
        if (this.props.lobby.lobbyId.length === 0) {
          //DONT COMMIT THIS CAHNGE
          //this.props.history.push('/');
        }
        this.initializeLobbyListener();
      }
    }
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.connection.websocket &&
      prevProps.connection.websocket === null
    ) {
      if (this.props.lobby) {
        this.initializeLobbyListener();
      }
    }
  }

  initializeLobbyListener() {
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
        }
      });
  }

  render() {
    return <Fragment></Fragment>;
  }
}

const mapStateToProps = (state) => ({
  connection: state.connection,
  lobby: state.lobby,
  user: state.user,
});
export default connect(mapStateToProps, { setLobby })(
  withRouter(SocketConnection)
);
