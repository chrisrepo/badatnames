// Config
const GAME_HEIGHT = 600;
const GAME_WIDTH = 900;

const BALL_VELOCITY = 350;
const PADDLE_VELOCITY = 250;

const players = {};
const config = {
  type: Phaser.HEADLESS,
  parent: 'phaser-example',
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
    },
  },
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
  autoFocus: false,
};

function preload() {
  this.load.image('ball', 'assets/ball.png');
  this.load.image('paddle', 'assets/paddle.png');
}

function create() {
  const self = this;
  // Game vars
  this.gameTracker = gameTracker();

  // Sprites / Physics
  this.paddleLeft = createPaddle(this, 15, GAME_HEIGHT / 2);
  this.paddleRight = createPaddle(this, GAME_WIDTH - 16, GAME_HEIGHT / 2);
  this.ball = createBall(this, GAME_WIDTH / 2, GAME_HEIGHT / 2);
  this.physics.add.collider(this.paddleLeft, this.ball);
  this.physics.add.collider(this.paddleRight, this.ball);

  // Eventing
  io.on('connection', function (socket) {
    self.socket = socket;
    console.log('a user connected', socket.id);
    socket.on('pong-player-create-finished', function () {
      // TODO: Fix this playerleft/right logic once I actually connect the lobby to the game
      if (!self.gameTracker.playerLeft) {
        self.gameTracker.playerLeft = socket.id;
        socket.emit('pong-set-player', 'left');
      } else if (!self.gameTracker.playerRight) {
        self.gameTracker.playerRight = socket.id;
        socket.emit('pong-set-player', 'right');
      } else {
        socket.emit('pong-set-player', 'spectator');
      }
    });

    socket.on('pong-player-ready', function (data) {
      if (data.id === self.gameTracker.playerLeft) {
        self.gameTracker.leftReady = true;
      } else if (data.id === self.gameTracker.playerRight) {
        self.gameTracker.rightReady = true;
      }
      if (self.gameTracker.leftReady && self.gameTracker.rightReady) {
        console.log('LAUNCHING BALL - SERVER');
        // Emit launch ball
        // TODO: Eventually add the dynamic room stuff here so we only emit to the specified room
        io.emit('pong-launch-ball');
        self.gameTracker.roundEnded = false;
        self.gameTracker.rightReady = false;
        self.gameTracker.leftReady = false;
        launch(self.ball);
      }
    });

    socket.on('disconnect', function () {
      console.log('user disconnected');
      // TODO: restart game w/ new player if existing player leaves
      if (self.gameTracker.playerRight === socket.id) {
        self.gameTracker.playerRight = undefined;
        self.gameTracker.rightReady = false;
        self.gameTracker.score = { left: 0, right: 0 };
      } else if (self.gameTracker.playerLeft === socket.id) {
        self.gameTracker.playerLeft = undefined;
        self.gameTracker.leftReady = false;
        self.gameTracker.score = { left: 0, right: 0 };
      }
    });
  });
}

function update() {
  // TODO: Handle paddle multiplayer (one player per paddle)
  if (!this.gameTracker.roundEnded) {
    controlPaddle(this.paddleLeft, this.input.y);
  }

  const blocked = this.ball.body.blocked;
  if ((blocked.left || blocked.right) && !this.gameTracker.roundEnded) {
    // Stop ball & paddles
    pointScored(this);
    resetBall(this.ball, GAME_WIDTH / 2, GAME_HEIGHT / 2);
    // Set score Send events
    // TODO: Eventually add the dynamic room stuff here so we only emit to the specified room
    if (blocked.left) {
      this.gameTracker.score.right++;
    } else {
      this.gameTracker.score.left++;
    }
    console.log('updating score');
    io.emit('pong-update-score', this.gameTracker.score);
    this.socket.emit('pong-end-round');
  }
}

function gameTracker() {
  return {
    roundEnded: false,
    playerLeft: undefined,
    playerRight: undefined,
    leftReady: false,
    rightReady: false,
    score: {
      left: 0,
      right: 0,
    },
  };
}

function pointScored(self) {
  self.ball.body.stop();
  self.paddleLeft.body.stop();
  self.paddleRight.body.stop();
  self.gameTracker.roundEnded = true;
}

function createPaddle(scene, x, y) {
  const paddle = scene.physics.add.sprite(x, y, 'paddle');
  paddle.setCollideWorldBounds(true);
  paddle.setImmovable(true);
  return paddle;
}

function controlPaddle(paddle, y) {
  const diff = paddle.y - y + paddle.height / 2;
  if (diff > paddle.height / 2 + 5) {
    paddle.body.setVelocity(0, -PADDLE_VELOCITY);
  } else if (diff < paddle.height / 2 - 5) {
    paddle.body.setVelocity(0, PADDLE_VELOCITY);
  } else {
    paddle.body.setVelocity(0, 0);
  }
}
function createBall(scene, x, y) {
  const ball = scene.physics.add.sprite(x, y, 'ball');
  ball.setCollideWorldBounds(true);
  ball.body.setBounce(1, 1);
  return ball;
}

function resetBall(ball, x, y) {
  ball.setX(x);
  ball.setY(y);
}

function launch(ball) {
  setTimeout(function () {
    ball.body.setVelocity(-BALL_VELOCITY, BALL_VELOCITY);
  }, 3000);
}

const game = new Phaser.Game(config);
window.gameLoaded();
