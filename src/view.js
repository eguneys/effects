import * as u from './util';

import playView from './view/play';


export default function view(ctrl, g) {

  const { width, height } = ctrl.data.game;

  const play = new playView(ctrl, g);


  this.render = ctrl => {

    clear();

    play.render(ctrl);
  };

  function clear() {
    g.raw(ctx => {
      ctx.clearRect(0, 0, width, height);
    });
  }

}
