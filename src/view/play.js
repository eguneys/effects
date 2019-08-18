import * as u from '../util';


export default function view(ctrl, g) {
  
  const { width, height } = ctrl.data.game;

  const b = g.buffers;


  this.render = ctrl => {
    ctrl = ctrl.play;

    ctrl.stars.each(_ => renderStar(ctrl, _, g));
  };

  function renderStar(ctrl, star, g) {

    const { radius } = star.data;

    const { x,
            y,
            size } = project(star);

    g.raw(ctx => {
      ctx.beginPath();
      ctx.arc(x, y, radius * size, 0, u.TAU);
      ctx.fill();
    });

  }

  function project(obj) {
    const { projCenterX,
            projCenterY } = obj;
    const { fov, x, y, z } = obj;

    const sizeProjected = fov / (fov + z),
          xProjected = x * sizeProjected + projCenterX,
          yProjected = y * sizeProjected + projCenterY;

    return {
      x: xProjected,
      y: yProjected,
      size: sizeProjected
    };
  }
}
