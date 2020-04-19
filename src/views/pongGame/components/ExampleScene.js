import { store } from '../../../index';
import { PONG_ACTIONS } from '../../../redux/actions/pong';
import { Scene } from 'phaser';

import ballImg from '../assets/ball.png';
import paddleImg from '../assets/paddle.png';

export default class ExampleScene extends Scene {
  // Member variables
  paddleLeft = undefined;
  paddleRight = undefined;

  create() {
    this.paddleLeft = this._createPaddle(0, this.game.world.centerY);
    this.paddleRight = this._createPaddle(
      this.game.world.width - 20,
      this.game.world.centerY
    );
  }

  /**
   * 
   * EXAMPLE ACTION CODE 
    const text = this.add.text(250, 250, 'Toggle UI', {
      backgroundColor: 'white',
      color: 'blue',
      fontSize: 48,
    });

    text.setInteractive({ useHandCursor: true });

    text.on('pointerup', () => {
      store.dispatch({ type: PONG_ACTIONS.TOGGLE });
    });
   */

  preload() {
    this.load.image('ball', ballImg);
    this.load.image('paddle', paddleImg);
  }

  update() {
    // TODO: Handle paddle multiplayer (one player per paddle)
    this._controlPaddle(this.paddleLeft, this.game.input.y);
  }

  _createPaddle(x, y) {
    const paddle = this.game.add.sprite(x, y, 'paddle');
    paddle.anchor.setTo(0.5, 0.5);
    this.game.physics.arcade.enable(paddle);
    paddle.body.collideWorldBounds = true;

    return paddle;
  }

  _controlPaddle(paddle, y) {
    paddle.y = y;

    // Keep paddle in bounds
    if (paddle.y < paddle.height / 2) {
      paddle.y = paddle.height / 2;
    } else if (paddle.y > this.game.world.height - paddle.height / 2) {
      paddle.y = this.game.world.height - paddle.height / 2;
    }
  }
}
