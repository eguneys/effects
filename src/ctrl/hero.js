import * as u from '../util';

export default function hero(ctrl) {
  const { width, height } = ctrl.data.game;

  const hero = ctrl.data.hero;

  const updatePos = delta => {
    hero.x += hero.vx * hero.boost * delta * 0.1;
    hero.y += hero.vy * hero.boost * delta * 0.1;

    if (hero.x < 0) {
      hero.x = 0;
      hero.vx *= -1;
      hero.edge = 'left';
    }
    if (hero.y < 0) {
      hero.y = 0;
      hero.vy *= -1;
      hero.edge = 'up';
    }
    if (hero.x >= width) {
      hero.x = width;
      hero.vx *= -1;
      hero.edge = 'right';
    }
    if (hero.y >= height) {
      hero.y = height;
      hero.vy *= -1;
      hero.edge = 'down';
    }
  };

  this.update = delta => {
    updatePos(delta);
  };

  this.boost = boost => {
    hero.boost = boost;
  };


  this.changeV = angle => {
    const c = Math.cos(angle),
          s = Math.sin(angle);

    const lV = [c, s];
    const hV = [-hero.vx, -hero.vy];

    const nV = [hV[0] + lV[0], hV[1] + lV[1]];

    hero.vx = u.clamp(nV[0] * 2, -1, 1);
    hero.vy = u.clamp(nV[1] * 2, -1, 1);
  };
}
