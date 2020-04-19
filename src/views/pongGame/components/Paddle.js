import { PADDLE_VELOCITY } from '../config';
export function createPaddle(scene, x, y) {
  const paddle = scene.physics.add.sprite(x, y, 'paddle');
  paddle.setCollideWorldBounds(true);
  paddle.setImmovable(true);
  return paddle;
}

export function controlPaddle(paddle, y) {
  const diff = paddle.y - y + paddle.height / 2;
  if (diff > paddle.height / 2 + 5) {
    paddle.body.setVelocity(0, -PADDLE_VELOCITY);
  } else if (diff < paddle.height / 2 - 5) {
    paddle.body.setVelocity(0, PADDLE_VELOCITY);
  } else {
    paddle.body.setVelocity(0, 0);
  }
}
