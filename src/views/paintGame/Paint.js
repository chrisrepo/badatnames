import React, { Fragment } from 'react';
import UserList from './UserList';
import CanvasContainer from './CanvasContainer';
import DrawMenu from './bottomMenu/DrawMenu';
import './Paint.css';
import BackgroundImage from '../../common/BackgroundImage';
import WordToGuess from './WordToGuess';
import ChatBox from './chatBox/ChatBox';
export class Paint extends React.Component {
  render() {
    return (
      <Fragment>
        <BackgroundImage url="/assets/graph_paper.jpg" />
        <WordToGuess />
        <div className="main-paint">
          <UserList />
          <CanvasContainer />
          <ChatBox />
        </div>
        <div className="lower-paint">
          <DrawMenu />
        </div>
      </Fragment>
    );
  }
}
