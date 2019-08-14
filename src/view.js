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

    renderDebug(ctrl, g);

    flush(ctrl, g);
  };

  function flush(ctrl, g) {
    g.renderSource = b.Collision;
    g.renderTarget = b.Screen;
    g.spr();

    g.renderSource = b.Ui;
    g.renderTarget = b.Screen;
    g.spr();

    g.renderSource = b.Midground;
    g.renderTarget = b.Screen;
    g.spr();

    g.renderSource = b.Foreground;
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

  function renderDebug(ctrl, g) {
    g.renderTarget = b.Foreground;
    const w = 8;

    for (let i = 0; i < 64; i++) {
      const x = Math.floor(i / 32) * w * 4 + width * 0.2,
            y = (i % 32) * w;
      g.fillRect(x, y, x + w, y + w, i);
      text({
        x: x - w,
        y: y,
        hspacing: 1,
        text: i + '',
        color: i
      }, g);
    }
  }

  function renderPlay(ctrl, g) {
    ctrl = ctrl.play;

    renderEdges(ctrl, g);

    ctrl.data.paddles.forEach(_ => renderPaddle(ctrl, _, g));
    ctrl.blocks.each(_ => renderBlock(_, g));
    renderHero(ctrl, g);

    renderUi(ctrl, g);
  }

  function renderEdges(ctrl, g) {
    const off = 41;
    const on = 38;

    const edge = ctrl.data.hero.edge;

    const left = edge==='left'?on:off;
    const right = edge==='right'?on:off;
    const up = edge==='up'?on:off;
    const down = edge==='down'?on:off;

    g.renderTarget = b.Screen;

    g.line(0, 0, width, 0, up);
    g.line(0, 0, 0, height, left);
    g.line(0, height - 1, width, height -1, down);
    g.line(width - 1, 0, width - 1, height, right);
  }

  function renderPaddle(ctrl, paddle, g) {
    
    g.renderTarget = b.Collision;
    const { x, y, w, h } = paddle;

    const { vx, vy } = paddle;

    g.fillRect(x, y, x + w, y + h, 5);

    if (vx === 1) {
      g.fillRect(x, y, x + w, y + h, 6);
    } if (vy === 1) {
      g.fillRect(x, y, x + w, y + h, 6);
    }

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

    g.renderTarget = b.Midground;
  }

  function renderUi(ctrl, g) {
    const score = ctrl.data.game.score + '';
    
    const scoreLabel = text({
      x: width * 0.1,
      y: 10,
      text: 'score',
      color: 48,
      scale: 1
    }, g);

    text({
      x: scoreLabel.ex + 20,
      y: 10,
      text: score,
      color: 48,
      scale: 1
    }, g);    
  }

}

