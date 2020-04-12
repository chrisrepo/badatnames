import React, { Fragment } from 'react';
import UserList from './UserList';
import Canvas from './Canvas';
import { ColorSelector } from './ColorSelector';

export class Paint extends React.Component {
  constructor(props) {
    super(props);
    window.console.log(props, 'p');
  }

  /**
   * TODO:
   * - Move user data management to redux (keep sepaarate from paint, will eventually want some sort of account/guest login situation to be maintained across games)
   * - Move selected color to redux (under a parent reducer that will handle everything for 'paint')
   */
  render() {
    return (
      <Fragment>
        <div className="main-paint">
          <UserList userId={this.props.userId} />
          <Canvas
            userId={this.props.userId}
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
