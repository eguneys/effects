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
    const w = width * 0.2,
          h = w;

    const { tick } = ctrl.data.game;

    const shifter = colors.shifter(pal.Blue);

    g.raw(ctx => {

      const t = u.floor((tick * 0.01) % 10);

      for (let i = 0; i < 10; i++) {
        let c = ((10 - i + t) % 10) / 10;
        ctx.fillStyle = colors.css(shifter.lum(c));
        ctx.fillRect((width - w) / 2, i * h, w, h);
      }

    });
  }

  function clear() {
    g.raw(ctx => {
      ctx.clearRect(0, 0, width, height);
    });
  }

}
