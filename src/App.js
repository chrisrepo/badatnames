// App.js

import React, { Component } from 'react';
import { Route, Router } from 'react-router-dom';
import history from './common/history';
import socketIOClient from 'socket.io-client';
import { socketEndpoint } from './constants';
import { connect } from 'react-redux';

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './views/login/Login';
import { v4 } from 'uuid';
import { Paint } from './views/paintGame/Paint';
import { setWebsocketConnection, setUser } from './redux/actions';
import LobbyView from './views/pregameLobby/LobbyView';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: undefined,
      isConnecting: true,
    };
    this.userId = v4();
  }

  componentDidMount() {
    const ws = socketIOClient(socketEndpoint);
    ws.on('connect', () => {
      this.onWebsocketConnect(ws);
    });

    const sessionUser = sessionStorage.getItem('draw-user');
    if (sessionUser !== null) {
      this.setState({
        user: sessionUser,
      });
    }
    this.props.setUser({ userId: this.userId });
  }

  onWebsocketConnect(ws) {
    // Put websocket in redux store for use throughout application
    this.props.setWebsocketConnection(ws);
    const sessionUser = sessionStorage.getItem('draw-user');
    if (sessionUser !== null) {
      ws.emit('update-user', {
        id: ws.id,
        username: sessionUser,
      });
    }
    this.setState({
      isConnecting: false,
      ws,
    });
  }

  renderPage() {
    window.console.log(this.state.ws, this.state.isConnecting);
    if (!this.state.isConnecting) {
      return (
        <Router history={history}>
          <Route path="/" exact>
            <Login />
          </Route>
          <Route path="/lobby">
            <LobbyView />
          </Route>
          <Route path="/paint" exact>
            <Paint />
          </Route>
          <Route path="/pong" exact>
            <div>Page does not exist</div>
          </Route>
        </Router>
      );
    } else {
      return <h3>LOADING...</h3>;
    }
  }

  render() {
    return this.renderPage();
  }
}

const mapStateToProps = (state) => ({});
export default connect(mapStateToProps, { setWebsocketConnection, setUser })(
  App
);
