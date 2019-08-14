import * as u from '../util';

import text from '../text';

export default function view(ctrl, g) {

  const { width, height } = ctrl.data.game;

  const b = g.buffers;

  const renderOver = (ctrl) => {

    const action = 5;
    const info = 7;

    const score = ctrl.data.game.score + '';

    text({
      x: width / 2,
      y: height * 0.2,
      text: 'backout',
      color: 1,
      scale: 5
    }, g);

    if (ctrl.data.gameover) {
      text({
        x: width / 2,
        y: height * 0.4,
        text: 'high score ' + score,
        color: 12,
        scale: 3
      }, g);

    }

    text({
      x: width / 2,
      y: height * 0.5,
      text: 'press space to play.',
      color: action,
      scale: 2
    }, g);


    text({
      x: width / 2,
      y: height * 0.7,
      text: 'avoid paddles to hit the ball.\nuse arrow keys to control paddles.\nuse space to go faster.',
      vspacing: 8,
      color: info,
      scale: 1.8
    }, g);

  };


  this.render = ctrl => {
    g.renderTarget = b.Ui;

    if (ctrl.data.state === u.States.Over) {
      renderOver(ctrl);
    }

  };
  
}
