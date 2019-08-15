import * as u from '../util';

import Pool from '../pool';

import makeHero from './hero';
import makePaddles from './paddle';
import makeSpot from './spot';

import defaults from '../state';

import { collides, lineCollisionRange } from '../collision';

export default function ctrl(state, g) {
  this.data = state;
  const { width, height } = this.data.game;

  this.hero = new makeHero(this);

  this.paddles = new makePaddles(this, g);

  this.blocks = new Pool(makeBlock, this);

  this.spots = new Pool(makeSpot, this);

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
      blockHit(hitBlock);
    }

  };

  const spotLife = () => u.rand(2, 5);

  const blockHit = (hitBlock) => {
    const { x, y, angle, color } = hitBlock.data;

    this.hero.changeV(angle);

    this.blocks.release(hitBlock);

    this.spots.create({x, y, color});
    if (u.rand(0,1)<0.5)
      this.spots.create({ x: x+20, y, life: spotLife(), color });
    if (u.rand(0,1)<0.5)
      this.spots.create({ x: x-20, y, life: spotLife(), color });
    if (u.rand(0,1)<0.5)
      this.spots.create({ x: x+20, y: y+20, life: spotLife(), color });
    if (u.rand(0,1)<0.5)
      this.spots.create({ x: x+20, y: y-20, life: spotLife(), color });
    if (u.rand(0,1)<0.5)
      this.spots.create({ x, y: y + 20, life: spotLife(), color });
    if (u.rand(0,1)<0.5)
      this.spots.create({ x, y: y - 20, life: spotLife(), color });
    
  };

  const maybeBoost = () => {
    if (this.userBoost) {
      this.hero.boost(20);

      u.ensureDelay(this.userBoost, () => {
        this.userBoost = 0;
      }, 100);
    } else {
      this.hero.boost(1);
    }
  };

  const maybeSpawnBlock = withDelay(() => {
    const length = this.data.game.unit;
    this.blocks.create({
      x: u.rand(length, width - length),
      y: u.rand(length, height - length),
      length: length * 0.4,
      angle: u.rand(0, u.TAU / 4 - u.TAU / 8) + u.TAU / 10
    });

  }, 1000);

  this.reset = () => {
    this.data.hero.x = width / 2;
    this.data.hero.y = height / 2;
    this.data.game.score = 0;
  };

  this.boost = () => {
    this.userBoost = u.now();
  };

  this.paddleHit = () => {
    this.data.gameover = u.now();
    this.data.state = u.States.Over;
  };

  this.paddleMove = v => {
    if (v[0] !== 0) 
      this.data.paddleBoost[0] = v[0];
    if (v[1] !== 0)
      this.data.paddleBoost[1] = v[1];
  };


  this.update = delta => {
    maybeBoost(delta);
    maybeSpawnBlock(delta);
    updateCollision(delta);

    this.hero.update(delta);
    this.paddles.update(delta);
    this.blocks.each(_ => _.update(delta));
    this.spots.each(_ => _.update(delta));
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
    color: spotColor()
  });

}

const spotColor = () => u.randItem([
  11,
  21,
  54,
  42,
  29,
  18
]);

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
