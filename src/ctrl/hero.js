import * as u from '../util';

export default function hero(ctrl) {
  const { width, height } = ctrl.data.game;

  const hero = ctrl.data.hero;

  const updatePos = delta => {

    hero.vx += hero.ax * delta * 0.001 * hero.boost;
    hero.vy += hero.ay * delta * 0.001 * hero.boost;

    hero.x += hero.vx;
    hero.y += hero.vy;

    if (hero.x < 0) {
      hero.x = 0;
      hero.vx *= -0.5;
      hero.ax *= -1;
      hero.edge = 'left';
      hero.active = 4;
    }
    if (hero.y < 0) {
      hero.y = 0;
      hero.vy *= -0.5;
      hero.ay *= -1;
      hero.edge = 'up';
      hero.active = 4;
    }
    if (hero.x >= width) {
      hero.x = width;
      hero.vx *= -0.5;
      hero.ax *= -1;
      hero.edge = 'right';
      hero.active = 4;
    }
    if (hero.y >= height) {
      hero.y = height;
      hero.vy *= -0.5;
      hero.ay *= -1;
      hero.edge = 'down';
      hero.active = 4;
    }
  };

  const updateTicks = delta => {
    hero.tick += delta;

    if (hero.active > 0) {
      hero.active = Math.max(0, hero.active - (delta / 16) * 0.2);
    }
  };

  this.update = delta => {
    updatePos(delta);
    updateTicks(delta);
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

    hero.ax = u.clamp(nV[0] * 2, -1, 1);
    hero.ay = u.clamp(nV[1] * 2, -1, 1);
    hero.active = 4;
  };
}
