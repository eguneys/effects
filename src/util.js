export const PI = Math.PI;
export const HALFPI = PI / 2;
export const THIRDPI = PI / 3;
export const TAU = PI * 2;
export const THIRDTAU = TAU / 3;

export function rand(min, max) {
  return Math.random() * (max - min) + min;
}

export function clamp(v, min, max) {
  return Math.min(Math.max(v, min), max);
}

export function floor(v) {
  return Math.floor(v);
}

export function sin(v) {
  return Math.sin(v);
};


export function usin(v) {
  return (sin(v) + 1) / 2;
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
