import { BALL_VELOCITY } from '../config';
export function createBall(scene, x, y) {
  const ball = scene.physics.add.sprite(x, y, 'ball');
  ball.setCollideWorldBounds(true);
  ball.body.setBounce(1, 1);
  return ball;
}

export function launch(ball, xVel, yVel) {
  ball.body.setVelocity(xVel, yVel);
}

export function reset(ball, x, y) {
  ball.setX(x);
  ball.setY(y);
}
