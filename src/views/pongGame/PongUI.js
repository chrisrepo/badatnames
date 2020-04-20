import React, { Fragment } from 'react';
import Card from 'react-bootstrap/Card';
import { connect } from 'react-redux';

import player1 from '../../img/paint/paint-player-1.svg';

import './PongUI.css';
class PongUI extends React.Component {
  readyButtonClicked = () => {
    const id = this.props.connection.websocket.id;
    window.console.log('ready button clicked for: ', id);
    const data = {
      id,
    };
    this.props.connection.websocket.emit('pong-player-ready', data);
  };

  renderScore = () => {
    const score = this.props.pongGame.score;
    return (
      <Fragment>
        {score.left} - {score.right}
      </Fragment>
    );
  };

  renderPlayers() {
    // TODO: lobby list not harcode
    return (
      <Fragment>
        <div className="pongPlayerCard">
          <Card border="info" style={{ width: '120px' }}>
            <Card.Img variant="top" src={player1} />
            <Card.Body>
              <Card.Title>PLAYER 1</Card.Title>
              <Card.Text>HOST</Card.Text>
            </Card.Body>
          </Card>
        </div>
        <div id="pongScoreContainer">
          {this.renderScore()}
          <button className="btn btn-success" onClick={this.readyButtonClicked}>
            Ready
          </button>
        </div>
        <div className="pongPlayerCard">
          <Card border="info" style={{ width: '120px' }}>
            <Card.Img variant="top" src={player1} />
            <Card.Body>
              <Card.Title>PLAYER 2</Card.Title>
            </Card.Body>
          </Card>
        </div>
      </Fragment>
    );
  }
  render() {
    return <div id="pongUIContainer">{this.renderPlayers()}</div>;
  }
}

const mapStateToProps = (state) => ({
  pongGame: state.pongGame,
  connection: state.connection,
  //lobby: state.lobby,
  //user: state.user,
});

export default connect(mapStateToProps)(PongUI);
