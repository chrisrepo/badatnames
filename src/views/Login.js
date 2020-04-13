import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import { setUser } from '../redux/actions';

// Local Imports
import './Login.css';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = { username: '' };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({ username: event.target.value });
  }

  joinCanvas = () => {
    this.sendJoinData();
    this.props.history.push('/paint');
  };

  sendJoinData() {
    if (this.props.connection.websocket) {
      const body = {
        username: this.state.username,
        id: this.props.connection.websocket.id,
      };
      this.props.setUser({ username: this.state.username });
      this.props.connection.websocket.emit('on-join', body);
    }
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

const mapStateToProps = (state) => ({
  connection: state.connection,
});
export default connect(mapStateToProps, { setUser })(withRouter(Login));
