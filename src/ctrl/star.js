import * as u from '../util';

export default function star(ctrl) {

  const { width, height } = ctrl.data.game;

  const globeRadius = width * 0.3;

  this.init = d => {
    this.data = { ...defaults(), ...d };

    this.vz = u.PI * 0.1;

    this.fov = width * 0.8;
    this.projCenterX = width * 0.5;
    this.projCenterY = height * 0.5;

  };

  const updatePos = delta => {

    this.data.theta += this.vz * delta * 0.01;
    this.data.theta = this.data.theta % u.TAU;

    const { phi, theta } = this.data;

    this.x = globeRadius * Math.sin(phi) * Math.cos(theta),
    this.y = globeRadius * Math.cos(phi),
    this.z = globeRadius * Math.sin(phi) * Math.sin(theta) + globeRadius;

  };

  this.update = delta => {
    updatePos(delta);
  };
}

const defaults = () => ({
  theta: 0,
  phi: 0,
  radius: 10
});
