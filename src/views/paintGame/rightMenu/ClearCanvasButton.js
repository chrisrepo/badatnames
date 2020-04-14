import React from 'react';
import { connect } from 'react-redux';

class ClearCanvasButton extends React.Component {
  clearCanvasClicked = () => {
    window.console.log('clear canvas voted', this.props);
    const body = {
      userId: this.props.user.userId,
    };
    this.props.websocket.emit('on-clear-vote', body);
  };

  render() {
    window.console.log('websocket', this.props.websocket);
    return <button onClick={this.clearCanvasClicked}>Vote to Clear</button>;
  }
}

const mapStateToProps = (state) => ({
  websocket: state.connection.websocket,
  user: state.user,
});
export default connect(mapStateToProps, {})(ClearCanvasButton);
