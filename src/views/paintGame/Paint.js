import React, { Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import UserList from './UserList';
import CanvasContainer from './CanvasContainer';
import DrawMenu from './bottomMenu/DrawMenu';
import BackgroundImage from '../../common/BackgroundImage';
import WordToGuess from './WordToGuess';
import ChatBox from './chatBox/ChatBox';
import './Paint.css';
class Paint extends React.Component {
  render() {
    return (
      <Fragment>
        <BackgroundImage url="/assets/graph_paper.jpg" />
        <WordToGuess />
        <div className="main-paint">
          <UserList />
          <CanvasContainer history={this.props.history} />
          <ChatBox />
        </div>
        <div className="lower-paint">
          <DrawMenu />
        </div>
      </Fragment>
    );
  }
}

export default withRouter(Paint);
