import * as u from './util';

import text from './text';  

import overView from './view/over';

export default function view(ctrl, g) {

  const { width, height } = ctrl.data.game;

  const b = g.buffers;
  
  g.renderTarget = b.Screen;

  const over = new overView(ctrl, g);

  this.render = ctrl => {
    clear(ctrl, g);

    renderPlay(ctrl, g);

    over.render(ctrl);

    flush(ctrl, g);
  };

  function flush(ctrl, g) {
    g.renderSource = b.Collision;
    g.renderTarget = b.Screen;
    g.spr();

    g.renderSource = b.Ui;
    g.renderTarget = b.Screen;
    g.spr();
  }

  function clear(ctrl, g) {
    g.renderTarget = b.Ui;
    g.clear(0);
    g.renderTarget = b.Collision;
    g.clear(0);
    g.renderTarget = b.Screen;
    g.clear(0);
  }

  function renderPlay(ctrl, g) {
    ctrl = ctrl.play;

    ctrl.data.paddles.forEach(_ => renderPaddle(ctrl, _, g));
    ctrl.blocks.each(_ => renderBlock(_, g));
    renderHero(ctrl, g);

    renderUi(ctrl, g);
  }

  function renderPaddle(ctrl, paddle, g) {
    
    g.renderTarget = b.Collision;
    const { x, y, w, h } = paddle;

    g.fillRect(x, y, x + w, y + h, 5);

  }

  function renderBlock(ctrl, g) {
    g.renderTarget = b.Collision;
    const { x, y, angle, length, color } = ctrl.data;
    let c = Math.cos(angle) * length,
        s = Math.sin(angle) * length;
    g.line(x, y, x + c, y + s, color);
  }

  function renderHero(ctrl, g) {
    g.renderTarget = b.Collision;
    const { x, y, radius, color } = ctrl.data.hero;
    console.log(x, y);
    g.fillCircle(x, y, radius, color);
  }

  function renderUi(ctrl, g) {
    const score = ctrl.data.game.score + '';
    
    const scoreLabel = text({
      x: width * 0.1,
      y: 10,
      text: 'score',
      color: 7,
      scale: 2
    }, g);

    text({
      x: scoreLabel.ex + 20,
      y: 10,
      text: score,
      color: 10,
      scale: 3
    }, g);    
  }

}

