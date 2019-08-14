import * as u from './util';

export default function defaults() {

  const height = 256,
        width = height * 1.5,
        ratio = height / width;

  const gameUnit = 40;

  const paddleWidth = gameUnit;

  return {
    debug: true,
    state: u.States.Over,
    game: {
      score: 0,
      unit: gameUnit,
      width,
      height,
      ratio,
      vx: 10,
      tick: 0
    },
    paddleBoost: [1, 1],
    paddles: [
      {
        vx: 1,
        vy: 0,
        x: width / 2,
        y: 1,
        w: paddleWidth,
        h: 10
      },
      {
        vx: -1,
        vy: 0,
        x: width / 2,
        y: height - 11,
        w: paddleWidth,
        h: 10
      },
      {
        vx: 0,
        vy: 1,
        x: 1,
        y: height / 2,
        w: 10,
        h: paddleWidth
      },
      {
        vx: 0,
        vy: -1,
        x: width - 11,
        y: height / 2,
        w: 10,
        h: paddleWidth
      }
    ],
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
