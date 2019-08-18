export default function waterfall(ctrl, g) {
  const { width, height } = ctrl.data.game;

  this.render = ctrl => {
    const n = 1;
    upto(i => {
      const gWidth = width / n;
      gradient(ctrl, { width: gWidth / n, x: i * gWidth }, g);
    }, n);
  };

  function gradient(ctrl, gradient, g) {
    const n = 1;

    const { width, x } = gradient;

    upto(i => {
      const wWidth = width,
            wX = x + i * wWidth;

      waterfall(ctrl, { x: wX, phase: i, width: wWidth }, g);
    }, n);
  }

  function waterfall(ctrl, waterfall, g) {
    const { tick } = ctrl.data.game;

    const n = 30;

    const { x, width, phase } = waterfall;

    upto(i => {
      drop(ctrl, {
        x: x + i * n,
        y: 0,
        w: width / n,
        h: width / n,
        phase: phase + i,
        n: width / n
      }, g);
    }, n);
  }

  function drop(ctrl, drop, g) {
    const { n, x, y, w, h, phase } = drop;

    const { tick } = ctrl.data.game;

    const shifter = colors.shifter(pal.Blue);

    g.raw(ctx => {

      const t = Math.floor(tick * 0.01);

      const res = [];

      upto(i => {
        let p = u.sin(t) * phase;
        let ip = (n - i + p + t) % n;
        let ii = (ip > (n / 2) ? n - ip:ip);
        let c = ((ii) % n) / n;
        // res.push(c);
        ctx.fillStyle = colors.css(shifter.lum(c));
        ctx.fillRect(x, y + i * h, w, h);
      }, n);

      // if (phase === 9)
      //   console.log(res);
    });
  }
}

function upto(f, n) {
  for (let i = 0; i < n; i++) {
    f(i);
  }
};
