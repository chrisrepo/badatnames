import React from 'react';
import './MainPage.css';

export class MainPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { username: '' };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({ username: event.target.value });
  }

  joinCanvas = () => {
    window.console.log('join canvas', this.state.username);
    this.sendJoinData();
    this.props.setUser(this.state.username);
  };

  async sendJoinData() {
    const body = {
      username: this.state.username
    };
    const req = await fetch('http://localhost:4000/login', {
      method: 'post',
      body: JSON.stringify(body),
      headers: {
        'content-type': 'application/json'
      }
    });
    await req.json();
  }

  render() {
    return (
      <div className="main-page-wrapper">
        <div className="log-in">
          <div className="form__group field">
            <input
              type="text"
              value={this.state.username}
              onChange={this.handleChange}
              className="form__field"
              placeholder="Username"
            />
            <label className="form__label">Username</label>
          </div>
          <div>
            <button onClick={this.joinCanvas}>Join</button>
          </div>
        </div>
      </div>
    );
  }
}
