import React, { Fragment } from 'react';
import { UserList } from './UserList';
import Canvas from './Canvas';
import { ColorSelector } from './ColorSelector';

export class Paint extends React.Component {
  constructor(props) {
    super(props);
    window.console.log(props, 'p');
  }

  render() {
    return (
      <Fragment>
        <div className="main-paint">
          <UserList
            userId={this.props.userId}
            websocket={this.props.websocket}
          />
          <Canvas
            userId={this.props.userId}
            websocket={this.props.websocket}
            selectedColor={this.props.selectedColor}
          />
          <ColorSelector
            selectedColor={this.props.selectedColor}
            changeSelectedColor={this.props.changeSelectedColor}
          />
        </div>
      </Fragment>
    );
  }
}
