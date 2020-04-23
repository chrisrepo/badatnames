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

  // TODO: Don't  let paddles move until ready
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
    this.countdown = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 3, '3', {
      fontFamily: 'Arial',
      fontSize: 72,
      color: '#ffffff',
    });
    this.countdown.setOrigin(0.5, 0.5);
    this.countdown.setAlpha(0);
    // Events
    this.websocket.emit('pong-player-create-finished'); //This lets the server know that this client is ready to be assigned to a player spot
    this.websocket.on('pong-launch-ball', function (data) {
      self.gameTracker.setRoundEnded(false);
      window.console.log('launching ball - client', data);
      // Start countdown
      self.countdown.setAlpha(1);
      let time = 3;
      let interval = setInterval(function () {
        time--;
        self.countdown.text = time;
        if (time === 0) {
          clearInterval(interval);
          self.countdown.setAlpha(0);
          self.countdown.text = 3;
          Ball.launch(self.ball, data.xVel, data.yVel);
        }
      }, 1000);
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

    this.websocket.on('pong-update-input', function (data) {
      const { velocity, player } = data;
      if (player === 'left') {
        self.paddleLeft.body.setVelocity(0, velocity);
      } else if (player === 'right') {
        self.paddleRight.body.setVelocity(0, velocity);
      }
    });
  }

  preload() {
    this.load.image('ball', 'assets/ball.png');
    this.load.image('paddle', 'assets/paddle.png');
  }

  update() {
    if (!this.gameTracker.roundEnded) {
      let newVel = undefined;
      if (this.player.left) {
        newVel = Paddle.controlPaddle(this.paddleLeft, this.input.y);
      } else if (this.player.right) {
        newVel = Paddle.controlPaddle(this.paddleRight, this.input.y);
      }
      if (newVel !== undefined) {
        const player = this.player.left ? 'left' : 'right';
        // TODO handle rooms
        this.websocket.emit('pong-update-input', { velocity: newVel, player });
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
