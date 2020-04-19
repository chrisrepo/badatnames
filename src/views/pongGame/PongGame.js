import React from 'react';
import Phaser from 'phaser';

import { GAME_WIDTH, GAME_HEIGHT } from './config';
import * as Paddle from './components/Paddle';
import * as Ball from './components/Ball';
import { GameTracker } from './components/GameTracker';
import { PongEventEmitter } from './components/PongEventEmitter';

import './PongGame.css';

export default class PongGame extends React.Component {
  componentDidMount() {
    this.emitter = PongEventEmitter.getInstance();
    this.emitter.on('player-scored', this.handlePlayerScore);
    window.console.log(this.emitter);
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
          pointScored: this.pointScored,
        },
      },
    };
    this.game = new Phaser.Game(config);
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

  create() {
    // Events
    window.console.log(this);
    this.emitter = PongEventEmitter.getInstance();
    this.emitter.on(
      'players-ready',
      function () {
        // Start game (countdown then ball launch)
      },
      this
    );
    // GameTracker
    this.gameTracker = new GameTracker();

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
    Ball.launch(this.ball);
  }

  preload() {
    this.load.image('ball', 'assets/ball.png');
    this.load.image('paddle', 'assets/paddle.png');
  }

  update() {
    // TODO: Handle paddle multiplayer (one player per paddle)
    if (!this.gameTracker.roundEnded) {
      Paddle.controlPaddle(this.paddleLeft, this.input.y);
    }

    if (this.ball.body.blocked.left && !this.gameTracker.roundEnded) {
      this.emitter.emit('player-scored', 'right');
      // Stop ball & paddles
      this.pointScored();
    }
    if (this.ball.body.blocked.right && !this.gameTracker.roundEnded) {
      this.emitter.emit('player-scored', 'left');
      this.pointScored();
    }
  }

  pointScored() {
    this.ball.body.stop();
    this.paddleLeft.body.stop();
    this.paddleRight.body.stop();
    this.gameTracker.setRoundEnded(true);
  }
}
