import React from 'react';
import Phaser from 'phaser';
import { connect } from 'react-redux';

import { store } from '../../index';
import { setScore, PONG_ACTIONS } from '../../redux/actions';
import { GAME_WIDTH, GAME_HEIGHT } from './config';
import { GameTracker } from './components/GameTracker';
import * as Paddle from './components/Paddle';
import * as Ball from './components/Ball';

import './PongGame.css';

class PongGame extends React.Component {
  componentDidMount() {
    const config = {
      type: Phaser.AUTO,
      width: GAME_WIDTH,
      height: GAME_HEIGHT,
      parent: 'phaser-game',
      physics: {
        default: 'arcade',
        arcade: {
          debug: true,
        },
      },
      events: this.emitter,
      input: {
        windowEvents: false, // Avoids events from being fired outside of the canvas
      },
      scene: {
        preload: this.preload,
        create: this.create,
        update: this.update,
        extend: {
          websocket: this.props.connection.websocket,
          pointScored: this.pointScored,
          test: this.test,
        },
      },
    };
    this.game = new Phaser.Game(config);

    // Eventing for react
    this.props.connection.websocket.on('pong-update-score', function (data) {
      window.console.log('pong update score -client', data);
      store.dispatch({ type: PONG_ACTIONS.SET_SCORE, payload: data });
    });
  }

  handlePlayerScore = (player) => {
    window.console.log('react player scored: ', player);
  };

  shouldComponentUpdate() {
    return false;
  }

  render() {
    return <div id="phaser-game" />;
  }

  // Member variables
  paddleLeft = undefined;
  paddleRight = undefined;
  ball = undefined;
  emitter = undefined;
  gameTracker = undefined;
  player = {
    left: false,
    right: false,
    spectator: false,
  };

  create() {
    const self = this;
    // GameTracker
    this.gameTracker = new GameTracker();
    this.player = {
      left: false,
      right: false,
      spectator: false,
    };
    // Sprites / Physics
    this.paddleLeft = Paddle.createPaddle(this, 15, GAME_HEIGHT / 2);
    this.paddleRight = Paddle.createPaddle(
      this,
      GAME_WIDTH - 16,
      GAME_HEIGHT / 2
    );
    this.ball = Ball.createBall(this, GAME_WIDTH / 2, GAME_HEIGHT / 2);
    this.physics.add.collider(this.paddleLeft, this.ball);
    this.physics.add.collider(this.paddleRight, this.ball);

    // Events
    this.websocket.emit('pong-player-create-finished'); //This lets the server know that this client is ready to be assigned to a player spot
    this.websocket.on('pong-launch-ball', function () {
      self.gameTracker.setRoundEnded(false);
      window.console.log('launching ball - client');
      Ball.launch(self.ball);
    });
    this.websocket.on('pong-set-player', function (data) {
      if (data === 'left') {
        self.player.left = true;
      } else if (data === 'right') {
        self.player.right = true;
      } else {
        self.player.spectator = true;
      }
    });
  }

  preload() {
    this.load.image('ball', 'assets/ball.png');
    this.load.image('paddle', 'assets/paddle.png');
  }

  update() {
    // TODO: Handle paddle multiplayer (one player per paddle)
    if (!this.gameTracker.roundEnded) {
      if (this.player.left) {
        Paddle.controlPaddle(this.paddleLeft, this.input.y);
      } else if (this.player.right) {
        Paddle.controlPaddle(this.paddleRight, this.input.y);
      }
    }

    const blocked = this.ball.body.blocked;
    if ((blocked.left || blocked.right) && !this.gameTracker.roundEnded) {
      // Stop ball & paddles
      this.pointScored();
      Ball.reset(this.ball, GAME_WIDTH / 2, GAME_HEIGHT / 2);
    }
  }

  pointScored() {
    this.ball.body.stop();
    this.paddleLeft.body.stop();
    this.paddleRight.body.stop();
    this.gameTracker.setRoundEnded(true);
  }
}

const mapStateToProps = (state) => ({
  connection: state.connection,
  lobby: state.lobby,
  user: state.user,
});
export default connect(mapStateToProps, { setScore })(PongGame);
