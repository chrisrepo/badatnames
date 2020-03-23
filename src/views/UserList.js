import React from 'react';

export class UserList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userList: []
    };

    this.pusher = props.pusher;
  }

  componentDidMount() {
    this.getInitialUserData();

    const channel = this.pusher.subscribe('painting');
    channel.bind('user', data => {
      window.console.log('user login event', data);
    });
  }

  getInitialUserData = () => {
    fetch('http://localhost:4000/userList')
      .then(res => {
        window.console.log('got res', res);
        return res.json();
      })
      .then(userList => {
        window.console.log('got list');
        this.setState({ userList });
      });
  };

  render() {
    window.console.log('userlist', this.state.userList);
    return (
      <div>
        {this.state.userList.map((user, index) => {
          return <div key={index}>{user}</div>;
        })}
      </div>
    );
  }
}
