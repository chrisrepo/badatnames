import React, { Fragment } from 'react';
import UserList from './UserList';
import Canvas from './Canvas';
import DrawMenu from './bottomMenu/DrawMenu';
import './Paint.css';
import BackgroundImage from '../../common/BackgroundImage';

export class Paint extends React.Component {
  render() {
    return (
      <Fragment>
        <BackgroundImage url="/assets/graph_paper.jpg" />
        <div className="main-paint">
          <UserList />
          <Canvas />
        </div>
        <div className="lower-paint">
          <DrawMenu />
        </div>
      </Fragment>
    );
  }
}
