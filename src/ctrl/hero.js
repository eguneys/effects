import * as u from '../util';

export default function hero(ctrl) {
  const { width, height } = ctrl.data.game;

  const hero = ctrl.data.hero;

  const { radius } = hero;

  const updatePos = delta => {

    hero.vx += hero.ax * delta * 0.001 * hero.boost;
    hero.vy += hero.ay * delta * 0.001 * hero.boost;

    hero.x += hero.vx;
    hero.y += hero.vy;

    if (hero.x < radius) {
      hero.x = radius;
      hero.vx *= -0.5;
      hero.ax *= -1;
      hero.edge = 'left';
      hero.active = 4;
    }
    if (hero.y < radius) {
      hero.y = radius;
      hero.vy *= -0.5;
      hero.ay *= -1;
      hero.edge = 'up';
      hero.active = 4;
    }
    if (hero.x >= width - radius) {
      hero.x = width - radius;
      hero.vx *= -0.5;
      hero.ax *= -1;
      hero.edge = 'right';
      hero.active = 4;
    }
    if (hero.y >= height - radius) {
      hero.y = height - radius;
      hero.vy *= -0.5;
      hero.ay *= -1;
      hero.edge = 'down';
      hero.active = 4;
    }
  };

  const updateRotation = delta => {
    hero.rotation += hero.active;
    hero.rotation = hero.rotation % u.TAU;
  };

  const updateTicks = delta => {
    hero.tick += delta;

    if (hero.active > 0) {
      hero.active = Math.max(0, hero.active - (delta / 16) * 0.2);
    }
  };

  const updateTrail = delta => {
    ctrl.spots.create({ x: hero.x - hero.ax * 10,
                        y: hero.y - hero.ay * 10,
                        color: 38,
                        life: 2 });
  };

  const updateScore = delta => {
    ctrl.data.game.score += Math.floor(hero.active);
  };

  this.update = delta => {
    updatePos(delta);
    updateRotation(delta);
    updateTicks(delta);
    updateTrail(delta);
    updateScore(delta);
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
