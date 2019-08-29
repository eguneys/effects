import * as u from '../util';

import Pool from '../pool';

import makeStar from './star';


export default function ctrl(ctrl, ctx) {
  const { g, a } = ctx;

  this.data = ctrl.data;
  const { width, height } = this.data.game;

  this.camera = {
    fov: width * 0.8,
    projCenterX: width * 0.5,
    projCenterY: height * 0.5
  };

  this.stars = new Pool(makeStar, this);

  this.spawnStar = () => {

    for (let i = 0; i < 100; i++) {
      this.stars.create({
        x: 100,
        y: 0,
        z: 1000,
        theta: u.rand(0, u.TAU),
        phi: Math.acos(u.rand(0, 2) - 1)
      });
    }
    
  };

  this.spawnStar();

  this.update = delta => {
    this.stars.each(_ => _.update(delta));
    this.stars.sort((a, b) => a.sizeProjection - b.sizeProjection);
  };
}
