import React from 'react';
import { connect } from 'react-redux';

class ClearCanvasButton extends React.Component {
  clearCanvasClicked = () => {
    const body = {
      userId: this.props.user.userId,
      lobbyId: this.props.lobby.lobbyId,
    };
    this.props.websocket.emit('paint-on-clear', body);
  };

  render() {
    // TODO: only show when the user is the drawer
    if (this.props.paint.isCurrentDrawer) {
      return (
        <button className="btn btn-info" onClick={this.clearCanvasClicked}>
          Clear Canvas
        </button>
      );
    }
    return null;
  }
}

const mapStateToProps = (state) => ({
  websocket: state.connection.websocket,
  user: state.user,
  lobby: state.lobby,
  paint: state.paintGame,
});
export default connect(mapStateToProps, {})(ClearCanvasButton);
