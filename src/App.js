// App.js

import React, { Component, Fragment } from 'react';
import './App.css';
import Canvas from './canvas';
import { ColorSelector } from './views/ColorSelector';
import { Colors } from './models/Colors';
import { MainPage } from './views/MainPage';
import { UserList } from './views/UserList';
import Pusher from 'pusher-js';
import { v4 } from 'uuid';

class App extends Component {
  constructor(props) {
    super(props);
    this.colors = new Colors();
    this.state = {
      selectedColor: this.colors.defaultColor,
      user: undefined
    };
    this.userId = v4();
    this.pusher = new Pusher('5071c0bac3b84fcc0cf4', {
      cluster: 'us3'
    });
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
    this.setState({
      user
    });
  };

  render() {
    if (!this.state.user) {
      return <MainPage setUser={this.setUser} />;
    }
    return (
      <Fragment>
        <h3 style={{ textAlign: 'center' }}>Dos Paint</h3>
        <div className="main">
          <UserList userId={this.userId} pusher={this.pusher} />
          <Canvas
            userId={this.userId}
            pusher={this.pusher}
            selectedColor={this.state.selectedColor}
          />
          <ColorSelector
            selectedColor={this.state.selectedColor}
            changeSelectedColor={this.changeSelectedColor}
          />
        </div>
      </Fragment>
    );
  }
}
export default App;
