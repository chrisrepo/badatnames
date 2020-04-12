// App.js

import React, { Component } from 'react';
import { Route, BrowserRouter, Redirect } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import socketIOClient from 'socket.io-client';
import { socketEndpoint } from './constants';
import { connect } from 'react-redux';

import './App.css';
import { Colors } from './models/Colors';
import Login from './views/Login';
import { v4 } from 'uuid';
import { Paint } from './views/Paint';
import { setWebsocketConnection } from './redux/actions';

class App extends Component {
  constructor(props) {
    super(props);
    this.colors = new Colors();
    this.state = {
      selectedColor: this.colors.defaultColor,
      user: undefined,
      history: createBrowserHistory(),
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

  changeSelectedColor = (hexValue) => {
    window.console.log('change color to ', hexValue);
    if (hexValue !== this.state.selectedColor) {
      this.setState({
        selectedColor: hexValue,
      });
    }
  };

  setUser = (user) => {
    sessionStorage.setItem('draw-user', user);
    this.setState({
      user,
    });
  };

  renderPage() {
    window.console.log(this.state.ws, this.state.isConnecting);
    if (!this.state.isConnecting) {
      const sessionUser = sessionStorage.getItem('draw-user');
      return (
        <BrowserRouter history={this.state.history}>
          <Route path="/" exact>
            {sessionUser !== null && <Redirect exact from="/" to="/paint" />}
            {sessionUser === null && <Login setUser={this.setUser} />}
          </Route>
          <Route path="/paint" exact>
            <Paint
              userId={this.userId}
              websocket={this.state.ws}
              selectedColor={this.state.selectedColor}
              changeSelectedColor={this.changeSelectedColor}
            />
          </Route>
        </BrowserRouter>
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
export default connect(mapStateToProps, { setWebsocketConnection })(App);
