import React from 'react';
import { connect } from 'react-redux';

class UserList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      clientList: [],
    };
  }

  componentDidMount() {
    if (this.props.connection.websocket !== null) {
      this.initializeJoinListener();
    }
  }
  componentDidUpdate(prevProps) {
    if (
      this.props.connection.websocket &&
      prevProps.connection.websocket === null
    ) {
      this.initializeJoinListener();
    }
  }

  initializeJoinListener() {
    window.console.log('initialize JOIN');
    this.props.connection.websocket.on('emit-join', (clientList) => {
      window.console.log('set user data', clientList);
      this.setState({
        clientList,
      });
    });
    this.props.connection.websocket.emit('on-join-request');
  }

  render() {
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

const mapStateToProps = (state) => ({
  connection: state.connection,
});
export default connect(mapStateToProps, {})(UserList);
