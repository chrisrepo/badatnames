import React, { Fragment } from 'react';
import UserList from './UserList';
import Canvas from './Canvas';
import ColorSelector from './rightMenu/ColorSelector';
import './Paint.css';

export class Paint extends React.Component {
  render() {
    return (
      <Fragment>
        <div className="main-paint">
          <UserList />
          <Canvas />
          <ColorSelector />
        </div>
      </Fragment>
    );
  }
}
