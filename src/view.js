import * as u from './util';

import * as colors from './colors';


export default function view(ctrl, g) {

  const { width, height } = ctrl.data.game;

  const pal = colors.Palette;

  this.render = ctrl => {

    clear();

  };

  function clear() {
    g.raw(ctx => {
      ctx.clearRect(0, 0, width, height);
    });
  }

}
