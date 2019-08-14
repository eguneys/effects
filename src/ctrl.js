import * as u from './util';

import Pool from './pool';

export default function ctrl(state, g) {
  this.data = state;
  const { width, height } = this.data.game;

  const hero = this.data.hero;

  this.blocks = new Pool(makeBlock, this);

  const updateHero = delta => {
    hero.x += hero.vx * hero.boost;
    hero.y += hero.vy * hero.boost;

    if (hero.x < 0) {
      hero.x = 0;
      hero.vx *= -1;
    }
    if (hero.y < 0) {
      hero.y = 0;
      hero.vy *= -1;
    }
    if (hero.x >= width) {
      hero.x = width;
      hero.vx *= -1;
    }
    if (hero.y >= height) {
      hero.y = height;
      hero.vy *= -1;
    }
  };


  const heroChangeV = angle => {
    const c = Math.cos(angle),
          s = Math.sin(angle);

    const lV = [c, s];
    const hV = [-hero.vx, -hero.vy];

    const nV = [hV[0] + lV[0], hV[1] + lV[1]];

    hero.vx = u.clamp(nV[0], -1, 1);
    hero.vy = u.clamp(nV[1], -1, 1);
  };

  const updateGame = delta => {
    const game = this.data.game;

    game.tick += delta;
  };

  const updateCollision = delta => {
    
    const hitBlock = this.blocks
          .find(_ => {

            if (_.life < 100) {
              return false;
            }

            return collides(g,
                            u.HERO_COLOR,
                            lineCollisionRange(_.data));
          });
    if (hitBlock) {
      const { angle } = hitBlock.data;

      heroChangeV(angle);

      this.blocks.release(hitBlock);
    }

  };

  const maybeBoost = withDelay(() => {
    if (hero.boost > 1) {
      hero.boost = 1;
    } else {
      hero.boost = 2;
    }
  }, 1000);

  const maybeSpawnBlock = withDelay(() => {
    const length = 10;
    this.blocks.create({
      x: u.rand(length, width - length),
      y: u.rand(length, height - length),
      length,
      angle: u.rand(0, u.TAU / 4 - u.TAU / 8) + u.TAU / 10
    });

  }, 1000);


  this.update = delta => {
    maybeBoost(delta);
    maybeSpawnBlock(delta);
    updateCollision(delta);

    updateGame(delta);
    updateHero(delta);
    this.blocks.each(_ => _.update(delta));
  };
}

function makeBlock(ctrl) {

  this.init = (d) => {
    this.data = { ...defaults(), ...d };

    this.life = 0;
    
  };

  this.update = delta => {
    this.life += delta;
    
    
  };

  const defaults = () => ({
    x: 0,
    y: 0,
    angle: u.THIRDTAU,
    length: 100,
    color: u.BLOCK_COLOR
  });

}

function collides(g, color, cr) {
  return cr((x, y) => {
    return g.pget(x, y, g.buffers.Collision) === color;
  });
}

function circleCollisionRange({ x, y, radius }) {
  return (collider) => {
    for (let a = 0; a < u.TAU; a+= u.THIRDPI) {
      const c = Math.cos(a) * radius,
            s = Math.sin(a) * radius;
      if (collider(x + c, y + s)); {
        return true;
      }
    }
    return false;
  };
}

function lineCollisionRange({ x, y, angle, length }) {
  return (collider) => {
    for (let a = 0; a < length; a+=0.1) {
      const c = Math.cos(angle) * a,
            s = Math.sin(angle) * a;
      if (collider(x + c, y + s)) {
        return true;
      }
    }
    return false;
  };
}

const withDelay = (fn, delay, updateFn) => {
  let lastUpdate = 0;

  return (delta) => {
    lastUpdate += delta;
    if (lastUpdate >= delay) {
      fn();
      lastUpdate = 0;
    } else {
      if (updateFn)
        updateFn(lastUpdate / delay);
    }
  };
};
