import * as u from './util';

export default function defaults() {

  const width = 256,
        height = 256,
        ratio = height / width;

  const gameUnit = 40;

  return {
    game: {
      unit: gameUnit,
      width,
      height,
      ratio,
      vx: 10,
      tick: 0
    },
    hero: {
      color: u.HERO_COLOR,
      radius: gameUnit / 4,
      gap: 2,
      gapMove: 2,
      rotation: 0,
      x: width / 2,
      y: height / 2,
      vx: 0,
      vy: -1,
      boost: 1,
      tick: 0
    }
  };
 
}
