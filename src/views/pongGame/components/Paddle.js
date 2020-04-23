import { PADDLE_VELOCITY } from '../config';
export function createPaddle(scene, x, y) {
  const paddle = scene.physics.add.sprite(x, y, 'paddle');
  paddle.setCollideWorldBounds(true);
  paddle.setImmovable(true);
  return paddle;
}

export function controlPaddle(paddle, y) {
  const diff = paddle.y - y + paddle.height / 2;
  const curVel = paddle.body.velocity.y;
  if (diff > paddle.height / 2 + 5) {
    paddle.body.setVelocity(0, -PADDLE_VELOCITY);
  } else if (diff < paddle.height / 2 - 5) {
    paddle.body.setVelocity(0, PADDLE_VELOCITY);
  } else {
    paddle.body.setVelocity(0, 0);
  }
  const newVel = paddle.body.velocity.y;
  const shouldUpdate = newVel !== curVel && !bodyBlocked(paddle, newVel);
  return shouldUpdate ? newVel : undefined;
}

function bodyBlocked(paddle, y) {
  if (
    (paddle.body.blocked.down && y > 0) ||
    (paddle.body.blocked.up && y < 0)
  ) {
    return true;
  }
  return false;
}
