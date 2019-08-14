import * as u from './util';

import Pool from './pool';

import makeHero from './hero';
import makePaddles from './paddle';

export default function ctrl(state, g) {
  this.data = state;
  const { width, height } = this.data.game;

  this.hero = new makeHero(this);

  this.paddles = new makePaddles(this);

  this.blocks = new Pool(makeBlock, this);

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

      this.hero.changeV(angle);

      this.blocks.release(hitBlock);
    }

  };

  const maybeBoost = () => {
    if (this.userBoost) {
      this.hero.boost(10);
      this.userBoost = false;
    } else {
      this.hero.boost(1);
    }
  };

  const maybeSpawnBlock = withDelay(() => {
    const length = 10;
    this.blocks.create({
      x: u.rand(length, width - length),
      y: u.rand(length, height - length),
      length,
      angle: u.rand(0, u.TAU / 4 - u.TAU / 8) + u.TAU / 10
    });

  }, 1000);

  this.boost = () => {
    this.userBoost = true;
  };


  this.update = delta => {
    maybeBoost(delta);
    maybeSpawnBlock(delta);
    updateCollision(delta);

    updateGame(delta);
    this.hero.update(delta);
    this.paddles.update(delta);
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
