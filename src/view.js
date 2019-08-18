import * as u from './util';

import * as colors from './colors';


export default function view(ctrl, g) {

  const { width, height } = ctrl.data.game;

  const pal = colors.Palette;

  this.render = ctrl => {

    clear();

    waterfall(ctrl, g);

  };

  function waterfall(ctrl, g) {
    const { tick } = ctrl.data.game;

    const n = 10;

    const wX = width * 0;
    const wWidth = width * (1/n);

    for (let i = 0; i < n; i++) {
      drop(ctrl, {
        x: wX + i * wWidth,
        y: 0,
        w: wWidth,
        h: wWidth,
        phase: i,
        n
      }, g);
    }
  }

  function drop(ctrl, drop, g) {
    const { n, x, y, w, h, phase } = drop;

    const { tick } = ctrl.data.game;

    const shifter = colors.shifter(pal.Blue);

    g.raw(ctx => {

      const t = Math.floor(tick * 0.01);

      const res = [];

      for (let i = 0; i < n; i++) {
        let ip = (n - i + phase + t) % n;
        let ii = (ip > (n / 2) ? n - ip:ip);
        let c = ((ii) % n) / n;
        res.push(c);
        ctx.fillStyle = colors.css(shifter.lum(c));
        ctx.fillRect(x, y + i * h, w, h);
      }
      if (phase === 9)
      console.log(res);
    });
  }

  function clear() {
    g.raw(ctx => {
      ctx.clearRect(0, 0, width, height);
    });
  }

}
