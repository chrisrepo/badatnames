import React from 'react';

export class UserList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      clientList: []
    };
  }

  componentDidMount() {
    if (this.props.websocket !== null) {
      this.initializeJoinListener();
    }
  }
  componentDidUpdate(prevProps) {
    if (this.props.websocket && prevProps.websocket === null) {
      this.initializeJoinListener();
    }
  }

  initializeJoinListener() {
    window.console.log('initialize JOIN');
    this.props.websocket.on('emit-join', clientList => {
      window.console.log('set user data', clientList);
      this.setState({
        clientList
      });
    });
    this.props.websocket.emit('on-join-request');
  }

  render() {
    console.log('UserList props', this.state);
    return (
      <div>
        {Object.keys(this.state.clientList).map((key, index) => {
          const client = this.state.clientList[key];
          return <div key={index}>{client.username}</div>;
        })}
      </div>
    );
  }
}
