// App.js

import React, { Component } from 'react';
import { Route, BrowserRouter, Redirect } from 'react-router-dom';
import { createBrowserHistory } from 'history';

import './App.css';
import { Colors } from './models/Colors';
import Login from './views/Login';
import { v4 } from 'uuid';
import { Paint } from './views/Paint';
import { withWebsocket } from './models/withWebsocket';

class App extends Component {
  constructor(props) {
    super(props);
    this.colors = new Colors();
    this.state = {
      selectedColor: this.colors.defaultColor,
      user: undefined,
      history: createBrowserHistory()
    };
    this.userId = v4();
  }

  componentDidMount() {
    const sessionUser = sessionStorage.getItem('draw-user');
    if (sessionUser !== null) {
      this.setState({
        user: sessionUser
      });
    }
  }

  changeSelectedColor = hexValue => {
    window.console.log('change color to ', hexValue);
    if (hexValue !== this.state.selectedColor) {
      this.setState({
        selectedColor: hexValue
      });
    }
  };

  setUser = user => {
    sessionStorage.setItem('draw-user', user);
    this.setState({
      user
    });
  };

  render() {
    const sessionUser = sessionStorage.getItem('draw-user');
    return (
      <BrowserRouter history={this.state.history}>
        <Route path="/" exact>
          {sessionUser !== null && <Redirect exact from="/" to="/paint" />}
          {sessionUser === null && (
            <Login websocket={this.props.websocket} setUser={this.setUser} />
          )}
        </Route>
        <Route path="/paint" exact>
          <Paint
            userId={this.userId}
            websocket={this.props.websocket}
            selectedColor={this.state.selectedColor}
            changeSelectedColor={this.changeSelectedColor}
          />
        </Route>
      </BrowserRouter>
    );
  }
}
export default withWebsocket(App);
