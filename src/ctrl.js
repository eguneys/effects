import * as u from './util';

import playCtrl from './ctrl/play';
import overCtrl from './ctrl/over';

export default function ctrl(state, ctx) {
  const { g, a } = ctx;

  this.data = state;

  this.play = new playCtrl(state, ctx);

  this.over = new overCtrl(state, ctx);

  const maybeUpdateGame = delta => {
    if (this.data.state === u.States.Play) {
      this.play.update(delta);
    }
    if (this.shouldResetGame) {
      this.shouldResetGame = false;
      this.play.reset();
      this.data.gameover = 0;
      this.data.state = u.States.Play;
    }
  };

  const maybeUpdateOver = delta => {
    if (this.data.state === u.States.Over) {
      this.over.update(delta);
    }
  };

  this.spaceHit = () => {
    if (this.data.state === u.States.Play) {
      this.play.boost();
    } else {
      if (this.data.gameover) {
        u.ensureDelay(this.data.gameover, () => {
          this.shouldResetGame = true;
        });
      } else {
        this.shouldResetGame = true;
      }
    }
  };

  const paddleBoost = 3;

  this.pressKey = key => {
    switch (key) {
    case 'up':
      this.play.paddleMove([0, -paddleBoost]);
      break;
    case 'down':
      this.play.paddleMove([0, paddleBoost]);
      break;
    case 'left':
      this.play.paddleMove([-paddleBoost, 0]);
      break;
    case 'right':
      this.play.paddleMove([paddleBoost, 0]);
      break;
    };
  };

  this.releaseKey = key => {
    switch (key) {
    case 'up':
      // check because down might have started
      if (this.data.paddleBoost[1] < 0)
        this.play.paddleMove([0, 1]);
      break;
    case 'down':
      if (this.data.paddleBoost[1] > 0)
      this.play.paddleMove([0, 1]);
      break;
    case 'left':
      if (this.data.paddleBoost[0] < 0)
        this.play.paddleMove([1, 0]);
      break;
    case 'right':
      if (this.data.paddleBoost[0] > 0)
      this.play.paddleMove([1, 0]);
      break;
    }
  };

  this.update = delta => {
    maybeUpdateGame(delta);
    maybeUpdateOver(delta);

    this.data.game.tick += delta;
  };
  
}
