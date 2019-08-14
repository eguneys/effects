import * as u from './util';

import text from './text';

export default function view(ctrl, g) {

  const { width, height } = ctrl.data.game;

  const b = g.buffers;
  
  g.renderTarget = b.Screen;

  this.render = ctrl => {
    clear(ctrl, g);
    renderHero(ctrl, g);
    ctrl.data.paddles.forEach(_ => renderPaddle(ctrl, _, g));
    ctrl.blocks.each(_ => renderBlock(_, g));
    flush(ctrl, g);
  };

  function flush(ctrl, g) {
    g.renderSource = b.Collision;
    g.renderTarget = b.Screen;
    g.spr();
  }

  function clear(ctrl, g) {
    g.renderTarget = b.Collision;
    g.clear(0);
    g.renderTarget = b.Screen;
    g.clear(0);
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

    g.fillCircle(x, y, radius, color);
  }

}

