import { BALL_VELOCITY } from '../config';
export function createBall(scene, x, y) {
  const ball = scene.physics.add.sprite(x, y, 'ball');
  ball.setCollideWorldBounds(true);
  ball.body.setBounce(1, 1);
  return ball;
}

export function launch(ball) {
  setTimeout(function () {
    ball.body.setVelocity(-BALL_VELOCITY, BALL_VELOCITY);
  }, 3000);
}

export function reset(ball, x, y) {
  ball.setX(x);
  ball.setY(y);
}
