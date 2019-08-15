import * as u from './util';

import playCtrl from './ctrl/play';
import overCtrl from './ctrl/over';

export default function ctrl(state, g) {
  this.data = state;

  this.play = new playCtrl(state, g);

  this.over = new overCtrl(state, g);

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

  this.pressKey = key => {
    switch (key) {
    case 'up':
      this.play.paddleMove([0, -1]);
      break;
    case 'down':
      this.play.paddleMove([0, 1]);
      break;
    case 'left':
      this.play.paddleMove([-1, 0]);
      break;
    case 'right':
      this.play.paddleMove([1, 0]);
      break;
    };
  };

  this.update = delta => {
    maybeUpdateGame(delta);
    maybeUpdateOver(delta);

    this.data.game.tick += delta;
  };
  
}
