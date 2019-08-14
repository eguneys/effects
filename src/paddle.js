export default function paddles(ctrl) {
  const { width, height } = ctrl.data.game;

  const paddles = ctrl.data.paddles;

  const updatePaddle = paddle => delta => {
    paddle.x += paddle.vx;
    paddle.y += paddle.vy;

    if (paddle.x > width - paddle.w) {
      paddle.x = width - paddle.w;
      paddle.vx *= -1;
    }
    if (paddle.x < 0) {
      paddle.x = 0;
      paddle.vx *= -1;
    }
    if (paddle.y > height - paddle.h) {
      paddle.y = height - paddle.h;
      paddle.vy *= -1;
    }
    if (paddle.y < 0) {
      paddle.y = 0;
      paddle.vy *= -1;
    }
  };

  this.update = delta => {
    paddles.forEach(_ => updatePaddle(_)(delta));
  };

}
