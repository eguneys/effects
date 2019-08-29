import * as u from '../util';

export default function star(ctrl) {

  const { width, height } = ctrl.data.game;

  const globeRadius = width * 0.3;

  this.init = d => {
    this.data = { ...defaults(), ...d };

    this.vz = u.PI * 0.1;
  };

  const updatePos = delta => {

    this.data.theta += this.vz * delta * 0.01;
    this.data.theta = this.data.theta % u.TAU;

    const { x, y, z, phi, theta } = this.data;

    this.x = x + globeRadius * Math.sin(phi) * Math.cos(theta),
    this.y = y + globeRadius * Math.cos(phi),
    this.z = z + globeRadius * Math.sin(phi) * Math.sin(theta) + globeRadius;

  };

  this.update = delta => {
    updatePos(delta);
  };
}

const defaults = () => ({
  theta: 0,
  phi: 0,
  radius: 10,
  x: 0,
  y: 0,
  z: 0
});
