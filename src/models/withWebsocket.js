import React from 'react';
import socketIOClient from 'socket.io-client';
const socketEndpoint = 'http://127.0.0.1:4001';

export function withWebsocket(WrappedComponent) {
  return class extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        ws: null
      };
    }

    componentDidMount() {
      window.console.log('connecting to socket io websocket');
      this.connect();
    }

    connect = () => {
      var ws = socketIOClient(socketEndpoint);
      this.setState({
        ws
      });
      ws.on('connect', function() {
        const sessionUser = sessionStorage.getItem('draw-user');
        if (sessionUser !== null) {
          ws.emit('update-user', {
            id: ws.id,
            username: sessionUser
          });
        }
      });
      //TODO: maybe some logic to try and reconnect iff error
    };

    render() {
      return <WrappedComponent websocket={this.state.ws} />;
    }
  };
}
