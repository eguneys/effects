import * as u from '../util';

import text from '../text';

export default function view(ctrl, g) {

  const { width, height } = ctrl.data.game;

  const b = g.buffers;

  const renderOver = (ctrl) => {

    const score = ctrl.data.game.score + '';

    text({
      x: width / 2,
      y: height * 0.3,
      text: score,
      color: 10,
      scale: 3
    }, g);

    text({
      x: width / 2,
      y: height * 0.5,
      text: 'Press Space to play again.',
      color: 10,
      scale: 2
    }, g);
  };


  this.render = ctrl => {
    g.renderTarget = b.Ui;

    if (ctrl.data.state === u.States.Over) {
      renderOver(ctrl);
    }

  };
  
}
